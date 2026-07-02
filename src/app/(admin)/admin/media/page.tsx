'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { Metadata } from 'next'
import AdminToast from '@/components/ui/AdminToast'

// Next.js metadata must be in a server component; keep title via document.title trick instead
void (null as unknown as Metadata)

type MediaFile = {
  id: string
  filename: string
  originalName: string
  url: string
  size: number
  width: number | null
  height: number | null
  alt: string
  createdAt: string
  source: 'local' | 'supabase'
  canDelete: boolean
  bucket?: string
}

async function toWebP(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas not supported'))
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          if (blob) resolve({ blob, width: img.naturalWidth, height: img.naturalHeight })
          else reject(new Error('WebP conversion failed'))
        },
        'image/webp',
        0.88
      )
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')) }
    img.src = url
  })
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<MediaFile | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editAlt, setEditAlt] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const dismissToast = useCallback(() => setToast(null), [])

  useEffect(() => {
    fetch('/api/admin/media')
      .then(r => r.ok ? r.json() : [])
      .then(setFiles)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setEditTitle(selected?.originalName ?? '')
    setEditAlt(selected?.alt ?? '')
  }, [selected])

  async function handleSaveEdit() {
    if (!selected) return
    setSavingEdit(true)
    try {
      const res = await fetch(`/api/admin/media/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalName: editTitle, alt: editAlt }),
      })
      if (res.ok) {
        const updated = await res.json()
        setFiles(prev => prev.map(f => f.id === selected.id ? { ...f, originalName: updated.originalName, alt: updated.alt } : f))
        setSelected(prev => prev ? { ...prev, originalName: updated.originalName, alt: updated.alt } : prev)
        setToast({ message: 'Saved!', type: 'success' })
      } else {
        setToast({ message: 'Save failed.', type: 'error' })
      }
    } catch {
      setToast({ message: 'Save failed.', type: 'error' })
    } finally {
      setSavingEdit(false)
    }
  }

  async function processFiles(rawFiles: File[]) {
    const images = rawFiles.filter(f => f.type.startsWith('image/'))
    if (!images.length) return
    setUploading(true)
    setUploadProgress({ done: 0, total: images.length })
    let ok = 0, fail = 0
    for (let i = 0; i < images.length; i++) {
      try {
        const { blob, width, height } = await toWebP(images[i])
        const fd = new FormData()
        fd.append('file', blob, images[i].name.replace(/\.[^.]+$/, '.webp'))
        fd.append('originalName', images[i].name)
        fd.append('width', String(width))
        fd.append('height', String(height))
        const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
        if (res.ok) { const data = await res.json(); setFiles(prev => [data, ...prev]); ok++ }
        else fail++
      } catch { fail++ }
      setUploadProgress({ done: i + 1, total: images.length })
    }
    setUploading(false)
    setUploadProgress(null)
    if (ok > 0) setToast({ message: `${ok} image${ok > 1 ? 's' : ''} uploaded as WebP!`, type: 'success' })
    if (fail > 0) setToast({ message: `${fail} upload${fail > 1 ? 's' : ''} failed.`, type: 'error' })
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (picked.length) processFiles(picked)
  }

  async function handleDelete(file: MediaFile) {
    if (!file.canDelete) return
    if (!window.confirm(`Delete "${file.originalName}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/media/${file.id}`, { method: 'DELETE' })
    if (res.ok) {
      setFiles(prev => prev.filter(f => f.id !== file.id))
      if (selected?.id === file.id) setSelected(null)
      setToast({ message: 'Image deleted.', type: 'success' })
    } else {
      setToast({ message: 'Delete failed.', type: 'error' })
    }
  }

  function copyUrl(file: MediaFile) {
    const url = file.url
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(file.id)
      setTimeout(() => setCopiedId(null), 2200)
    })
  }

  const filtered = files.filter(f =>
    !search ||
    f.originalName.toLowerCase().includes(search.toLowerCase()) ||
    f.filename.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {toast && <AdminToast message={toast.message} type={toast.type} onClose={dismissToast} />}

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Media Library</h1>
          <p className="admin-page-sub">{files.length} image{files.length !== 1 ? 's' : ''} · Local WebP + Supabase storage</p>
        </div>
        <div className="admin-actions">
          <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleInputChange} />
          <button className="admin-btn admin-btn--primary" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading && uploadProgress
              ? `Converting ${uploadProgress.done}/${uploadProgress.total}…`
              : '↑ Upload Images'
            }
          </button>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={e => {
          e.preventDefault(); setIsDragOver(false)
          processFiles(Array.from(e.dataTransfer.files))
        }}
        style={{
          border: `2px dashed ${isDragOver ? 'rgba(215,38,46,0.7)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '12px',
          padding: '2rem 1rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          cursor: uploading ? 'default' : 'pointer',
          background: isDragOver ? 'rgba(215,38,46,0.05)' : 'rgba(255,255,255,0.02)',
          transition: 'border-color 0.2s, background 0.2s',
        }}
      >
        {uploading && uploadProgress ? (
          <>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⟳</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', margin: 0 }}>
              Converting to WebP… {uploadProgress.done}/{uploadProgress.total}
            </p>
            <div style={{ marginTop: '0.75rem', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden', maxWidth: '200px', margin: '0.75rem auto 0' }}>
              <div style={{ height: '100%', background: '#D7262E', borderRadius: '99px', width: `${(uploadProgress.done / uploadProgress.total) * 100}%`, transition: 'width 0.3s ease' }} />
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem', opacity: 0.35 }}>🖼</div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', margin: 0 }}>
              {isDragOver ? 'Drop to upload' : <>Drag & drop images here, or <span style={{ color: '#D7262E' }}>click to browse</span></>}<br />
              <span style={{ fontSize: '0.78rem', opacity: 0.8 }}>PNG, JPG, GIF, AVIF, SVG → automatically saved as WebP</span>
            </p>
          </>
        )}
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.25rem' }}>
        <input
          className="admin-input"
          style={{ maxWidth: '300px' }}
          placeholder="Search by filename…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
        {/* Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(255,255,255,0.25)' }}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="admin-card" style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>
              {search ? 'No images match your search.' : 'No images yet. Upload your first image above.'}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: '0.75rem' }}>
              {filtered.map(file => {
                const isCopied = copiedId === file.id
                const isSelected = selected?.id === file.id
                return (
                  <div
                    key={file.id}
                    onClick={() => setSelected(isSelected ? null : file)}
                    style={{
                      position: 'relative',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: `1.5px solid ${isSelected ? '#D7262E' : 'rgba(255,255,255,0.08)'}`,
                      background: 'rgba(255,255,255,0.03)',
                      aspectRatio: '1',
                      cursor: 'pointer',
                      transition: 'border-color 0.18s, box-shadow 0.18s',
                      boxShadow: isSelected ? '0 0 0 2px rgba(215,38,46,0.25)' : 'none',
                    }}
                    className="media-grid-item"
                  >
                    <img
                      src={file.url}
                      alt={file.alt || file.originalName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />

                    {/* Hover overlay */}
                    <div className="media-overlay" style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
                      opacity: 0, transition: 'opacity 0.18s',
                      display: 'flex', flexDirection: 'column',
                      justifyContent: 'flex-end', padding: '0.6rem',
                    }}>
                      <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem', wordBreak: 'break-all', lineHeight: 1.35 }}>
                        {file.originalName}
                      </p>
                      <button
                        onClick={e => { e.stopPropagation(); copyUrl(file) }}
                        style={{
                          background: isCopied ? '#22c55e' : '#D7262E',
                          color: '#fff', border: 'none', borderRadius: '6px',
                          padding: '0.35rem 0', fontSize: '0.72rem', fontWeight: 700,
                          cursor: 'pointer', width: '100%', transition: 'background 0.2s',
                        }}
                      >
                        {isCopied ? '✓ Copied!' : 'Copy URL'}
                      </button>
                    </div>

                    {/* Delete button — local files only */}
                    {file.canDelete && (
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(file) }}
                        style={{
                          position: 'absolute', top: '5px', right: '5px',
                          width: '20px', height: '20px', borderRadius: '50%',
                          background: 'rgba(0,0,0,0.75)', color: '#fff', border: 'none',
                          cursor: 'pointer', fontSize: '10px', zIndex: 2,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          opacity: 0, transition: 'opacity 0.18s',
                        }}
                        className="media-delete-btn"
                        aria-label="Delete"
                      >✕</button>
                    )}

                    {/* Source badge for Supabase files */}
                    {file.source === 'supabase' && (
                      <span style={{
                        position: 'absolute', top: '5px', left: '5px',
                        fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.04em',
                        background: 'rgba(0,0,0,0.7)', color: 'rgba(255,255,255,0.6)',
                        borderRadius: '3px', padding: '1px 4px', pointerEvents: 'none',
                      }}>
                        {file.bucket}
                      </span>
                    )}

                    {/* Dimensions badge */}
                    {file.width && file.height && (
                      <span style={{
                        position: 'absolute', bottom: '5px', left: '5px',
                        fontSize: '0.6rem', color: 'rgba(255,255,255,0.8)',
                        background: 'rgba(0,0,0,0.65)', borderRadius: '3px', padding: '1px 4px',
                        pointerEvents: 'none',
                      }}>
                        {file.width}×{file.height}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{
            width: '240px', flexShrink: 0,
            background: 'rgba(255,255,255,0.03)',
            border: '1.5px solid rgba(255,255,255,0.08)',
            borderRadius: '12px', padding: '1rem',
            position: 'sticky', top: '1rem',
          }}>
            <img
              src={selected.url}
              alt={selected.alt || selected.originalName}
              style={{ width: '100%', borderRadius: '8px', marginBottom: '0.875rem', objectFit: 'cover', maxHeight: '180px' }}
            />
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Filename</p>
            <p style={{ fontSize: '0.8rem', color: '#fff', marginBottom: '0.875rem', wordBreak: 'break-all', lineHeight: 1.4 }}>{selected.filename}</p>

            <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Title</label>
            <input
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              style={{ width: '100%', marginBottom: '0.75rem', padding: '0.4rem 0.6rem', fontSize: '0.8rem', color: '#fff', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px' }}
            />

            <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Alt Text</label>
            <input
              value={editAlt}
              onChange={e => setEditAlt(e.target.value)}
              placeholder="Describe this image…"
              style={{ width: '100%', marginBottom: '0.5rem', padding: '0.4rem 0.6rem', fontSize: '0.8rem', color: '#fff', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px' }}
            />
            <button
              onClick={handleSaveEdit}
              disabled={savingEdit || (editTitle === selected.originalName && editAlt === (selected.alt || ''))}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.08)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px',
                padding: '0.45rem', fontSize: '0.78rem', fontWeight: 600,
                cursor: savingEdit ? 'default' : 'pointer', marginBottom: '0.875rem',
              }}
            >
              {savingEdit ? 'Saving…' : 'Save Title & Alt Text'}
            </button>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.875rem' }}>
              {selected.width && selected.height && (
                <div>
                  <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Size</p>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)' }}>{selected.width}×{selected.height}</p>
                </div>
              )}
              <div>
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>File size</p>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)' }}>{formatBytes(selected.size)}</p>
              </div>
            </div>

            {selected.source === 'supabase' && selected.bucket && (
              <>
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bucket</p>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', marginBottom: '0.875rem' }}>{selected.bucket}</p>
              </>
            )}

            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>URL</p>
            <div style={{ marginBottom: '1rem' }}>
              <code style={{ display: 'block', fontSize: '0.68rem', color: '#D7262E', wordBreak: 'break-all', background: 'rgba(215,38,46,0.08)', padding: '0.35rem 0.5rem', borderRadius: '5px', lineHeight: 1.6 }}>
                {selected.url}
              </code>
            </div>

            <button
              onClick={() => copyUrl(selected)}
              style={{
                width: '100%',
                background: copiedId === selected.id ? '#22c55e' : '#D7262E',
                color: '#fff', border: 'none', borderRadius: '8px',
                padding: '0.55rem', fontSize: '0.82rem', fontWeight: 700,
                cursor: 'pointer', transition: 'background 0.2s', marginBottom: '0.5rem',
              }}
            >
              {copiedId === selected.id ? '✓ Copied!' : 'Copy URL'}
            </button>
            {selected.canDelete && (
              <button
                onClick={() => handleDelete(selected)}
                style={{
                  width: '100%',
                  background: 'none', color: '#f87171',
                  border: '1px solid rgba(248,113,113,0.3)', borderRadius: '8px',
                  padding: '0.5rem', fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Delete Image
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        .media-grid-item:hover .media-overlay { opacity: 1 !important; }
        .media-grid-item:hover .media-delete-btn { opacity: 1 !important; }
      `}</style>
    </>
  )
}

'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import UnderlineExt from '@tiptap/extension-underline'
import LinkExt from '@tiptap/extension-link'
import ImageExt from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useCallback, useRef } from 'react'
import './RichTextEditor.css'

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

function ToolbarBtn({ title, active, onClick, children }: { title: string; active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rte-btn${active ? ' rte-btn--active' : ''}`}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({ value, onChange, placeholder = 'Write your blog post here…' }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadingRef = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      UnderlineExt,
      LinkExt.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
      ImageExt.configure({ inline: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: { class: 'rte-content' },
    },
  })

  useEffect(() => {
    if (!editor) return
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const setLink = useCallback(() => {
    if (!editor) return
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Enter URL', prev ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }, [editor])

  const insertImageByUrl = useCallback(() => {
    if (!editor) return
    const url = window.prompt('Image URL', 'https://')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }, [editor])

  const uploadImage = useCallback(async (file: File) => {
    if (uploadingRef.current || !editor) return
    uploadingRef.current = true
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'blog')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      if (res.ok) {
        const { url } = await res.json()
        editor.chain().focus().setImage({ src: url }).run()
      } else {
        alert('Image upload failed')
      }
    } finally {
      uploadingRef.current = false
    }
  }, [editor])

  if (!editor) return null

  const sep = <span className="rte-sep" />

  return (
    <div className="rte-wrap">
      {/* Toolbar */}
      <div className="rte-toolbar">
        <ToolbarBtn title="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()}>↩</ToolbarBtn>
        <ToolbarBtn title="Redo (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()}>↪</ToolbarBtn>
        {sep}
        <ToolbarBtn title="Bold (Ctrl+B)" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></ToolbarBtn>
        <ToolbarBtn title="Italic (Ctrl+I)" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></ToolbarBtn>
        <ToolbarBtn title="Underline (Ctrl+U)" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></ToolbarBtn>
        <ToolbarBtn title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></ToolbarBtn>
        {sep}
        <ToolbarBtn title="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</ToolbarBtn>
        <ToolbarBtn title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolbarBtn>
        <ToolbarBtn title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolbarBtn>
        {sep}
        <ToolbarBtn title="Bullet List" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="4" cy="6" r="2"/><rect x="8" y="5" width="13" height="2" rx="1"/><circle cx="4" cy="12" r="2"/><rect x="8" y="11" width="13" height="2" rx="1"/><circle cx="4" cy="18" r="2"/><rect x="8" y="17" width="13" height="2" rx="1"/></svg>
        </ToolbarBtn>
        <ToolbarBtn title="Ordered List" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
        </ToolbarBtn>
        {sep}
        <ToolbarBtn title="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
        </ToolbarBtn>
        <ToolbarBtn title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>—</ToolbarBtn>
        {sep}
        <ToolbarBtn title="Insert / Edit Link" active={editor.isActive('link')} onClick={setLink}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </ToolbarBtn>
        {sep}
        <ToolbarBtn title="Insert Image by URL" onClick={insertImageByUrl}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </ToolbarBtn>
        <label className="rte-btn" title="Upload Image from Device">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = '' }}
          />
        </label>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  )
}

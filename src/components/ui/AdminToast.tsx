'use client'

import { useEffect, useRef } from 'react'

type Props = {
  message: string
  type: 'success' | 'error'
  onClose: () => void
  duration?: number
}

export default function AdminToast({ message, type, onClose, duration = 3500 }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(onClose, duration)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [duration, onClose])

  const isSuccess = type === 'success'

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: '1.25rem',
        right: '1.25rem',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.85rem 1rem 0.85rem 1.1rem',
        background: '#18181b',
        border: `1px solid ${isSuccess ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
        minWidth: '260px',
        maxWidth: '380px',
        animation: 'toastIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both',
      }}
    >
      {/* Icon */}
      <span style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: isSuccess ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: isSuccess ? '#22c55e' : '#ef4444',
        fontSize: '0.9rem',
      }}>
        {isSuccess ? '✓' : '✕'}
      </span>

      {/* Message */}
      <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 600, color: '#f4f4f5', lineHeight: 1.4 }}>
        {message}
      </span>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, height: '3px',
        background: isSuccess ? '#22c55e' : '#ef4444',
        borderRadius: '0 0 12px 12px',
        animation: `toastProgress ${duration}ms linear both`,
        opacity: 0.6,
      }} />

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Dismiss"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.35)', fontSize: '1rem', lineHeight: 1,
          padding: '0.15rem', borderRadius: '4px', flexShrink: 0,
          transition: 'color 0.15s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
      >
        ✕
      </button>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(calc(100% + 1.5rem)); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  )
}

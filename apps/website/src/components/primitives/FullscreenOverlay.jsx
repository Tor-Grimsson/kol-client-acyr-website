import { useEffect, useRef } from 'react'
import Icon from '../loaders/icons/Icon'

export default function FullscreenOverlay({ open, onClose, children }) {
  const sheetRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  const onBackdropClick = (e) => {
    if (sheetRef.current && !sheetRef.current.contains(e.target)) onClose?.()
  }

  return (
    <div className="ac-overlay" role="dialog" aria-modal="true" onMouseDown={onBackdropClick}>
      <div ref={sheetRef} className="ac-overlay-sheet">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-0 -top-12 inline-flex items-center justify-center w-9 h-9 rounded-full text-emphasis cursor-pointer"
          style={{ backgroundColor: 'var(--ac-surface-primary)' }}
        >
          <Icon name="x" size={16} />
        </button>
        {children}
      </div>
    </div>
  )
}

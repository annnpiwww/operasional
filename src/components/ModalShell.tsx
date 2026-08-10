import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  labelledBy: string
  children: ReactNode
  maxWidth?: string
}

/**
 * Shell modal bersama: backdrop blur + fade, tutup via Esc / klik backdrop,
 * focus trap ringan (Tab wrap), dan kunci scroll body saat terbuka.
 */
export function ModalShell({
  isOpen,
  onClose,
  labelledBy,
  children,
  maxWidth = 'max-w-lg',
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const prevFocus = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    panel?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key === 'Tab' && panel) {
        const focusables = panel.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      prevFocus?.focus?.()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="animate-backdrop absolute inset-0 bg-ink-950/85 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`animate-modal panel relative w-full ${maxWidth} max-h-[min(88vh,880px)] overflow-y-auto p-5 shadow-2xl shadow-black/50 outline-none sm:p-6`}
      >
        {children}
      </div>
    </div>
  )
}
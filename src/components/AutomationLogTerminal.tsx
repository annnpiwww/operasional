import { Eraser, TerminalSquare } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { AutomationState, LogEntry, LogStatus } from '../types'

const BADGE: Record<LogStatus, string> = {
  idle: 'border-line text-low',
  running: 'border-accent/40 bg-accent/10 text-accent',
  success: 'border-ok/40 bg-ok/10 text-ok',
  failed: 'border-bad/40 bg-bad/10 text-bad',
}

const LINE: Record<LogStatus, string> = {
  idle: 'border-l-low',
  running: 'border-l-accent',
  success: 'border-l-ok',
  failed: 'border-l-bad',
}

const PILL: Record<AutomationState, { dot: string; label: string; cls: string }> = {
  idle: { dot: 'bg-low', label: 'IDLE', cls: 'border-line text-low' },
  running: { dot: 'animate-pulse bg-accent', label: 'RUNNING', cls: 'border-accent/40 bg-accent/10 text-accent' },
  success: { dot: 'bg-ok', label: 'SUCCESS', cls: 'border-ok/40 bg-ok/10 text-ok' },
  failed: { dot: 'bg-bad', label: 'FAILED', cls: 'border-bad/40 bg-bad/10 text-bad' },
}

interface Props {
  logs: LogEntry[]
  state: AutomationState
  onClear: () => void
}

export function AutomationLogTerminal({ logs, state, onClear }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const pill = PILL[state]

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [logs])

  return (
    <section className="panel flex min-h-0 flex-col overflow-hidden">
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex items-center gap-2.5">
          <TerminalSquare className="h-4 w-4 text-accent" />
          <h2 className="font-display text-sm font-semibold tracking-wide text-hi">
            Terminal Automasi
          </h2>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider ${pill.cls}`}
            role="status"
            aria-live="polite"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${pill.dot}`} />
            {pill.label}
          </span>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={logs.length === 0}
          className="flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs text-mid transition-colors hover:border-[#313a4e] hover:text-hi disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Eraser className="h-3.5 w-3.5" />
          Bersihkan
        </button>
      </header>

      {state === 'running' && <div className="hazard-stripe h-[3px]" aria-hidden="true" />}

      <div
        ref={bodyRef}
        className="term-scroll h-[420px] flex-1 overflow-y-auto bg-ink-950 p-3 font-mono text-[12px] leading-relaxed"
      >
        {logs.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <TerminalSquare className="h-6 w-6 text-low" />
            <p className="text-xs text-low">
              Belum ada aktivitas. Jalankan sync dari Modul 4 untuk melihat alur Playwright.
            </p>
            <p className="text-accent">▌</p>
          </div>
        ) : (
          <ul className="space-y-1.5">
            {logs.map((e) => (
              <li
                key={e.id}
                className={`flex items-start gap-2.5 border-l-2 pl-2.5 ${LINE[e.status]}`}
              >
                <span className="shrink-0 text-low">{e.ts}</span>
                <span
                  className={`shrink-0 rounded border px-1.5 py-px text-[10px] font-semibold tracking-wider ${BADGE[e.status]}`}
                >
                  {e.status.toUpperCase()}
                </span>
                <span className="shrink-0 text-mid">{e.step}</span>
                <span className="min-w-0 break-words text-hi/90">{e.message}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className="flex items-center justify-between border-t border-line px-4 py-2">
        <span className="font-mono text-[10px] tracking-wider text-low">
          {logs.length} baris log
        </span>
        <span className="font-mono text-[10px] tracking-wider text-low">
          SYNC · PLAYWRIGHT
        </span>
      </footer>
    </section>
  )
}
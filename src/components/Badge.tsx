import type { ReactNode } from 'react'

export type BadgeTone = 'ok' | 'accent' | 'bad' | 'low' | 'blue'

const TONE: Record<BadgeTone, string> = {
  ok: 'border-ok/40 bg-ok/10 text-ok',
  accent: 'border-accent/40 bg-accent/10 text-accent',
  bad: 'border-bad/40 bg-bad/10 text-bad',
  low: 'border-line text-low',
  blue: 'border-blue/40 bg-blue/10 text-blue',
}

interface Props {
  tone: BadgeTone
  children: ReactNode
}

export function Badge({ tone, children }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider ${TONE[tone]}`}
    >
      {children}
    </span>
  )
}
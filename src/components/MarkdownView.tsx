import { Check, Copy, Download, FileCode2 } from 'lucide-react'
import { useState } from 'react'
import {
  buildMarkdown,
  copyText,
  downloadText,
  reportFilename,
} from '../lib/reportExport'
import type { FullOperationalReport } from '../types'

interface Props {
  report: FullOperationalReport
}

export function MarkdownView({ report }: Props) {
  const [copied, setCopied] = useState(false)
  const markdown = buildMarkdown(report)
  const lines = markdown.split('\n').length

  const handleCopy = async () => {
    if (await copyText(markdown)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    downloadText(
      markdown,
      reportFilename(report.header.tanggalLaporan, 'md'),
      'text/markdown',
    )
  }

  return (
    <section className="panel flex min-h-0 flex-col overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/40 bg-accent/10">
            <FileCode2 className="h-4 w-4 text-accent" />
          </span>
          <div>
            <h2 className="font-display text-sm font-semibold tracking-wide text-hi">
              Structured Markdown
            </h2>
            <p className="text-[11px] text-mid">
              Draft laporan terstruktur — siap dipindah ke Notion / GitHub / arsip.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleDownload} className="btn-ghost">
            <Download className="h-3.5 w-3.5" />
            Download .md
          </button>
          <button type="button" onClick={handleCopy} className="btn-solid">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Tersalin!' : 'Copy Markdown'}
          </button>
        </div>
      </header>

      <div className="flex items-center justify-between gap-2 border-b border-line bg-ink-950 px-4 py-2 sm:px-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-low">
          Markdown · {lines} baris
        </span>
        <span className="truncate font-mono text-[10px] text-low">
          {reportFilename(report.header.tanggalLaporan, 'md')}
        </span>
      </div>

      <div className="term-scroll max-h-[560px] overflow-auto bg-ink-950 p-4 sm:p-5">
        <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-hi/90">
          {markdown}
        </pre>
      </div>
    </section>
  )
}
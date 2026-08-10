import { Check, Copy, Download, Eye, FileText, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  buildMarkdown,
  buildPlainText,
  copyText,
  downloadText,
  reportFilename,
} from '../lib/reportExport'
import type { FullOperationalReport, ReportExportFormat } from '../types'
import { ModalShell } from './ModalShell'

interface Props {
  isOpen: boolean
  onClose: () => void
  report: FullOperationalReport
}

export function ModalReportPreview({ isOpen, onClose, report }: Props) {
  const [format, setFormat] = useState<ReportExportFormat>('text')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isOpen) setFormat('text')
  }, [isOpen])

  const output = format === 'text' ? buildPlainText(report) : buildMarkdown(report)
  const lines = output.split('\n').length

  const handleCopy = async () => {
    if (await copyText(output)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    downloadText(
      output,
      reportFilename(report.header.tanggalLaporan, format === 'text' ? 'txt' : 'md'),
      format === 'text' ? 'text/plain' : 'text/markdown',
    )
  }

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="preview-title"
      maxWidth="max-w-2xl"
    >
      <header className="mb-4 flex items-start justify-between gap-3 border-b border-line pb-4">
        <div>
          <h3
            id="preview-title"
            className="flex items-center gap-2 font-display text-base font-semibold tracking-wide text-hi"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/40 bg-accent/10">
              <Eye className="h-4 w-4 text-accent" />
            </span>
            Pratinjau &amp; Salin Laporan
          </h3>
          <p className="mt-1 text-xs text-mid">
            Output siap tempel ke WhatsApp, email, atau arsip laporan.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup modal"
          className="rounded-md border border-line p-2 text-low transition-colors hover:border-[#313a4e] hover:text-hi"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="seg mb-4 max-w-[280px]">
        <button
          type="button"
          onClick={() => setFormat('text')}
          aria-pressed={format === 'text'}
          className={`seg-btn flex items-center justify-center gap-1.5 ${format === 'text' ? 'seg-btn-active' : 'seg-btn-idle'}`}
        >
          <FileText className="h-3.5 w-3.5" />
          Plain Text
        </button>
        <button
          type="button"
          onClick={() => setFormat('markdown')}
          aria-pressed={format === 'markdown'}
          className={`seg-btn flex items-center justify-center gap-1.5 ${format === 'markdown' ? 'seg-btn-active' : 'seg-btn-idle'}`}
        >
          <span className="font-mono text-[11px] font-bold">#</span>
          Markdown
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-ink-950">
        <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-low">
            {format === 'text' ? 'TXT' : 'MD'} · {lines} baris
          </span>
          <span className="truncate font-mono text-[10px] text-low">
            {reportFilename(report.header.tanggalLaporan, format === 'text' ? 'txt' : 'md')}
          </span>
        </div>
        <pre className="term-scroll max-h-[46vh] overflow-auto whitespace-pre-wrap p-4 font-mono text-[12px] leading-relaxed text-hi/90">
          {output}
        </pre>
      </div>

      <p className="mt-3 text-[11px] text-low">
        {format === 'text'
          ? 'Format polos untuk WhatsApp / email — tanpa markdown.'
          : 'Markdown terstruktur dengan tabel — untuk Notion, GitHub, atau arsip.'}
      </p>

      <footer className="mt-4 flex items-center justify-end gap-2 border-t border-line pt-4">
        <button type="button" onClick={handleDownload} className="btn-ghost">
          <Download className="h-3.5 w-3.5" />
          Download .{format === 'text' ? 'txt' : 'md'}
        </button>
        <button type="button" onClick={handleCopy} className="btn-solid">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Tersalin!' : 'Copy ke Clipboard'}
        </button>
      </footer>
    </ModalShell>
  )
}
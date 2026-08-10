import { Check, ClipboardCheck, Copy } from 'lucide-react'
import { useState } from 'react'
import { buildPlainText, copyText } from '../lib/reportExport'
import type { FullOperationalReport, OperationalStatus, SPVFinalSummary } from '../types'
import { Badge, type BadgeTone } from './Badge'

const STATUSES: OperationalStatus[] = ['Normal', 'Baik', 'Terdapat Kendala']

const STATUS_TONE: Record<OperationalStatus, BadgeTone> = {
  Normal: 'ok',
  Baik: 'accent',
  'Terdapat Kendala': 'bad',
}

interface Props {
  report: FullOperationalReport
  onChange: (summary: SPVFinalSummary) => void
}

export function ModuleSummary({ report, onChange }: Props) {
  const [copied, setCopied] = useState(false)
  const { summary } = report
  const preview = buildPlainText(report)

  const update = (patch: Partial<SPVFinalSummary>) => {
    onChange({ ...summary, ...patch })
  }

  const copy = async () => {
    if (await copyText(preview)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const field = (
    label: string,
    key: 'kendala' | 'kebutuhan' | 'rencanaTindakLanjut',
    placeholder: string,
  ) => (
    <div>
      <label htmlFor={`sum-${key}`} className="label mb-1.5 block">
        {label}
      </label>
      <textarea
        id={`sum-${key}`}
        rows={3}
        value={summary[key]}
        onChange={(e) => update({ [key]: e.target.value })}
        placeholder={placeholder}
        className="input resize-none"
      />
    </div>
  )

  return (
    <section className="panel flex min-h-0 flex-col p-4 sm:p-5">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="label">Modul 6</p>
          <h2 className="mt-1 font-display text-base font-semibold tracking-wide text-hi">
            Catatan SPV &amp; Kesimpulan Akhir
          </h2>
          <p className="mt-0.5 text-xs text-mid">
            Kesimpulan dirangkum otomatis dari seluruh modul — siap disalin ke laporan.
          </p>
        </div>
        <Badge tone={STATUS_TONE[summary.statusOperasional]}>
          {summary.statusOperasional.toUpperCase()}
        </Badge>
      </header>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          {field(
            'Kendala yang Memerlukan Tindak Lanjut',
            'kendala',
            'cth: CCTV pos 3 mati, koordinasi dengan teknisi…',
          )}
          {field('Kebutuhan Lokasi', 'kebutuhan', 'cth: Tambahan lampu, penggantian baterai HT…')}
          {field(
            'Rencana Tindak Lanjut',
            'rencanaTindakLanjut',
            'cth: Jadwalkan perbaikan H+1, laporan ke SPV…',
          )}

          <div>
            <span className="label mb-1.5 block">Status Operasional</span>
            <div className="seg">
              {STATUSES.map((s) => {
                const active = summary.statusOperasional === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => update({ statusOperasional: s })}
                    aria-pressed={active}
                    className={`seg-btn py-2 text-center ${active ? 'seg-btn-active' : 'seg-btn-idle'}`}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-col">
          <span className="label mb-1.5 block">Pratinjau Teks Laporan Operasional</span>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-line bg-ink-950">
            <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2.5">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-low">
                <ClipboardCheck className="h-3.5 w-3.5 text-accent" />
                Auto-generated
              </span>
              <button
                type="button"
                onClick={copy}
                className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                  copied
                    ? 'border-ok/40 bg-ok/10 text-ok'
                    : 'border-accent/40 bg-accent/10 text-accent hover:bg-accent/20'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Teks Laporan
                  </>
                )}
              </button>
            </div>
            <pre className="term-scroll max-h-[560px] flex-1 overflow-auto whitespace-pre-wrap p-4 font-mono text-[12px] leading-relaxed text-hi/90">
              {preview}
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
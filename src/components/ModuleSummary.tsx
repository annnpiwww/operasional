import { CheckCheck, ClipboardCheck, Copy, Edit3 } from 'lucide-react'
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
  const [isEditingCustom, setIsEditingCustom] = useState(false)
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

  return (
    <section className="panel flex min-h-0 flex-col p-4 sm:p-5">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="label">Modul 6</p>
          <h2 className="mt-1 font-display text-base font-semibold tracking-wide text-hi">
            Catatan SPV &amp; Kesimpulan Akhir
          </h2>
          <p className="mt-0.5 text-xs text-mid">
            Format laporan otomatis disesuaikan untuk standar laporan WhatsApp BSS Parking.
          </p>
        </div>
        <Badge tone={STATUS_TONE[summary.statusOperasional]}>
          {summary.statusOperasional.toUpperCase()}
        </Badge>
      </header>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        {/* Left Col: Form Inputs */}
        <div className="space-y-4">
          {/* Field 1: Kendala */}
          <div>
            <label htmlFor="sum-kendala" className="label mb-1.5 block">
              Kendala yang memerlukan tindak lanjut:
            </label>
            <textarea
              id="sum-kendala"
              rows={2}
              value={summary.kendala}
              onChange={(e) => update({ kendala: e.target.value })}
              placeholder="Sebutkan kendala atau rintangan operasional..."
              className="input resize-none"
            />
          </div>

          {/* Field 2: Kebutuhan Lokasi */}
          <div>
            <label htmlFor="sum-kebutuhan" className="label mb-1.5 block">
              Kebutuhan lokasi:
            </label>
            <textarea
              id="sum-kebutuhan"
              rows={2}
              value={summary.kebutuhan}
              onChange={(e) => update({ kebutuhan: e.target.value })}
              placeholder="Logistik, sarana prasarana yang diperlukan..."
              className="input resize-none"
            />
          </div>

          {/* Field 3: Rencana Tindak Lanjut */}
          <div>
            <label htmlFor="sum-rencana" className="label mb-1.5 block">
              Rencana tindak lanjut:
            </label>
            <textarea
              id="sum-rencana"
              rows={2}
              value={summary.rencanaTindakLanjut}
              onChange={(e) => update({ rencanaTindakLanjut: e.target.value })}
              placeholder="Action plan yang akan Anda eksekusi..."
              className="input resize-none"
            />
          </div>

          {/* Field 4: Status Operasional Radio */}
          <div>
            <span className="label mb-1.5 block">Kesimpulan Status Operasional:</span>
            <div className="grid grid-cols-3 gap-1 rounded-lg border border-line bg-ink-850 p-1">
              {STATUSES.map((s) => {
                const active = summary.statusOperasional === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => update({ statusOperasional: s })}
                    aria-pressed={active}
                    className={`rounded-md px-2 py-2 text-center text-xs font-semibold transition-colors ${
                      active ? 'bg-accent/15 text-accent' : 'text-mid hover:bg-ink-800 hover:text-hi'
                    }`}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Field 5: Custom Edit Kalimat Kesimpulan */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="label text-xs">Custom Teks Kesimpulan Akhir (Opsional)</span>
              <button
                type="button"
                onClick={() => setIsEditingCustom(!isEditingCustom)}
                className="text-[10px] text-accent hover:underline flex items-center gap-1"
              >
                <Edit3 className="h-3 w-3" /> {isEditingCustom ? 'Sembunyikan Edit' : 'Edit Kalimat Kesimpulan'}
              </button>
            </div>

            {isEditingCustom && (
              <textarea
                rows={2}
                value={summary.customKesimpulan || ''}
                onChange={(e) => update({ customKesimpulan: e.target.value })}
                placeholder='Default: "Operasional pada tanggal [Tanggal] berjalan [Status]. Seluruh temuan telah dikoordinasikan dengan Leader/Admin dan akan dimonitor hingga tindak lanjut selesai."'
                className="input resize-none font-mono text-xs text-hi"
              />
            )}
          </div>
        </div>

        {/* Right Col: Auto-Generated Report Preview Box */}
        <div className="flex min-h-0 flex-col">
          <span className="label mb-1.5 block">Pratinjau Teks Laporan WhatsApp Ready</span>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-line bg-ink-950">
            <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2.5">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-low">
                <ClipboardCheck className="h-3.5 w-3.5 text-accent" />
                Format WhatsApp BSS
              </span>
              <button
                type="button"
                onClick={copy}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
                  copied
                    ? 'border-ok/40 bg-ok/10 text-ok shadow-sm'
                    : 'border-accent/40 bg-accent text-ink-950 hover:bg-[#ffb224] shadow-md shadow-accent/20'
                }`}
              >
                {copied ? (
                  <>
                    <CheckCheck className="h-3.5 w-3.5" />
                    Tersalin ke Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Teks Laporan (WA)
                  </>
                )}
              </button>
            </div>
            <pre className="term-scroll max-h-[520px] flex-1 overflow-auto whitespace-pre-wrap p-4 font-mono text-[12px] leading-relaxed text-hi/90">
              {preview}
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}

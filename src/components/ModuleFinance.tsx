import { Banknote, RefreshCw, Zap } from 'lucide-react'
import { useState } from 'react'
import { OUTLETS, type IncomeReportItem, type LogStatus, type OutletCode } from '../types'
import { Badge } from './Badge'

const fmtRp = (n: number) => n.toLocaleString('id-ID')
const fmtDelta = (n: number) =>
  n > 0 ? `+Rp ${fmtRp(n)}` : n < 0 ? `−Rp ${fmtRp(Math.abs(n))}` : 'Rp 0'

const TREND: Record<IncomeReportItem['trend'], { mark: string; cls: string }> = {
  Naik: { mark: '▲', cls: 'text-ok font-bold' },
  Turun: { mark: '▼', cls: 'text-bad font-bold' },
  Sama: { mark: '▬', cls: 'text-mid font-semibold' },
}

interface Props {
  items: IncomeReportItem[]
  onChange: (items: IncomeReportItem[]) => void
  onLog: (status: LogStatus, step: string, message: string) => void
  spreadsheetUrl?: string
  tanggalLaporan?: string
}

export function ModuleFinance({ items, onChange, onLog, spreadsheetUrl, tanggalLaporan }: Props) {
  const [target, setTarget] = useState<OutletCode>(OUTLETS[0].code)
  const [busy, setBusy] = useState(false)

  const dateStr = tanggalLaporan || new Date().toISOString().split('T')[0]
  const dateObj = new Date(dateStr)
  dateObj.setDate(dateObj.getDate() - 7)
  const h7DateStr = dateObj.toISOString().split('T')[0]

  const syncOne = async () => {
    setBusy(true)
    onLog('running', 'mulai', `Memulai Playwright sync untuk ${target} (${dateStr} vs H-7: ${h7DateStr})`)

    try {
      const res = await fetch('http://localhost:3101/api/automate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: target,
          date: dateStr,
          income: 350000,
          shift: 'Shift 1',
          spreadsheetUrl,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        if (Array.isArray(data.logs)) {
          data.logs.forEach((msg: string) => onLog('running', 'step', msg))
        }
        onLog('success', 'selesai', `Data ${target} berhasil disinkronkan ke Rekapan Total Income!`)
      } else {
        onLog('failed', 'error', `Gagal: ${data.message || 'Server error'}`)
      }
    } catch (err: any) {
      onLog('failed', 'net_err', `Gagal terhubung ke http://localhost:3101 (${err.message})`)
    } finally {
      setBusy(false)
    }
  }

  const syncAll = async () => {
    setBusy(true)
    onLog('running', 'mulai', `Memulai Playwright batch sync 20 outlets (${dateStr} vs H-7: ${h7DateStr})`)

    try {
      const res = await fetch('http://localhost:3101/api/automate-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: dateStr,
          spreadsheetUrl,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        if (Array.isArray(data.logs)) {
          data.logs.forEach((msg: string) => onLog('running', 'step', msg))
        }
        if (Array.isArray(data.incomes)) {
          onChange(data.incomes)
        }
        onLog('success', 'selesai', `✅ Seluruh 20 Outlets berhasil di-sync (Range: ${dateStr} vs ${h7DateStr})`)
      } else {
        onLog('failed', 'error', `Gagal batch sync: ${data.message || 'Server error'}`)
      }
    } catch (err: any) {
      onLog('failed', 'net_err', `Network error: ${err.message}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="panel flex min-h-0 flex-col p-4 sm:p-5">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-line pb-3">
        <div>
          <p className="label">Modul 4</p>
          <h2 className="mt-1 font-display text-base font-semibold tracking-wide text-hi">
            Laporan Pendapatan (Finance Sync 20 Outlets)
          </h2>
          <p className="mt-0.5 text-xs text-mid">
            Komparasi otomatis: <span className="font-mono text-accent font-semibold">Hari Ini ({dateStr})</span> vs <span className="font-mono text-low font-semibold">Minggu Lalu H-7 ({h7DateStr})</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{items.length} / 20 disinkron</Badge>
          <button
            type="button"
            onClick={syncOne}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-lg border border-line bg-ink-850 px-3 py-2 text-xs font-semibold text-hi transition-colors hover:bg-ink-800 disabled:cursor-wait disabled:opacity-50"
          >
            <Zap className="h-3.5 w-3.5 text-accent" />
            Sync [{target}]
          </button>
          <button
            type="button"
            onClick={syncAll}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/15 px-3.5 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent/25 disabled:cursor-wait disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${busy ? 'animate-spin' : ''}`} />
            Sync Semua Lokasi (20 Outlets)
          </button>
        </div>
      </header>

      {/* Outlet Selector Grid */}
      <div className="mb-4">
        <span className="label mb-1.5 block">Target Outlet Individual:</span>
        <div className="term-scroll grid grid-cols-4 gap-1 overflow-x-auto sm:grid-cols-5 md:grid-cols-10">
          {OUTLETS.map((o) => {
            const active = target === o.code
            return (
              <button
                key={o.code}
                type="button"
                onClick={() => setTarget(o.code)}
                aria-pressed={active}
                className={`rounded-md border px-2 py-1.5 font-mono text-xs font-semibold transition-colors ${
                  active
                    ? 'border-accent/40 bg-ink-850 text-accent'
                    : 'border-transparent text-mid hover:border-line hover:bg-ink-850/60'
                }`}
              >
                {o.code}
              </button>
            )
          })}
        </div>
      </div>

      {/* Income Table */}
      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line py-12 text-center">
          <Banknote className="h-8 w-8 text-low" />
          <p className="text-xs text-mid font-semibold">
            Belum ada data pendapatan.
          </p>
          <p className="text-xs text-low">
            Klik <strong className="text-accent">"Sync Semua Lokasi (20 Outlets)"</strong> untuk otomatis membaca data spreadsheet (Hari Ini vs H-7).
          </p>
        </div>
      ) : (
        <div className="term-scroll max-h-[500px] overflow-auto rounded-lg border border-line bg-ink-950">
          <table className="w-full text-left text-xs font-mono">
            <thead className="sticky top-0 border-b border-line bg-ink-900 text-low uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Lokasi</th>
                <th className="py-2.5 px-3">Hari Ini ({dateStr})</th>
                <th className="py-2.5 px-3">Minggu Lalu ({h7DateStr})</th>
                <th className="py-2.5 px-3">Selisih (Delta)</th>
                <th className="py-2.5 px-3">Tren</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {items.map((item) => {
                const tr = TREND[item.trend]
                return (
                  <tr key={item.lokasi} className="hover:bg-ink-850/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-hi">{item.lokasi}</td>
                    <td className="py-2.5 px-3 text-accent font-semibold">Rp {fmtRp(item.hariIni)}</td>
                    <td className="py-2.5 px-3 text-mid">Rp {fmtRp(item.mingguLalu)}</td>
                    <td className={`py-2.5 px-3 font-semibold ${item.delta > 0 ? 'text-ok' : item.delta < 0 ? 'text-bad' : 'text-mid'}`}>
                      {fmtDelta(item.delta)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1 font-semibold ${tr.cls}`}>
                        {tr.mark} {item.trend}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

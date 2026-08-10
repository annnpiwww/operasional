import { Building2, CalendarDays, ExternalLink, Link2, Lock, RotateCcw, User } from 'lucide-react'
import { useState } from 'react'
import type { HeaderInfo } from '../types'

const DEFAULT_SPREADSHEET_URL =
  'https://docs.google.com/spreadsheets/d/1kbHKDu9uTlGRHwjvfXNwR71cXfRjMdCIWbvjZoDy2gU/edit?gid=303152#gid=303152'

interface Props {
  headerInfo: HeaderInfo
  onChange: (updated: HeaderInfo) => void
}

export function ModuleHeader({ headerInfo, onChange }: Props) {
  const [showUrlEdit, setShowUrlEdit] = useState(false)

  const handleResetUrl = () => {
    onChange({ ...headerInfo, spreadsheetUrl: DEFAULT_SPREADSHEET_URL })
  }

  return (
    <section className="panel mb-4 p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
        <h2 className="font-display text-sm font-semibold tracking-wide text-hi flex items-center gap-2">
          <Building2 className="h-4 w-4 text-accent" />
          Informasi Header Laporan Operasional SPV
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrlEdit(!showUrlEdit)}
            className="font-mono text-[10px] text-accent hover:underline flex items-center gap-1 bg-accent/10 border border-accent/30 px-2 py-0.5 rounded-full"
          >
            <Link2 className="h-3 w-3" />
            {showUrlEdit ? 'Tutup Setting Link' : '🔗 Ganti Link Spreadsheet Target'}
          </button>
          <span className="font-mono text-[10px] text-accent font-semibold bg-accent/10 border border-accent/30 px-2 py-0.5 rounded-full">
            WAJIB DIISI SPV
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* 1. Tanggal Laporan */}
        <div>
          <label htmlFor="hdr-date" className="label mb-1.5 flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-accent" /> Tanggal Laporan
          </label>
          <input
            id="hdr-date"
            type="date"
            required
            value={headerInfo.tanggalLaporan}
            onChange={(e) => onChange({ ...headerInfo, tanggalLaporan: e.target.value })}
            className="input font-mono text-sm"
          />
        </div>

        {/* 2. Nama Supervisor (SPV) */}
        <div>
          <label htmlFor="hdr-spv" className="label mb-1.5 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-accent" /> Nama Supervisor (SPV)
          </label>
          <input
            id="hdr-spv"
            type="text"
            required
            placeholder="Masukkan nama lengkap SPV Anda…"
            value={headerInfo.namaSPV}
            onChange={(e) => onChange({ ...headerInfo, namaSPV: e.target.value })}
            className="input text-sm"
          />
        </div>

        {/* 3. Kantor Cabang / Area (PATEN) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-accent" /> Kantor Cabang / Area
            </label>
            <span className="font-mono text-[10px] text-low flex items-center gap-1 bg-ink-800 px-1.5 py-0.5 rounded border border-line">
              <Lock className="h-2.5 w-2.5" /> PATEN
            </span>
          </div>
          <input
            type="text"
            disabled
            value="KC SulutGoTengPa"
            className="input bg-ink-850 text-accent font-semibold cursor-not-allowed opacity-90"
          />
        </div>
      </div>

      {/* Dynamic Link Google Spreadsheet Input */}
      {showUrlEdit && (
        <div className="mt-3.5 pt-3 border-t border-line/60 bg-ink-950/60 p-3 rounded-lg animate-in fade-in">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="hdr-url" className="label text-xs font-semibold text-accent flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5" /> Target Link Google Spreadsheet (Auto Sync Destination)
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetUrl}
                className="text-[10px] text-mid hover:text-hi flex items-center gap-1 hover:underline"
              >
                <RotateCcw className="h-2.5 w-2.5" /> Reset Default
              </button>
              <a
                href={headerInfo.spreadsheetUrl || DEFAULT_SPREADSHEET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-accent hover:underline flex items-center gap-1"
              >
                Buka Link <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>
          <input
            id="hdr-url"
            type="url"
            value={headerInfo.spreadsheetUrl}
            onChange={(e) => onChange({ ...headerInfo, spreadsheetUrl: e.target.value })}
            placeholder="Paste link Google Spreadsheet baru di sini (https://docs.google.com/spreadsheets/d/...)..."
            className="input font-mono text-xs text-hi"
          />
          <p className="mt-1 text-[10px] text-low">
            *Jika link spreadsheet diganti oleh tim manajemen, paste URL baru di atas. Playwright akan otomatis me-refer ke link ini.
          </p>
        </div>
      )}
    </section>
  )
}

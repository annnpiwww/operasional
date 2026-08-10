import { MapPin, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { VisitPoint } from '../types'
import { Badge } from './Badge'

let seq = 0
const nextId = () => `vp-${++seq}-${Date.now().toString(36)}`

interface Props {
  points: VisitPoint[]
  onChange: (points: VisitPoint[]) => void
}

export function ModuleVisit({ points, onChange }: Props) {
  const [lokasi, setLokasi] = useState('')
  const [catatan, setCatatan] = useState('')

  const canAdd = lokasi.trim() !== ''
  const add = () => {
    if (!canAdd) return
    onChange([...points, { id: nextId(), lokasi: lokasi.trim(), catatan: catatan.trim() }])
    setLokasi('')
    setCatatan('')
  }
  const remove = (id: string) => onChange(points.filter((p) => p.id !== id))

  return (
    <section className="panel flex min-h-0 flex-col p-4 sm:p-5">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="label">Modul 1</p>
          <h2 className="mt-1 font-display text-base font-semibold tracking-wide text-hi">
            Visit Lokasi
          </h2>
          <p className="mt-0.5 text-xs text-mid">
            Titik pantau kunjungan lapangan — tambah atau hapus sesuai kondisi.
          </p>
        </div>
        <Badge tone="accent">{points.length} titik</Badge>
      </header>

      <div className="mb-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <div>
          <label htmlFor="vp-lokasi" className="label mb-1.5 block">
            Lokasi
          </label>
          <input
            id="vp-lokasi"
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="cth: Pos 01 – TBM"
            className="input"
          />
        </div>
        <div>
          <label htmlFor="vp-catatan" className="label mb-1.5 block">
            Catatan Temuan
          </label>
          <input
            id="vp-catatan"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="Kondisi lapangan…"
            className="input"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={add}
            disabled={!canAdd}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:border-line disabled:bg-ink-800 disabled:text-low sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Tambah
          </button>
        </div>
      </div>

      {points.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line py-10 text-center">
          <MapPin className="h-6 w-6 text-low" />
          <p className="text-xs text-low">Belum ada titik kunjungan. Tambahkan lokasi yang dipantau.</p>
        </div>
      ) : (
        <ul className="term-scroll max-h-[480px] space-y-2 overflow-y-auto pr-1">
          {points.map((p, i) => (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-lg border border-line bg-ink-850/60 px-3 py-2.5"
            >
              <span className="font-mono text-[10px] text-low">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-hi">{p.lokasi}</p>
                {p.catatan && <p className="truncate text-xs text-mid">{p.catatan}</p>}
              </div>
              <button
                type="button"
                onClick={() => remove(p.id)}
                aria-label={`Hapus ${p.lokasi}`}
                className="rounded-md border border-line p-2 text-low transition-colors hover:border-bad/40 hover:bg-bad/10 hover:text-bad"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
import { Pencil, Plus, Save, Trash2, Users, X } from 'lucide-react'
import { useState } from 'react'
import { OUTLETS, type LeaderCoordinationItem } from '../types'
import { Badge } from './Badge'

let seq = 0
const nextId = () => `crd-${++seq}-${Date.now().toString(36)}`

interface Props {
  items: LeaderCoordinationItem[]
  onChange: (items: LeaderCoordinationItem[]) => void
}

export function ModuleCoordination({ items, onChange }: Props) {
  const [lokasi, setLokasi] = useState<string>(OUTLETS[0].code)
  const [hasil, setHasil] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<LeaderCoordinationItem | null>(null)

  const canAdd = hasil.trim() !== ''
  const add = () => {
    if (!canAdd) return
    onChange([...items, { id: nextId(), lokasi, hasilKegiatan: hasil.trim() }])
    setHasil('')
  }

  const startEdit = (item: LeaderCoordinationItem) => {
    setEditingId(item.id)
    setDraft({ ...item })
  }
  const saveEdit = () => {
    if (!draft || !draft.hasilKegiatan.trim()) return
    onChange(items.map((it) => (it.id === draft.id ? draft : it)))
    setEditingId(null)
    setDraft(null)
  }
  const cancelEdit = () => {
    setEditingId(null)
    setDraft(null)
  }
  const remove = (id: string) => onChange(items.filter((it) => it.id !== id))

  return (
    <section className="panel flex min-h-0 flex-col p-4 sm:p-5">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="label">Modul 5</p>
          <h2 className="mt-1 font-display text-base font-semibold tracking-wide text-hi">
            Laporan Koordinasi Leader/Admin
          </h2>
          <p className="mt-0.5 text-xs text-mid">
            Hasil koordinasi dan kegiatan leader/admin di setiap lokasi.
          </p>
        </div>
        <Badge tone="blue">{items.length} kegiatan</Badge>
      </header>

      <div className="mb-4 grid gap-2 sm:grid-cols-[200px_minmax(0,1fr)_auto]">
        <div>
          <label htmlFor="crd-lokasi" className="label mb-1.5 block">
            Lokasi
          </label>
          <select
            id="crd-lokasi"
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            className="input"
          >
            {OUTLETS.map((o) => (
              <option key={o.code} value={o.code}>
                {o.code} · {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="crd-hasil" className="label mb-1.5 block">
            Hasil Kegiatan / Koordinasi
          </label>
          <input
            id="crd-hasil"
            value={hasil}
            onChange={(e) => setHasil(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="cth: Briefing shift, pengecekan logbook…"
            className="input"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={add}
            disabled={!canAdd}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:border-line disabled:bg-ink-800 disabled:text-low"
          >
            <Plus className="h-4 w-4" />
            Tambah
          </button>
        </div>
      </div>

      <div className="term-scroll overflow-x-auto">
        <table className="w-full min-w-[560px] text-left">
          <thead>
            <tr className="border-b border-line text-[10px] uppercase tracking-[0.14em] text-low">
              <th className="py-2 pr-3 font-semibold">#</th>
              <th className="py-2 pr-3 font-semibold">Lokasi</th>
              <th className="py-2 pr-3 font-semibold">Hasil Kegiatan / Koordinasi</th>
              <th className="py-2 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="py-10 text-center">
                  <Users className="mx-auto mb-2 h-6 w-6 text-low" />
                  <p className="text-xs text-low">Belum ada kegiatan koordinasi tercatat.</p>
                </td>
              </tr>
            )}
            {items.map((it, i) =>
              editingId === it.id ? (
                <tr key={it.id} className="bg-ink-850/60">
                  <td className="py-2 pr-3 font-mono text-[10px] text-low">
                    {String(i + 1).padStart(2, '0')}
                  </td>
                  <td className="py-2 pr-3">
                    <select
                      value={draft?.lokasi ?? it.lokasi}
                      onChange={(e) => setDraft((d) => (d ? { ...d, lokasi: e.target.value } : d))}
                      className="input px-2 py-1.5 text-xs"
                    >
                      {OUTLETS.map((o) => (
                        <option key={o.code} value={o.code}>
                          {o.code}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      value={draft?.hasilKegiatan ?? it.hasilKegiatan}
                      onChange={(e) =>
                        setDraft((d) => (d ? { ...d, hasilKegiatan: e.target.value } : d))
                      }
                      className="input px-2 py-1.5 text-xs"
                    />
                  </td>
                  <td className="py-2">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={saveEdit}
                        aria-label="Simpan perubahan"
                        className="rounded-md border border-ok/40 p-2 text-ok transition-colors hover:bg-ok/10"
                      >
                        <Save className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        aria-label="Batalkan edit"
                        className="rounded-md border border-line p-2 text-mid transition-colors hover:text-hi"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={it.id} className="transition-colors hover:bg-ink-850/40">
                  <td className="py-2.5 pr-3 font-mono text-[10px] text-low">
                    {String(i + 1).padStart(2, '0')}
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className="font-mono text-xs font-semibold tracking-wide text-hi">
                      {it.lokasi}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-xs text-mid">{it.hasilKegiatan}</td>
                  <td className="py-2.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => startEdit(it)}
                        aria-label={`Edit kegiatan ${it.hasilKegiatan}`}
                        className="rounded-md border border-line p-2 text-low transition-colors hover:border-accent/40 hover:text-accent"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(it.id)}
                        aria-label={`Hapus kegiatan ${it.hasilKegiatan}`}
                        className="rounded-md border border-line p-2 text-low transition-colors hover:border-bad/40 hover:bg-bad/10 hover:text-bad"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
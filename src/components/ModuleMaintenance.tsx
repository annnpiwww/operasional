import { Pencil, Plus, Save, Trash2, Wrench, X } from 'lucide-react'
import { useState } from 'react'
import { OUTLETS, type MaintenanceItem } from '../types'
import { Badge, type BadgeTone } from './Badge'

let seq = 0
const nextId = () => `mnt-${++seq}-${Date.now().toString(36)}`

const STATUSES: MaintenanceItem['status'][] = ['Selesai', 'On Progress', 'Pending']

const STATUS_TONE: Record<MaintenanceItem['status'], BadgeTone> = {
  Selesai: 'ok',
  'On Progress': 'accent',
  Pending: 'low',
}

interface Props {
  items: MaintenanceItem[]
  onChange: (items: MaintenanceItem[]) => void
}

export function ModuleMaintenance({ items, onChange }: Props) {
  const [lokasi, setLokasi] = useState<string>(OUTLETS[0].code)
  const [perbaikan, setPerbaikan] = useState('')
  const [status, setStatus] = useState<MaintenanceItem['status']>('Pending')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<MaintenanceItem | null>(null)

  const canAdd = perbaikan.trim() !== ''
  const add = () => {
    if (!canAdd) return
    onChange([...items, { id: nextId(), lokasi, perbaikan: perbaikan.trim(), status }])
    setPerbaikan('')
    setStatus('Pending')
  }

  const startEdit = (item: MaintenanceItem) => {
    setEditingId(item.id)
    setDraft({ ...item })
  }
  const saveEdit = () => {
    if (!draft || !draft.perbaikan.trim()) return
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
          <p className="label">Modul 3</p>
          <h2 className="mt-1 font-display text-base font-semibold tracking-wide text-hi">
            Perbaikan &amp; Penambahan Aksesoris
          </h2>
          <p className="mt-0.5 text-xs text-mid">
            Daftar pekerjaan perbaikan dan penambahan aksesoris di lokasi.
          </p>
        </div>
        <Badge tone="accent">{items.length} item</Badge>
      </header>

      <div className="mb-4 grid gap-2 sm:grid-cols-[180px_minmax(0,1fr)_auto_auto]">
        <div>
          <label htmlFor="mnt-lokasi" className="label mb-1.5 block">
            Lokasi
          </label>
          <select
            id="mnt-lokasi"
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
          <label htmlFor="mnt-perbaikan" className="label mb-1.5 block">
            Deskripsi Perbaikan / Aksesoris
          </label>
          <input
            id="mnt-perbaikan"
            value={perbaikan}
            onChange={(e) => setPerbaikan(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="cth: Ganti kamera pos 2, tambah lampu sorot…"
            className="input"
          />
        </div>
        <div>
          <span className="label mb-1.5 block">Status</span>
          <div className="flex h-[42px] items-center gap-1 rounded-lg border border-line bg-ink-850 p-1">
            {STATUSES.map((s) => {
              const active = status === s
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  aria-pressed={active}
                  className={`whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-semibold transition-colors ${
                    active ? 'bg-accent/15 text-accent' : 'text-mid hover:bg-ink-800 hover:text-hi'
                  }`}
                >
                  {s}
                </button>
              )
            })}
          </div>
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
        <table className="w-full min-w-[680px] text-left">
          <thead>
            <tr className="border-b border-line text-[10px] uppercase tracking-[0.14em] text-low">
              <th className="py-2 pr-3 font-semibold">#</th>
              <th className="py-2 pr-3 font-semibold">Lokasi</th>
              <th className="py-2 pr-3 font-semibold">Deskripsi Perbaikan / Aksesoris</th>
              <th className="py-2 pr-3 font-semibold">Status</th>
              <th className="py-2 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center">
                  <Wrench className="mx-auto mb-2 h-6 w-6 text-low" />
                  <p className="text-xs text-low">Belum ada item perbaikan / aksesoris.</p>
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
                      value={draft?.perbaikan ?? it.perbaikan}
                      onChange={(e) =>
                        setDraft((d) => (d ? { ...d, perbaikan: e.target.value } : d))
                      }
                      className="input px-2 py-1.5 text-xs"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <select
                      value={draft?.status ?? it.status}
                      onChange={(e) =>
                        setDraft((d) =>
                          d ? { ...d, status: e.target.value as MaintenanceItem['status'] } : d,
                        )
                      }
                      className="input px-2 py-1.5 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
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
                  <td className="py-2.5 pr-3 text-xs text-mid">{it.perbaikan}</td>
                  <td className="py-2.5 pr-3">
                    <Badge tone={STATUS_TONE[it.status]}>{it.status}</Badge>
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => startEdit(it)}
                        aria-label={`Edit ${it.perbaikan}`}
                        className="rounded-md border border-line p-2 text-low transition-colors hover:border-accent/40 hover:text-accent"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(it.id)}
                        aria-label={`Hapus ${it.perbaikan}`}
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
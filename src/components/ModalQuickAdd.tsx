import { MapPin, Plus, ShieldAlert, Users, Wrench, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
  OUTLETS,
  type IncidentItem,
  type LeaderCoordinationItem,
  type MaintenanceItem,
  type VisitPoint,
} from '../types'
import { ModalShell } from './ModalShell'

interface Props {
  isOpen: boolean
  onClose: () => void
  onAddVisit: (item: VisitPoint) => void
  onAddIncident: (item: IncidentItem) => void
  onAddMaintenance: (item: MaintenanceItem) => void
  onAddCoordination: (item: LeaderCoordinationItem) => void
}

type Category = 'visit' | 'incident' | 'maintenance' | 'coordination'

const CATS: { id: Category; label: string; icon: typeof MapPin }[] = [
  { id: 'visit', label: 'Visit', icon: MapPin },
  { id: 'incident', label: 'Kejadian', icon: ShieldAlert },
  { id: 'maintenance', label: 'Perbaikan', icon: Wrench },
  { id: 'coordination', label: 'Koordinasi', icon: Users },
]

const INC_STATUS = ['Proses Investigasi', 'Selesai', 'Tindak Lanjut'] as const
const MNT_STATUS = ['Pending', 'On Progress', 'Selesai'] as const

const FIELD_LABEL: Record<Category, string> = {
  visit: 'Catatan Kunjungan / Monitoring Field',
  incident: 'Jenis Kejadian / Insiden',
  maintenance: 'Rincian Perbaikan / Aksesoris',
  coordination: 'Hasil Koordinasi Leader / Admin',
}

const FIELD_HINT: Record<Category, string> = {
  visit: 'cth: Patroli malam, kondisi pos aman…',
  incident: 'cth: Pencurian di pos, kerusakan CCTV…',
  maintenance: 'cth: Ganti kamera pos 2, tambah lampu sorot…',
  coordination: 'cth: Briefing shift, pengecekan logbook…',
}

export function ModalQuickAdd({
  isOpen,
  onClose,
  onAddVisit,
  onAddIncident,
  onAddMaintenance,
  onAddCoordination,
}: Props) {
  const [category, setCategory] = useState<Category>('visit')
  const [lokasi, setLokasi] = useState<string>(OUTLETS[0].code)
  const [deskripsi, setDeskripsi] = useState('')
  const [status, setStatus] = useState<string>('Proses Investigasi')
  const deskripsiRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen) {
      setCategory('visit')
      setLokasi(OUTLETS[0].code)
      setDeskripsi('')
      setStatus('Proses Investigasi')
      deskripsiRef.current?.focus()
    }
  }, [isOpen])

  const canSubmit = deskripsi.trim() !== ''

  const submit = () => {
    if (!canSubmit) return
    const id = `qa-${Date.now().toString(36)}`
    const target = lokasi

    if (category === 'visit') {
      onAddVisit({ id, lokasi: target, catatan: deskripsi.trim() })
    } else if (category === 'incident') {
      onAddIncident({
        id,
        lokasi: target,
        jenisKejadian: deskripsi.trim(),
        statusPenanganan: status as IncidentItem['statusPenanganan'],
      })
    } else if (category === 'maintenance') {
      onAddMaintenance({
        id,
        lokasi: target,
        perbaikan: deskripsi.trim(),
        status: status as MaintenanceItem['status'],
      })
    } else {
      onAddCoordination({ id, lokasi: target, hasilKegiatan: deskripsi.trim() })
    }
    onClose()
  }

  const pickCategory = (c: Category) => {
    setCategory(c)
    setStatus(c === 'incident' ? 'Proses Investigasi' : c === 'maintenance' ? 'Pending' : status)
  }

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} labelledBy="qa-title">
      <header className="mb-4 flex items-start justify-between gap-3 border-b border-line pb-4">
        <div>
          <h3
            id="qa-title"
            className="flex items-center gap-2 font-display text-base font-semibold tracking-wide text-hi"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/40 bg-accent/10">
              <Plus className="h-4 w-4 text-accent" />
            </span>
            Tambah Cepat Catatan
          </h3>
          <p className="mt-1 text-xs text-mid">
            Satu form untuk semua modul — pilih kategori, isi, simpan.
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

      <div className="seg mb-4">
        {CATS.map((cat) => {
          const Icon = cat.icon
          const active = category === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => pickCategory(cat.id)}
              aria-pressed={active}
              className={`seg-btn flex items-center justify-center gap-1.5 ${active ? 'seg-btn-active' : 'seg-btn-idle'}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.label}
            </button>
          )
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="qa-lokasi" className="label mb-1.5 block">
            Kode Lokasi / Outlet
          </label>
          <select
            id="qa-lokasi"
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            className="input font-mono"
          >
            {OUTLETS.map((o) => (
              <option key={o.code} value={o.code}>
                {o.code} · {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="qa-deskripsi" className="label mb-1.5 block">
            {FIELD_LABEL[category]}
          </label>
          <textarea
            id="qa-deskripsi"
            ref={deskripsiRef}
            rows={3}
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submit()
            }}
            placeholder={FIELD_HINT[category]}
            className="input resize-none"
          />
        </div>

        {(category === 'incident' || category === 'maintenance') && (
          <div>
            <span className="label mb-1.5 block">Status</span>
            <div className="seg">
              {(category === 'incident' ? INC_STATUS : MNT_STATUS).map((s) => {
                const active = status === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    aria-pressed={active}
                    className={`seg-btn ${active ? 'seg-btn-active' : 'seg-btn-idle'}`}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <footer className="flex items-center justify-end gap-2 border-t border-line pt-4">
          <button type="button" onClick={onClose} className="btn-ghost">
            Batal
          </button>
          <button type="submit" disabled={!canSubmit} className="btn-solid">
            <Plus className="h-3.5 w-3.5" />
            Simpan Catatan
          </button>
        </footer>
      </form>
    </ModalShell>
  )
}
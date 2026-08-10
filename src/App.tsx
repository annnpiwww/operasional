import {
  Banknote,
  ClipboardCheck,
  Clock3,
  Code,
  Eye,
  MapPin,
  Plus,
  ShieldCheck,
  Siren,
  Users,
  Wifi,
  Wrench,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AutomationLogTerminal } from './components/AutomationLogTerminal'
import { MarkdownView } from './components/MarkdownView'
import { ModalQuickAdd } from './components/ModalQuickAdd'
import { ModalReportPreview } from './components/ModalReportPreview'
import { ModuleCoordination } from './components/ModuleCoordination'
import { ModuleFinance } from './components/ModuleFinance'
import { ModuleHeader } from './components/ModuleHeader'
import { ModuleIncident } from './components/ModuleIncident'
import { ModuleMaintenance } from './components/ModuleMaintenance'
import { ModuleSummary } from './components/ModuleSummary'
import { ModuleVisit } from './components/ModuleVisit'
import {
  type AutomationState,
  type HeaderInfo,
  type IncidentItem,
  type IncomeReportItem,
  type LeaderCoordinationItem,
  type LogEntry,
  type LogStatus,
  type MaintenanceItem,
  type SPVFinalSummary,
  type VisitPoint,
} from './types'

const HEALTH_URL = 'http://localhost:3101/api/health'

type TabId = 1 | 2 | 3 | 4 | 5 | 6 | 7

const TABS: { id: TabId; label: string; icon: typeof MapPin }[] = [
  { id: 1, label: 'Visit Lokasi', icon: MapPin },
  { id: 2, label: 'Incident Report', icon: Siren },
  { id: 3, label: 'Perbaikan & Aksesoris', icon: Wrench },
  { id: 4, label: 'Pendapatan (Sync 20 Outlets)', icon: Banknote },
  { id: 5, label: 'Koordinasi Leader', icon: Users },
  { id: 6, label: 'Catatan & Kesimpulan', icon: ClipboardCheck },
  { id: 7, label: 'Structured Markdown', icon: Code },
]

function currentShift(): number {
  const h = new Date().getHours()
  if (h >= 6 && h < 14) return 1
  if (h >= 14 && h < 22) return 2
  return 3
}

export default function App() {
  const [tab, setTab] = useState<TabId>(1)
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Header Info Section State (Tanggal, SPV, KC SulutGoTengPa PATEN, Dynamic URL)
  const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({
    tanggalLaporan: new Date().toISOString().split('T')[0],
    namaSPV: '',
    kantorCabang: 'KC SulutGoTengPa', // Fixed Paten
    spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1kbHKDu9uTlGRHwjvfXNwR71cXfRjMdCIWbvjZoDy2gU/edit?gid=303152#gid=303152',
  })

  const [visitPoints, setVisitPoints] = useState<VisitPoint[]>([])
  const [incidents, setIncidents] = useState<IncidentItem[]>([])
  const [maintenances, setMaintenances] = useState<MaintenanceItem[]>([])
  const [incomes, setIncomes] = useState<IncomeReportItem[]>([])
  const [coordinations, setCoordinations] = useState<LeaderCoordinationItem[]>([])
  const [summary, setSummary] = useState<SPVFinalSummary>({
    kendala: '',
    kebutuhan: '',
    rencanaTindakLanjut: '',
    statusOperasional: 'Normal',
  })

  const [logs, setLogs] = useState<LogEntry[]>([])
  const [autoState, setAutoState] = useState<AutomationState>('idle')
  const [apiOnline, setApiOnline] = useState<boolean | null>(null)

  const logId = useRef(0)

  const addLog = useCallback((status: LogStatus, step: string, message: string) => {
    logId.current += 1
    setLogs((prev) => [
      ...prev.slice(-499),
      {
        id: logId.current,
        ts: new Date().toLocaleTimeString('id-ID', { hour12: false }),
        status,
        step,
        message,
      },
    ])
    if (status === 'running') setAutoState('running')
    else if (status === 'success') setAutoState('success')
    else if (status === 'failed') setAutoState('failed')
  }, [])

  useEffect(() => {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 4000)
    fetch(HEALTH_URL, { signal: ctrl.signal })
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false))
      .finally(() => clearTimeout(t))
    return () => {
      clearTimeout(t)
      ctrl.abort()
    }
  }, [])

  const fullReport = {
    header: headerInfo,
    visitPoints,
    incidents,
    maintenances,
    incomes,
    coordinations,
    summary,
  }

  const tabCounts: Partial<Record<TabId, number>> = {
    1: visitPoints.length,
    2: incidents.length,
    3: maintenances.length,
    4: incomes.length,
    5: coordinations.length,
  }

  const renderTab = () => {
    switch (tab) {
      case 1:
        return <ModuleVisit points={visitPoints} onChange={setVisitPoints} />
      case 2:
        return <ModuleIncident items={incidents} onChange={setIncidents} />
      case 3:
        return <ModuleMaintenance items={maintenances} onChange={setMaintenances} />
      case 4:
        return (
          <ModuleFinance
            items={incomes}
            onChange={setIncomes}
            onLog={addLog}
            spreadsheetUrl={headerInfo.spreadsheetUrl}
            tanggalLaporan={headerInfo.tanggalLaporan}
          />
        )
      case 5:
        return <ModuleCoordination items={coordinations} onChange={setCoordinations} />
      case 6:
        return <ModuleSummary report={fullReport} onChange={setSummary} />
      case 7:
        return <MarkdownView report={fullReport} />
    }
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-20 border-b border-line bg-ink-950/85 backdrop-blur">
        <header className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-accent/40 bg-ink-900">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <div className="hazard-stripe absolute inset-x-0 bottom-0 h-[3px]" />
            </div>
            <div>
              <h1 className="font-display text-sm font-semibold leading-tight tracking-wide text-hi sm:text-base">
                PT Bahana Security Sistem
              </h1>
              <p className="text-[11px] text-mid">Operational Report Builder — KC SulutGoTengPa</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Modal Triggers */}
            <button
              type="button"
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/20"
            >
              <Plus className="h-3.5 w-3.5" /> Quick Add
            </button>

            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-line bg-ink-850 px-3 py-1.5 text-xs font-semibold text-hi transition-colors hover:bg-ink-800"
            >
              <Eye className="h-3.5 w-3.5 text-accent" /> Preview Laporan
            </button>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider ${
                apiOnline === null
                  ? 'border-line text-low'
                  : apiOnline
                    ? 'border-ok/40 bg-ok/10 text-ok'
                    : 'border-bad/40 bg-bad/10 text-bad'
              }`}
              title="Status koneksi ke server automasi"
            >
              <Wifi className="h-3 w-3" />
              API {apiOnline === null ? '…' : apiOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-mid">
              <Clock3 className="h-3 w-3" />
              Shift {currentShift()}
            </span>
          </div>
        </header>

        <nav aria-label="Modul laporan operasional" className="mx-auto max-w-[1440px] px-4 sm:px-6">
          <div className="term-scroll flex gap-1.5 overflow-x-auto border-t border-line py-2.5">
            {TABS.map((t) => {
              const Icon = t.icon
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
                    active
                      ? 'border-accent/40 bg-ink-850 text-hi'
                      : 'border-transparent text-mid hover:bg-ink-850/60 hover:text-hi'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-accent' : 'text-low'}`} />
                  <span className="font-mono text-[10px] text-low">M{t.id}</span>
                  <span className="whitespace-nowrap text-xs font-semibold">{t.label}</span>
                  {tabCounts[t.id] ? (
                    <span className="rounded-full border border-line bg-ink-900 px-1.5 py-px font-mono text-[9px] font-semibold text-mid">
                      {tabCounts[t.id]}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </nav>
      </div>

      <main className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6">
        {/* Header Info Card (Tanggal Laporan, Nama SPV, KC SulutGoTengPa PATEN) */}
        <ModuleHeader headerInfo={headerInfo} onChange={setHeaderInfo} />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-5">
          <div className="min-w-0">{renderTab()}</div>
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <AutomationLogTerminal logs={logs} state={autoState} onClear={() => setLogs([])} />
          </aside>
        </div>
      </main>

      {/* Interactive Modals */}
      <ModalQuickAdd
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddVisit={(item) => setVisitPoints((prev) => [...prev, item])}
        onAddIncident={(item) => setIncidents((prev) => [...prev, item])}
        onAddMaintenance={(item) => setMaintenances((prev) => [...prev, item])}
        onAddCoordination={(item) => setCoordinations((prev) => [...prev, item])}
      />

      <ModalReportPreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        report={fullReport}
      />
    </div>
  )
}

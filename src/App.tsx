import {
  Code,
  Eye,
  Plus,
  ShieldCheck,
  Wifi,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AutomationLogTerminal } from './components/AutomationLogTerminal'
import { IncomeResultsTable } from './components/IncomeResultsTable'
import { MarkdownView } from './components/MarkdownView'
import { ModalQuickAdd } from './components/ModalQuickAdd'
import { ModalReportPreview } from './components/ModalReportPreview'
import { ModuleHeader } from './components/ModuleHeader'
import { OperationalFormsAccordion } from './components/OperationalFormsAccordion'
import { WorkflowSection } from './components/WorkflowSection'
import type {
  AutomationState,
  HeaderInfo,
  IncidentItem,
  IncomeReportItem,
  LeaderCoordinationItem,
  LogEntry,
  LogStatus,
  MaintenanceItem,
  OutletCode,
  SPVFinalSummary,
  VisitPoint,
} from './types'

const HEALTH_URL = 'http://localhost:3101/api/health'

export default function App() {
  const [selectedOutlet, setSelectedOutlet] = useState<OutletCode>('MGNW')
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [activeView, setActiveView] = useState<'dashboard' | 'markdown'>('dashboard')

  // Header Info State
  const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({
    tanggalLaporan: new Date().toISOString().split('T')[0],
    namaSPV: '',
    kantorCabang: 'KC SulutGoTengPa', // Fixed Paten
    spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1kbHKDu9uTlGRHwjvfXNwR71cXfRjMdCIWbvjZoDy2gU/edit?gid=303152#gid=303152',
  })

  // Operational Modules State
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
  const [busy, setBusy] = useState(false)
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

  // Playwright Single Outlet Sync
  const handleSyncSingle = async (outlet: OutletCode) => {
    setBusy(true)
    addLog('running', 'mulai', `Memulai Playwright sync untuk ${outlet} (${headerInfo.tanggalLaporan})`)

    try {
      const res = await fetch('http://localhost:3101/api/automate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: outlet,
          date: headerInfo.tanggalLaporan,
          income: 350000,
          shift: 'Shift 1',
          spreadsheetUrl: headerInfo.spreadsheetUrl,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        if (Array.isArray(data.logs)) {
          data.logs.forEach((msg: string) => addLog('running', 'step', msg))
        }
        addLog('success', 'selesai', `Data ${outlet} berhasil disinkronkan ke Rekapan Total Income!`)
      } else {
        addLog('failed', 'error', `Gagal: ${data.message || 'Server error'}`)
      }
    } catch (err: any) {
      addLog('failed', 'net_err', `Network error: ${err.message}`)
    } finally {
      setBusy(false)
    }
  }

  // Playwright Batch 20 Outlets Sync
  const handleSyncAll = async () => {
    setBusy(true)
    addLog('running', 'mulai', `Memulai Playwright batch sync 20 outlets (${headerInfo.tanggalLaporan})`)

    try {
      const res = await fetch('http://localhost:3101/api/automate-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: headerInfo.tanggalLaporan,
          spreadsheetUrl: headerInfo.spreadsheetUrl,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        if (Array.isArray(data.logs)) {
          data.logs.forEach((msg: string) => addLog('running', 'step', msg))
        }
        if (Array.isArray(data.incomes)) {
          setIncomes(data.incomes)
        }
        addLog('success', 'selesai', `✅ Seluruh 20 Outlets berhasil di-sync (Range Hari Ini vs H-7)!`)
      } else {
        addLog('failed', 'error', `Gagal batch sync: ${data.message || 'Server error'}`)
      }
    } catch (err: any) {
      addLog('failed', 'net_err', `Network error: ${err.message}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Top Navbar Header */}
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
              <p className="text-[11px] text-mid">Operational Automation App — KC SulutGoTengPa</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveView(activeView === 'dashboard' ? 'markdown' : 'dashboard')}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeView === 'markdown'
                  ? 'border-accent bg-accent/20 text-accent font-bold'
                  : 'border-line bg-ink-850 text-hi hover:bg-ink-800'
              }`}
            >
              <Code className="h-3.5 w-3.5" />
              {activeView === 'markdown' ? 'Kembali ke Dashboard' : 'Structured Markdown'}
            </button>

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
            >
              <Wifi className="h-3 w-3" />
              API {apiOnline === null ? '…' : apiOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </header>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 space-y-4">
        {/* Header Info Section (Tanggal, SPV, KC SulutGoTengPa PATEN, Link Spreadsheet URL) */}
        <ModuleHeader headerInfo={headerInfo} onChange={setHeaderInfo} />

        {activeView === 'markdown' ? (
          <MarkdownView report={fullReport} />
        ) : (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-5">
            {/* Left Main Column */}
            <div className="min-w-0 space-y-4">
              {/* 1. Workflow Section Card (Step 1 -> Step 2 -> Step 3) */}
              <WorkflowSection
                selectedOutlet={selectedOutlet}
                onSelectOutlet={setSelectedOutlet}
                onSyncSingle={handleSyncSingle}
                onSyncAll={handleSyncAll}
                isSyncing={busy}
                hasData={incomes.length > 0}
              />

              {/* 2. Income Results Table & Summary Metrics (MENONJOL TAMPILKAN HASIL OTOMATISASI 20 OUTLETS) */}
              <IncomeResultsTable items={incomes} tanggalLaporan={headerInfo.tanggalLaporan} />

              {/* 3. Simplified Unified Operational Forms (Visit, Incident, Maintenance, Coordination, Summary) */}
              <OperationalFormsAccordion
                visitPoints={visitPoints}
                setVisitPoints={setVisitPoints}
                incidents={incidents}
                setIncidents={setIncidents}
                maintenances={maintenances}
                setMaintenances={setMaintenances}
                coordinations={coordinations}
                setCoordinations={setCoordinations}
                summary={summary}
                setSummary={setSummary}
                headerInfo={headerInfo}
                fullReport={fullReport}
                incomeCount={incomes.length}
              />
            </div>

            {/* Right Column: Live Automation Terminal Logs */}
            <aside className="lg:sticky lg:top-20 lg:self-start">
              <AutomationLogTerminal logs={logs} state={autoState} onClear={() => setLogs([])} />
            </aside>
          </div>
        )}
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

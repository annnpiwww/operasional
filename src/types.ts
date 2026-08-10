export type OutletCode =
  | 'TBM' | 'NBM' | 'PBM' | 'PPM' | 'PKM'
  | 'MPP' | 'MGKB' | 'MGAM' | 'MGMM' | 'MGNW'
  | 'MGTO' | 'MGGJ' | 'MGBP' | 'MGLG' | 'MGMP'
  | 'MGMK' | 'MGJY' | 'MGNS' | 'MGRA' | 'MGSO';

export interface Outlet {
  code: OutletCode;
  label: string;
}

export const OUTLETS: Outlet[] = [
  'TBM', 'NBM', 'PBM', 'PPM', 'PKM', 'MPP',
  'MGKB', 'MGAM', 'MGMM', 'MGNW', 'MGTO', 'MGGJ', 'MGBP', 'MGLG',
  'MGMP', 'MGMK', 'MGJY', 'MGNS', 'MGRA', 'MGSO',
].map((code, i) => ({
  code: code as OutletCode,
  label: `Post ${String(i + 1).padStart(2, '0')} · Operasional`,
}));

// Header Info Section (dengan Dynamic Spreadsheet URL)
export interface HeaderInfo {
  tanggalLaporan: string;
  namaSPV: string;
  kantorCabang: string; // Fixed: "KC SulutGoTengPa"
  spreadsheetUrl: string; // Dynamic URL target
}

// Modul 1: Visit Lokasi
export interface VisitPoint {
  id: string;
  lokasi: string;
  catatan: string;
}

// Modul 2: Incident Report
export interface IncidentItem {
  id: string;
  lokasi: string;
  jenisKejadian: string;
  statusPenanganan: 'Proses Investigasi' | 'Selesai' | 'Tindak Lanjut';
}

// Modul 3: Perbaikan & Aksesoris
export interface MaintenanceItem {
  id: string;
  lokasi: string;
  perbaikan: string;
  status: 'Selesai' | 'On Progress' | 'Pending';
}

// Modul 4: Laporan Pendapatan (Finance Sync)
export interface IncomeReportItem {
  id: string;
  lokasi: OutletCode;
  pic: string;
  hariIni: number;
  mingguLalu: number;
  delta: number;
  trend: 'Naik' | 'Turun' | 'Sama';
}

// Modul 5: Laporan Koordinasi Leader/Admin
export interface LeaderCoordinationItem {
  id: string;
  lokasi: string;
  hasilKegiatan: string;
}

// Modul 6: Catatan SPV & Kesimpulan
export type OperationalStatus = 'Normal' | 'Baik' | 'Terdapat Kendala';

export interface SPVFinalSummary {
  kendala: string;
  kebutuhan: string;
  rencanaTindakLanjut: string;
  statusOperasional: OperationalStatus;
}

// Full Composite Report State
export interface FullOperationalReport {
  header: HeaderInfo;
  visitPoints: VisitPoint[];
  incidents: IncidentItem[];
  maintenances: MaintenanceItem[];
  incomes: IncomeReportItem[];
  coordinations: LeaderCoordinationItem[];
  summary: SPVFinalSummary;
}

export type LogStatus = 'idle' | 'running' | 'success' | 'failed';
export type AutomationState = 'idle' | 'running' | 'success' | 'failed';
export type ReportExportFormat = 'text' | 'markdown';

export interface LogEntry {
  id: number;
  ts: string;
  status: LogStatus;
  step: string;
  message: string;
}

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

// ====== PIC GROUPING (Sync per Lokasi) ======
export interface PICGroup {
  id: string;
  pic: string;
  outlets: OutletCode[];
}

export const PIC_GROUPS: PICGroup[] = [
  {
    id: 'irvan-gandaria',
    pic: 'Irvan Gandaria',
    outlets: ['TBM', 'NBM', 'PBM', 'MPP', 'PPM', 'MGAM', 'MGJY', 'MGNS', 'PKM', 'MGRA'],
  },
  {
    id: 'arthur-sengkandai',
    pic: 'Arthur Sengkandai',
    outlets: ['MGKB', 'MGMM', 'MGNW', 'MGTO', 'MGGJ', 'MGBP', 'MGLG', 'MGMK', 'MGMP', 'MGSO'],
  },
];

export function getPICForOutlet(code: OutletCode): string {
  const g = PIC_GROUPS.find((grp) => grp.outlets.includes(code));
  return g ? g.pic : 'Unassigned';
}

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

// Modul 4: Laporan Pendapatan (Finance Sync - per Outlet Status)
export interface IncomeReportItem {
  id: string;
  lokasi: OutletCode;
  pic: string;
  hariIni: number;
  mingguLalu: number;
  delta: number;
  trend: 'Naik' | 'Turun' | 'Sama';
  statusSync?: 'Sukses' | 'Kendala' | 'Pending';
  catatanKendala?: string;
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
  customKesimpulan?: string;
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

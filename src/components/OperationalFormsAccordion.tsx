import React from 'react';
import { ModuleVisit } from './ModuleVisit';
import { ModuleIncident } from './ModuleIncident';
import { ModuleMaintenance } from './ModuleMaintenance';
import { ModuleCoordination } from './ModuleCoordination';
import { ModuleSummary } from './ModuleSummary';
import { VisitPoint, IncidentItem, MaintenanceItem, LeaderCoordinationItem, SPVFinalSummary, FullOperationalReport, HeaderInfo } from '../types';
import { ClipboardCheck } from 'lucide-react';

interface OperationalFormsAccordionProps {
  visitPoints: VisitPoint[];
  setVisitPoints: (items: VisitPoint[]) => void;
  incidents: IncidentItem[];
  setIncidents: (items: IncidentItem[]) => void;
  maintenances: MaintenanceItem[];
  setMaintenances: (items: MaintenanceItem[]) => void;
  coordinations: LeaderCoordinationItem[];
  setCoordinations: (items: LeaderCoordinationItem[]) => void;
  summary: SPVFinalSummary;
  setSummary: (summary: SPVFinalSummary) => void;
  headerInfo: HeaderInfo;
  fullReport: FullOperationalReport;
  incomeCount: number;
}

export const OperationalFormsAccordion: React.FC<OperationalFormsAccordionProps> = ({
  visitPoints,
  setVisitPoints,
  incidents,
  setIncidents,
  maintenances,
  setMaintenances,
  coordinations,
  setCoordinations,
  setSummary,
  fullReport,
}) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-line pb-2">
        <h2 className="font-display text-sm font-semibold tracking-wide text-hi flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-accent" />
          Form Catatan & Ringkasan Laporan Operasional SPV
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Modul 1: Visit Lokasi */}
        <ModuleVisit points={visitPoints} onChange={setVisitPoints} />

        {/* Modul 2: Incident Report */}
        <ModuleIncident items={incidents} onChange={setIncidents} />

        {/* Modul 3: Perbaikan Aksesoris */}
        <ModuleMaintenance items={maintenances} onChange={setMaintenances} />

        {/* Modul 5: Koordinasi Leader */}
        <ModuleCoordination items={coordinations} onChange={setCoordinations} />
      </div>

      {/* Modul 6: Catatan & Kesimpulan Akhir SPV */}
      <ModuleSummary report={fullReport} onChange={setSummary} />
    </section>
  );
};

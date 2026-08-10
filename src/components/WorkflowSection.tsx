import React from 'react';
import { Play, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';
import { OUTLETS, OutletCode } from '../types';

interface WorkflowSectionProps {
  selectedOutlet: OutletCode;
  onSelectOutlet: (outlet: OutletCode) => void;
  onSyncSingle: (outlet: OutletCode) => void;
  onSyncAll: () => void;
  isSyncing: boolean;
  hasData: boolean;
}

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({
  selectedOutlet,
  onSelectOutlet,
  onSyncSingle,
  onSyncAll,
  isSyncing,
  hasData
}) => {
  return (
    <section className="panel p-5 space-y-5">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
        <div>
          <h2 className="font-display text-base font-semibold tracking-wide text-hi flex items-center gap-2">
            <Layers className="h-5 w-5 text-accent" />
            Fitur Utama: Otomatisasi Mapping & Sync Data Spreadsheet
          </h2>
          <p className="text-xs text-mid mt-0.5">
            Playwright otomatis membuka Google Sheet <span className="font-mono text-accent">Rekapan Total Income</span> & memetakan 20 outlets (Hari Ini vs H-7)
          </p>
        </div>

        {/* Action Trigger Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSyncSingle(selectedOutlet)}
            disabled={isSyncing}
            className="flex items-center gap-1.5 rounded-lg border border-line bg-ink-850 px-3 py-2 text-xs font-semibold text-hi transition-colors hover:bg-ink-800 disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5 text-accent" />
            Sync [{selectedOutlet}]
          </button>

          <button
            type="button"
            onClick={onSyncAll}
            disabled={isSyncing}
            className="flex items-center gap-2 rounded-lg border border-accent/40 bg-accent px-4 py-2 text-xs font-bold text-ink-950 shadow-md shadow-accent/20 transition-all hover:bg-[#ffb224] active:scale-[0.99] disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Memproses Playwright Sync...' : '🔄 SYNC SEMUA LOKASI (20 OUTLETS)'}
          </button>
        </div>
      </div>

      {/* Workflow Steps Visual Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Step 1 */}
        <div className="rounded-lg border border-line bg-ink-950 p-3.5 flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 font-mono text-xs font-bold text-accent">
            1
          </div>
          <div>
            <h3 className="text-xs font-semibold text-hi">Header & Parameter</h3>
            <p className="text-[11px] text-mid mt-0.5">Format tanggal laporan & nama SPV terisi.</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className={`rounded-lg border p-3.5 flex items-start gap-3 transition-colors ${
          isSyncing ? 'border-accent bg-accent/10' : 'border-line bg-ink-950'
        }`}>
          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
            isSyncing ? 'bg-accent text-ink-950 animate-pulse' : 'bg-accent/15 text-accent'
          }`}>
            2
          </div>
          <div>
            <h3 className="text-xs font-semibold text-hi flex items-center gap-1">
              Playwright Execution {isSyncing && <RefreshCw className="h-3 w-3 animate-spin text-accent" />}
            </h3>
            <p className="text-[11px] text-mid mt-0.5">Engine buka Chromium & petakan data sheet.</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className={`rounded-lg border p-3.5 flex items-start gap-3 transition-colors ${
          hasData ? 'border-ok/40 bg-ok/10' : 'border-line bg-ink-950'
        }`}>
          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
            hasData ? 'bg-ok text-ink-950' : 'bg-accent/15 text-accent'
          }`}>
            3
          </div>
          <div>
            <h3 className="text-xs font-semibold text-hi flex items-center gap-1">
              Hasil Sync & Metrics {hasData && <CheckCircle2 className="h-3 w-3 text-ok" />}
            </h3>
            <p className="text-[11px] text-mid mt-0.5">Tabel 20 outlets & kalkulasi H-7 langsung tampil.</p>
          </div>
        </div>
      </div>

      {/* Outlet Selector Chips */}
      <div>
        <span className="label mb-1.5 block">Target Outlet Individual (20 Outlets):</span>
        <div className="term-scroll grid grid-cols-5 sm:grid-cols-10 gap-1 overflow-x-auto">
          {OUTLETS.map((o) => {
            const active = selectedOutlet === o.code;
            return (
              <button
                key={o.code}
                type="button"
                onClick={() => onSelectOutlet(o.code)}
                className={`rounded-md border px-2 py-1.5 font-mono text-xs font-semibold transition-colors ${
                  active
                    ? 'border-accent/40 bg-ink-850 text-accent'
                    : 'border-transparent text-mid hover:border-line hover:bg-ink-850/60'
                }`}
              >
                {o.code}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

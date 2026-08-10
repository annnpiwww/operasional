import React from 'react';
import { IncomeReportItem } from '../types';
import { TrendingUp, TrendingDown, BarChart3, AlertCircle } from 'lucide-react';

interface IncomeResultsTableProps {
  items: IncomeReportItem[];
  tanggalLaporan: string;
}

const fmtRp = (n: number) => n.toLocaleString('id-ID');
const fmtDelta = (n: number) =>
  n > 0 ? `+Rp ${fmtRp(n)}` : n < 0 ? `−Rp ${fmtRp(Math.abs(n))}` : 'Rp 0';

const TREND: Record<IncomeReportItem['trend'], { mark: string; cls: string }> = {
  Naik: { mark: '▲', cls: 'text-ok font-bold' },
  Turun: { mark: '▼', cls: 'text-bad font-bold' },
  Sama: { mark: '▬', cls: 'text-mid font-semibold' },
};

export const IncomeResultsTable: React.FC<IncomeResultsTableProps> = ({ items, tanggalLaporan }) => {
  const dateStr = tanggalLaporan || new Date().toISOString().split('T')[0];
  const dateObj = new Date(dateStr);
  dateObj.setDate(dateObj.getDate() - 7);
  const h7DateStr = dateObj.toISOString().split('T')[0];

  // Calculated Metrics
  const totalHariIni = items.reduce((acc, curr) => acc + curr.hariIni, 0);
  const totalMingguLalu = items.reduce((acc, curr) => acc + curr.mingguLalu, 0);
  const totalDelta = totalHariIni - totalMingguLalu;
  const countNaik = items.filter((i) => i.trend === 'Naik').length;
  const countTurun = items.filter((i) => i.trend === 'Turun').length;

  return (
    <section className="panel p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <div>
          <h2 className="font-display text-base font-bold tracking-wide text-hi flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            Hasil Otomatisasi Pendapatan (20 Outlets Rekapan Total Income)
          </h2>
          <p className="text-xs text-mid mt-0.5">
            Komparasi Realtime: <span className="font-mono text-accent font-semibold">Hari Ini ({dateStr})</span> vs <span className="font-mono text-low font-semibold">Minggu Lalu H-7 ({h7DateStr})</span>
          </p>
        </div>

        {items.length > 0 && (
          <span className="font-mono text-xs font-semibold text-ok bg-ok/10 border border-ok/30 px-3 py-1 rounded-full">
            ✅ 20 / 20 Outlets Ter-sync Otomatis
          </span>
        )}
      </div>

      {/* Metric Summary Cards */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-lg border border-line bg-ink-950 p-3.5">
            <span className="text-[11px] text-mid block font-mono">Total Omset Hari Ini ({dateStr})</span>
            <span className="text-lg font-bold font-mono text-accent mt-1 block">
              Rp {fmtRp(totalHariIni)}
            </span>
          </div>

          <div className="rounded-lg border border-line bg-ink-950 p-3.5">
            <span className="text-[11px] text-mid block font-mono">Total Omset Minggu Lalu ({h7DateStr})</span>
            <span className="text-lg font-bold font-mono text-mid mt-1 block">
              Rp {fmtRp(totalMingguLalu)}
            </span>
          </div>

          <div className="rounded-lg border border-line bg-ink-950 p-3.5">
            <span className="text-[11px] text-mid block font-mono">Total Selisih (Delta Rp)</span>
            <span className={`text-lg font-bold font-mono mt-1 block ${totalDelta >= 0 ? 'text-ok' : 'text-bad'}`}>
              {fmtDelta(totalDelta)}
            </span>
          </div>

          <div className="rounded-lg border border-line bg-ink-950 p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-mid block font-mono">Performa Outlets</span>
              <div className="flex items-center gap-3 mt-1 font-mono text-xs font-semibold">
                <span className="text-ok flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> {countNaik} Naik</span>
                <span className="text-bad flex items-center gap-1"><TrendingDown className="h-3.5 w-3.5" /> {countTurun} Turun</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Income Results Table */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line py-14 text-center">
          <AlertCircle className="h-8 w-8 text-accent animate-pulse" />
          <div>
            <p className="text-sm font-semibold text-hi">
              Data hasil otomatisasi belum dimuat.
            </p>
            <p className="text-xs text-mid mt-1">
              Klik tombol <strong className="text-accent">"🔄 SYNC SEMUA LOKASI (20 OUTLETS)"</strong> di atas untuk memetakan data spreadsheet secara otomatis.
            </p>
          </div>
        </div>
      ) : (
        <div className="term-scroll max-h-[520px] overflow-auto rounded-lg border border-line bg-ink-950">
          <table className="w-full text-left text-xs font-mono">
            <thead className="sticky top-0 border-b border-line bg-ink-900 text-low uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">No</th>
                <th className="py-2.5 px-3">Kode Outlet</th>
                <th className="py-2.5 px-3">Income Hari Ini ({dateStr})</th>
                <th className="py-2.5 px-3">Income Minggu Lalu ({h7DateStr})</th>
                <th className="py-2.5 px-3">Selisih Delta (Rp)</th>
                <th className="py-2.5 px-3">Tren Performa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {items.map((item, idx) => {
                const tr = TREND[item.trend];
                return (
                  <tr key={item.lokasi} className="hover:bg-ink-850/50 transition-colors">
                    <td className="py-2.5 px-3 text-low">{String(idx + 1).padStart(2, '0')}</td>
                    <td className="py-2.5 px-3 font-bold text-accent">{item.lokasi}</td>
                    <td className="py-2.5 px-3 text-hi font-bold">Rp {fmtRp(item.hariIni)}</td>
                    <td className="py-2.5 px-3 text-mid">Rp {fmtRp(item.mingguLalu)}</td>
                    <td className={`py-2.5 px-3 font-semibold ${item.delta > 0 ? 'text-ok' : item.delta < 0 ? 'text-bad' : 'text-mid'}`}>
                      {fmtDelta(item.delta)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1 ${tr.cls}`}>
                        {tr.mark} {item.trend}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

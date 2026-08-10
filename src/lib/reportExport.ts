import type { FullOperationalReport } from '../types'

const fmtRp = (n: number) => n.toLocaleString('id-ID')
const deltaRp = (n: number) =>
  n > 0 ? `+Rp ${fmtRp(n)}` : n < 0 ? `-Rp ${fmtRp(Math.abs(n))}` : 'Rp 0'

function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return 'Senin, 10 Agustus 2026';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const formatted = d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  return formatted;
}

export function buildPlainText(report: FullOperationalReport): string {
  const { header, visitPoints, incidents, maintenances, incomes, coordinations, summary } = report
  const L: string[] = []
  const separator = '━━━━━━━━━━━━━━━'

  const formattedDate = formatIndonesianDate(header.tanggalLaporan);

  L.push('*LAPORAN OPERASIONAL HARIAN SUPERVISOR BSS PARKING*')
  L.push(`*Tanggal:* ${formattedDate}`)
  L.push(`*Supervisor:* ${header.namaSPV || '-'}`)
  L.push(`*Area/Cabang:* ${header.kantorCabang || 'KC SulutGoTengPa'}`)
  L.push(`*Status Operasional:* ${summary.statusOperasional}`)
  L.push(separator)
  L.push('')

  // 1. Visit Lokasi
  L.push('*1. VISIT LOKASI & MONITORING:*')
  if (visitPoints.length === 0) {
    L.push('• Nihil / Tidak ada catatan monitoring')
  } else {
    visitPoints.forEach((v) => {
      L.push(`• [${v.lokasi}] ${v.catatan || '-'}`)
    })
  }
  L.push('')

  // 2. Incident Report
  L.push('*2. INCIDENT REPORT (LAPORAN KEJADIAN):*')
  if (incidents.length === 0) {
    L.push('• Nihil / Tidak ada laporan kejadian')
  } else {
    incidents.forEach((inc) => {
      L.push(`• [${inc.lokasi}] ${inc.jenisKejadian} (${inc.statusPenanganan})`)
    })
  }
  L.push('')

  // 3. Perbaikan & Aksesoris
  L.push('*3. PERBAIKAN & PENAMBAHAN AKSESORIS:*')
  if (maintenances.length === 0) {
    L.push('• Nihil / Tidak ada perbaikan alat')
  } else {
    maintenances.forEach((m) => {
      L.push(`• [${m.lokasi}] ${m.perbaikan} (${m.status})`)
    })
  }
  L.push('')

  // 4. Laporan Pendapatan
  L.push('*4. LAPORAN PENDAPATAN:*')
  if (incomes.length === 0) {
    L.push('• Nihil / Belum ada laporan pendapatan')
  } else {
    incomes.forEach((inc) => {
      const picLabel = inc.pic ? ` (PIC: ${inc.pic})` : ''
      if (inc.statusSync === 'Kendala') {
        L.push(`• *${inc.lokasi}*${picLabel}`)
        L.push(`  - ⚠️ KENDALA: ${inc.catatanKendala || 'Data Kosong / Akses Drop'}`)
      } else {
        const trendSymbol = inc.trend === 'Naik' ? 'Naik ↑' : inc.trend === 'Turun' ? 'Turun ↓' : 'Sama ▬'
        L.push(`• *${inc.lokasi}*${picLabel}`)
        L.push(`  - Hari Ini: Rp ${fmtRp(inc.hariIni)}`)
        L.push(`  - Minggu Lalu: Rp ${fmtRp(inc.mingguLalu)}`)
        L.push(`  - Selisih: ${deltaRp(inc.delta)} (${trendSymbol})`)
      }
    })
  }
  L.push('')

  // 5. Laporan Koordinasi Leader/Admin
  L.push('*5. LAPORAN KOORDINASI LEADER/ADMIN:*')
  if (coordinations.length === 0) {
    L.push('• Nihil')
  } else {
    coordinations.forEach((c) => {
      L.push(`• [${c.lokasi}] ${c.hasilKegiatan}`)
    })
  }
  L.push('')

  // 6. Catatan SPV
  L.push('*6. CATATAN SPV:*')
  L.push(`• *Kendala:* ${summary.kendala.trim() || 'Nihil'}`)
  L.push(`• *Kebutuhan:* ${summary.kebutuhan.trim() || 'Nihil'}`)
  L.push(`• *Rencana Tindak Lanjut:* ${summary.rencanaTindakLanjut.trim() || 'Nihil'}`)
  L.push('')

  // Kesimpulan Akhir (Custom atau Default Template)
  L.push('*Kesimpulan Akhir:*')
  if (summary.customKesimpulan && summary.customKesimpulan.trim()) {
    L.push(`"${summary.customKesimpulan.trim()}"`)
  } else {
    L.push(`"Operasional pada tanggal ${formattedDate} berjalan ${summary.statusOperasional}. Seluruh temuan telah dikoordinasikan dengan Leader/Admin dan akan dimonitor hingga tindak lanjut selesai."`)
  }
  L.push(separator)

  return L.join('\n')
}

export function buildMarkdown(report: FullOperationalReport): string {
  return buildPlainText(report);
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function downloadText(text: string, filename: string, mime: string): void {
  const blob = new Blob([text], { type: `${mime};charset=utf-8;` })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function reportFilename(date: string, ext: 'md' | 'txt'): string {
  return `Laporan_Operasional_SPV_${date || 'HariIni'}.${ext}`
}

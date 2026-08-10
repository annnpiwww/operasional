import type { FullOperationalReport } from '../types'

/** Single source of truth untuk semua output laporan (plain text + markdown). */

const fmtRp = (n: number) => n.toLocaleString('id-ID')
const deltaRp = (n: number) =>
  n > 0 ? `+Rp ${fmtRp(n)}` : n < 0 ? `−Rp ${fmtRp(Math.abs(n))}` : 'Rp 0'

const EMPTY: Record<string, string> = {
  visit: 'Tidak ada catatan kunjungan lapangan hari ini.',
  incident: 'Aman dan kondusif — tidak ada laporan insiden.',
  maintenance: 'Tidak ada laporan perbaikan atau penambahan aksesoris.',
  income: 'Data pendapatan belum disinkronkan dari Finance Sync.',
  coordination: 'Tidak ada catatan koordinasi leader hari ini.',
}

export function buildPlainText(report: FullOperationalReport): string {
  const { header, visitPoints, incidents, maintenances, incomes, coordinations, summary } = report
  const L: string[] = []
  const bar = '='.repeat(58)
  const thin = '-'.repeat(58)

  L.push('LAPORAN OPERASIONAL SPV — PT BAHANA SECURITY SISTEM')
  L.push(bar)
  L.push(`Tanggal Laporan : ${header.tanggalLaporan || 'Hari Ini'}`)
  L.push(`Supervisor (SPV): ${header.namaSPV || '-'}`)
  L.push(`Kantor Cabang   : ${header.kantorCabang}`)
  L.push(`Status          : ${summary.statusOperasional.toUpperCase()}`)
  L.push('')

  L.push('1. VISIT LOKASI & MONITORING FIELD')
  L.push(thin)
  if (visitPoints.length === 0) L.push(`- ${EMPTY.visit}`)
  else visitPoints.forEach((v, i) => L.push(`${i + 1}. [${v.lokasi}] ${v.catatan || '-'}`))
  L.push('')

  L.push('2. LAPORAN KEJADIAN (INCIDENT REPORT)')
  L.push(thin)
  if (incidents.length === 0) L.push(`- ${EMPTY.incident}`)
  else incidents.forEach((inc, i) => L.push(`${i + 1}. [${inc.lokasi}] ${inc.jenisKejadian} — ${inc.statusPenanganan}`))
  L.push('')

  L.push('3. PERBAIKAN & PENAMBAHAN AKSESORIS')
  L.push(thin)
  if (maintenances.length === 0) L.push(`- ${EMPTY.maintenance}`)
  else maintenances.forEach((m, i) => L.push(`${i + 1}. [${m.lokasi}] ${m.perbaikan} — ${m.status}`))
  L.push('')

  L.push('4. REKAPAN PENDAPATAN (FINANCE SYNC)')
  L.push(thin)
  if (incomes.length === 0) L.push(`- ${EMPTY.income}`)
  else {
    incomes.forEach((inc, i) => {
      L.push(`${i + 1}. [${inc.lokasi}] Hari ini Rp ${fmtRp(inc.hariIni)} | Minggu lalu Rp ${fmtRp(inc.mingguLalu)} | Delta ${deltaRp(inc.delta)} (${inc.trend})`)
    })
    const totHariIni = incomes.reduce((a, x) => a + x.hariIni, 0)
    const totMingguLalu = incomes.reduce((a, x) => a + x.mingguLalu, 0)
    L.push(`TOTAL: Hari ini Rp ${fmtRp(totHariIni)} | Minggu lalu Rp ${fmtRp(totMingguLalu)} | Delta ${deltaRp(totHariIni - totMingguLalu)}`)
  }
  L.push('')

  L.push('5. LAPORAN KOORDINASI LEADER / ADMIN')
  L.push(thin)
  if (coordinations.length === 0) L.push(`- ${EMPTY.coordination}`)
  else coordinations.forEach((c, i) => L.push(`${i + 1}. [${c.lokasi}] ${c.hasilKegiatan}`))
  L.push('')

  L.push('6. CATATAN & KESIMPULAN AKHIR SPV')
  L.push(thin)
  L.push(`- Status Operasional : ${summary.statusOperasional}`)
  L.push(`- Kendala Tindak Lanjut: ${summary.kendala.trim() || '-'}`)
  L.push(`- Kebutuhan Lokasi    : ${summary.kebutuhan.trim() || '-'}`)
  L.push(`- Rencana Tindak Lanjut: ${summary.rencanaTindakLanjut.trim() || '-'}`)
  L.push('')
  L.push(bar)

  return L.join('\n')
}

export function buildMarkdown(report: FullOperationalReport): string {
  const { header, visitPoints, incidents, maintenances, incomes, coordinations, summary } = report
  const M: string[] = []

  M.push('# Laporan Operasional SPV — PT Bahana Security Sistem')
  M.push('')
  M.push(`> **Kantor Cabang:** \`${header.kantorCabang}\`  `)
  M.push(`> **Tanggal Laporan:** \`${header.tanggalLaporan || 'Hari Ini'}\`  `)
  M.push(`> **Supervisor (SPV):** \`${header.namaSPV || 'Belum diisi'}\`  `)
  M.push(`> **Status Operasional:** **\`${summary.statusOperasional.toUpperCase()}\`**`)
  M.push('')
  M.push('---')
  M.push('')

  M.push('## 1. Visit Lokasi & Monitoring Field')
  M.push('')
  if (visitPoints.length === 0) M.push(`*${EMPTY.visit}*`)
  else visitPoints.forEach((v, i) => M.push(`${i + 1}. **[${v.lokasi}]** ${v.catatan || '-'}`))
  M.push('')

  M.push('## 2. Laporan Kejadian (Incident Report)')
  M.push('')
  if (incidents.length === 0) M.push(`*${EMPTY.incident}*`)
  else {
    M.push('| Lokasi | Jenis Kejadian | Status Penanganan |')
    M.push('| :--- | :--- | :--- |')
    incidents.forEach((inc) => M.push(`| **${inc.lokasi}** | ${inc.jenisKejadian} | \`${inc.statusPenanganan}\` |`))
  }
  M.push('')

  M.push('## 3. Perbaikan & Penambahan Aksesoris')
  M.push('')
  if (maintenances.length === 0) M.push(`*${EMPTY.maintenance}*`)
  else {
    M.push('| Lokasi | Perbaikan / Aksesoris | Status |')
    M.push('| :--- | :--- | :--- |')
    maintenances.forEach((m) => M.push(`| **${m.lokasi}** | ${m.perbaikan} | \`${m.status}\` |`))
  }
  M.push('')

  M.push('## 4. Rekapan Pendapatan (Finance Sync)')
  M.push('')
  if (incomes.length === 0) M.push(`*${EMPTY.income}*`)
  else {
    M.push('| Outlet | Hari Ini | Minggu Lalu | Delta | Tren |')
    M.push('| :--- | ---: | ---: | ---: | :---: |')
    incomes.forEach((inc) =>
      M.push(`| **${inc.lokasi}** | Rp ${fmtRp(inc.hariIni)} | Rp ${fmtRp(inc.mingguLalu)} | ${deltaRp(inc.delta)} | **${inc.trend}** |`),
    )
    const totHariIni = incomes.reduce((a, x) => a + x.hariIni, 0)
    const totMingguLalu = incomes.reduce((a, x) => a + x.mingguLalu, 0)
    M.push('')
    M.push(`**Total:** Rp ${fmtRp(totHariIni)} (hari ini) · Rp ${fmtRp(totMingguLalu)} (minggu lalu) · ${deltaRp(totHariIni - totMingguLalu)} (delta)`)
  }
  M.push('')

  M.push('## 5. Laporan Koordinasi Leader / Admin')
  M.push('')
  if (coordinations.length === 0) M.push(`*${EMPTY.coordination}*`)
  else coordinations.forEach((c, i) => M.push(`${i + 1}. **[${c.lokasi}]** ${c.hasilKegiatan}`))
  M.push('')

  M.push('## 6. Catatan & Kesimpulan Akhir SPV')
  M.push('')
  M.push(`- **Status Operasional:** ${summary.statusOperasional}`)
  M.push(`- **Kendala Tindak Lanjut:** ${summary.kendala.trim() || '-'}`)
  M.push(`- **Kebutuhan Lokasi:** ${summary.kebutuhan.trim() || '-'}`)
  M.push(`- **Rencana Tindak Lanjut:** ${summary.rencanaTindakLanjut.trim() || '-'}`)

  return M.join('\n')
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
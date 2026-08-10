# 📘 PANDUAN & TUTORIAL APLIKASI OTOMATISASI OPERASIONAL SPV
**PT BAHANA SECURITY SISTEM — KC SULUTGOTENGPA**

---

## 🎯 PENGENALAN APLIKASI
Aplikasi Laporan Operasional SPV berguna untuk:
1. **Otomatisasi Sync Data Finance (Income)** dari Google Spreadsheet untuk 20 Outlets secara otomatis menggunakan engine Playwright.
2. **Standardisasi Laporan Operasional SPV** dalam 6 Modul terstruktur (Visit Lokasi, Incident Report, Perbaikan Aksesoris, Finance Sync, Koordinasi Leader, dan Kesimpulan).
3. **Auto-Generator Teks Laporan & Markdown** yang siap di-copy ke WhatsApp / Email resmi.

---

## 🚀 PANDUAN PENGGUNAAN UNTUK SPV OPS (STEP-BY-STEP)

### 📌 STEP 1: Pengisian Informasi Header
1. Buka aplikasi. Pada bagian paling atas (**Informasi Header Laporan Operasional SPV**):
   - **Tanggal Laporan**: Pilih tanggal operasional (Default: Tanggal hari ini).
   - **Nama Supervisor (SPV)**: Ketikkan nama lengkap Anda (misal: *Budi Santoso*).
   - **Kantor Cabang / Area**: Terisi otomatis **`KC SulutGoTengPa`** (Paten).

---

### 📌 STEP 2: Pengisian Modul Operasional (M1 s/d M5)
Anda bisa mengisi laporan melalui **Tab Modul** atau menggunakan tombol modal cepat **`+ Quick Add`** di pojok kanan atas:

1. **Modul 1 (Visit Lokasi)**: Masukkan lokasi dan poin penting hasil monitoring kunjungan lapangan.
2. **Modul 2 (Incident Report)**: Masukkan laporan kejadian jika ada (Lokasi, Jenis Kejadian, & Status Penanganan).
3. **Modul 3 (Perbaikan & Aksesoris)**: Masukkan rincian perbaikan sensor/rambu/aksesoris dan statusnya (`Selesai` / `On Progress` / `Pending`).
4. **Modul 5 (Koordinasi Leader/Admin)**: Masukkan catatan hasil briefing atau kegiatan koordinasi di lokasi.

---

### 📌 STEP 3: Otomatisasi Sync Income Finance (Modul 4)
1. Masuk ke **Tab M4 (Pendapatan / Finance Sync)**.
2. Untuk mensinkronkan 1 lokasi individu, pilih outlet (misal: `MGNW`) lalu klik **`Sync [MGNW]`**.
3. Untuk mensinkronkan **seluruh 20 outlets sekaligus**, klik tombol hijau **`🔄 Sync Semua Lokasi (20 Outlets)`**.
4. Engine **Playwright** akan otomatis membuka Google Spreadsheet target (`Rekapan Total Income`), membaca income hari ini dan minggu lalu, serta menghitung otomatis:
   - **Selisih (Delta)** (+Rp / -Rp)
   - **Tren** (▲ Naik / ▼ Turun / ▬ Sama)
5. Anda bisa memantau alur kerja Playwright pada **Terminal Automasi** di sebelah kanan layar.

---

### 📌 STEP 4: Kesimpulan & Copy Teks Laporan (Modul 6 & M7)
1. Masuk ke **Tab M6 (Catatan & Kesimpulan)**.
2. Isi rincian **Kendala**, **Kebutuhan Lokasi**, **Rencana Tindak Lanjut**, dan pilih **Status Operasional** (`Normal` / `Baik` / `Terdapat Kendala`).
3. Pada panel kanan **Pratinjau Teks Kesimpulan Laporan Operasional**, klik tombol **`📋 Copy Teks Laporan`** untuk menyalin teks format siap kirim ke WhatsApp / Email Group.
4. Atau buka **Tab M7 (Structured Markdown)** jika ingin melihat dokumen format Markdown utuh atau mengunduh file `.md` via tombol **`Download .md`**.

---

## 💻 PANDUAN DEPLOYMENT & CARA MENJALANKAN (UNTUK TIM IT)

### 1. Menjalankan di Environment Lokal (Pengembangan / Testing)
```bash
# Clone repository & install dependencies
npm install

# Install browser Playwright
npx playwright install chromium

# Menjalankan Frontend React (Port 3000) + Backend Server (Port 3101) bersamaan
npm run start
```
Buka browser di: `http://localhost:3000`

---

### 2. Membangun File Installer Aplikasi Desktop (`.exe` Windows)

#### Cara A: Build Otomatis via GitHub Actions (Rekomendasi)
1. Push kodingan project ke repository GitHub.
2. Masuk ke tab **Actions** di GitHub repository.
3. Jalankan workflow `Build Tauri Windows Executable (.exe)`.
4. File installer `.exe` dapat diunduh langsung dari halaman Release / Artifacts GitHub.

#### Cara B: Build Manual di OS Windows
1. Pastikan Rust compiler ter-install di Windows ([rustup.rs](https://rustup.rs/)).
2. Jalankan command:
   ```bash
   npm run tauri:build
   ```
3. File installer `.exe` akan tercipta di folder:
   `src-tauri/target/release/bundle/nsis/OperasionalAutomationApp_1.0.0_x64-setup.exe`

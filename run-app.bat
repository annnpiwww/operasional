@echo off
title PT Bahana Security Sistem - Operational Automation App
echo ===============================================================
echo   PT BAHANA SECURITY SISTEM - KC SULUTGOTENGPA
echo   Aplikasi Otomatisasi Laporan Operasional SPV & Finance Sync
echo ===============================================================
echo.

IF NOT EXIST "node_modules\" (
  echo [!] Dependencies (react, express, playwright) belum ter-install.
  echo [!] Menjalankan 'npm install' otomatis... Sila tunggu sebentar...
  echo.
  call npm install
  echo [OK] Dependencies berhasil ter-install!
  echo.
)

echo [1/2] Memulai Backend Automation Server & React Dashboard...
echo [2/2] Membuka browser ke http://localhost:3000 ...
echo.
start http://localhost:3000
npm run start
pause

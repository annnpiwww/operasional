@echo off
title PT Bahana Security Sistem - Operational Automation App
echo ===============================================================
echo   PT BAHANA SECURITY SISTEM - KC SULUTGOTENGPA
echo   Aplikasi Otomatisasi Laporan Operasional SPV & Finance Sync
echo ===============================================================
echo.

IF NOT EXIST "node_modules\" (
  echo [!] Dependencies belum ter-install. Menjalankan 'npm install'...
  call npm install
  echo.
)

echo [1/2] Memulai Server Backend (Port 3101)...
start "Backend API Server" /min cmd /c "node server/index.js"

echo [2/2] Memulai Dashboard Frontend (Port 3000)...
timeout /t 2 >nul
start http://localhost:3000
call npx vite --port 3000 --host 0.0.0.0

pause

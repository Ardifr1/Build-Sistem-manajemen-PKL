@echo off
REM ============================================
REM  SiMagang - Jalankan Backend + Frontend
REM  Cukup double-click file ini
REM ============================================
cd /d "%~dp0backend"
start "SiMagang Backend" cmd /k php artisan serve
cd /d "%~dp0frontend"
start "SiMagang Frontend" cmd /k npm run dev
echo.
echo Kedua server sedang dijalankan di jendela terpisah:
echo   - Backend  : http://localhost:8000
echo   - Frontend : http://localhost:5173
echo.
echo Jendela ini boleh ditutup.
pause

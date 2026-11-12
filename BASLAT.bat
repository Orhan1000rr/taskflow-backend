@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js bulunamadi. https://nodejs.org/ adresinden kurup tekrar deneyin.
  pause
  exit /b 1
)
if not exist "node_modules\express" (
  echo Gerekli paketler kuruluyor. Internet baglantisi gerekir.
  call npm install
  if errorlevel 1 (
    echo Paket kurulumu basarisiz. README.md dosyasini inceleyin.
    pause
    exit /b 1
  )
)
echo Sunucu baslatiliyor. Bu pencereyi kapatmayin.
call npm start
pause

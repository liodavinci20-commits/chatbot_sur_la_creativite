@echo off
echo ========================================
echo    🤖 Lancement de CodeBot...
echo ========================================
echo.

echo [1/2] Demarrage du backend Flask (port 5000)...
start "CodeBot Backend" cmd /k "cd /d %~dp0 && python app.py"

echo [2/2] Demarrage du frontend Vite (port 5173)...
start "CodeBot Frontend" cmd /k "cd /d %~dp0\frontend && npm run dev"

echo.
echo ✅ Les deux serveurs sont lances !
echo    Frontend : http://localhost:5173
echo    Backend  : http://localhost:5000
echo.
timeout /t 3 >nul
start http://localhost:5173

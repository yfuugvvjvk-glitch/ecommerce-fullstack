@echo off
echo ========================================
echo   TESTARE ENDPOINT-URI APLICATIE
echo ========================================
echo.

echo [1] Testare Backend Health...
curl http://localhost:3001/health -s | findstr "ok" >nul
if %errorlevel% equ 0 (
    echo ✅ Backend Health: OK
) else (
    echo ❌ Backend Health: FAILED
)

echo [2] Testare API Data...
curl http://localhost:3001/api/data -s | findstr "data" >nul
if %errorlevel% equ 0 (
    echo ✅ API Data: OK
) else (
    echo ❌ API Data: FAILED
)

echo [3] Testare Frontend...
curl http://localhost:3000 -s | findstr "html" >nul
if %errorlevel% equ 0 (
    echo ✅ Frontend: OK
) else (
    echo ❌ Frontend: FAILED
)

echo.
echo ========================================
echo   TESTARE COMPLETATA
echo ========================================
echo.
echo Aplicatia ruleaza pe:
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:3001
echo - Health:   http://localhost:3001/health
echo.
pause
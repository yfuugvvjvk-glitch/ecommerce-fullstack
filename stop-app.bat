@echo off
echo ========================================
echo    OPRIRE APLICATIE E-COMMERCE
echo ========================================
echo.

echo [1/3] Oprire procese Node.js...
taskkill /f /im node.exe 2>nul
echo.

echo [2/3] Oprire baza de date...
docker-compose down
echo.

echo [3/3] Curatare fisiere temporare...
cd frontend
if exist ".next\dev\lock" del ".next\dev\lock" /f /q 2>nul
cd ..

echo.
echo ========================================
echo    APLICATIA A FOST OPRITA!
echo ========================================
echo.
pause
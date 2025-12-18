@echo off
echo ========================================
echo   PORNIRE APLICATIE E-COMMERCE LOCAL
echo ========================================
echo.

echo [1/4] Verificare Docker...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker nu ruleaza! Porneste Docker Desktop si ruleaza din nou.
    pause
    exit /b 1
)

echo [2/4] Pornire PostgreSQL...
docker-compose up -d
timeout /t 5 /nobreak >nul

echo [3/4] Pornire Backend...
cd backend
copy .env.local .env
start cmd /k "npm run dev"
cd ..

echo [4/4] Pornire Frontend...
cd frontend
copy .env.development .env.local
start cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo   APLICATIE PORNITA CU SUCCES!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo.
echo Apasa orice tasta pentru a inchide acest terminal...
pause >nul

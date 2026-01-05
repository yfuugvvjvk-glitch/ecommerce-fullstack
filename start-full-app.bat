@echo off
echo ========================================
echo    PORNIRE APLICATIE E-COMMERCE
echo ========================================
echo.

echo [1/4] Pornire baza de date PostgreSQL...
docker-compose up -d postgres
timeout /t 5 /nobreak > nul

echo [2/4] Sincronizare schema baza de date...
cd backend
call npx prisma db push
echo.

echo [3/4] Pornire backend (port 3001)...
start "Backend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul

echo [4/4] Pornire frontend (port 3000)...
cd ../frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo    APLICATIA A FOST PORNITA!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo.
echo Apasa orice tasta pentru a inchide...
pause > nul
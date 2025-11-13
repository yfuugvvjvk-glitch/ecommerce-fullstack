@echo off
echo 🐳 Starting PostgreSQL with Docker...
echo.

docker-compose up -d

echo.
echo ✅ PostgreSQL started!
echo.
echo 📊 Database Info:
echo    Host: localhost
echo    Port: 5432
echo    Database: fullstack_app
echo    User: postgres
echo    Password: postgres
echo.
echo 🔍 Check status: docker ps
echo 🛑 Stop database: docker-compose down
echo.
pause

# Script pentru verificare și reparare deploy live

Write-Host "🔍 Verificare Status Deploy E-Commerce" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# URLs live
$frontendUrl = "https://ecommerce-frontend-navy.vercel.app"
$backendUrl = "https://ecommerce-fullstack-3y1b.onrender.com"

Write-Host "`n📱 Verificare Frontend (Vercel)..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri $frontendUrl -UseBasicParsing -TimeoutSec 10
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend ONLINE - Status: $($frontendResponse.StatusCode)" -ForegroundColor Green
        Write-Host "   URL: $frontendUrl" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Frontend OFFLINE sau EROARE" -ForegroundColor Red
    Write-Host "   Eroare: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🖥️  Verificare Backend (Render)..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-WebRequest -Uri "$backendUrl/health" -UseBasicParsing -TimeoutSec 15
    if ($backendResponse.StatusCode -eq 200) {
        $healthData = $backendResponse.Content | ConvertFrom-Json
        Write-Host "✅ Backend ONLINE - Status: $($healthData.status)" -ForegroundColor Green
        Write-Host "   URL: $backendUrl" -ForegroundColor Cyan
        Write-Host "   Timestamp: $($healthData.timestamp)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Backend OFFLINE sau EROARE" -ForegroundColor Red
    Write-Host "   Eroare: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Render poate fi în sleep mode (free tier)" -ForegroundColor Yellow
}

Write-Host "`n🔄 Testare API Backend..." -ForegroundColor Yellow
try {
    $apiResponse = Invoke-WebRequest -Uri "$backendUrl/api/categories" -UseBasicParsing -TimeoutSec 20
    if ($apiResponse.StatusCode -eq 200) {
        Write-Host "✅ API Backend funcționează" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ API Backend nu răspunde" -ForegroundColor Red
    if ($_.Exception.Message -like "*503*") {
        Write-Host "   🔄 Render service în sleep mode - se trezește..." -ForegroundColor Yellow
        Write-Host "   ⏳ Așteptați 30-60 secunde și încercați din nou" -ForegroundColor Yellow
    }
}

Write-Host "`n📊 Informații Deploy:" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green
Write-Host "Frontend (Vercel):" -ForegroundColor Cyan
Write-Host "  - Auto-deploy din GitHub main branch" -ForegroundColor Gray
Write-Host "  - URL: $frontendUrl" -ForegroundColor Gray
Write-Host ""
Write-Host "Backend (Render):" -ForegroundColor Cyan  
Write-Host "  - Auto-deploy din GitHub main branch" -ForegroundColor Gray
Write-Host "  - URL: $backendUrl" -ForegroundColor Gray
Write-Host "  - Free tier - poate intra în sleep după 15 min inactivitate" -ForegroundColor Gray
Write-Host ""

Write-Host "🛠️  Soluții pentru probleme:" -ForegroundColor Yellow
Write-Host "=============================" -ForegroundColor Yellow
Write-Host "1. Backend 503 Error:" -ForegroundColor White
Write-Host "   - Render free tier intră în sleep" -ForegroundColor Gray
Write-Host "   - Accesați $backendUrl/health de câteva ori" -ForegroundColor Gray
Write-Host "   - Așteptați 30-60 secunde să se trezească" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Frontend nu se actualizează:" -ForegroundColor White
Write-Host "   - Verificați deploy pe vercel.com dashboard" -ForegroundColor Gray
Write-Host "   - Push nou pe GitHub declanșează redeploy" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Erori după modificări:" -ForegroundColor White
Write-Host "   - Verificați logs pe platforme" -ForegroundColor Gray
Write-Host "   - Testați local mai întâi" -ForegroundColor Gray

Write-Host "`n🎯 Credențiale Test:" -ForegroundColor Green
Write-Host "Admin: admin@example.com / Admin1234" -ForegroundColor Cyan
Write-Host "User: ion.popescu@example.com / User1234" -ForegroundColor Cyan
Write-Host "Vouchers: WELCOME10, SUMMER50" -ForegroundColor Cyan

Write-Host "`n🚀 Pentru a trezi backend-ul rapid:" -ForegroundColor Yellow
Write-Host "curl backend-url/health" -ForegroundColor Gray
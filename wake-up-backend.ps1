# Script pentru trezirea backend-ului pe Render (free tier)

Write-Host "🔄 Trezirea Backend-ului pe Render..." -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

$backendUrl = "https://ecommerce-fullstack-3y1b.onrender.com"

Write-Host "`n⏳ Încercare 1/3 - Ping health endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/health" -UseBasicParsing -TimeoutSec 45
    if ($response.StatusCode -eq 200) {
        $health = $response.Content | ConvertFrom-Json
        Write-Host "✅ Backend ONLINE!" -ForegroundColor Green
        Write-Host "   Status: $($health.status)" -ForegroundColor Cyan
        Write-Host "   Timestamp: $($health.timestamp)" -ForegroundColor Gray
        exit 0
    }
} catch {
    Write-Host "❌ Încercare 1 eșuată: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n⏳ Încercare 2/3 - Așteptare 15 secunde..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

try {
    $response = Invoke-WebRequest -Uri "$backendUrl/health" -UseBasicParsing -TimeoutSec 45
    if ($response.StatusCode -eq 200) {
        $health = $response.Content | ConvertFrom-Json
        Write-Host "✅ Backend ONLINE!" -ForegroundColor Green
        Write-Host "   Status: $($health.status)" -ForegroundColor Cyan
        Write-Host "   Timestamp: $($health.timestamp)" -ForegroundColor Gray
        exit 0
    }
} catch {
    Write-Host "❌ Încercare 2 eșuată: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n⏳ Încercare 3/3 - Așteptare 30 secunde..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

try {
    $response = Invoke-WebRequest -Uri "$backendUrl/health" -UseBasicParsing -TimeoutSec 60
    if ($response.StatusCode -eq 200) {
        $health = $response.Content | ConvertFrom-Json
        Write-Host "✅ Backend ONLINE!" -ForegroundColor Green
        Write-Host "   Status: $($health.status)" -ForegroundColor Cyan
        Write-Host "   Timestamp: $($health.timestamp)" -ForegroundColor Gray
        
        # Test API
        Write-Host "`n🧪 Testare API..." -ForegroundColor Yellow
        try {
            $apiTest = Invoke-WebRequest -Uri "$backendUrl/api/categories" -UseBasicParsing -TimeoutSec 30
            if ($apiTest.StatusCode -eq 200) {
                Write-Host "✅ API funcționează!" -ForegroundColor Green
            }
        } catch {
            Write-Host "⚠️  API nu răspunde încă (normal după trezire)" -ForegroundColor Yellow
        }
        
        exit 0
    }
} catch {
    Write-Host "❌ Încercare 3 eșuată: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n❌ Backend nu răspunde după 3 încercări" -ForegroundColor Red
Write-Host "Posibile cauze:" -ForegroundColor Yellow
Write-Host "- Render service în mentenanță" -ForegroundColor Gray
Write-Host "- Probleme cu deploy-ul" -ForegroundColor Gray
Write-Host "- Erori în cod după ultimele modificări" -ForegroundColor Gray
Write-Host ""
Write-Host "Soluții:" -ForegroundColor Yellow
Write-Host "1. Verificați dashboard-ul Render" -ForegroundColor Gray
Write-Host "2. Verificați logs pe render.com" -ForegroundColor Gray
Write-Host "3. Faceți redeploy manual" -ForegroundColor Gray
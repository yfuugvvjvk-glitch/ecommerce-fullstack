Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   VERIFICARE SETUP MEDIA MANAGER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificare directoare
Write-Host "[1/6] Verificare directoare..." -ForegroundColor Yellow

$directories = @(
    "backend\public\uploads\products",
    "backend\public\uploads\avatars",
    "backend\public\uploads\offers",
    "backend\public\uploads\media"
)

foreach ($dir in $directories) {
    if (Test-Path $dir) {
        Write-Host "  [OK] $dir" -ForegroundColor Green
    } else {
        Write-Host "  [!!] $dir - LIPSESTE" -ForegroundColor Red
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  [OK] Creat $dir" -ForegroundColor Green
    }
}
Write-Host ""

# 2. Verificare fisiere backend
Write-Host "[2/6] Verificare fisiere backend..." -ForegroundColor Yellow

$backendFiles = @(
    "backend\src\routes\media.routes.ts",
    "backend\src\middleware\auth.middleware.ts",
    "backend\src\middleware\admin.middleware.ts"
)

foreach ($file in $backendFiles) {
    if (Test-Path $file) {
        Write-Host "  [OK] $(Split-Path $file -Leaf)" -ForegroundColor Green
    } else {
        Write-Host "  [!!] $(Split-Path $file -Leaf) - LIPSESTE" -ForegroundColor Red
    }
}
Write-Host ""

# 3. Verificare fisiere frontend
Write-Host "[3/6] Verificare fisiere frontend..." -ForegroundColor Yellow

$frontendFiles = @(
    "frontend\components\admin\MediaManager.tsx",
    "frontend\components\admin\ContentManager.tsx"
)

foreach ($file in $frontendFiles) {
    if (Test-Path $file) {
        Write-Host "  [OK] $(Split-Path $file -Leaf)" -ForegroundColor Green
    } else {
        Write-Host "  [!!] $(Split-Path $file -Leaf) - LIPSESTE" -ForegroundColor Red
    }
}
Write-Host ""

# 4. Verificare configurare
Write-Host "[4/6] Verificare configurare..." -ForegroundColor Yellow

if (Test-Path "frontend\.env.local") {
    Write-Host "  [OK] frontend\.env.local" -ForegroundColor Green
    $envContent = Get-Content "frontend\.env.local" -Raw
    if ($envContent -match "NEXT_PUBLIC_API_URL") {
        Write-Host "  [OK] NEXT_PUBLIC_API_URL este setat" -ForegroundColor Green
    } else {
        Write-Host "  [!!] NEXT_PUBLIC_API_URL nu este setat" -ForegroundColor Red
    }
} else {
    Write-Host "  [!!] frontend\.env.local - LIPSESTE" -ForegroundColor Red
}

if (Test-Path "backend\.env.local") {
    Write-Host "  [OK] backend\.env.local" -ForegroundColor Green
} else {
    Write-Host "  [!!] backend\.env.local - LIPSESTE" -ForegroundColor Red
}
Write-Host ""

# 5. Verificare build backend
Write-Host "[5/6] Verificare build backend..." -ForegroundColor Yellow
Push-Location backend
$buildResult = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  [OK] Build backend REUSIT" -ForegroundColor Green
} else {
    Write-Host "  [!!] Build backend ESUAT" -ForegroundColor Red
    Write-Host "  [!!] Ruleaza: cd backend && npm run build" -ForegroundColor Red
}
Pop-Location
Write-Host ""

# 6. Numarare fisiere
Write-Host "[6/6] Numarare fisiere..." -ForegroundColor Yellow

$categories = @{
    "Products" = "backend\public\uploads\products"
    "Avatars" = "backend\public\uploads\avatars"
    "Offers" = "backend\public\uploads\offers"
    "Media" = "backend\public\uploads\media"
}

foreach ($category in $categories.GetEnumerator()) {
    if (Test-Path $category.Value) {
        $count = (Get-ChildItem -Path $category.Value -File).Count
        Write-Host "  $($category.Key): $count fisiere" -ForegroundColor Cyan
    } else {
        Write-Host "  $($category.Key): 0 fisiere (director lipseste)" -ForegroundColor Yellow
    }
}
Write-Host ""

# Rezumat final
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "         VERIFICARE COMPLETA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Urmatoarele comenzi pentru pornire:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Terminal 1 - Backend:" -ForegroundColor White
Write-Host "  cd backend" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  Terminal 2 - Frontend:" -ForegroundColor White
Write-Host "  cd frontend" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Apoi acceseaza: http://localhost:3000" -ForegroundColor Green
Write-Host "Admin Panel -> Editare Continut -> Media" -ForegroundColor Green
Write-Host ""

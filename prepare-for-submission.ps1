# Script pentru pregătirea proiectului pentru trimitere

Write-Host "Pregătire proiect pentru trimitere..." -ForegroundColor Green
Write-Host ""

# 1. Curăță node_modules
Write-Host "Stergere node_modules..." -ForegroundColor Yellow
if (Test-Path "frontend/node_modules") {
    Remove-Item -Recurse -Force "frontend/node_modules"
    Write-Host "OK: frontend/node_modules sters" -ForegroundColor Green
}
if (Test-Path "backend/node_modules") {
    Remove-Item -Recurse -Force "backend/node_modules"
    Write-Host "OK: backend/node_modules sters" -ForegroundColor Green
}

# 2. Curăță build-uri
Write-Host ""
Write-Host "Stergere build-uri..." -ForegroundColor Yellow
if (Test-Path "frontend/.next") {
    Remove-Item -Recurse -Force "frontend/.next"
    Write-Host "OK: frontend/.next sters" -ForegroundColor Green
}
if (Test-Path "backend/dist") {
    Remove-Item -Recurse -Force "backend/dist"
    Write-Host "OK: backend/dist sters" -ForegroundColor Green
}

# 3. Calculează dimensiunea
Write-Host ""
Write-Host "Calculare dimensiune..." -ForegroundColor Yellow
$size = (Get-ChildItem -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "Dimensiune totala: $([math]::Round($size, 2)) MB" -ForegroundColor Cyan

if ($size -lt 50) {
    Write-Host "OK: Dimensiunea este buna pentru trimitere" -ForegroundColor Green
} else {
    Write-Host "ATENTIE: Dimensiunea este mare" -ForegroundColor Yellow
}

# 4. Rezumat
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "PROIECT PREGATIT PENTRU TRIMITERE!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Urmatorii pasi:" -ForegroundColor Yellow
Write-Host "1. Creaza arhiva ZIP a folderului app" -ForegroundColor White
Write-Host "2. Verifica ca arhiva se deschide corect" -ForegroundColor White
Write-Host "3. Trimite arhiva profesorului" -ForegroundColor White
Write-Host ""
Write-Host "Vezi INSTRUCTIUNI_TRIMITERE.md pentru detalii" -ForegroundColor Cyan

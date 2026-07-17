Write-Host "Iniciando Hostal Cofee..." -ForegroundColor Green
Write-Host ""

# Backend
Write-Host "Starting backend on port 3001..." -ForegroundColor Yellow
$backend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\REST-COFEE\hostal-cofee\server'; npx tsx src/index.ts" -PassThru

Start-Sleep -Seconds 4

# Frontend
Write-Host "Starting frontend on port 5173..." -ForegroundColor Yellow
$frontend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\REST-COFEE\hostal-cofee\client'; npm run dev" -PassThru

Start-Sleep -Seconds 4

# Health check
try {
    $r = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "Backend: OK (PID $($backend.Id))" -ForegroundColor Green
} catch {
    Write-Host "Backend: FALLO" -ForegroundColor Red
}

try {
    $r = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 5
    Write-Host "Frontend: OK (PID $($frontend.Id))" -ForegroundColor Green
} catch {
    Write-Host "Frontend: FALLO" -ForegroundColor Red
}

Write-Host ""
Write-Host "Abrre http://localhost:5173 en tu navegador" -ForegroundColor Cyan
Write-Host "Para detener: cierra ambas ventanas de PowerShell" -ForegroundColor Gray

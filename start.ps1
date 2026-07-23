Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   HOSTAL COFEE - Inicio Automatico    " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar PostgreSQL local
Write-Host "[1/4] Verificando PostgreSQL local..." -ForegroundColor Yellow

try {
    $result = & psql -U postgres -c "SELECT 1" -t -A 2>&1
    if ($LASTEXITCODE -ne 0) { throw "psql not found" }
} catch {
    Write-Host "Error: PostgreSQL no esta corriendo o psql no esta en PATH." -ForegroundColor Red
    Write-Host "Asegurate de que PostgreSQL este iniciado en el puerto 5432." -ForegroundColor Gray
    exit 1
}

# Verificar que la base de datos exista
$dbExists = & psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='hostal_cofee'" 2>&1
if ($dbExists -ne "1") {
    Write-Host "Creando base de datos hostal_cofee..." -ForegroundColor Gray
    & psql -U postgres -c "CREATE DATABASE hostal_cofee"
}
Write-Host "PostgreSQL: OK" -ForegroundColor Green

# 2. Migraciones de Prisma
Write-Host "[2/4] Ejecutando migraciones de Prisma..." -ForegroundColor Yellow
Push-Location hostal-cofre/server
npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error en las migraciones de Prisma." -ForegroundColor Red
    Pop-Location
    exit 1
}
npx prisma generate
Pop-Location
Write-Host "Migraciones: OK" -ForegroundColor Green

# 3. Seed (solo si la tabla esta vacia)
Write-Host "[3/4] Verificando datos iniciales..." -ForegroundColor Yellow
$menuCount = & psql -U postgres -d hostal_cofee -tAc "SELECT COUNT(*) FROM \"MenuItem\"" 2>&1
if ($menuCount -eq "0") {
    Write-Host "Ejecutando seed (primera vez)..." -ForegroundColor Gray
    Push-Location hostal-cofre/server
    npm run db:seed
    Pop-Location
}
Write-Host "Datos: OK" -ForegroundColor Green

# 4. Backend + Frontend
Write-Host "[4/4] Iniciando Backend (3001) y Frontend (5173)..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend:  http://localhost:3001" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener todo." -ForegroundColor Gray
Write-Host "----------------------------------------" -ForegroundColor DarkGray

npm run dev

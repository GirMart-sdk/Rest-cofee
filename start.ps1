# Silencia los mensajes de progreso de comandos como Invoke-WebRequest
$ProgressPreference = 'SilentlyContinue'

# --- Detección de la Raíz del Proyecto ---
# Busca hacia arriba desde la ubicación del script hasta encontrar un directorio que contenga 'server' y 'client'.
# Esto hace que el script sea más robusto y funcione sin importar dónde se encuentre.
$currentPath = $PSScriptRoot
$ProjectRoot = $null
while ($currentPath) {
    if ((Test-Path (Join-Path $currentPath "hostal-cofre/server")) -and (Test-Path (Join-Path $currentPath "hostal-cofre/client"))) {
        $ProjectRoot = Get-Item $currentPath
        break
    }
    $currentPath = (Get-Item $currentPath).PSParentPath
}

if (-not $ProjectRoot) {
    Write-Host "ERROR: No se pudo encontrar el directorio del proyecto que contiene 'hostal-cofre/server' y 'hostal-cofre/client'." -ForegroundColor Red
    exit 1
}

$ServerPath = Join-Path $ProjectRoot.FullName "hostal-cofre/server"
$ClientPath = Join-Path $ProjectRoot.FullName "hostal-cofre/client"
 
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   HOSTAL COFEE - Inicio Automatico    " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# --- Funciones de Ayuda ---
function Invoke-Step {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Name,
        [Parameter(Mandatory=$true)]
        [scriptblock]$ScriptBlock
    )
    Write-Host -NoNewline "-> $Name..."
    try {
        & $ScriptBlock
        Write-Host " OK" -ForegroundColor Green
    } catch {
        Write-Host " ERROR" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        exit 1
    }
}

function Invoke-NpmInstall {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Path
    )
    Push-Location $Path
    if (-not (Test-Path "node_modules")) {
        Write-Host -NoNewline " (instalando)..."
        npm install --silent
        if ($LASTEXITCODE -ne 0) {
            throw "Fallo la instalacion de dependencias en '$Path'"
        }
    }
    Pop-Location
}

function Import-EnvVariables {
    param(
        [Parameter(Mandatory=$true)]
        [string]$EnvPath
    )
    if (-not (Test-Path $EnvPath)) {
        $ExamplePath = "$EnvPath.example"
        if (Test-Path $ExamplePath) {
            Write-Host -NoNewline " (creando .env desde .env.example)..."
            Copy-Item -Path $ExamplePath -Destination $EnvPath
        } else {
            throw "El archivo '$EnvPath' no existe y no se encontró un '$ExamplePath' para crearlo."
        }
    }
    # Lee el archivo .env, filtra comentarios/líneas vacías y establece las variables de entorno para el proceso actual.
    Get-Content -Path $EnvPath | ForEach-Object {
        if ($_ -match '^\s*(?<name>[\w.-]+)\s*=\s*"?\s*(?<value>.*?)\s*"?\s*$') {
            # Establece la variable de entorno para el proceso actual de PowerShell de forma segura.
            Set-Item -Path Env:$($Matches.name) -Value $Matches.value
        }
    }

    # Asegurarse de que DATABASE_URL esté definida y tenga el formato correcto
    if (-not $env:DATABASE_URL) {
        throw "La variable de entorno DATABASE_URL no está definida en '$EnvPath'. Por favor, asegúrate de que esté presente y no vacía."
    }
    if (-not ($env:DATABASE_URL -like 'postgresql://*' -or $env:DATABASE_URL -like 'postgres://*')) {
        throw "La variable de entorno DATABASE_URL en '$EnvPath' debe comenzar con 'postgresql://' o 'postgres://'. Verifica su formato."
    }
}
# --- Pasos de Inicio ---

Invoke-Step "Verificando disponibilidad de 'node' y 'npm'" {
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        throw "El comando 'node' no se encontró en el PATH. Asegúrate de que Node.js esté instalado."
    }
    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        throw "El comando 'npm' no se encontró en el PATH. Asegúrate de que npm (Node Package Manager) esté instalado."
    }
}

Invoke-Step "Verificando disponibilidad de 'psql'" {
    if (-not (Get-Command psql -ErrorAction SilentlyContinue)) {
        throw "El comando 'psql' no se encontró en el PATH. Asegúrate de que PostgreSQL esté instalado y que su directorio 'bin' esté en el PATH del sistema."
    }
}

Invoke-Step "Verificando PostgreSQL" {
    # Cargar .env para obtener la DATABASE_URL ANTES de cualquier operación de BD
    Import-EnvVariables (Join-Path $ServerPath ".env")

    # Extraer el nombre de la base de datos de la URL de conexión
    $dbName = ($env:DATABASE_URL -split '/')[-1].Split('?')[0]
    if (-not $dbName) {
        throw "No se pudo determinar el nombre de la base de datos desde la DATABASE_URL."
    }

    # Extraer la contraseña de la DATABASE_URL para que psql no la pida interactivamente.
    # Esto asume una URL con formato: postgresql://user:password@host:port/db
    $password = $null
    if ($env:DATABASE_URL -match ':\/\/[^:]+:(?<password>[^@]+)@') {
        $password = $Matches.password
    }

    # Usar el usuario 'postgres' por defecto para conectar a la base de datos de mantenimiento ('postgres').
    # Esto evita problemas de permisos si el usuario de la aplicación no puede acceder a la BD 'postgres'.
    $env:PGPASSWORD=$password; $dbExists = & psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$dbName'" 2>$null
    
    if ($LASTEXITCODE -ne 0 -and -not $dbExists) {
        throw "No se pudo conectar a PostgreSQL con el usuario 'postgres'. Verifica que el servicio esté corriendo y que la autenticación para este usuario sea correcta (p. ej., archivo pg_hba.conf)."
    }

    if ($dbExists -ne "1") {
        Write-Host -NoNewline " (creando BD)..."
        & psql -U postgres -c "CREATE DATABASE $dbName" | Out-Null
    }
}

Invoke-Step "Instalando dependencias (servidor)" { Invoke-NpmInstall $ServerPath }
Invoke-Step "Instalando dependencias (cliente)" { Invoke-NpmInstall $ClientPath }

Invoke-Step "Ejecutando migraciones de base de datos" {
    Push-Location $ServerPath
    # Usamos `prisma db push` para desarrollo. Sincroniza el schema de forma no interactiva
    # y es ideal para entornos locales. También ejecuta `prisma generate` internamente.
    # Redirigimos stderr a stdout y verificamos si hay errores para una detección más robusta.
    $output = npx prisma db push --schema=./prisma/schema.prisma 2>&1
    if ($LASTEXITCODE -ne 0 -or $output -like "*Error:*") {
        throw "Fallo 'prisma db push'. Revisa la salida para más detalles: $output"
    }
    Pop-Location
}

Invoke-Step "Verificando datos iniciales (seed)" {
    Push-Location $ServerPath
    # Usamos `prisma db execute` con un script SQL. Es más simple y no depende de la resolución de módulos de Node.js.
    # Esto evita problemas de "Cannot find module" al ejecutar scripts TSX desde fuera de su directorio de proyecto.
    $checkSeedSqlPath = Join-Path $ProjectRoot.FullName "check-seed.sql"
    # El comando necesita ejecutarse desde el directorio del servidor para encontrar el schema de Prisma.
    $menuCountResult = npx prisma db execute --file $checkSeedSqlPath --schema=./prisma/schema.prisma 2>&1
    if ($LASTEXITCODE -ne 0 -or $menuCountResult -like "*Error:*") {
        throw "Fallo al ejecutar la comprobación de datos iniciales con 'prisma db execute'. Error: $menuCountResult"
    }
    Pop-Location

    # El script SQL devuelve 'count: 1' si hay datos, 'count: 0' si no.
    $menuCount = ($menuCountResult | Select-String -Pattern 'count: (\d+)' | ForEach-Object { $_.Matches.Groups[1].Value })
    if ($menuCount -eq "0" -or -not $menuCount) {
        Write-Host -NoNewline " (ejecutando seed)..."
        Push-Location $ServerPath
        npm run db:seed
        if ($LASTEXITCODE -ne 0) { throw "Fallo el script del seed" }
        Pop-Location
    }
}

Write-Host ""
Write-Host "Todo listo. Iniciando servicios..." -ForegroundColor Yellow
Write-Host "Backend:  http://localhost:3001" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener todo." -ForegroundColor Gray
Write-Host "----------------------------------------" -ForegroundColor DarkGray

# Iniciar el backend en una nueva ventana de PowerShell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Push-Location -Path '$ServerPath'; npm run dev"

# Iniciar el frontend en una nueva ventana de PowerShell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Push-Location -Path '$ClientPath'; npm run dev"

Write-Host "Servicios iniciados en ventanas separadas."

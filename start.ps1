# ============================================================
# HOSTAL COFEE - Inicio del sistema
#
# - Modo desarrollo (por defecto): inicia servidor y cliente con
#   hot-reload en ventanas separadas.
# - Modo produccion:  powershell -ExecutionPolicy Bypass -File start.ps1 -Production
#   Ejecuta deploy\deploy.ps1 (instala/actualiza el servicio NSSM "HostalCofee").
#   Guia completa de despliegue en produccion: deploy\README.md
#
# Optimizaciones de velocidad:
#   * `prisma db push` solo se ejecuta cuando realmente se necesita:
#     tabla principal ausente, esquema modificado o cliente Prisma sin generar.
#   * La comprobacion de datos iniciales (seed) se hace con `psql` directo,
#     sin arrancar el CLI de Node (`prisma db execute`).
#   * La instalacion de dependencias de servidor y cliente se hace en paralelo.
# ============================================================
param(
    [switch]$Production
)

if ($Production) {
    Write-Host "Modo produccion: ejecutando deploy\deploy.ps1 ..." -ForegroundColor Cyan
    & (Join-Path $PSScriptRoot "deploy\deploy.ps1")
    exit $LASTEXITCODE
}

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

function Get-SchemaHash {
    # Hash MD5 del schema de Prisma para saber si el esquema cambió desde la última ejecución.
    $schemaFile = Join-Path $ServerPath "prisma\schema.prisma"
    if (Test-Path -LiteralPath $schemaFile) {
        return (Get-FileHash -Algorithm MD5 -LiteralPath $schemaFile).Hash
    }
    return $null
}

# Variables de conexión compartidas entre pasos (ámbito de script).
$script:DbName = $null
$script:DbPassword = $null
$script:TableExists = $false

# Cache local (fuera del repo) para recordar el último esquema sincronizado.
$cacheDir = Join-Path $env:TEMP "hostal-cofee"
$schemaCacheFile = Join-Path $cacheDir "schema.md5"

# --- Pasos de Inicio ---

Invoke-Step "Verificando disponibilidad de 'node', 'npm' y 'psql'" {
    foreach ($cmd in @('node', 'npm', 'psql')) {
        if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
            throw "El comando '$cmd' no se encontró en el PATH. Asegúrate de que esté instalado (Node.js y PostgreSQL, con su directorio 'bin' en el PATH)."
        }
    }
}

Invoke-Step "Verificando PostgreSQL" {
    # Cargar .env para obtener la DATABASE_URL ANTES de cualquier operación de BD
    Import-EnvVariables (Join-Path $ServerPath ".env")

    # Extraer el nombre de la base de datos de la URL de conexión
    $script:DbName = ($env:DATABASE_URL -split '/')[-1].Split('?')[0]
    if (-not $script:DbName) {
        throw "No se pudo determinar el nombre de la base de datos desde la DATABASE_URL."
    }

    # Extraer la contraseña de la DATABASE_URL para que psql no la pida interactivamente.
    # Esto asume una URL con formato: postgresql://user:password@host:port/db
    $script:DbPassword = $null
    if ($env:DATABASE_URL -match ':\/\/[^:]+:(?<password>[^@]+)@') {
        $script:DbPassword = $Matches.password
    }

    # Usar el usuario 'postgres' por defecto para conectar a la base de datos de mantenimiento ('postgres').
    # Esto evita problemas de permisos si el usuario de la aplicación no puede acceder a la BD 'postgres'.
    $env:PGPASSWORD=$script:DbPassword
    $dbExists = & psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$script:DbName'" 2>$null

    if ($LASTEXITCODE -ne 0 -and -not $dbExists) {
        throw "No se pudo conectar a PostgreSQL con el usuario 'postgres'. Verifica que el servicio esté corriendo y que la autenticación para este usuario sea correcta (p. ej., archivo pg_hba.conf)."
    }

    if ($dbExists -ne "1") {
        Write-Host -NoNewline " (creando BD)..."
        & psql -U postgres -c "CREATE DATABASE $script:DbName" | Out-Null
    }

    # Verifica si la tabla principal del esquema ya existe (con psql directo, sin Node).
    # Se envía la consulta por stdin (no con -c) para evitar problemas de
    # escape de comillas dobles de PowerShell 5.1 al invocar programas nativos.
    $sqlTable = "SELECT to_regclass('`"MenuItem`"') IS NOT NULL"
    $hasTable = ($sqlTable | & psql -U postgres -d $script:DbName -tA -q 2>&1)
    if ($LASTEXITCODE -ne 0) {
        throw "No se pudo verificar el esquema de la base de datos '$script:DbName'."
    }
    $script:TableExists = ($hasTable -eq 't')
}

Invoke-Step "Instalando dependencias (servidor y cliente)" {
    $jobs = @()
    if (-not (Test-Path (Join-Path $ServerPath "node_modules"))) {
        $jobs += Start-Job -ScriptBlock { param($p) Push-Location $p; npm install --silent; Pop-Location } -ArgumentList $ServerPath
    }
    if (-not (Test-Path (Join-Path $ClientPath "node_modules"))) {
        $jobs += Start-Job -ScriptBlock { param($p) Push-Location $p; npm install --silent; Pop-Location } -ArgumentList $ClientPath
    }
    if ($jobs.Count -gt 0) {
        Write-Host -NoNewline " (instalando en paralelo)..."
        $completed = Wait-Job -Job $jobs -Timeout 900
        if (-not $completed) {
            $jobs | Stop-Job | Out-Null
            $jobs | Remove-Job -Force
            throw "Tiempo agotado instalando las dependencias."
        }
        foreach ($job in $jobs) {
            if ($job.State -ne 'Completed') {
                Receive-Job $job | Out-String | Write-Host
                Remove-Job $job -Force
                throw "Fallo la instalación de dependencias."
            }
            Receive-Job $job | Out-Null
            Remove-Job $job
        }
    }
}

# --- Sincronización del esquema (solo si es necesario) ---
$schemaHash = Get-SchemaHash
$cachedHash = $null
if (Test-Path -LiteralPath $schemaCacheFile) {
    $cachedHash = (Get-Content -LiteralPath $schemaCacheFile -Raw).Trim()
}
$clientGenerated = Test-Path -LiteralPath (Join-Path $ServerPath "node_modules\.prisma\client\index.d.ts")

# Se omite `prisma db push` cuando no hay nada que sincronizar:
# la tabla principal existe, el esquema no cambió y el cliente Prisma ya está generado.
$needsDbPush = (-not $script:TableExists) -or ($schemaHash -ne $cachedHash) -or (-not $clientGenerated)

if ($needsDbPush) {
    Invoke-Step "Sincronizando esquema de base de datos" {
        Push-Location $ServerPath
        # Usamos `prisma db push` para desarrollo. Sincroniza el schema de forma no interactiva
        # y es ideal para entornos locales. También ejecuta `prisma generate` internamente.
        # Redirigimos stderr a stdout y verificamos si hay errores para una detección más robusta.
        $output = npx prisma db push --schema=./prisma/schema.prisma 2>&1
        if ($LASTEXITCODE -ne 0 -or $output -like "*Error:*") {
            throw "Fallo 'prisma db push'. Revisa la salida para más detalles: $output"
        }
        Pop-Location
        # Registra el esquema sincronizado para omitir este paso en próximas ejecuciones.
        if ($schemaHash) {
            New-Item -ItemType Directory -Force -Path $cacheDir | Out-Null
            Set-Content -LiteralPath $schemaCacheFile -Value $schemaHash
        }
    }
} else {
    Write-Host "-> Esquema de base de datos ya sincronizado (sin cambios)." -ForegroundColor Green
}

Invoke-Step "Verificando datos iniciales (seed)" {
    if ($script:TableExists) {
        $env:PGPASSWORD=$script:DbPassword
        $sqlMenu = "SELECT EXISTS(SELECT 1 FROM `"MenuItem`" LIMIT 1)"
        $hasMenu = ($sqlMenu | & psql -U postgres -d $script:DbName -tA -q 2>&1)
        if ($LASTEXITCODE -ne 0) {
            throw "No se pudo verificar los datos iniciales en la base de datos."
        }
    } else {
        # Tabla recién creada por 'prisma db push': aún no tiene datos.
        $hasMenu = 'f'
    }

    if ($hasMenu -ne 't') {
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

# Iniciar backend y frontend en la misma ventana con concurrently
$serverDev = "npm run dev --prefix `"$ServerPath`""
$clientDev = "npm run dev --prefix `"$ClientPath`""
Push-Location $ProjectRoot.FullName
npx --yes concurrently --names "server,client" --prefix-colors "cyan,green" "$serverDev" "$clientDev"
Pop-Location

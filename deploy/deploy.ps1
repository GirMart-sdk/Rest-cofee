# ============================================================
# HOSTAL COFEE - Despliegue de produccion (Windows / PowerShell 5.1)
#
# Ejecuta todo el ciclo de despliegue: verifica herramientas,
# configura .env, instala dependencias, compila servidor + cliente,
# aplica migraciones, siembra el menu si esta vacio, instala o
# actualiza el servicio de Windows "HostalCofee" (NSSM) y comprueba
# que la API responde en /api/health.
#
# Uso (como Administrador):
#   powershell -ExecutionPolicy Bypass -File deploy\deploy.ps1
#
# Opciones:
#   -NssmPath      Ruta explicita a nssm.exe si no esta en el PATH.
#   -SkipSeed      Omite la comprobacion/ejecucion del seed.
#   -EnvTemplate   Ruta a la plantilla .env de produccion
#                  (por defecto deploy\.env.production.example).
# ============================================================

param(
    [string]$NssmPath = "",
    [switch]$SkipSeed,
    [string]$EnvTemplate = ""
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$ServiceName = 'HostalCofee'
$HealthUrl = 'http://localhost:3001/api/health'

# --- Deteccion de la raiz del proyecto (D:\Rest-COFEE) ---
$DeployDir = $PSScriptRoot
$ProjectRoot = Split-Path $DeployDir -Parent
$ServerDir = Join-Path $ProjectRoot "hostal-cofre/server"
$ClientDir = Join-Path $ProjectRoot "hostal-cofre/client"
$ServerEnv = Join-Path $ServerDir ".env"
$LogsDir = Join-Path $ProjectRoot "logs"

if (-not (Test-Path $ServerDir) -or -not (Test-Path $ClientDir)) {
    Write-Host "ERROR: No se encontro 'hostal-cofre/server' y 'hostal-cofre/client' bajo '$ProjectRoot'." -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $LogsDir)) { New-Item -ItemType Directory -Path $LogsDir | Out-Null }

# Se necesita una consola elevada para crear e iniciar servicios de Windows.
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: Ejecuta este script como Administrador (clic derecho -> Ejecutar como administrador)." -ForegroundColor Red
    exit 1
}

# --- Funciones de ayuda ---

function Write-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host "=== $Message ===" -ForegroundColor Cyan
}

function Assert-Command {
    param(
        [string]$Name,
        [string]$InstallHint
    )
    $cmd = Get-Command $Name -ErrorAction SilentlyContinue
    if (-not $cmd) {
        Write-Host "ERROR: El comando '$Name' no esta disponible en el PATH." -ForegroundColor Red
        Write-Host $InstallHint -ForegroundColor Yellow
        exit 1
    }
    return $cmd
}

function Read-EnvValue {
    param(
        [string]$Path,
        [string]$Name
    )
    $pattern = '^\s*' + [regex]::Escape($Name) + '\s*=\s*(.*)$'
    foreach ($line in Get-Content -Path $Path) {
        if ($line -match $pattern) {
            $value = $Matches[1].Trim()
            # Quitar un posible comentario final (solo si va precedido de espacio)
            $value = $value -replace '\s+#.*$', ''
            # Quitar comillas envolventes simples o dobles
            if ($value.Length -ge 2 -and (
                ($value[0] -eq '"' -and $value[$value.Length - 1] -eq '"') -or
                ($value[0] -eq "'" -and $value[$value.Length - 1] -eq "'")
            )) {
                $value = $value.Substring(1, $value.Length - 2)
            }
            return $value
        }
    }
    return $null
}

function Parse-DatabaseUrl {
    param([string]$Url)
    $Url = $Url.Trim()
    if ($Url -like 'postgresql://*') {
        $rest = $Url.Substring('postgresql://'.Length)
    } elseif ($Url -like 'postgres://*') {
        $rest = $Url.Substring('postgres://'.Length)
    } else {
        throw "DATABASE_URL no valida (debe comenzar con postgresql:// o postgres://)."
    }

    $at = $rest.IndexOf('@')
    if ($at -ge 0) {
        $userinfo = $rest.Substring(0, $at)
        $hostportdb = $rest.Substring($at + 1)
    } else {
        $userinfo = ''
        $hostportdb = $rest
    }

    $user = ''
    $password = ''
    if ($userinfo) {
        $colon = $userinfo.IndexOf(':')
        if ($colon -ge 0) {
            $user = $userinfo.Substring(0, $colon)
            $password = $userinfo.Substring($colon + 1)
        } else {
            $user = $userinfo
        }
    }

    $slash = $hostportdb.IndexOf('/')
    if ($slash -ge 0) {
        $hostport = $hostportdb.Substring(0, $slash)
        $db = $hostportdb.Substring($slash + 1)
    } else {
        $hostport = $hostportdb
        $db = ''
    }
    $q = $db.IndexOf('?')
    if ($q -ge 0) { $db = $db.Substring(0, $q) }

    $user = [Uri]::UnescapeDataString($user)
    $password = [Uri]::UnescapeDataString($password)

    $hostName = $hostport
    $port = 5432
    if ($hostport -match '^\[(.+)\]:(\d+)$') {
        $hostName = $Matches[1]
        $port = [int]$Matches[2]
    } elseif ($hostport -match '^(.+):(\d+)$') {
        $hostName = $Matches[1]
        $port = [int]$Matches[2]
    }

    return [pscustomobject]@{
        User = $user
        Password = $password
        Host = $hostName
        Port = $port
        Db = $db
    }
}

$hintNode = @"
  Instala Node.js 18 o superior desde https://nodejs.org (version LTS).
  Reinicia la terminal despues de instalarlo y vuelve a ejecutar este script.
"@

$hintNpm = @"
  npm se instala junto con Node.js. Reinstala Node.js desde https://nodejs.org si falta.
"@

$hintPsql = @"
  Instala PostgreSQL 14+ desde https://www.postgresql.org/download/windows/ y agrega
  'C:\Program Files\PostgreSQL\17\bin' (ajusta el numero de version) al PATH del sistema.
"@

try {
    # --- 1. Verificacion de herramientas ---
    Write-Step "Verificando herramientas requeridas (node, npm, psql, nssm)"

    $nodeCmd = Assert-Command "node" $hintNode
    $npmCmd = Assert-Command "npm" $hintNpm
    $psqlCmd = Assert-Command "psql" $hintPsql

    if ($NssmPath) {
        if (-not (Test-Path $NssmPath)) {
            Write-Host "ERROR: No se encontro nssm.exe en '$NssmPath'." -ForegroundColor Red
            exit 1
        }
        $nssmCmd = $NssmPath
    } else {
        $nssm = Get-Command nssm -ErrorAction SilentlyContinue
        if (-not $nssm) {
            Write-Host "ERROR: El comando 'nssm' no esta disponible." -ForegroundColor Red
            Write-Host "  Descarga NSSM desde https://nssm.cc/download (version win64), descomprime" -ForegroundColor Yellow
            Write-Host "  el archivo y coloca nssm.exe en el PATH, o indica su ruta con -NssmPath." -ForegroundColor Yellow
            exit 1
        }
        $nssmCmd = $nssm.Source
    }

    # Comprobacion suave de la version de Node
    $nodeVersion = (& node --version 2>$null)
    if ($nodeVersion -match '^v(\d+)') {
        $nodeMajor = [int]$Matches[1]
        if ($nodeMajor -lt 18) {
            Write-Host "  ADVERTENCIA: Node $nodeVersion es antiguo. Se recomienda Node 18 o superior." -ForegroundColor Yellow
        }
    }

    Write-Host "  node: $($nodeCmd.Source)"
    Write-Host "  npm:  $($npmCmd.Source)"
    Write-Host "  psql: $($psqlCmd.Source)"
    Write-Host "  nssm: $nssmCmd"
    Write-Host "  raiz del proyecto: $ProjectRoot"

    # --- 2. Variables de entorno ---
    Write-Step "Configurando variables de entorno (.env)"

    if (-not $EnvTemplate) {
        $EnvTemplate = Join-Path $DeployDir ".env.production.example"
    }
    if (-not (Test-Path $EnvTemplate)) {
        Write-Host "ERROR: No se encontro la plantilla de entorno '$EnvTemplate'." -ForegroundColor Red
        exit 1
    }

    if (-not (Test-Path $ServerEnv)) {
        Write-Host "  No existe $ServerEnv. Copiando la plantilla de produccion..." -ForegroundColor Yellow
        Copy-Item -Path $EnvTemplate -Destination $ServerEnv
        Write-Host "  IMPORTANTE: Edita '$ServerEnv' con tus valores reales y vuelve a ejecutar este script." -ForegroundColor Yellow
    }

    $jwt = Read-EnvValue -Path $ServerEnv -Name "JWT_SECRET"
    $jwtInvalid = (-not $jwt) -or ($jwt.Length -le 32) -or ($jwt -like '*REEMPLAZA*') -or ($jwt -like '*CHANGE_ME*')
    if ($jwtInvalid) {
        Write-Host "ERROR: JWT_SECRET en '$ServerEnv' no es valido para produccion (debe ser un secreto aleatorio de mas de 32 caracteres)." -ForegroundColor Red
        Write-Host "  Genera uno con:  node -e `"console.log(require('crypto').randomBytes(64).toString('hex'))`"" -ForegroundColor Yellow
        Write-Host "  y pegalo en la linea JWT_SECRET=... de '$ServerEnv'." -ForegroundColor Yellow
        exit 1
    }

    $dbUrl = Read-EnvValue -Path $ServerEnv -Name "DATABASE_URL"
    if (-not $dbUrl -or -not ($dbUrl -like 'postgresql://*' -or $dbUrl -like 'postgres://*')) {
        Write-Host "ERROR: DATABASE_URL en '$ServerEnv' no es valida (debe comenzar con postgresql:// o postgres://)." -ForegroundColor Red
        exit 1
    }
    $maskedDb = $dbUrl -replace '://[^:]+:[^@]+@', '://***@'
    Write-Host "  JWT_SECRET: ok ($($jwt.Length) caracteres)"
    Write-Host "  DATABASE_URL: $maskedDb"

    # --- 3. Detener el servicio existente antes de tocar archivos ---
    Write-Step "Deteniendo el servicio '$ServiceName' (si existe)"

    $svc = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    if ($svc) {
        if ($svc.Status -ne 'Stopped') {
            Stop-Service -Name $ServiceName -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
            Write-Host "  Servicio '$ServiceName' detenido."
        } else {
            Write-Host "  Servicio '$ServiceName' existe (ya estaba detenido)."
        }
    } else {
        Write-Host "  No hay servicio instalado aun."
    }

    # --- 4. Dependencias ---
    Write-Step "Instalando dependencias (npm ci)"

    Push-Location $ServerDir
    Write-Host "  -> npm ci en hostal-cofre/server ..."
    & npm ci
    $npmCode = $LASTEXITCODE
    Pop-Location
    if ($npmCode -ne 0) {
        Write-Host "ERROR: Fallo 'npm ci' en el servidor (codigo $npmCode)." -ForegroundColor Red
        exit 1
    }

    Push-Location $ClientDir
    Write-Host "  -> npm ci en hostal-cofre/client ..."
    & npm ci
    $npmCode = $LASTEXITCODE
    Pop-Location
    if ($npmCode -ne 0) {
        Write-Host "ERROR: Fallo 'npm ci' en el cliente (codigo $npmCode)." -ForegroundColor Red
        exit 1
    }

    # --- 5. Generar el cliente de Prisma (necesario para compilar el servidor) ---
    Write-Step "Generando el cliente de Prisma (prisma generate)"

    Push-Location $ServerDir
    & npx prisma generate --schema=./prisma/schema.prisma
    $prismaCode = $LASTEXITCODE
    Pop-Location
    if ($prismaCode -ne 0) {
        Write-Host "ERROR: Fallo 'prisma generate' (codigo $prismaCode)." -ForegroundColor Red
        exit 1
    }

    # --- 6. Compilacion (server tsc + client vite) ---
    Write-Step "Compilando servidor y cliente (npm run build)"

    Push-Location $ProjectRoot
    & npm run build
    $buildCode = $LASTEXITCODE
    Pop-Location
    if ($buildCode -ne 0) {
        Write-Host "ERROR: Fallo 'npm run build' (codigo $buildCode). Revisa los errores de TypeScript/vite." -ForegroundColor Red
        exit 1
    }

    # --- 7. Migraciones ---
    Write-Step "Aplicando migraciones (prisma migrate deploy)"

    Push-Location $ServerDir
    & npx prisma migrate deploy --schema=./prisma/schema.prisma
    $migrateCode = $LASTEXITCODE
    Pop-Location
    if ($migrateCode -ne 0) {
        Write-Host "ERROR: Fallo 'prisma migrate deploy'. Verifica que PostgreSQL este corriendo y que la DATABASE_URL sea correcta." -ForegroundColor Red
        exit 1
    }

    # --- 8. Seed si el menu esta vacio ---
    Write-Step "Verificando datos iniciales (seed)"

    $db = Parse-DatabaseUrl -Url $dbUrl
    if ($SkipSeed) {
        Write-Host "  Parametro -SkipSeed: se omite la comprobacion/ejecucion del seed."
    } else {
        $env:PGPASSWORD = $db.Password
        $countRaw = & psql -w -h $db.Host -p $db.Port -U $db.User -d $db.Db -tAc 'SELECT count(*) FROM "MenuItem"' 2>$null
        $countCode = $LASTEXITCODE
        Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
        if ($countCode -ne 0) {
            Write-Host "ERROR: No se pudo consultar la base de datos '$($db.Db)' en $($db.Host):$($db.Port)." -ForegroundColor Red
            Write-Host "  Verifica que PostgreSQL este corriendo y que las credenciales de DATABASE_URL sean correctas." -ForegroundColor Yellow
            exit 1
        }
        $count = ([string]$countRaw).Trim()
        Write-Host "  MenuItems en base de datos: $count"
        if ($count -eq '0') {
            Write-Host "  El menu esta vacio. Ejecutando seed..." -ForegroundColor Yellow
            Push-Location $ServerDir
            & npm run db:seed
            $seedCode = $LASTEXITCODE
            Pop-Location
            if ($seedCode -ne 0) {
                Write-Host "ERROR: Fallo 'npm run db:seed' (codigo $seedCode)." -ForegroundColor Red
                exit 1
            }
            Write-Host "  Seed completado."
        } else {
            Write-Host "  El menu ya tiene datos. Se omite el seed."
        }
    }

    # --- 9. Instalacion del servicio NSSM ---
    Write-Step "Instalando el servicio de Windows '$ServiceName' (NSSM)"

    $nodePath = (Get-Command node).Source

    # Reinstalacion limpia: si el servicio existe se detiene y elimina.
    $svc = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    if ($svc) {
        Write-Host "  Servicio existente. Reinstalando (stop + remove + install)..." -ForegroundColor Yellow
        if ($svc.Status -ne 'Stopped') {
            Stop-Service -Name $ServiceName -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
        }
        & $nssmCmd remove $ServiceName confirm | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  ADVERTENCIA: 'nssm remove' devolvio codigo $LASTEXITCODE (el servicio podria no existir)." -ForegroundColor Yellow
        }
    }

    & $nssmCmd install $ServiceName $nodePath
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Fallo 'nssm install'. Asegurate de ejecutar el script como Administrador." -ForegroundColor Red
        exit 1
    }

    & $nssmCmd set $ServiceName AppDirectory $ServerDir
    & $nssmCmd set $ServiceName AppParameters "dist/index.js"
    & $nssmCmd set $ServiceName AppStdout (Join-Path $LogsDir "server-out.log")
    & $nssmCmd set $ServiceName AppStderr (Join-Path $LogsDir "server-err.log")
    & $nssmCmd set $ServiceName AppRotateFiles 1
    & $nssmCmd set $ServiceName AppRotateBytes 10485760
    & $nssmCmd set $ServiceName AppExit "Default" "Restart"
    & $nssmCmd set $ServiceName Start "SERVICE_AUTO_START"
    & $nssmCmd set $ServiceName AppEnvironmentExtra "NODE_ENV=production" "PORT=3001"

    Write-Host "  Configuracion aplicada al servicio:"
    Write-Host "    AppDirectory:     $ServerDir"
    Write-Host "    AppParameters:    dist/index.js"
    Write-Host "    AppStdout/Stderr: $LogsDir\server-out.log / server-err.log"
    Write-Host "    AppRotateBytes:   10485760"
    Write-Host "    Environment:      NODE_ENV=production PORT=3001"

    # --- 10. Arranque y comprobacion de salud ---
    Write-Step "Iniciando el servicio '$ServiceName'"

    try {
        Start-Service -Name $ServiceName
    } catch {
        Write-Host "ERROR: No se pudo iniciar el servicio: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "  Revisa los logs en '$LogsDir' (server-err.log) y el estado en services.msc." -ForegroundColor Yellow
        exit 1
    }

    Write-Host "  Esperando respuesta en $HealthUrl (hasta 30 segundos)..."
    $deadline = (Get-Date).AddSeconds(30)
    $healthy = $false
    while ((Get-Date) -lt $deadline) {
        try {
            $resp = Invoke-RestMethod -Uri $HealthUrl -TimeoutSec 5
            if ($resp.status -eq 'ok') {
                $healthy = $true
                break
            }
        } catch {
            # El servicio aun no responde; se reintenta.
        }
        Start-Sleep -Seconds 2
    }

    if (-not $healthy) {
        Write-Host "ERROR: El servicio no respondio correctamente en $HealthUrl dentro del tiempo esperado." -ForegroundColor Red
        Write-Host "  Revisa '$LogsDir\server-err.log' y '$LogsDir\server-out.log'." -ForegroundColor Yellow
        exit 1
    }
    Write-Host "  Health: OK ($HealthUrl)" -ForegroundColor Green

    # --- 11. Resumen ---
    Write-Step "Despliegue completado"

    Write-Host "  Servicio de Windows:  $ServiceName (arranque automatico, NSSM)"
    Write-Host "  API local:            http://localhost:3001/api/health"
    Write-Host "  Logs del servicio:    $LogsDir\server-out.log y server-err.log"
    Write-Host "  Logs del monitor:     $LogsDir\monitor.log"
    Write-Host "  Backups:              $ProjectRoot\backups"
    Write-Host ""
    Write-Host "Siguientes pasos:" -ForegroundColor Green
    Write-Host "  1. HTTPS: copia deploy\Caddyfile a tu instalacion de Caddy, reemplaza"
    Write-Host "     'yourdomain.com' por tu dominio y abre los puertos 80 y 443 en el firewall."
    Write-Host "  2. Programa deploy\backup-db.ps1 en el Programador de tareas (diario)."
    Write-Host "  3. Programa deploy\monitor.ps1 en el Programador de tareas (al iniciar el equipo)."
    Write-Host "  4. Guia completa de despliegue: abre deploy\README.md"

    exit 0
} catch {
    Write-Host ""
    Write-Host "ERROR FATAL: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

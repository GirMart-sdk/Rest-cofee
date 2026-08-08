# ============================================================
# HOSTAL COFEE - Backup de la base de datos (pg_dump)
#
# Lee DATABASE_URL de hostal-cofre/server/.env, hace un volcado en
# formato custom (-Fc) dentro de D:\Rest-COFEE\backups y conserva
# solo los ultimos N backups (por defecto 14).
#
# Uso (tambien valido desde el Programador de tareas):
#   powershell -ExecutionPolicy Bypass -File deploy\backup-db.ps1
#   powershell -ExecutionPolicy Bypass -File deploy\backup-db.ps1 -RetentionCount 30
# ============================================================

param(
    [int]$RetentionCount = 14
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

# --- Rutas ---
$DeployDir = $PSScriptRoot
$ProjectRoot = Split-Path $DeployDir -Parent
$ServerEnv = Join-Path $ProjectRoot "hostal-cofre/server/.env"
$BackupsDir = Join-Path $ProjectRoot "backups"
$LogsDir = Join-Path $ProjectRoot "logs"
$LogFile = Join-Path $LogsDir "backup.log"

function Write-BackupLog {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    Add-Content -Path $LogFile -Value $line
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
            $value = $value -replace '\s+#.*$', ''
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

# --- Precondiciones ---
if (-not (Get-Command pg_dump -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: 'pg_dump' no esta en el PATH. Verifica que la carpeta" -ForegroundColor Red
    Write-Host "  'C:\Program Files\PostgreSQL\XX\bin' este en el PATH del sistema." -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path $ServerEnv)) {
    Write-Host "ERROR: No se encontro '$ServerEnv'. Ejecuta primero deploy\deploy.ps1." -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $BackupsDir)) { New-Item -ItemType Directory -Path $BackupsDir | Out-Null }
if (-not (Test-Path $LogsDir)) { New-Item -ItemType Directory -Path $LogsDir | Out-Null }

try {
    $dbUrl = Read-EnvValue -Path $ServerEnv -Name "DATABASE_URL"
    if (-not $dbUrl) {
        throw "DATABASE_URL vacia o no encontrada en '$ServerEnv'."
    }
    $db = Parse-DatabaseUrl -Url $dbUrl

    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $outFile = Join-Path $BackupsDir ("hostal_cofee_{0}.dump" -f $timestamp)

    Write-Host "Creando backup en: $outFile"
    $env:PGPASSWORD = $db.Password
    & pg_dump -w -h $db.Host -p $db.Port -U $db.User -d $db.Db -Fc -f $outFile
    $dumpCode = $LASTEXITCODE
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue

    if ($dumpCode -ne 0) {
        if (Test-Path $outFile) { Remove-Item -Path $outFile -Force }
        Write-BackupLog "ERROR: pg_dump fallo con codigo $dumpCode (bd=$($db.Db), host=$($db.Host))"
        Write-Host "ERROR: Fallo pg_dump (codigo $dumpCode)." -ForegroundColor Red
        exit 1
    }

    $sizeMb = [math]::Round((Get-Item $outFile).Length / 1MB, 2)
    Write-Host "Backup completado ($sizeMb MB)."
    Write-BackupLog "OK: $outFile ($sizeMb MB)"

    # Retencion: conservar solo los ultimos N backups
    $files = @(Get-ChildItem -Path $BackupsDir -Filter "hostal_cofee_*.dump" | Sort-Object LastWriteTime -Descending)
    if ($files.Count -gt $RetentionCount) {
        $toDelete = $files | Select-Object -Skip $RetentionCount
        foreach ($f in $toDelete) {
            Remove-Item -Path $f.FullName -Force
            Write-BackupLog "Limpieza: eliminado backup antiguo $($f.Name)"
            Write-Host "Eliminado backup antiguo: $($f.Name)" -ForegroundColor Yellow
        }
    }
    Write-Host "Retencion: se conservan los ultimos $RetentionCount backups."
    exit 0
} catch {
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
    Write-BackupLog "ERROR: $($_.Exception.Message)"
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

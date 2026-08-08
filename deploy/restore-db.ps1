# ============================================================
# HOSTAL COFEE - Restaurar la base de datos desde un backup (pg_restore)
#
# Uso (como Administrador, con cuidado):
#   powershell -ExecutionPolicy Bypass -File deploy\restore-db.ps1 -BackupFile D:\Rest-COFEE\backups\hostal_cofee_20260101_120000.dump
#
# ADVERTENCIA: reemplaza TODOS los datos actuales de la base de datos
# por el contenido del backup. Pide confirmacion antes de proceder.
# ============================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$DeployDir = $PSScriptRoot
$ProjectRoot = Split-Path $DeployDir -Parent
$ServerEnv = Join-Path $ProjectRoot "hostal-cofre/server/.env"
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
if (-not (Get-Command pg_restore -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: 'pg_restore' no esta en el PATH. Verifica que la carpeta" -ForegroundColor Red
    Write-Host "  'C:\Program Files\PostgreSQL\XX\bin' este en el PATH del sistema." -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path $BackupFile)) {
    Write-Host "ERROR: No se encontro el archivo de backup '$BackupFile'." -ForegroundColor Red
    exit 1
}
$BackupFile = (Resolve-Path $BackupFile).Path

if (-not (Test-Path $ServerEnv)) {
    Write-Host "ERROR: No se encontro '$ServerEnv'. Ejecuta primero deploy\deploy.ps1." -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $LogsDir)) { New-Item -ItemType Directory -Path $LogsDir | Out-Null }

try {
    $dbUrl = Read-EnvValue -Path $ServerEnv -Name "DATABASE_URL"
    if (-not $dbUrl) {
        throw "DATABASE_URL vacia o no encontrada en '$ServerEnv'."
    }
    $db = Parse-DatabaseUrl -Url $dbUrl

    Write-Host "ADVERTENCIA: Esta operacion reemplazara TODOS los datos actuales" -ForegroundColor Yellow
    Write-Host "  de la base de datos '$($db.Db)' en $($db.Host):$($db.Port)" -ForegroundColor Yellow
    Write-Host "  por el contenido de:" -ForegroundColor Yellow
    Write-Host "  $BackupFile" -ForegroundColor Cyan
    Write-Host ""
    $confirm = Read-Host "Escribe RESTAURAR para continuar (cualquier otra cosa cancela)"
    if ($confirm -ne 'RESTAURAR') {
        Write-Host "Operacion cancelada. No se modifico nada."
        exit 1
    }

    Write-Host "Restaurando backup..."
    $env:PGPASSWORD = $db.Password
    & pg_restore -w -h $db.Host -p $db.Port -U $db.User -d $db.Db --clean --if-exists -Fc $BackupFile
    $restoreCode = $LASTEXITCODE
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue

    if ($restoreCode -ne 0) {
        Write-BackupLog "ERROR: pg_restore fallo con codigo $restoreCode (bd=$($db.Db), backup=$BackupFile)"
        Write-Host "ERROR: Fallo pg_restore (codigo $restoreCode)." -ForegroundColor Red
        Write-Host "  El backup se hizo sobre la base '$($db.Db)': verifica que exista y que el backup sea compatible." -ForegroundColor Yellow
        exit 1
    }

    Write-Host "Restauracion completada." -ForegroundColor Green
    Write-BackupLog "OK: restaurado $BackupFile en $($db.Db)"
    exit 0
} catch {
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
    Write-BackupLog "ERROR: $($_.Exception.Message)"
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# ============================================================
# HOSTAL COFEE - Desinstalar el servicio de Windows "HostalCofee"
#
# Uso (como Administrador):
#   powershell -ExecutionPolicy Bypass -File deploy\uninstall-service.ps1
#
# Opciones:
#   -NssmPath   Ruta explicita a nssm.exe si no esta en el PATH.
# ============================================================

param(
    [string]$NssmPath = ""
)

$ErrorActionPreference = 'Stop'

$ServiceName = 'HostalCofee'

if ($NssmPath) {
    if (-not (Test-Path $NssmPath)) {
        Write-Host "ERROR: No se encontro nssm.exe en '$NssmPath'." -ForegroundColor Red
        exit 1
    }
    $nssmCmd = $NssmPath
} else {
    $nssm = Get-Command nssm -ErrorAction SilentlyContinue
    if (-not $nssm) {
        Write-Host "ERROR: El comando 'nssm' no esta en el PATH. Descargalo desde" -ForegroundColor Red
        Write-Host "  https://nssm.cc/download o indica su ruta con -NssmPath." -ForegroundColor Yellow
        exit 1
    }
    $nssmCmd = $nssm.Source
}

$svc = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if (-not $svc) {
    Write-Host "El servicio '$ServiceName' no esta instalado. Nada que hacer."
    exit 0
}

Write-Host "Deteniendo el servicio '$ServiceName'..."
if ($svc.Status -ne 'Stopped') {
    Stop-Service -Name $ServiceName -Force
    Start-Sleep -Seconds 2
}

Write-Host "Eliminando el servicio '$ServiceName' con NSSM..."
& $nssmCmd remove $ServiceName confirm
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Fallo 'nssm remove' (codigo $LASTEXITCODE)." -ForegroundColor Red
    exit 1
}

Write-Host "Servicio '$ServiceName' eliminado correctamente." -ForegroundColor Green
exit 0

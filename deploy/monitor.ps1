# ============================================================
# HOSTAL COFEE - Monitor de salud y reinicio automatico
#
# Bucle infinito: consulta /api/health cada 30 segundos. Si falla
# MaxFailures veces seguidas, reinicia el servicio "HostalCofee"
# y registra todo en D:\Rest-COFEE\logs\monitor.log.
#
# Uso:
#   - Manual:       powershell -ExecutionPolicy Bypass -File deploy\monitor.ps1
#   - Programador de tareas: ejecutar como SYSTEM/Administrador para
#     poder reiniciar el servicio (Restart-Service necesita privilegios).
#     Ejemplo de argumento del programa:
#       powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File "D:\Rest-COFEE\deploy\monitor.ps1"
# ============================================================

param(
    [string]$HealthUrl = "http://localhost:3001/api/health",
    [string]$ServiceName = "HostalCofee",
    [int]$IntervalSeconds = 30,
    [int]$MaxFailures = 3
)

$ProgressPreference = 'SilentlyContinue'

$DeployDir = $PSScriptRoot
$ProjectRoot = Split-Path $DeployDir -Parent
$LogsDir = Join-Path $ProjectRoot "logs"
$LogFile = Join-Path $LogsDir "monitor.log"

if (-not (Test-Path $LogsDir)) { New-Item -ItemType Directory -Path $LogsDir | Out-Null }

function Write-MonitorLog {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    Add-Content -Path $LogFile -Value $line
}

Write-MonitorLog "Monitor iniciado (health=$HealthUrl, servicio=$ServiceName, intervalo=${IntervalSeconds}s, fallos_max=${MaxFailures})"

$failCount = 0

while ($true) {
    $ok = $false
    try {
        $resp = Invoke-RestMethod -Uri $HealthUrl -TimeoutSec 10
        if ($resp.status -eq 'ok') {
            $ok = $true
        }
    } catch {
        # Sin respuesta; se cuenta como fallo.
    }

    if ($ok) {
        if ($failCount -gt 0) {
            Write-MonitorLog "Recuperado: salud OK tras $failCount fallo(s)."
        }
        $failCount = 0
    } else {
        $failCount++
        Write-MonitorLog "Fallo $failCount/${MaxFailures}: sin respuesta en $HealthUrl"
        if ($failCount -ge $MaxFailures) {
            Write-MonitorLog "Reiniciando servicio '$ServiceName'..."
            try {
                Restart-Service -Name $ServiceName -Force
                Write-MonitorLog "Servicio '$ServiceName' reiniciado."
            } catch {
                Write-MonitorLog "ERROR: no se pudo reiniciar '$ServiceName': $($_.Exception.Message)"
            }
            $failCount = 0
        }
    }

    Start-Sleep -Seconds $IntervalSeconds
}

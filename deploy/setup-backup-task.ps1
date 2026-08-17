# ============================================================
# HOSTAL COFEE - Configurar backup automatico diario
#
# Registra una tarea en el Programador de Tareas de Windows
# que ejecuta deploy\backup-db.ps1 todos los dias a las 3:00 AM.
#
# Ejecutar una vez como Administrador:
#   powershell -ExecutionPolicy Bypass -File deploy\setup-backup-task.ps1
# ============================================================

$ErrorActionPreference = 'Stop'

$TaskName = 'HostalCofee-BackupDB'
$TaskDesc = 'Backup automatico diario de la base de datos Hostal Cofee'
$ScriptPath = Join-Path $PSScriptRoot 'backup-db.ps1'
$LogsDir = Join-Path (Split-Path $PSScriptRoot -Parent) 'logs'

if (-not (Test-Path $ScriptPath)) {
    Write-Host "ERROR: No se encontro $ScriptPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $LogsDir)) {
    New-Item -ItemType Directory -Path $LogsDir | Out-Null
}

$ExistingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($ExistingTask) {
    Write-Host "La tarea '$TaskName' ya existe. Actualizando..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

$Action = New-ScheduledTaskAction `
    -Execute 'powershell.exe' `
    -Argument "-ExecutionPolicy Bypass -File `"$ScriptPath`""

$Trigger = New-ScheduledTaskTrigger -Daily -At '03:00AM'

$Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Hours 1) `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 5)

$Principal = New-ScheduledTaskPrincipal `
    -UserId $env:USERNAME `
    -LogonType S4U `
    -RunLevel Highest

Register-ScheduledTask `
    -TaskName $TaskName `
    -Description $TaskDesc `
    -Action $Action `
    -Trigger $Trigger `
    -Settings $Settings `
    -Principal $Principal

Write-Host ""
Write-Host "Tarea programada creada exitosamente:" -ForegroundColor Green
Write-Host "  Nombre:    $TaskName"
Write-Host "  Horario:   Diario a las 3:00 AM"
Write-Host "  Script:    $ScriptPath"
Write-Host "  Retencion: 14 backups"
Write-Host ""
Write-Host "Para probarla ahora:" -ForegroundColor Yellow
Write-Host "  Start-ScheduledTask -TaskName '$TaskName'"
Write-Host ""
Write-Host "Para verificar:" -ForegroundColor Yellow
Write-Host "  Get-ScheduledTask -TaskName '$TaskName' | Format-List"

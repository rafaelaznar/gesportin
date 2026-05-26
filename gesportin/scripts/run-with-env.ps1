param(
    [string]$EnvFile = ".env.local"
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $projectRoot $EnvFile

if (-not (Test-Path $envPath)) {
    Write-Error "No existe $EnvFile. Crea ese fichero con las variables SMTP."
}

Get-Content $envPath | ForEach-Object {
    $line = $_.Trim()

    if ($line.Length -eq 0 -or $line.StartsWith("#")) {
        return
    }

    $parts = $line.Split("=", 2)
    if ($parts.Count -ne 2) {
        return
    }

    [Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), "Process")
}

Set-Location $projectRoot
mvn spring-boot:run

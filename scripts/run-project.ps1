$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$runDir = Join-Path $projectRoot ".run"
New-Item -ItemType Directory -Force $runDir | Out-Null

$backendJar = Get-ChildItem (Join-Path $projectRoot "backend\\target") -Filter "*.jar" -ErrorAction SilentlyContinue |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1 |
  ForEach-Object { $_.FullName }

$backendJarLabel = if ($backendJar) { $backendJar } else { Join-Path $projectRoot "backend\\target\\<app>.jar" }
$frontendIndex = Join-Path $projectRoot "frontend\\build\\index.html"

if (-not $backendJar -or -not (Test-Path $backendJar)) {
  Write-Host "Backend jar not found: $backendJarLabel"
  Write-Host "Build it with: cd backend; mvn -DskipTests package"
  exit 1
}

if (-not (Test-Path $frontendIndex)) {
  Write-Host "Frontend build not found: $frontendIndex"
  Write-Host "Build it with: cmd /c ""cd frontend && npm install && npm run build"""
  exit 1
}

$backendOut = Join-Path $projectRoot "backend-run.log"
$backendErr = Join-Path $projectRoot "backend-run.err"
$frontendOut = Join-Path $projectRoot "frontend-run.log"
$frontendErr = Join-Path $projectRoot "frontend-run.err"

Write-Host "Starting backend (Spring Boot jar)..."
$backend = Start-Process -FilePath "java" -ArgumentList @("-jar", "`"$backendJar`"") -WorkingDirectory $projectRoot -RedirectStandardOutput $backendOut -RedirectStandardError $backendErr -PassThru

Write-Host "Starting frontend (static server)..."
$frontendScript = Join-Path $projectRoot "scripts\\serve-frontend.js"
$frontend = Start-Process -FilePath "node" -ArgumentList @("`"$frontendScript`"", "--port", "3000") -WorkingDirectory $projectRoot -RedirectStandardOutput $frontendOut -RedirectStandardError $frontendErr -PassThru

$pids = @{
  backendPid = $backend.Id
  frontendPid = $frontend.Id
  startedAt = (Get-Date).ToString("o")
}
$pids | ConvertTo-Json | Set-Content (Join-Path $runDir "pids.json") -Encoding UTF8

Write-Host ""
Write-Host "Backend:  http://localhost:8081"
Write-Host "Frontend: http://localhost:3000"
Write-Host ""
Write-Host "Logs:"
Write-Host "  $backendOut"
Write-Host "  $backendErr"
Write-Host "  $frontendOut"
Write-Host "  $frontendErr"
Write-Host ""
Write-Host "Stop:"
Write-Host "  Stop-Process -Id $($backend.Id),$($frontend.Id) -Force"


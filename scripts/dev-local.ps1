<#
    CAST QUEST — dev-local.ps1
    Local development launcher
    ---------------------------------------
    Runs core services for local testing:
      • Web (Next.js)
      • Admin (Next.js)
      • API Gateway
#>

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "     CAST QUEST — LOCAL DEV ENVIRONMENT       " -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# ---------------------------------------------------------
# Utility: Check if command exists
# ---------------------------------------------------------
function Has-Cmd($cmd) {
    return [bool](Get-Command $cmd -ErrorAction SilentlyContinue)
}

# ---------------------------------------------------------
# 1. AUTO-DETECT REPO ROOT
# ---------------------------------------------------------
function Find-RepoRoot {
    $dir = Get-Location

    while ($dir -ne $null) {
        if (Test-Path (Join-Path $dir ".git")) {
            return $dir
        }
        $parent = Split-Path $dir -Parent
        if ($parent -eq $dir) { break }
        $dir = $parent
    }

    return $null
}

$RepoRoot = Find-RepoRoot

if (-not $RepoRoot) {
    Write-Host "ERROR: Could not locate repo root (.git folder not found)" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Repo root detected at: $RepoRoot" -ForegroundColor Green
Set-Location $RepoRoot

# ---------------------------------------------------------
# 2. Validate Node + PNPM
# ---------------------------------------------------------
Write-Host "`nChecking environment..." -ForegroundColor Yellow

if (-not (Has-Cmd "node")) {
    Write-Host "ERROR: Node.js not found. Run node-guard.ps1 first." -ForegroundColor Red
    exit 1
}

if (-not (Has-Cmd "pnpm")) {
    Write-Host "ERROR: PNPM not found. Run node-guard.ps1 first." -ForegroundColor Red
    exit 1
}

Write-Host "✓ Node: $(node -v)" -ForegroundColor Green
Write-Host "✓ PNPM: $(pnpm -v)" -ForegroundColor Green

# ---------------------------------------------------------
# 3. Launch services
# ---------------------------------------------------------
Write-Host "`nLaunching CAST QUEST services..." -ForegroundColor Yellow

# Web App
Write-Host "→ Starting Web (Next.js) on http://localhost:3000" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "cd `"$RepoRoot`"; pnpm --filter web dev"

# Admin App
Write-Host "→ Starting Admin Panel on http://localhost:3001" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "cd `"$RepoRoot`"; pnpm --filter admin dev"

# API Gateway
Write-Host "→ Starting API Gateway on http://localhost:4000" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "cd `"$RepoRoot`"; pnpm --filter api-gateway dev"

Write-Host "`n==============================================" -ForegroundColor Green
Write-Host "   CAST QUEST — DEV SERVICES ARE RUNNING       " -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

Write-Host "`nOpen your browser:" -ForegroundColor Yellow
Write-Host "  Web UI:     http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Admin UI:   http://localhost:3001" -ForegroundColor Cyan
Write-Host "  API:        http://localhost:4000" -ForegroundColor Cyan

Write-Host "`nAll services launched in separate terminals." -ForegroundColor Green
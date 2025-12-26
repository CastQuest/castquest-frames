<#
    CAST QUEST — bootstrap.ps1
    Operator-grade environment bootstrapper
    ---------------------------------------
    This script:
      • Verifies Node + PNPM
      • Installs PNPM if missing
      • Installs all workspace dependencies
      • Builds all packages + apps
      • Runs basic health checks
#>

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "   CAST QUEST — OPERATOR BOOTSTRAP SEQUENCE   " -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# -----------------------------
# 1. Verify working directory
# -----------------------------
$expected = "castquest-frames"
$current = Split-Path -Leaf (Get-Location)

if ($current -ne $expected) {
    Write-Host "ERROR: Run this script from the repo root: castquest-frames" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Working directory verified" -ForegroundColor Green

# -----------------------------
# 2. Verify Node.js
# -----------------------------
Write-Host "`nChecking Node.js..." -ForegroundColor Yellow
$node = Get-Command node -ErrorAction SilentlyContinue

if (-not $node) {
    Write-Host "ERROR: Node.js is not installed. Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

$nodeVersion = node -v
Write-Host "✓ Node.js detected: $nodeVersion" -ForegroundColor Green

# -----------------------------
# 3. Verify PNPM
# -----------------------------
Write-Host "`nChecking PNPM..." -ForegroundColor Yellow
$pnpm = Get-Command pnpm -ErrorAction SilentlyContinue

if (-not $pnpm) {
    Write-Host "PNPM not found — installing globally..." -ForegroundColor Yellow
    npm install -g pnpm
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install PNPM" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ PNPM installed" -ForegroundColor Green
} else {
    $pnpmVersion = pnpm -v
    Write-Host "✓ PNPM detected: $pnpmVersion" -ForegroundColor Green
}

# -----------------------------
# 4. Install workspace deps
# -----------------------------
Write-Host "`nInstalling workspace dependencies..." -ForegroundColor Yellow
pnpm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: pnpm install failed" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Dependencies installed" -ForegroundColor Green

# -----------------------------
# 5. Build all packages + apps
# -----------------------------
Write-Host "`nBuilding all workspaces via Turbo..." -ForegroundColor Yellow
pnpm build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Build completed successfully" -ForegroundColor Green

# -----------------------------
# 6. Health checks
# -----------------------------
Write-Host "`nRunning health checks..." -ForegroundColor Yellow

# Check required directories
$required = @(
    "apps/web",
    "apps/mobile",
    "apps/admin",
    "packages/contracts",
    "packages/sdk",
    "packages/ai-brain",
    "packages/ui-kit",
    "infra/api-gateway",
    "infra/indexer",
    "infra/workers"
)

foreach ($dir in $required) {
    if (-not (Test-Path $dir)) {
        Write-Host "ERROR: Missing directory: $dir" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✓ Directory structure verified" -ForegroundColor Green

# -----------------------------
# 7. Final banner
# -----------------------------
Write-Host "`n==============================================" -ForegroundColor Cyan
Write-Host "   CAST QUEST — BOOTSTRAP COMPLETE             " -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

Write-Host "`nYou are ready to run:" -ForegroundColor Yellow
Write-Host "  pnpm dev:web     → Web app" -ForegroundColor Green
Write-Host "  pnpm dev:mobile  → Mobile app" -ForegroundColor Green
Write-Host "  pnpm dev:admin   → Admin panel" -ForegroundColor Green
Write-Host "  pnpm dev:api     → API gateway" -ForegroundColor Green

Write-Host "`nSovereign systems online." -ForegroundColor Cyan

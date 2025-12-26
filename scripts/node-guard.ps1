<#
    CAST QUEST — node-guard.ps1
    Ensures a compatible Node + PNPM setup.
#>

Write-Host "=== CAST QUEST — NODE GUARD ===" -ForegroundColor Cyan

# 1. Check Node
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js not found. Install Node 20 LTS." -ForegroundColor Red
    exit 1
}

$nodeVersion = node -v
Write-Host "Node version: $nodeVersion" -ForegroundColor Yellow

# Require Node 18 or 20; reject 22+
if ($nodeVersion -match "^v22") {
    Write-Host "ERROR: Node 22 is not supported. Use Node 20 LTS (nvm use 20.x)." -ForegroundColor Red
    exit 1
}

# 2. Enable Corepack + PNPM
if (-not (Get-Command corepack -ErrorAction SilentlyContinue)) {
    Write-Host "Corepack not found, but Node 18+ should include it. Continuing..." -ForegroundColor Yellow
} else {
    Write-Host "Enabling Corepack..." -ForegroundColor Yellow
    corepack enable
    corepack prepare pnpm@latest --activate
}

if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: PNPM still not available after Corepack. Install manually: npm install -g pnpm" -ForegroundColor Red
    exit 1
}

Write-Host "PNPM detected: $(pnpm -v)" -ForegroundColor Green
Write-Host "Node guard OK." -ForegroundColor Green

<#
  CAST QUEST Smart Brain Operator

  - Validates repo
  - pnpm install
  - pnpm test
  - pnpm build
  - (extend with docker & k8s)
#>

function FX { param([string]$m) Write-Host "[$(Get-Date -Format ''HH:mm:ss'')] $m" -ForegroundColor Cyan }
function FX-Success { param([string]$m) Write-Host "[$(Get-Date -Format ''HH:mm:ss'')] $m" -ForegroundColor Green }
function FX-Error { param([string]$m) Write-Host "[$(Get-Date -Format ''HH:mm:ss'')] ERROR: $m" -ForegroundColor Red; exit 1 }

FX "CAST QUEST Operator starting..."

$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) { FX-Error "Not in a git repo." }

$repoName = Split-Path $repoRoot -Leaf
if ($repoName -notmatch "^castquest" -and $repoName -notmatch "^CastQuest") {
  FX-Error "This operator only runs in CastQuest repos."
}

Set-Location $repoRoot
FX-Success "Repo validated: $repoName"

FX "Installing dependencies..."
corepack enable
pnpm install || FX-Error "pnpm install failed."

FX "Running tests..."
pnpm test || FX-Error "tests failed."

FX "Building..."
pnpm build || FX-Error "build failed."

FX-Success "CAST QUEST Operator finished core pipeline."
Write-Host "Add docker & k8s steps when ready." -ForegroundColor Magenta

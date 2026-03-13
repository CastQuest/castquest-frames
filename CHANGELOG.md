# CastQuest Protocol — Changelog

## [Unreleased] — CI/CD Repair & Enterprise Readiness

### Fixed
- **CI pipeline**: Fixed `ci.yml` — removed duplicate content, now passes cleanly
- **Dependency health**: Fixed `dependency-health.yml` to prevent duplicate spam issues (check for existing open issues before creating)
- **pnpm binaries**: Added `.npmrc` with `shamefully-hoist=true` to expose `tsup`, `tsc-alias` and other dev tool binaries
- **SDK syntax error**: Removed invalid `export * from './abis'` inside a `try-catch` block in `packages/sdk/src/index.ts`
- **GlowButton**: Added `variant` and `size` props (was throwing type errors in admin app)
- **GlowCard**: Added `className` prop passthrough (was throwing type errors in admin app)
- **DashboardStat**: Added `"stable"` to trend values and `trendValue` prop
- **NeoThemeProvider**: Added `"use client"` directive (was causing SSR `useEffect` failures)
- **Web app**: Fixed unused variables in `apps/web/app/page.tsx` (lint errors)
- **Core services tests**: Fixed `media.test.ts` and `wallets.test.ts` to use correct method names and proper mock structure
- **Mobile tests**: Changed test script to skip if Jest not installed
- **Contracts tests**: Changed test script to skip if Forge not installed

### Added
- **tsconfig.base.json**: Created root base TypeScript config (referenced by packages but missing)
- **`packages/neo-ux-core/tsup.config.ts`**: Added `"use client"` banner to compiled output
- **`.env.example`**: Root + `apps/web` + `apps/admin` environment variable templates with full documentation
- **`scripts/setup-env.sh`**: Automated env setup script
- **`packages/contracts/slither.config.json`**: Slither static analysis configuration
- **`scripts/audit-contracts.sh`**: Smart contract audit automation script
- **`docs/AUDIT-REPORT-TEMPLATE.md`**: Template for security audit reports
- **`docs/CONTRACTS.md`**: Smart contract architecture documentation
- **`packages/neo-ux-core/.eslintrc.json`**: ESLint configuration for neo-ux-core

### Changed
- **README.md**: Fixed admin port inconsistency (3010 → 3001), added env setup instructions
- **docs/DEPLOYMENT.md**: Fixed admin port references (3010 → 3001)
- **pnpm workspace**: `.npmrc` now uses `shamefully-hoist=true` for reliable binary resolution



### Removed
- **Legacy packages cleanup**: Removed duplicate `packages/neo-ux` package (superseded by `neo-ux-core`)
- **Unused UI package**: Removed `packages/ui` package (not referenced anywhere)
- **Stub routes**: Removed incomplete `/frames` routes in admin app
- **Mock API**: Removed `/api/frames` mock API routes
- **Unused files**: Removed `apps/web/app/neo/theme.ts`

### Added
- **Frame templates API**: Added `/api/frame-templates` list endpoint for proper data retrieval
- **Missing dependencies**: Added `framer-motion` and `lucide-react` to apps where needed

### Changed
- **Route consolidation**: Updated `/dashboard/frames` to use `frame-templates` routes and API
- **Component imports**: Fixed `WebLayoutNEO` component to remove unused neo/theme import
- **Icon naming**: Changed `Fire` icon to `Flame` (correct lucide-react naming)
- **Type dependencies**: Fixed React types version mismatch in web app (downgraded from 19.x to 18.x)

### Fixed
- **Build issues**: Both admin and web apps now build successfully
- **Import consistency**: All imports now point to correct packages
- **Workspace configuration**: pnpm workspace correctly configured without unused packages

## v0.1.0 — MEGA Protocol Spine Release
**Date:** YYYY‑MM‑DD  
**Status:** Stable

### Added
- **Module 4 — BASE API + Mobile Admin + Strategy Dashboard**
  - `/api/base/*`
  - ShellLayout mobile admin
  - Strategy logs + dashboard

- **Module 5B — Quest Engine MEGA**
  - Quest creation, steps, rewards, progress
  - `/api/quests/*`
  - Public quest viewer

- **Module 6 — Frame Template Engine MEGA**
  - Template creation, editing, application
  - `/api/frame-templates/*`
  - Template viewer

- **Module 7 — Mint Engine + Renderer + Automation Worker MEGA**
  - Mint creation, simulation, claiming
  - Frame renderer (mock)
  - Worker run + scan
  - `/api/mints/*`, `/api/frames/render`, `/api/strategy/worker/*`

### Changed
- Unified admin navigation
- Improved mobile responsiveness
- Added JSON DB files for all modules

### Removed
- Legacy placeholder pages
- Old hot‑update artifacts

### Notes
This release establishes the **full protocol spine** and marks the transition
from prototype to sovereign automation system.
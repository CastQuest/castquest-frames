# CastQuest Protocol — Changelog

## [Unreleased] - Monorepo Cleanup

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
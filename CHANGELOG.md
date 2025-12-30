# CastQuest Protocol — Changelog

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

### `docs/modules.md`

```md
# Modules

## Module 4 — BASE API + Mobile Admin + Strategy Dashboard

- Mock BASE onchain routes:
  - `/api/base/mint`
  - `/api/base/frame`
  - `/api/base/token-info`
  - `/api/base/tx-status`
- Mobile‑friendly ShellLayout
- Strategy logs and dashboard at `/strategy`

## Module 5B — Quest Engine MEGA

- JSON:
  - `quests.json`
  - `quest-steps.json`
  - `quest-rewards.json`
  - `quest-progress.json`
- Admin:
  - `/quests`
  - `/quests/create`
  - `/quests/[id]`
- Web:
  - `/quests`
  - `/quests/[id]`
- APIs:
  - `/api/quests/create`
  - `/api/quests/add-step`
  - `/api/quests/add-reward`
  - `/api/quests/progress`
  - `/api/quests/complete`
  - `/api/quests/trigger`

## Module 6 — Frame Template Engine MEGA

- JSON:
  - `frame-templates.json`
- Admin:
  - `/frame-templates`
  - `/frame-templates/create`
  - `/frame-templates/[id]`
- Web:
  - `/frames/templates`
  - `/frames/templates/[id]`
- APIs:
  - `/api/frame-templates/create`
  - `/api/frame-templates/update`
  - `/api/frame-templates/delete`
  - `/api/frame-templates/apply`

## Module 7 — Mint + Render + Automation Worker MEGA

- JSON:
  - `mints.json`
  - `mint-events.json`
  - `frames.json`
  - `worker-events.json`
- Admin:
  - `/mints`
  - `/mints/[id]`
  - `/frames/[id]`
- APIs:
  - `/api/mints/create`
  - `/api/mints/simulate`
  - `/api/mints/claim`
  - `/api/mints/attach-to-frame`
  - `/api/mints/attach-to-quest`
  - `/api/frames/render`
  - `/api/strategy/worker/run`
  - `/api/strategy/worker/scan`
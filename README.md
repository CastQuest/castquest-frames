# CAST QUEST Frames

[![CI](https://github.com/CastQuest/castquest-frames/actions/workflows/ci.yml/badge.svg)](https://github.com/CastQuest/castquest-frames/actions/workflows/ci.yml)
[![Deploy](https://github.com/CastQuest/castquest-frames/actions/workflows/deploy.yml/badge.svg)](https://github.com/CastQuest/castquest-frames/actions/workflows/deploy.yml)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![pnpm Version](https://img.shields.io/badge/pnpm-%3E%3D9.0.0-blue)](https://pnpm.io/)

CAST QUEST Frames is a Web3-native social photo protocol that feels like Instagram, mints like Zora, extends like Farcaster Frames, and builds like Remix — powered by a Smart Brain multi-agent AI.

## ✨ Core Principles

- Chain-first: Built on Base with multi-chain EVM support
- Creator-first: Onchain minting, collecting, royalties, and programmable fees
- Builder-first: Frames, SDK, and a Remix-style module builder
- AI-native: Smart Brain agents for pricing, previews, tagging, and system optimization

## 🧱 Monorepo Structure

apps/
  web/         - Next.js app (feed, profiles, frames)
  admin/       - Next.js admin app (fees, templates, AI settings)
  mobile/      - React Native / Expo app

packages/
  contracts/   - Solidity contracts (Base + EVM)
  sdk/         - CAST QUEST SDK integration (used here)
  ai-brain/    - Multi-agent Smart Brain orchestration
  ui-kit/      - Shared UI components & design system

infra/
  api-gateway/ - API entrypoint (frames, mint, collect)
  indexer/     - Onchain event indexer
  workers/     - Background jobs (AI, notifications, analytics)
  k8s/         - Kubernetes manifests

docs/
  whitepaper/  - Vision & protocol
  architecture/- Diagrams & technical design
  sdk/         - Dev docs & examples
  product/     - User & admin guides

.github/       - CI/CD, issue templates, PR templates
scripts/       - Dev, deploy, Smart Brain operator
examples/frames/ - Example frame definitions

## 🤝 Contributing

See CONTRIBUTING.md.

## � Prerequisites

**Required:**
- **Node.js 20+** (to prevent ERR_INVALID_THIS errors)
- **pnpm 9+** (package manager)

**Install with nvm:**
```bash
nvm install 20
nvm use 20
npm install -g pnpm@9
```

**Or use the .nvmrc file:**
```bash
nvm use  # Automatically uses Node 20.19.6
```

## �💸 Sponsors & Partners

Site: https://castquest.xyz (placeholder)
Docs: https://docs.castquest.xyz (placeholder)
Sponsors: GitHub Sponsors / custom page

## 🌌 Vision

Social feeds will be onchain.
Creators will own their rails.
Builders will extend everything through Frames and SDKs.
AI will act as the invisible Smart Brain across the entire stack.


# CastQuest Protocol — Operator Console

A sovereign, media‑first automation protocol combining:

- Frame Template Engine (Module 6 MEGA)
- Quest Engine (Module 5B MEGA)
- Mint Engine + Renderer + Automation (Module 7 MEGA)
- BASE Mock Onchain Layer (Module 4 MEGA)
- Mobile‑Optimized Admin Console
- Strategy Worker + Logs Dashboard

## Contributors

- **Yosef (Founder / Protocol Architect)**  
  Vision, architecture, automation engine, operator console design.

- **SMSDAO (Core Contributor)**  
  Execution, module integration, system orchestration.

- **AI Automation Partner**  
  Script generation, module scaffolding, error‑resilient workflows.

## Modules Installed

### Module 4 — BASE API + Mobile Admin + Strategy Dashboard
- `/api/base/*`
- `/strategy`
- ShellLayout mobile UI

### Module 5B — Quest Engine MEGA
- `/quests`
- `/api/quests/*`
- `data/quests.json`, `quest-steps.json`, `quest-progress.json`, `quest-rewards.json`

### Module 6 — Frame Template Engine MEGA
- `/frame-templates`
- `/api/frame-templates/*`
- `data/frame-templates.json`

### Module 7 — Mint + Render + Automation MEGA
- `/mints`
- `/api/mints/*`
- `/api/frames/render`
- `/api/strategy/worker/*`
- `data/mints.json`, `mint-events.json`, `frames.json`, `worker-events.json`

## Vision

CastQuest is a sovereign automation protocol that turns:

**Media → Templates → Frames → Mints → Quests → Strategy → Onchain**

into a single expressive pipeline.

You are early.

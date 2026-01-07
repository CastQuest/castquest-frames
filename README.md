# CAST QUEST Frames

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

## 📦 Prerequisites

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

## 🎨 Dashboards

CastQuest Frames includes two production-ready dashboards with **neo-glow theme** for creators and administrators.

### 👤 User Dashboard
**Port:** 3000 | **URL:** http://localhost:3000/dashboard

A creator-focused dashboard with AI tools and community features:
- ✨ **AI Frame Builder** - Generate frames with natural language
- 📊 **Analytics** - Track views, engagement, and revenue
- 🏪 **Marketplace** - Browse and purchase frame templates
- 💬 **Community Hub** - Social feed with interactions
- 🎯 **Frame Management** - Create and monitor frames
- 🏆 **Leaderboard** - Global rankings and achievements
- ⚡ **Quest System** - Daily/weekly challenges
- 💎 **NFT Mints** - Manage collectible mints

```bash
# Start user dashboard
cd apps/web && pnpm dev
# Access: http://localhost:3000/dashboard
```

### 👑 Admin Dashboard
**Port:** 3010 | **URL:** http://localhost:3010/dashboard

A protocol management console with comprehensive monitoring:
- 💎 **Token Management** - Monitor $CAST, $PIC, $VID, $AUDIO
- 🔐 **Permission System** - Role-based access control
- 💰 **Fee Controls** - Adjustable protocol fees
- 🛡️ **Risk Management** - AI-powered detection (98% accuracy)
- 📊 **Protocol Metrics** - TVL, volume, active users
- 📡 **System Health** - Real-time monitoring
- 🖼️ **Frame Monitoring** - Track all frame activity
- 📋 **Activity Logs** - Complete audit trail

```bash
# Start admin dashboard
cd apps/admin && pnpm dev -- -p 3010
# Access: http://localhost:3010/dashboard
```

### 🚀 Quick Start - Both Dashboards

```bash
# Install dependencies
pnpm install

# Run both dashboards using self-healing script (recommended)
chmod +x scripts/self-healing-ui.sh
./scripts/self-healing-ui.sh

# Or run manually in separate terminals:
# Terminal 1: User Dashboard
cd apps/web && pnpm dev

# Terminal 2: Admin Dashboard  
cd apps/admin && pnpm dev -- -p 3010
```

📖 **Full Documentation:** See [docs/DASHBOARDS.md](./docs/DASHBOARDS.md) for complete setup, configuration, deployment, and troubleshooting guides.

## 💸 Sponsors & Partners

Site: https://castquest.xyz (placeholder)
Docs: https://docs.castquest.xyz (placeholder)
Sponsors: GitHub Sponsors / custom page

## 🌌 Vision

Social feeds will be onchain.
Creators will own their rails.
Builders will extend everything through Frames and SDKs.
AI will act as the invisible Smart Brain across the entire stack.

# CAST QUEST Frames

![Dependency Health](https://img.shields.io/badge/dependency--health-passing-brightgreen)
![Build Status](https://github.com/CastQuest/castquest-frames/workflows/CI/badge.svg)
![Node Version](https://img.shields.io/badge/node-20.19.6-green)
![pnpm Version](https://img.shields.io/badge/pnpm-9.0.0-blue)

CAST QUEST Frames is a Web3-native social photo protocol that feels like Instagram, mints like Zora, extends like Farcaster Frames, and builds like Remix — powered by a Smart Brain multi-agent AI.

## ✨ Core Principles

- Chain-first: Built on Base with multi-chain EVM support
- Creator-first: Onchain minting, collecting, royalties, and programmable fees
- Builder-first: Frames, SDK, and a Remix-style module builder
- AI-native: Smart Brain agents for pricing, previews, tagging, and system optimization

## 🚀 Quick Start

### Prerequisites

**Required:**
- **Node.js 20+** (to prevent ERR_INVALID_THIS errors)
- **pnpm 9+** (package manager)
- **PostgreSQL 14+** (for database)

**Install with nvm:**
```bash
nvm install 20
nvm use 20
npm install -g pnpm@9
```

### Installation

```bash
# Clone the repository
git clone https://github.com/CastQuest/castquest-frames.git
cd castquest-frames

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Initialize database
pnpm db:push

# Start development
pnpm dev
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/castquest"

# Auth.js
NEXTAUTH_SECRET="your-secret-key"  # Generate: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Web3
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your-project-id"
NEXT_PUBLIC_ALCHEMY_ID="your-alchemy-key"

# Contract Deployment (Admin only)
ADMIN_PRIVATE_KEY="your-deployer-private-key"

# AI Agents
OPENAI_API_KEY="sk-your-api-key"

# Feature Flags
NEXT_PUBLIC_WEB3_ENABLED="true"
NEXT_PUBLIC_AGENTS_ENABLED="true"
```

### Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Run migrations (production)
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio
```

## 🧱 Monorepo Structure

```
apps/
  web/         - Next.js 15 user app (feed, profiles, frames)
  admin/       - Next.js 15 admin app (fees, templates, AI settings)
  mobile/      - React Native / Expo app (future)

packages/
  contracts/   - Solidity contracts (Base + EVM, Foundry)
  sdk/         - CAST QUEST SDK integration
  neo-ux-core/ - Shared UI components & Neon Glass design system
  ai-brain/    - Multi-agent Smart Brain orchestration
  core-services/- Backend services and database layer
  frames/      - Farcaster Frame protocol support
  strategy-worker/ - Background job processing

prisma/
  schema.prisma - Database schema (Users, Roles, Permissions, Feature Flags, Agents, Contracts)

scripts/       - Development and deployment automation
docs/          - Documentation, whitepapers, technical guides
examples/      - Example frame definitions and usage
```

## 🎨 Dashboards

### 👤 User Dashboard (Port 3000)

```bash
cd apps/web && pnpm dev
# Access: http://localhost:3000
```

Features:
- ✨ AI Frame Builder
- 📊 Analytics & Metrics
- 🏪 Frame Marketplace
- 💬 Community Hub
- 🎯 Frame Management
- ⚡ Quest System
- 💎 NFT Mints

### 👑 Admin Dashboard (Port 3001)

```bash
cd apps/admin && pnpm dev
# Access: http://localhost:3001
```

Features:
- 🔐 User & Role Management
- 🚩 Feature Flags Control
- 📜 Contract Deployment
- 🤖 Agent Configuration
- 📊 System Monitoring
- 🛡️ RBAC Permissions

## 🔐 Authentication

CastQuest uses **Auth.js (NextAuth v5)** for authentication:

- Credentials-based login (email/password)
- JWT session strategy
- Role-based access control (RBAC)
- Protected routes via middleware

### User Roles

| Role | Access |
|------|--------|
| ADMIN | Full system access, user management, deployments |
| OPERATOR | Manage quests, frames, run agents |
| CREATOR | Create content, manage own frames |
| VIEWER | Read-only access |

## 🌐 Web3 Integration

- **RainbowKit** for wallet connection
- **Wagmi** for Ethereum interactions
- **viem** for low-level blockchain operations

### Supported Chains

- Ethereum Mainnet (1)
- Base (8453) ← Primary
- Optimism (10)
- Arbitrum (42161)
- Polygon (137)
- Base Sepolia (84532) ← Testnet
- Sepolia (11155111) ← Testnet

## 🤖 Smart Brain Agents

AI-powered automation agents:

| Agent | Function |
|-------|----------|
| FramePricingAgent | Market analysis, pricing recommendations |
| ContentModerationAgent | Content scanning, policy enforcement |
| QuestCompletionAgent | Quest validation, reward distribution |
| SmartBrainOrchestrator | Agent coordination, workflow optimization |

## 📜 Smart Contract Deployment

Deploy contracts directly from the Admin dashboard:

1. Navigate to `/admin/contracts`
2. Enter Solidity source code or paste pre-compiled bytecode
3. Select target chain
4. Deploy with one click

Supports verification on Etherscan/Basescan.

## 🏥 Health Monitoring

```bash
# Run comprehensive health check
bash scripts/master.sh health

# Run automated repair
bash scripts/repair-dependencies.sh

# AI-powered insights
.smartbrain/oracle.sh analyze
```

## 📝 Available Scripts

```bash
# Development
pnpm dev          # Start web app
pnpm dev:admin    # Start admin app
pnpm dev:all      # Start both apps

# Building
pnpm build        # Build all packages
pnpm lint         # Run linters
pnpm typecheck    # Type checking

# Database
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema to DB
pnpm db:migrate   # Run migrations
pnpm db:studio    # Open Prisma Studio
```

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## 📖 Documentation

- [Architecture Overview](./docs/architecture/)
- [SDK Documentation](./docs/sdk/)
- [API Reference](./docs/api/)
- [Dashboard Guide](./docs/DASHBOARDS.md)
- [Dependency Health](./docs/DEPENDENCY-HEALTH.md)

## 💸 Sponsors & Partners

- Site: https://castquest.xyz
- Docs: https://docs.castquest.xyz

## 🌌 Vision

Social feeds will be onchain.
Creators will own their rails.
Builders will extend everything through Frames and SDKs.
AI will act as the invisible Smart Brain across the entire stack.

**Media → Templates → Frames → Mints → Quests → Strategy → Onchain**

You are early.

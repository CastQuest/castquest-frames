# CastQuest Platform - Complete System Documentation

## 🏗️ Architecture Overview

CastQuest is a decentralized media tokenization platform built on Base, consisting of multiple integrated layers:

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND LAYER                           │
│  • apps/web - Main web application (Next.js)                │
│  • apps/admin - Admin dashboard (Next.js)                   │
│  • Farcaster Frames - Social media integration              │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                  SDK & API LAYER                             │
│  • @castquest/sdk - TypeScript SDK                          │
│  • @castquest/core-services - REST API (39 endpoints)      │
│    - Users & Auth (JWT)                                     │
│    - Wallet Management (EVM)                                │
│    - Media Registry Mirror                                  │
│    - Market Data & Signals                                  │
│    - Risk & Abuse Control                                   │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│               BLOCKCHAIN LAYER                               │
│  • @castquest/contracts - Solidity smart contracts         │
│    - CASTToken (ERC-20)                                     │
│    - MediaTokenFactory                                      │
│    - MediaRegistry                                          │
│    - MediaMarket (AMM)                                      │
│    - FeeRouter                                              │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│            INTELLIGENT LAYER                                 │
│  • @castquest/ai-brain - Risk detection & content moderation│
│  • @castquest/strategy-worker - Autonomous operations      │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Package Structure

### **Core Packages**

#### **@castquest/core-services**

Backend API layer - **100% Complete**

- **Location**: `packages/core-services/`
- **Port**: 4000
- **Technology**: Node.js + Express + TypeScript + Drizzle ORM
- **Database**: PostgreSQL
- **Status**: Production Ready ✅

**Features**:

- 39 REST API endpoints (15 public, 20 auth, 4 admin)
- 5 service modules (Users, Wallets, Media, Markets, Risk)
- JWT authentication + admin API keys
- Rate limiting (100 req/15min)
- Database migrations with Drizzle
- Comprehensive test suite (Vitest)
- Full API documentation

**Commands**:

```bash
./scripts/master.sh services start         # Start API server
./scripts/master.sh services health        # Check all 5 modules
./scripts/master.sh services db:migrate    # Run migrations
./scripts/master.sh services db:seed       # Seed test data
./scripts/master.sh services api:test      # Test endpoints
./scripts/master.sh services full-check    # Complete validation
```

#### **@castquest/contracts**

Smart contracts layer - **100% Complete**

- **Location**: `packages/contracts/`
- **Technology**: Solidity 0.8.23 + Foundry
- **Network**: Base (Mainnet & Sepolia)
- **Status**: Production Ready ✅

**Contracts** (8 files, 804 lines):

- `CASTToken.sol` - Main protocol token (100M max supply)
- `MediaToken.sol` - Per-media ERC-20 tokens
- `MediaTokenFactory.sol` - Token creation with fees
- `MediaRegistry.sol` - Media tracking & risk flags
- `MediaMarket.sol` - Constant product AMM
- `FeeRouter.sol` - Protocol fee distribution
- `Errors.sol` - Custom error library
- `CastQuestRegistry.sol` - Core registry

**Test Suite** (4 files, ~450 lines):

- CASTToken.t.sol - Token operations
- MediaTokenFactory.t.sol - Factory creation
- MediaMarket.t.sol - Trading & liquidity
- MediaRegistry.t.sol - Registry operations

**Commands**:

```bash
./scripts/master.sh contracts status       # Check structure
./scripts/master.sh contracts build        # Compile with Foundry
./scripts/master.sh contracts test         # Run tests
./scripts/master.sh contracts coverage     # Test coverage
./scripts/master.sh contracts gas          # Gas analysis
```

#### **@castquest/sdk**

TypeScript SDK for platform integration

- **Location**: `packages/sdk/`
- **Status**: In Development 🚧
- Consumes `@castquest/core-services` types
- Type-safe API client
- Wallet connection utilities

#### **@castquest/ai-brain**

AI-powered risk detection

- **Location**: `packages/ai-brain/`
- **Status**: In Development 🚧
- Content moderation
- Risk scoring
- Spam detection

#### **@castquest/strategy-worker**

Autonomous operation system

- **Location**: `packages/strategy-worker/`
- **Status**: Active ⚡
- Background job processing
- Event listening
- Data synchronization

### **Frontend Applications**

#### **apps/web**

Main web application

- **Technology**: Next.js 14 + React
- **Port**: 3000
- **Status**: In Development 🚧

#### **apps/admin**

Admin dashboard

- **Technology**: Next.js 14 + React
- **Port**: 3001
- **Status**: In Development 🚧

### **UI Packages**

#### **@castquest/neo-ux**

Modern component library

- **Location**: `packages/neo-ux/`
- **Technology**: React + TailwindCSS
- **Features**: Glow effects, animations, dark mode

#### **@castquest/neo-ux-core**

Core UI primitives

- **Location**: `packages/neo-ux-core/`
- **Technology**: React + Radix UI

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 14+
- Foundry (for contracts)

### Installation

```bash
# Clone repository
git clone https://github.com/CastQuest/castquest-frames.git
cd castquest-frames

# Install dependencies
pnpm install

# Set up environment
cp packages/core-services/.env.example packages/core-services/.env
# Edit .env with your configuration

# Run database migrations
./scripts/master.sh services db:migrate

# Seed test data (optional)
./scripts/master.sh services db:seed
```

### Development

```bash
# Start Core Services API
./scripts/master.sh services start
# API available at http://localhost:4000

# Start web app (in another terminal)
cd apps/web
pnpm dev
# App available at http://localhost:3000

# Start admin dashboard
cd apps/admin
pnpm dev
# Admin available at http://localhost:3001
```

### Testing

```bash
# Test Core Services
./scripts/master.sh services test

# Test Smart Contracts
./scripts/master.sh contracts test

# Run all tests
pnpm test
```

## 📡 API Endpoints

### Core Services (Port 4000)

**Health Check**

```bash
GET /health
```

**Users & Auth**

```bash
POST   /api/v1/users/register       # Register new user
POST   /api/v1/users/login          # Login (returns JWT)
POST   /api/v1/users/verify-email   # Verify email
GET    /api/v1/users/profile        # Get profile (auth required)
PATCH  /api/v1/users/profile        # Update profile (auth required)
```

**Wallets**

```bash
POST   /api/v1/wallets              # Add wallet (auth required)
GET    /api/v1/wallets              # List wallets (auth required)
DELETE /api/v1/wallets/:id          # Remove wallet (auth required)
```

**Media**

```bash
GET    /api/v1/media                # Search media (public)
GET    /api/v1/media/:id            # Get details (public)
GET    /api/v1/media/by-address/:addr  # By token address
GET    /api/v1/media/by-owner/:owner   # By owner address
```

**Markets**

```bash
GET    /api/v1/markets/signals      # Timeline indicators (public)
GET    /api/v1/markets/prices       # Current prices (public)
GET    /api/v1/markets/volume       # 24h volume (public)
GET    /api/v1/markets/:tokenAddr   # Market data (public)
```

**Admin** (API key required)

```bash
GET    /api/v1/admin/stats          # Platform statistics
GET    /api/v1/admin/risk-view      # Flagged content
POST   /api/v1/admin/risk-flags     # Update flags
GET    /api/v1/admin/audit-logs     # Audit trail
```

Full API documentation: [packages/core-services/docs/API.md](../packages/core-services/docs/API.md)

## 🔐 Security

### Authentication

- JWT tokens (7-day expiry)
- Secure password hashing (bcrypt)
- Email verification required
- Admin API key authentication

### Rate Limiting

- 100 requests per 15 minutes per IP
- Configurable per endpoint
- Bypass for authenticated admin

### Security Headers

- Helmet.js for HTTP security
- CORS configuration
- XSS protection
- SQL injection prevention (Drizzle ORM)

## 🗄️ Database Schema

### Core Services Database (PostgreSQL)

**users**

- User accounts with email authentication
- Status tracking (pending, active, suspended, banned)

**verification_tokens**

- Email verification tokens
- Password reset tokens

**wallets**

- EVM address mappings
- Support for EOA, smart wallets, multisig

**media_metadata**

- Offchain mirror of blockchain registry
- Risk flags (SPAM, NSFW, SCAM, BLOCKED)
- Cached market data

**market_snapshots**

- Price history
- Volume tracking
- Holder counts

**audit_logs**

- Admin action tracking
- User activity logs

## 🛠️ Development Tools

### Master Orchestrator

The `scripts/master.sh` is the central command hub:

```bash
# System health & healing
./scripts/master.sh health          # Check all systems
./scripts/master.sh heal            # Self-healing protocols
./scripts/master.sh integrity       # Protocol integrity check

# Core Services
./scripts/master.sh services start
./scripts/master.sh services health
./scripts/master.sh services test
./scripts/master.sh services db:migrate

# Smart Contracts
./scripts/master.sh contracts build
./scripts/master.sh contracts test
./scripts/master.sh contracts deploy

# Workers
./scripts/master.sh workers start
./scripts/master.sh workers status

# Deployment
./scripts/master.sh deploy production
./scripts/master.sh monitor
```

### Smart Brain

Automated validation and deployment:

```bash
# Run Smart Brain analysis
.smartbrain/brain.sh auto

# Features:
# - Architecture safety validation
# - Security scanning
# - Protocol integrity checks
# - Automated git tagging
# - Deployment orchestration
```

## 📚 Documentation

- **Core Services**: [packages/core-services/README.md](../packages/core-services/README.md)
- **API Reference**: [packages/core-services/docs/API.md](../packages/core-services/docs/API.md)
- **Architecture**: [packages/core-services/docs/ARCHITECTURE.md](../packages/core-services/docs/ARCHITECTURE.md)
- **Contracts**: [packages/contracts/README.md](../packages/contracts/README.md)
- **Contributing**: [CONTRIBUTING.md](../CONTRIBUTING.md)

## 🧪 Testing Strategy

### Unit Tests

- Core Services: Vitest with mocked database
- Contracts: Foundry with comprehensive scenarios
- Coverage target: 80%+

### Integration Tests

- API endpoint testing
- Contract deployment flows
- End-to-end user journeys

### Performance Tests

- Load testing for APIs
- Gas optimization for contracts
- Database query optimization

## 🚢 Deployment

### Development

```bash
./scripts/master.sh deploy development
```

### Production

```bash
# Full deployment with all checks
./scripts/master.sh deploy production

# Manual steps:
# 1. Update environment variables
# 2. Run database migrations
# 3. Deploy contracts to Base mainnet
# 4. Start Core Services
# 5. Deploy frontend apps
# 6. Start workers
```

### Monitoring

```bash
./scripts/master.sh monitor
```

## 📊 Current Status

| Package         | Status              | Completion | Tests              |
| --------------- | ------------------- | ---------- | ------------------ |
| core-services   | ✅ Production Ready | 100%       | 3 suites, passing  |
| contracts       | ✅ Production Ready | 100%       | 4 suites, 36 tests |
| sdk             | 🚧 In Development   | 40%        | -                  |
| ai-brain        | 🚧 In Development   | 30%        | -                  |
| strategy-worker | ⚡ Active           | 60%        | -                  |
| apps/web        | 🚧 In Development   | 50%        | -                  |
| apps/admin      | 🚧 In Development   | 45%        | -                  |
| neo-ux          | ✅ Stable           | 85%        | -                  |
| neo-ux-core     | ✅ Stable           | 90%        | -                  |

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for development workflow and guidelines.

## 📝 License

MIT License - see [LICENSE](../LICENSE)

## 🔗 Links

- **Website**: https://castquest.xyz (coming soon)
- **GitHub**: https://github.com/CastQuest/castquest-frames
- **Base Network**: https://base.org

---

**Built with ❤️ by the CastQuest team**

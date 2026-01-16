# CastQuest V3 Architecture

## 7-Layer Stack

![V3 Architecture](/v3-architecture.svg)

### Layer 1: Interface Layer

**Web App** (`apps/web`) — Next.js with User/Admin/Dev dashboards  
**L3 UIs** — Creator-specific chain interfaces  
**Bots** — Farcaster, Reddit, X, Discord, Telegram

The interface layer provides multiple entry points for different user types and platforms. The web app serves as the primary interface with three distinct dashboard experiences.

### Layer 2: AI Builder Layer

**Code Builder** — AI-generated code modules  
**Frame Builder** — Farcaster frame creation + cloners  
**Game Builder** — AI game generation  
**UI Builder** (V3 NEW) — AI-generated UI/UX system

Builders enable creators to generate content and functionality without deep technical knowledge. The new UI Builder allows dynamic dashboard creation.

### Layer 3: Agent Layer

11 specialized agents working autonomously:

- **CreationAgent** — Mint and asset creation
- **FrameAgent** — Farcaster frame automation
- **GameAgent** — Game logic generation
- **PricingAgent** — Dynamic pricing optimization
- **AuctionAgent** — Auction management
- **CurationAgent** — Content curation and quality
- **FraudAgent** — Fraud detection and prevention
- **SyncAgent** — Cross-chain synchronization
- **UiAgent** (V3) — UI/UX generation
- **PortfolioAgent** (V3) — Portfolio optimization
- **SocialAutomationAgent** (V3) — Social media automation

### Layer 4: Protocol Layer

**6 Core Tokens**: 
- CAST (governance)
- QUEST (fees+buybacks)
- MEDIA (media assets)
- FRAM (frames)
- GAME (games)
- CODE (code modules)

**Core Contracts**: 
- UserProfile.sol (MC calculation)
- SubDAOFactory.sol (SubDAO creation)
- BuybackRouter.sol (token buybacks)
- AIDaoConstitution.sol (V3 governance)

### Layer 5: Multi-Chain + L3 Layer

**Base** (primary L2) — Main deployment chain  
**Other L2s** — Optimism, Arbitrum, etc.  
**Solana** — High-throughput chain support  
**Creator L3s** — RollupFactory, L3Bridge for creator-specific chains

### Layer 6: Marketplace Layer

**Global Marketplace** (PR#58) — Cross-chain asset trading  
**L3 Marketplace** — Creator-specific marketplaces  
**Solana Marketplace** — High-speed trading  
**Sponsor Marketplace** (V3) — Sponsorship trading and discovery

### Layer 7: Governance + Treasury Layer

**GovernanceV2.sol** (CAST voting) — Token-based governance  
**AIDaoConstitution.sol** (V3) — AI-assisted governance  
**Autonomous Treasury** (V3) — Yield optimization with sponsor participation

## V1 → V2 → V3 Migration

| Feature | V1 | V2 | V3 |
|---------|----|----|---- |
| Chains | Base only | Base + L2s + Solana | + Creator L3s |
| Tokens | MEDIA | + FRAM, GAME, CODE | + SponsorToken |
| Agents | 0 | 8 | 11 |
| UI | Basic | Manual | AI-generated |
| Treasury | Manual | Basic DAO | Autonomous + yield |
| Governance | Simple voting | DAO + SubDAOs | AI DAO Constitution |
| Marketplace | Single chain | Multi-chain | Global + Sponsor |

## Data Flow

```
User → Interface Layer → Builder Layer → Agent Layer → Protocol Layer → Chain Layer
         ↓                    ↓               ↓              ↓               ↓
    Dashboards           Automation      Processing      Smart Contracts   Settlement
```

## Key Architectural Principles

### Modularity

Each layer is independent and can be upgraded without affecting others. This allows for rapid iteration and experimentation.

### Composability

Components across layers can be combined in novel ways. Builders use agents, agents use protocol contracts, and everything is accessible via the interface layer.

### Decentralization

No single point of failure. Multi-chain deployment ensures resilience. L3s provide creator sovereignty.

### AI-Native

AI agents are first-class citizens in the architecture. They operate autonomously within defined boundaries and contribute to protocol evolution.

### Transparency

All operations are on-chain and auditable. The Smart Brain system provides real-time analytics and insights.

## Security Model

### Permission Boundaries

Each agent has specific permissions enforced by the AIDaoConstitution.sol contract. Agents cannot exceed their authorized scope.

### Multi-Sig Governance

Critical operations require multi-sig approval. The governance layer provides checks and balances.

### Timelock Execution

Major changes are subject to timelocks, giving stakeholders time to review and potentially veto changes.

### Emergency Pause

Governance can pause protocol operations in case of discovered vulnerabilities.

## Performance Characteristics

### Throughput

- **Base L2**: ~2000 TPS
- **Creator L3s**: ~10000 TPS per L3
- **Solana**: ~65000 TPS

### Latency

- **Web Interface**: <100ms response time
- **Agent Processing**: <1s for most operations
- **Cross-chain Operations**: 5-30 minutes depending on chains

### Scalability

The L3 architecture allows infinite horizontal scaling. Each creator can deploy their own L3 with dedicated throughput.

## Further Reading

- [Protocol Constitution](/v3/protocol/constitution.md)
- [AI DAO Constitution](/v3/protocol/ai-dao-constitution.md)
- [Agent Overview](/v3/agents/overview.md)
- [Tokenomics](/v3/overview/tokenomics.md)

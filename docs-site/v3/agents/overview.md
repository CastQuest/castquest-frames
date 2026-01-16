# CastQuest V3 Agents Overview

## Introduction

CastQuest V3 employs **11 specialized AI agents** that operate autonomously within defined permission boundaries to enhance protocol functionality, optimize operations, and provide intelligence to human decision-makers.

## Agent Architecture

All agents follow a common architecture:

- **Event-driven**: Respond to on-chain and off-chain events
- **Permission-scoped**: Operate within defined boundaries (enforced by AIDaoConstitution.sol)
- **Logged**: All actions recorded on-chain for transparency
- **Auditable**: Performance metrics tracked and publicly available
- **Revocable**: Governance can disable agents at any time

## The 11 Agents

### 1. CreationAgent

**Purpose**: Automate asset creation and minting

**Capabilities**:
- Generate media assets from prompts
- Mint MEDIA, FRAM, GAME, and CODE tokens
- Apply metadata and provenance
- Batch operations for efficiency

**Permissions**:
- Read: Creator profiles, marketplace data
- Write: Mint transactions, metadata updates
- Assets: None (cannot modify existing assets)

**Example Use Case**:
```
Creator prompt: "Sci-fi landscape, purple nebula, 4K"
→ CreationAgent generates image
→ Mints as MEDIA token
→ Assigns metadata and royalties
→ Lists on marketplace (if requested)
```

### 2. FrameAgent

**Purpose**: Farcaster frame automation and optimization

**Capabilities**:
- Create frames from templates
- Clone and customize existing frames
- Optimize frame performance
- A/B test frame variants

**Permissions**:
- Read: Frame data, interaction metrics
- Write: Frame creation, template modifications
- Assets: None

**Example Use Case**:
```
Creator: "Clone top-performing minting frame"
→ FrameAgent identifies best frame
→ Clones with creator branding
→ Deploys and monitors performance
→ Suggests optimizations
```

### 3. GameAgent

**Purpose**: Game generation and economy management

**Capabilities**:
- Generate simple games from descriptions
- Create game economies and token flows
- Balance gameplay mechanics
- Integrate with existing games

**Permissions**:
- Read: Game data, player metrics
- Write: Game creation, economy parameters
- Assets: None

**Example Use Case**:
```
Creator: "Trivia game about blockchain"
→ GameAgent generates questions and mechanics
→ Creates reward token economy
→ Mints GAME token with rules
→ Deploys playable instance
```

### 4. PricingAgent (V2/V3)

**Purpose**: Dynamic pricing optimization

**Capabilities**:
- Calculate optimal pricing for assets
- Adjust based on demand and market conditions
- Prevent price manipulation
- Suggest floor prices and auctions

**Permissions**:
- Read: Market data, historical sales
- Write: Pricing recommendations
- Governance: Advisory voting on fee structures
- Assets: None

**Example Use Case**:
```
New MEDIA mint about to launch
→ PricingAgent analyzes similar assets
→ Considers creator reputation
→ Factors in market conditions
→ Recommends: 0.05 ETH initial price
```

### 5. AuctionAgent (V2/V3)

**Purpose**: Auction creation and management

**Capabilities**:
- Create auctions (English, Dutch, sealed-bid)
- Manage bidding process
- Execute settlement automatically
- Detect and prevent bid manipulation

**Permissions**:
- Read: Asset data, bidder profiles
- Write: Auction creation and management
- Assets: Escrow only (temporary custody during auction)

**Example Use Case**:
```
Creator: "Auction rare MEDIA token"
→ AuctionAgent suggests Dutch auction
→ Sets starting and ending prices
→ Monitors bids in real-time
→ Executes settlement automatically
```

### 6. CurationAgent (V2/V3)

**Purpose**: Content curation and quality control

**Capabilities**:
- Score content quality
- Identify trending assets
- Recommend featured content
- Flag low-quality or inappropriate content

**Permissions**:
- Read: All content and engagement metrics
- Write: Curation scores and recommendations
- Governance: Advisory on content policies
- Assets: None

**Example Use Case**:
```
New MEDIA token minted
→ CurationAgent analyzes quality
→ Checks for duplicates or violations
→ Assigns quality score (0-100)
→ If score >80, recommend for featured page
```

### 7. FraudAgent (V2/V3)

**Purpose**: Fraud detection and prevention

**Capabilities**:
- Detect wash trading
- Identify fake engagement
- Flag suspicious patterns
- Prevent sybil attacks

**Permissions**:
- Read: All transactions and interactions
- Write: Fraud flags and alerts
- Governance: Advisory on security policies
- Assets: None (can freeze suspected accounts for governance review)

**Example Use Case**:
```
Suspicious trading pattern detected
→ FraudAgent analyzes transaction graph
→ Identifies coordinated wash trading
→ Flags accounts for review
→ Alerts governance for decision
```

### 8. SyncAgent (V2/V3)

**Purpose**: Cross-chain synchronization

**Capabilities**:
- Bridge assets between chains
- Verify cross-chain balances
- Reconcile discrepancies
- Monitor bridge health

**Permissions**:
- Read: Balances on all supported chains
- Write: Bridge transactions, balance updates
- Assets: None (uses secure bridge contracts)

**Example Use Case**:
```
User bridges MEDIA from Base to Arbitrum
→ SyncAgent verifies source balance
→ Initiates bridge transaction
→ Monitors finality on both chains
→ Updates unified balance tracker
```

### 9. UiAgent (V3 NEW)

**Purpose**: AI-generated UI/UX creation

**Capabilities**:
- Generate dashboard layouts
- Create custom components
- Optimize user flows
- A/B test interface variants

**Permissions**:
- Read: User preferences, usage patterns
- Write: UI component generation
- Assets: None

**Example Use Case**:
```
New creator onboards
→ UiAgent analyzes creator profile
→ Generates personalized dashboard
→ Includes relevant metrics and tools
→ Adapts based on usage patterns
```

### 10. PortfolioAgent (V3 NEW)

**Purpose**: Portfolio optimization and MC analysis

**Capabilities**:
- Calculate user and protocol MC
- Recommend portfolio rebalancing
- Analyze risk exposure
- Generate yield projections

**Permissions**:
- Read: All portfolio and market data
- Write: None (recommendations only)
- Governance: Advisory on treasury strategies
- Assets: None

**Example Use Case**:
```
User requests portfolio analysis
→ PortfolioAgent calculates current MC
→ Analyzes risk distribution
→ Suggests rebalancing: "Sell 20% FRAM, buy MEDIA"
→ Projects expected returns
```

### 11. SocialAutomationAgent (V3 NEW)

**Purpose**: Social media automation and engagement

**Capabilities**:
- Post content to Farcaster, Twitter, etc.
- Schedule posts for optimal engagement
- Generate captions and hashtags
- Monitor engagement metrics

**Permissions**:
- Read: Creator content and metrics
- Write: Social media posts (with creator approval)
- Assets: None

**Example Use Case**:
```
New MEDIA token minted
→ SocialAutomationAgent generates post
→ "Just minted new artwork! Check it out 🎨"
→ Adds relevant hashtags
→ Schedules for peak engagement time
→ Posts to configured platforms
```

## Agent Coordination

Agents coordinate on complex tasks through the AI DAO:

**Example: New Creator Onboarding**
```
1. CreationAgent: Helps mint first assets
2. PricingAgent: Recommends initial pricing
3. UiAgent: Creates personalized dashboard
4. SocialAutomationAgent: Announces launch
5. CurationAgent: Features on homepage (if quality threshold met)
```

**Example: Fraud Detection + Resolution**
```
1. FraudAgent: Detects suspicious activity
2. PortfolioAgent: Analyzes financial impact
3. AI DAO: Generates comprehensive report
4. Governance: Reviews and votes on action
5. Execution: Approved action taken automatically
```

## Performance Metrics

All agents track performance:

- **Uptime**: Percentage of time operational
- **Latency**: Average response time
- **Accuracy**: Correct decisions / total decisions
- **Impact**: Value created or protected
- **Cost**: Gas consumption and operational costs

Metrics are publicly available on the [Agent Dashboard](https://app.castquest.xyz/agents).

## Agent Governance

### Enabling/Disabling Agents

Governance can:
- Enable new agents
- Disable existing agents
- Modify agent permissions
- Adjust agent parameters

Via standard governance proposals.

### Emergency Shutdown

Multi-sig can emergency shutdown agents:
- Requires 4/7 signers
- Immediate effect
- Governance review within 24 hours
- Resume via governance vote

### Agent Upgrades

Agent code and models can be upgraded:
- Proposal with detailed changes
- AI DAO impact analysis
- Governance approval (>66%)
- Timelock execution (7 days)

## Future Agents

Potential future agents under consideration:

- **LegalAgent**: Compliance and regulatory monitoring
- **DataAgent**: Advanced analytics and insights
- **CommunityAgent**: Discord and forum moderation
- **TranslationAgent**: Multi-language support
- **VideoAgent**: Video content generation

Community can propose new agents via governance.

## Technical Implementation

**Agent Runtime**: `packages/ai-brain/`  
**Permissions Contract**: `packages/contracts/governance/AIDaoConstitution.sol`  
**Coordination System**: Event-driven architecture with message queues

## Further Reading

- [AI DAO Constitution](/v3/protocol/ai-dao-constitution.md)
- [Agent API Documentation](/api/endpoints/brain.md)
- [Smart Brain Architecture](/architecture/smart-brain.md)
- [Agent Dashboard](https://app.castquest.xyz/agents)

---

**Version**: 3.0.0  
**Total Agents**: 11  
**Status**: Operational

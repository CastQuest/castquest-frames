# CastQuest V3 Tokenomics

## Overview

CastQuest V3 operates with a multi-token system designed to align incentives across creators, sponsors, agents, and governance participants.

## Core Tokens

### CAST (Governance Token)

**Purpose**: Protocol governance and decision-making

**Supply**: 100,000,000 CAST (fixed)

**Distribution**:
- 40% — Community treasury (vested over 4 years)
- 25% — Team and advisors (4-year vest, 1-year cliff)
- 20% — Early contributors and builders
- 15% — Initial liquidity and ecosystem grants

**Utility**:
- 1 CAST = 1 vote in governance
- Proposal creation (requires >0.1% supply)
- Fee discounts (staking benefits)
- Access to premium features

### QUEST (Fee + Buyback Token)

**Purpose**: Protocol fees and value accrual

**Supply**: Dynamic (minted for fees, burned through buybacks)

**Mechanics**:
- Users pay fees in QUEST or ETH
- ETH fees automatically converted to QUEST
- Protocol uses revenue for QUEST buybacks
- Buyback multiplier increases MC (Market Cap)

**Fee Structure**:
- Frame creation: 0.1 QUEST
- Mint transactions: 0.5% in QUEST
- Marketplace trades: 2% in QUEST
- SubDAO creation: 10 QUEST

### MEDIA (Media Assets)

**Purpose**: Media content tokenization

**Supply**: Unlimited (minted by creators)

**Characteristics**:
- Each MEDIA token represents a unique media asset
- Royalties on secondary sales
- Cross-chain portable
- Includes metadata and provenance

### FRAM (Frames)

**Purpose**: Farcaster frame tokenization

**Supply**: Unlimited (minted by creators)

**Characteristics**:
- Each FRAM token represents a Farcaster frame
- Interaction fees flow to FRAM holders
- Cloneable with attribution
- Composable with other frames

### GAME (Games)

**Purpose**: Game tokenization and economies

**Supply**: Unlimited (minted by creators)

**Characteristics**:
- Each GAME token represents a game or game asset
- In-game economies built on GAME tokens
- Cross-game asset portability
- Play-to-earn mechanics

### CODE (Code Modules)

**Purpose**: Code module tokenization

**Supply**: Unlimited (minted by developers)

**Characteristics**:
- Each CODE token represents a reusable code module
- Usage fees flow to CODE holders
- Composable with other modules
- Versioning and upgrade paths

### SponsorToken (V3 NEW)

**Purpose**: Sponsorship economy and yield sharing

**Supply**: Dynamic (minted when sponsoring, burned when exiting)

**Mechanics**:
- Sponsors acquire SponsorTokens by sponsoring creators
- Receive proportional revenue from sponsored creators
- Participate in treasury yield distribution
- Advisory voting in AI DAO governance

**Yield Calculation**:
```
sponsor_yield = (SponsorToken_balance / total_SponsorTokens) × treasury_yield_pool
```

## Market Cap (MC) Calculation

The protocol's Market Cap aggregates value across all tokens and includes a buyback multiplier:

```
MC = Σ(MEDIA_value) + Σ(FRAM_value) + Σ(GAME_value) + Σ(CODE_value) + Σ(SubDAO_value) + Σ(L3_value) + buyback_multiplier
```

**Buyback Multiplier**: 
- Increases with cumulative QUEST buybacks
- Formula: `multiplier = 1 + (total_buybacks / 1,000,000)`
- Creates positive feedback loop for protocol value

## Revenue Flows

### Primary Sales (Mints)

```
Creator: 90%
Protocol: 10% (converted to QUEST for buybacks)
```

### Secondary Sales (Marketplace)

```
Creator royalty: 5-10% (creator sets)
Protocol fee: 2% (converted to QUEST for buybacks)
Seller: Remainder
```

### Frame Interactions

```
Frame creator: 70%
Protocol: 30% (converted to QUEST for buybacks)
```

### SubDAO Operations

```
SubDAO treasury: 85%
Protocol: 15% (converted to QUEST for buybacks)
```

## Treasury Management

### Composition

**Treasury Assets**:
- QUEST tokens (from fees)
- ETH and stablecoins (from conversions)
- DeFi positions (yield-generating)
- LP tokens (liquidity provision)

### Allocation Strategy

Target allocations (governance-approved):
- 30% — Liquid reserves (ETH, stablecoins)
- 40% — Low-risk DeFi (Aave, Compound)
- 20% — LP positions (protocol-owned liquidity)
- 10% — Strategic investments

### Yield Distribution

Treasury yields are distributed:
- 50% — SponsorToken holders (proportional)
- 30% — QUEST buybacks (value accrual)
- 20% — Community treasury (future grants)

Distribution occurs quarterly after yield settlement.

## Autonomous Treasury

### AI-Driven Optimization

PortfolioAgent manages treasury within constraints:
- Rebalances based on market conditions
- Identifies high-yield opportunities
- Manages risk exposure
- Executes approved strategies

### Risk Constraints

Hard limits enforced by smart contracts:
- Max 20% in any single protocol
- Min 30% liquid reserves
- Only approved DeFi protocols
- No leverage or exotic derivatives

### Performance Metrics

Treasury performance tracked via:
- Annualized yield (APY)
- Risk-adjusted returns (Sharpe ratio)
- Protocol comparison (vs. benchmarks)
- Transparency dashboard (public)

## Sponsor Economics

### Sponsorship Mechanics

1. **Sponsor a Creator**
   - Send ETH or stablecoins to sponsor contract
   - Receive SponsorTokens proportional to contribution
   - Begin receiving creator revenue share

2. **Receive Revenue**
   - Proportional share of creator's earnings
   - Automatic distribution (claimable anytime)
   - Includes primary sales, secondary royalties, interactions

3. **Treasury Yield**
   - Quarterly yield distribution from autonomous treasury
   - Based on SponsorToken holdings
   - Compounding reinvestment options

4. **Exit**
   - Sell SponsorTokens on marketplace
   - Or redeem directly (slight discount)
   - No lockup periods

### Expected Returns

Illustrative sponsor returns (not guaranteed):

**Creator Revenue**: 5-15% APY from creator earnings  
**Treasury Yield**: 3-8% APY from DeFi positions  
**Total**: 8-23% APY combined

Actual returns depend on creator performance and market conditions.

## Token Utilities Summary

| Token | Primary Use | Secondary Use | Governance |
|-------|-------------|---------------|------------|
| CAST | Governance | Fee discounts | Yes (binding) |
| QUEST | Fees | Buyback target | No |
| MEDIA | Media assets | Collectibles | No |
| FRAM | Frames | Interaction fees | No |
| GAME | Games | In-game economy | No |
| CODE | Code modules | Usage fees | No |
| SponsorToken | Sponsorship | Yield share | Yes (advisory) |

## Deflationary Mechanics

### QUEST Buybacks

Protocol revenue continuously buys QUEST:
- Market purchases on DEXs
- Dutch auction mechanisms
- Price-weighted execution
- Transparent on-chain operations

### Token Burns

Optional burn mechanisms:
- Creators can burn tokens for MC boost
- Protocol can burn excess QUEST
- SubDAOs can burn for treasury optimization
- Community votes on burn proposals

## Cross-Chain Token Flows

### Bridging

All tokens except SponsorToken are cross-chain bridgeable:
- Native bridges for Base ↔ L2s
- Wormhole for Solana integration
- L3 bridges for creator chains
- Unified balance tracking

### Synchronization

SyncAgent maintains cross-chain consistency:
- Balance verification
- Transaction finality tracking
- Conflict resolution
- Automatic reconciliation

## Vesting and Unlocks

### Team and Advisors

**Vesting Schedule**:
- Total allocation: 25% (25,000,000 CAST)
- Cliff: 1 year
- Vesting: 4 years linear
- First unlock: Year 1 (25%)
- Final unlock: Year 4 (100%)

### Community Treasury

**Release Schedule**:
- Total allocation: 40% (40,000,000 CAST)
- Year 1: 10% (4,000,000 CAST)
- Year 2: 15% (6,000,000 CAST)
- Year 3: 35% (14,000,000 CAST)
- Year 4: 40% (16,000,000 CAST)

Governance controls release and allocation of community treasury funds.

## Future Considerations

### Potential Additions

- **Staking CAST**: Lock CAST for yield and boosted governance
- **veCAST**: Vote-escrowed CAST for enhanced voting power
- **Agent Rewards**: Performance-based agent compensation
- **Creator Tokens**: Individual creator tokens (SubDAO level)

### Parameter Adjustments

Governance can modify:
- Fee rates (within reasonable bounds)
- Buyback strategies
- Treasury allocations
- Vesting schedules (future tranches only)

## Further Reading

- [Protocol Constitution](/v3/protocol/constitution.md)
- [AI DAO Constitution](/v3/protocol/ai-dao-constitution.md)
- [Treasury Dashboard](https://app.castquest.xyz/treasury)
- [Token Contracts](https://github.com/CastQuest/castquest-frames/tree/main/packages/contracts)

---

**Version**: 3.0.0  
**Last Updated**: TBD  
**Governance**: Approved parameters subject to change via governance proposals

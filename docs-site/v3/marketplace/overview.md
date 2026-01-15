# CastQuest V3 Marketplace Overview

## Introduction

The CastQuest V3 marketplace is a **global, multi-chain trading platform** for all protocol tokens (MEDIA, FRAM, GAME, CODE) and now includes the revolutionary **Sponsor Marketplace** for SponsorToken trading.

## Marketplace Layers

### Global Marketplace (PR#58)

**Cross-chain unified marketplace** enabling trading across all supported chains:

**Supported Chains**:
- Base L2 (primary)
- Optimism, Arbitrum, Polygon
- Solana (via Wormhole bridge)
- Creator L3s (dedicated chains)

**Features**:
- Unified order books across chains
- Atomic cross-chain swaps
- Shared liquidity pools
- Single UX for all chains

**Trade Flow**:
```
1. User lists MEDIA on Base
2. Buyer on Arbitrum places order
3. Marketplace routes through bridge
4. Atomic swap executed
5. Both parties receive assets simultaneously
```

### L3 Marketplace

**Creator-specific marketplaces** on dedicated L3 chains:

**Benefits**:
- Lower fees (creator sets rates)
- Faster settlement (~1 second)
- Custom token economics
- Enhanced creator control

**Use Cases**:
- High-volume creators with active communities
- Games with frequent in-game trades
- Limited edition drops requiring speed
- Custom auction mechanics

### Solana Marketplace

**High-throughput marketplace** for Solana-native operations:

**Advantages**:
- Ultra-fast finality (~400ms)
- Minimal fees (<$0.01 per trade)
- NFT standard compatibility
- DeFi composability

**Integration**:
- Bridged assets maintain provenance
- Revenue flows back to Base treasury
- Unified MC calculation

### Sponsor Marketplace (V3 NEW)

**Revolutionary marketplace for SponsorTokens** enabling liquid sponsorship positions:

**Trading Features**:
- Buy/sell SponsorTokens for individual creators
- Market-based pricing (supply and demand)
- Instant liquidity (no lockups)
- Transparent yield metrics

**Discovery Features**:
- Creator performance rankings
- Historical yield data
- Risk scoring
- Trending sponsors

**Sponsor Dashboard**:
- Portfolio overview
- Yield analytics
- Performance tracking
- Automated rebalancing suggestions

## Trading Mechanisms

### Standard Listings

**Fixed Price Sales**:
```
Creator lists: 1 MEDIA = 0.05 ETH
Buyer purchases at listed price
Instant settlement
```

**Parameters**:
- Minimum price: 0.001 ETH
- Maximum duration: 365 days
- Cancellation: Anytime before sale

### Auctions

**English Auctions** (ascending price):
```
Starting price: 0.01 ETH
Minimum bid increment: 10%
Duration: 24-72 hours
Automatic extension on late bids
```

**Dutch Auctions** (descending price):
```
Starting price: 1.0 ETH
Ending price: 0.1 ETH
Duration: 24 hours
Linear price decrease
```

**Sealed-Bid Auctions**:
```
Bidders submit secret bids
Reveal period after close
Highest bidder wins
Second-price payment (Vickrey)
```

### Offers and Bids

**Collection Offers**:
- Bid on any item in a collection
- Creator can accept any offer
- Offers expire after duration

**Trait-Based Offers**:
- Bid on items with specific traits
- Useful for FRAM with specific features
- Programmatic acceptance

## Fee Structure

### Trading Fees

**Standard Trades**:
- Protocol fee: 2% of sale price
- Creator royalty: 5-10% (creator sets)
- Total: 7-12% including royalties

**Sponsor Marketplace**:
- Protocol fee: 1% (lower to encourage liquidity)
- No creator royalty (SponsorTokens)
- Total: 1%

### Fee Distribution

Protocol fees are:
- 50% — QUEST buybacks (value accrual)
- 30% — Treasury (yield generation)
- 20% — LP incentives (liquidity provision)

### Volume Discounts

High-volume traders receive discounts:
- >10 ETH monthly: 10% fee discount
- >50 ETH monthly: 25% fee discount
- >100 ETH monthly: 50% fee discount
- >500 ETH monthly: 75% fee discount

Tracked via CAST staking for Sybil resistance.

## Liquidity Features

### Protocol-Owned Liquidity (POL)

The protocol provides liquidity for key pairs:
- MEDIA/ETH
- FRAM/ETH
- QUEST/ETH
- SponsorToken/ETH

Benefits:
- Guaranteed liquidity
- Stable pricing
- Reduced slippage
- 24/7 trading

### Liquidity Mining

LPs receive QUEST rewards:
- Proportional to liquidity provided
- Boosted for long-term positions
- Extra rewards for balanced pairs
- Distributed weekly

### Market Making

Professional market makers receive:
- Reduced fees (0.5% instead of 2%)
- Priority API access
- Volume rebates
- Analytics tools

## Advanced Features

### Bundling

**Asset Bundles**:
- Combine multiple tokens in one listing
- Discounted bundle pricing
- Atomic purchase (all or nothing)
- Popular for collections

**Example**:
```
Bundle: 5 MEDIA tokens from series
Individual: 0.05 ETH each (0.25 total)
Bundle price: 0.20 ETH (20% discount)
```

### Fractional Ownership

**High-value assets** can be fractionalized:
- Split into smaller shares
- Trade shares independently
- Governance over asset usage
- Exit liquidity for holders

**Use Case**:
```
1 MEDIA worth 10 ETH → 10,000 shares @ 0.001 ETH
→ Accessible to smaller collectors
→ Increased liquidity
→ Shared appreciation
```

### Automated Trading

**Trading Bots** via SDK:
- Programmatic listing and bidding
- Strategy execution (e.g., grid trading)
- Arbitrage across chains
- Portfolio rebalancing

**API Access**:
- REST API for order management
- WebSocket for real-time data
- Rate limits: 1000 req/min (standard), 10000 req/min (premium)

## Analytics and Insights

### Market Metrics

Real-time tracking of:
- Total volume (24h, 7d, 30d, all-time)
- Active listings
- Floor prices by collection
- Holder distribution
- Wash trading detection

### Price Discovery

**Oracle Integration**:
- Chainlink price feeds
- TWAP calculations
- Fair value estimates
- Historical price charts

### Performance Rankings

**Leaderboards**:
- Top-selling creators
- Most active traders
- Best-performing SponsorTokens
- Trending collections

## Security and Safety

### Trade Protection

**Buyer Protection**:
- 72-hour dispute window
- Metadata verification
- Authenticity checks by FraudAgent
- Escrow during disputes

**Seller Protection**:
- Verified buyer addresses
- Payment guarantees
- Automated settlement
- No chargeback risk

### Anti-Manipulation

**FraudAgent monitors for**:
- Wash trading (self-trading)
- Price manipulation
- Fake volume
- Coordinated pumps

Flagged activity is reviewed by governance.

### Smart Contract Security

All marketplace contracts:
- Audited by top firms (Certik, OpenZeppelin)
- Bug bounty program ($100k max payout)
- Timelock on upgrades (7 days)
- Emergency pause capability

## Cross-Chain Mechanics

### Bridge Integration

**Supported Bridges**:
- Native Base ↔ L2 bridges
- Wormhole for Solana
- Custom L3 bridges
- Optimistic rollups for speed

**Bridge Fees**:
- Native bridges: ~$1-5
- Wormhole: ~$5-10
- L3 bridges: <$0.10

### Asset Verification

**Cross-chain assets** maintain:
- Original provenance
- Metadata integrity
- Creator attribution
- Revenue flow continuity

SyncAgent verifies all bridged assets.

## Future Enhancements

### Planned Features

- **NFT Lending**: Collateralize assets for loans
- **Derivatives**: Options and futures on collections
- **Prediction Markets**: Bet on creator success
- **Social Trading**: Follow top traders' strategies
- **Virtual Showrooms**: 3D marketplace browsing

### Community Requests

Vote on new features via governance:
- Batch purchasing (buy multiple at once)
- Conditional orders (if/then logic)
- Stop-loss orders (risk management)
- Subscription models (recurring purchases)

## Integrations

### External Marketplaces

Listed on:
- OpenSea (Seaport protocol)
- Blur (aggregation)
- Rarible (exposure)
- Foundation (curated drops)

### DeFi Protocols

Composable with:
- Aave (NFT collateral)
- Uniswap (token swaps)
- Curve (stablecoin pools)
- SushiSwap (liquidity)

### Wallets

Supported wallets:
- MetaMask, Rainbow, Coinbase Wallet
- Ledger, Trezor (hardware)
- Safe (multi-sig)
- Smart wallets (account abstraction)

## Getting Started

### For Buyers

1. Connect wallet to [marketplace](https://app.castquest.xyz/marketplace)
2. Browse collections or search
3. Place bid or buy now
4. Approve transaction
5. Receive asset instantly

### For Sellers

1. Connect wallet with assets
2. Select asset to list
3. Choose listing type (fixed/auction)
4. Set price and duration
5. Confirm listing

### For Sponsors

1. Navigate to [Sponsor Marketplace](https://app.castquest.xyz/sponsors)
2. Research creators and yields
3. Purchase SponsorTokens
4. Monitor performance
5. Trade or hold for yields

## Support

- **Marketplace Guide**: [guide.castquest.xyz/marketplace](https://guide.castquest.xyz/marketplace)
- **API Documentation**: [docs.castquest.xyz/api](https://docs.castquest.xyz/api)
- **Discord Support**: Join #marketplace channel
- **Email**: marketplace@castquest.xyz

---

**Version**: 3.0.0  
**Total Volume**: TBD  
**Active Chains**: 5+ (Base, Optimism, Arbitrum, Solana, L3s)

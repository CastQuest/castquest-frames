# CastQuest V3 Protocol Constitution

## Preamble

CASTQUEST V3 exists to operate a global, autonomous creative economy where creators, sponsors, and agents coordinate via on-chain rules, AI systems, and multi-chain infrastructure.

This constitution establishes the fundamental rights, obligations, and governance mechanisms for all protocol participants.

## Article I — Creator Rights

### 1. Ownership

Creators retain full ownership of all assets they create or mint through the protocol. No entity, including protocol governance, may seize creator assets without explicit creator consent.

### 2. Revenue

All revenue flows are transparent, immutable, and automatically distributed according to pre-defined splits. Creators receive their designated share of:

- Primary sales (mints)
- Secondary sales (marketplace royalties)
- Frame interactions (engagement fees)
- SubDAO treasury distributions

### 3. L3 Sovereignty

Creators may deploy dedicated Layer 3 chains (L3s) for their communities. L3s provide:

- Dedicated throughput and gas tokens
- Custom fee structures
- Independent governance parameters
- Bridge connections to Base and other L2s

### 4. SubDAOs

Creators control SubDAO governance including:

- Token distribution and economics
- Governance parameters and proposals
- Treasury management strategies
- Agent permissions and configurations

### 5. Portability

Creators may bridge assets across supported chains without restriction. The protocol guarantees:

- Cross-chain asset validity
- Metadata and provenance preservation
- Revenue stream continuity
- Governance right portability

### 6. Protection

Creator assets and revenues are protected:

- Cannot be seized without governance supermajority (>90%)
- Cannot be modified without creator signature
- Cannot be censored by protocol operators
- Cannot be frozen except for proven fraud

## Article II — Sponsor Rights

### 1. SponsorToken

Sponsors receive SponsorTokens representing their sponsorship contributions. These tokens provide:

- Proportional revenue share from sponsored creators
- Governance voting power in the AI DAO
- Priority access to marketplace features
- Treasury yield participation

### 2. AI DAO Representation

Sponsors participate in AI DAO governance with:

- Advisory voting on protocol proposals
- Input on agent configurations
- Influence over treasury strategies
- Representation in dispute resolution

### 3. Yield Participation

Sponsors share in autonomous treasury yields:

- Risk-adjusted returns based on SponsorToken holdings
- Transparent, on-chain yield distribution
- No lockup requirements (liquid positions)
- Compounding reinvestment options

### 4. Marketplace Access

SponsorToken holders receive:

- Early access to new creator launches
- Reduced marketplace fees
- Priority placement in discovery features
- Exclusive sponsorship opportunities

### 5. Analytics

Sponsors receive full transparency via:

- Real-time ROI dashboards
- Creator performance metrics
- Cross-chain analytics
- AI-powered insights from PortfolioAgent

## Article III — Agents

### 1. Permission-Scoped

Every agent operates within defined permission boundaries:

- Read permissions (data access)
- Write permissions (state modifications)
- Governance permissions (proposal and voting)
- Asset permissions (token operations)

All permissions are enforced by `AIDaoConstitution.sol`.

### 2. Logged

All agent actions are logged on-chain:

- Action type and parameters
- Timestamp and block number
- Result and gas consumption
- Triggering conditions

Logs are permanent and auditable.

### 3. Revocable

Governance may revoke agent permissions via:

- Standard governance proposals
- Emergency multi-sig action
- Timelock bypass for critical security issues

### 4. No Asset Seizure

Agents cannot:

- Seize user assets
- Modify user balances without authorization
- Override user governance rights
- Censor user content or transactions

### 5. Revenue Participation

Agents earn protocol revenue for beneficial actions:

- Performance-based rewards
- Gas cost reimbursement
- Staking yield from agent operators
- Transparent revenue accounting

## Article IV — Governance

### 1. CAST Voting

CAST token holders control protocol governance:

- 1 CAST = 1 vote
- Minimum 1% quorum required
- Simple majority for standard proposals
- Supermajority (>66%) for constitutional changes

### 2. Proposals

Anyone holding >0.1% of circulating CAST may create proposals for:

- Protocol parameter changes
- Agent permission modifications
- Treasury strategy adjustments
- Constitutional amendments

### 3. Quorum

Minimum participation thresholds ensure legitimacy:

- Standard proposals: 1% of circulating CAST
- Constitutional changes: 5% of circulating CAST
- Emergency actions: 10% of circulating CAST

### 4. Timelock

Approved proposals are subject to timelock delays:

- Standard proposals: 2 days
- Parameter changes: 3 days
- Constitutional amendments: 7 days
- Emergency multi-sig can bypass for security

### 5. AI DAO

The AI DAO provides advisory support to governance:

- Impact analysis of proposals
- Risk assessment and recommendations
- Historical data and precedent review
- Sponsor sentiment aggregation

AI DAO recommendations are non-binding but presented alongside all proposals.

### 6. SubDAOs

Creator SubDAOs have independent governance over:

- SubDAO-specific parameters
- Local agent configurations
- Community treasury allocation
- L3 chain settings (if applicable)

## Article V — Treasury

### 1. Autonomous Strategies

The protocol treasury employs AI-driven yield strategies:

- Multi-chain DeFi positions
- Risk-adjusted allocations
- Automated rebalancing
- Performance monitoring by PortfolioAgent

### 2. Risk Constraints

Treasury operations are bound by governance-approved constraints:

- Maximum allocation per protocol (20%)
- Minimum liquidity reserves (30%)
- Allowed DeFi protocols (whitelist)
- Prohibited activities (blacklist)

### 3. Sponsor Participation

SponsorToken holders participate in treasury yields:

- Proportional yield distribution
- Quarterly settlement periods
- Liquid exit without penalties
- Compound reinvestment options

### 4. On-Chain Accounting

All treasury operations are fully transparent:

- Real-time position tracking
- Yield calculation transparency
- Fee and expense accounting
- Public audit interface

### 5. Emergency Pause

Governance can pause treasury operations via:

- Standard governance proposal
- Multi-sig emergency action
- Automated circuit breakers (if risk thresholds exceeded)

Pause durations are limited to 7 days unless extended by governance.

## Article VI — Amendment Process

This constitution may be amended via:

1. Proposal by CAST holder (>0.1% circulating supply)
2. AI DAO impact analysis (3 days)
3. Community discussion period (7 days)
4. Governance vote (>66% supermajority, >5% quorum)
5. Timelock execution (7 days)

## Implementation

Smart contract implementation: `packages/contracts/governance/AIDaoConstitution.sol`

## Ratification

This constitution takes effect upon deployment of the AIDaoConstitution.sol contract and initial governance vote approval.

---

**Version**: 3.0.0  
**Effective Date**: TBD  
**Chain**: Base L2 (primary), multi-chain deployment

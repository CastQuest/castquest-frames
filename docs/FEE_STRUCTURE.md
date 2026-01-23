# CastQuest V3 Fee Structure

## Overview
CastQuest protocol charges transparent, governance-controlled fees on all transactions. All fees are publicly documented, on-chain, and adjustable by governance through the GovernanceV2 contract with a 48-hour timelock.

## Fee Breakdown

### Trading Fees (Market Swaps & Marketplace Sales)
All trading fees are charged in basis points (bps), where 1 bps = 0.01%.

- **Protocol Fee**: 2.5% (250 basis points)
  - **Destination**: Protocol treasury multi-sig
  - **Purpose**: 
    - Protocol development and maintenance
    - Security audits and bug bounties
    - Developer grants and ecosystem growth
    - Infrastructure costs (RPC, indexing, hosting)
  - **Distribution**: Automated via FeeManagerV3 contract
  
- **Developer Fee**: 0.5% (50 basis points)
  - **Destination**: Developer treasury multi-sig
    - **EVM chains** (Ethereum, Optimism, Polygon, etc.): `monads.skr`
    - **Base chain**: `solanamobile.base.eth`
  - **Purpose**: 
    - Core development team compensation
    - Ongoing protocol maintenance
    - Technical support and bug fixes
    - Smart contract upgrades and optimizations
  - **Transparency**: All developer fee transactions are logged on-chain and publicly auditable
  
- **Treasury Fee**: 2.0% (200 basis points)
  - **Destination**: DAO-controlled treasury
  - **Purpose**: 
    - Liquidity incentives and rewards
    - Token buybacks and burns
    - Community initiatives
    - Strategic partnerships
  - **Governance**: Fully controlled by CAST token holders through GovernanceV2

**Total Trading Fee**: 5.0% (500 basis points)

### Creation Fees (Token Minting)

- **Factory Fee**: 0.001 ETH per token deployment
  - **Destination**: Protocol treasury
  - **Purpose**: 
    - Cover gas costs for token creation
    - Prevent spam token deployments
    - Support protocol infrastructure
  
  Note: Creation fees are sent directly to the protocol treasury and are separate from the FeeManagerV3 distribution system.

### Quest & Game Fees

- **Quest Completion**: No fee (rewards funded by quest creators)
- **Game Asset Minting**: 0.0005 ETH per asset
- **Code NFT Generation**: 0.0002 ETH per generation

## Fee Caps & Limits

To protect users and ensure fair pricing, the protocol enforces maximum fee caps:

- **Maximum Total Trading Fee**: 10% (1000 bps)
- **Maximum Creation Fee**: 0.01 ETH per token
- **Minimum Fee Change Timelock**: 48 hours

These caps are enforced at the smart contract level and cannot be bypassed.

## Fee Adjustment Mechanism

All fee changes require governance approval and follow a strict timelock process:

### 1. Proposal Creation
- Any CAST holder with ≥100,000 CAST can create a proposal
- Proposals must include detailed justification for fee changes
- Voting period: ~7 days (50,400 blocks)

### 2. Voting Process
- CAST token holders vote based on their token balance
- Quorum requirement: 4% of total CAST supply
- Approval requirement: Simple majority (>50% of votes cast)

### 3. Timelock & Execution
- **48-hour timelock** after successful vote
- Provides time for community review and preparation
- Emergency cancellation available if critical issues discovered

### 4. Implementation
- Automated execution via FeeManagerV3 contract
- All changes logged on-chain with events
- Immediate effect after timelock expires

## Fee Distribution

Fee distribution occurs in two steps via the FeeManagerV3 contract:

```solidity
// Example for a 1 ETH trade with 5% total fee
Total Fee: 0.05 ETH

Protocol Treasury: 0.025 ETH (2.5% of 1 ETH)
Developer Treasury: 0.005 ETH (0.5% of 1 ETH)
DAO Treasury: 0.02 ETH (2.0% of 1 ETH)
Seller Receives: 0.95 ETH
```

### Collection and Distribution Flow
- **Step 1**: Fees are collected via `FeeManagerV3.collectFees()` and accumulated in `pendingFees` mapping
- **Step 2**: Fees are distributed via `FeeManagerV3.distributeFees()` call, which sends funds to the three treasuries
- All fee transactions are logged on-chain via `FeesCollected` and `FeesDistributed` events

## Developer Fee Transparency

The developer fee exists to ensure long-term protocol sustainability and quality maintenance.

### Why a Developer Fee?

1. **Ongoing Development**: Smart contract protocols require continuous maintenance, security updates, and feature improvements
2. **Security First**: Dedicated resources for security audits, bug bounties, and rapid response to vulnerabilities
3. **Quality Assurance**: Professional development team ensures protocol reliability and user safety
4. **Fair Compensation**: Market-rate compensation for experienced blockchain developers

### Developer Fee Recipients

- **Primary**: monads.skr (ENS name on EVM chains)
- **Base Chain**: solanamobile.base.eth (ENS name on Base)
- **Fallback**: Multi-sig wallet controlled by core development team

### Accountability

- All developer fee transactions are publicly visible on-chain
- Quarterly transparency reports published to the community
- Developer treasury address is public and auditable
- Community can propose fee adjustments through governance

## Historical Fee Changes

| Date | Change | Reason | Governance Proposal |
|------|--------|--------|-------------------|
| 2026-01-22 | Initial V3 Launch | Set initial fee structure | N/A (Launch) |

## Fee Exemptions

Certain operations may be exempt from fees to encourage specific behaviors:

- **Quest Rewards**: No fee on reward claims (encourages participation)
- **Governance Actions**: No fee on proposal creation or voting
- **Token Burns**: No fee on burning CAST tokens
- **Emergency Actions**: No fee on emergency withdrawals or safety mechanisms

## Fee Comparison

CastQuest's fee structure is competitive with other DeFi protocols:

| Protocol | Trading Fee | Creation Fee | Notes |
|----------|------------|--------------|-------|
| CastQuest V3 | 5.0% | 0.001 ETH | Transparent, governance-controlled |
| OpenSea | 2.5% | Free | No protocol development fund |
| Uniswap V3 | 0.3-1% | Free | LP fees, no protocol fee currently |
| Rarible | 2.5% | Free | Platform-focused |
| Foundation | 15% | Free | Higher take rate |

## Fee Revenue Transparency

All fee revenue is tracked on-chain and publicly accessible:

- **Contract**: FeeManagerV3.sol
- **Events**: `FeesCollected`, `FeesDistributed`
- **Dashboard**: Real-time fee analytics at castquest.xyz/analytics
- **API**: Fee data available via public API endpoints

## Smart Contract Addresses

### Mainnet (Base)
- FeeManagerV3: TBD (Deploy after governance approval)
- Protocol Treasury: TBD (Multi-sig wallet)
- Developer Treasury: solanamobile.base.eth
- DAO Treasury: TBD (Governed by CAST holders)

### Testnet (Base Goerli)
- FeeManagerV3: TBD (Testing deployment)

## FAQ

### Q: Can fees be changed without governance approval?
**A**: No. All fee changes require a governance proposal, community vote, and 48-hour timelock.

### Q: Why is there a developer fee?
**A**: The developer fee ensures sustainable protocol development, security audits, and ongoing maintenance. It's similar to how traditional software requires ongoing support and updates.

### Q: Can I avoid paying fees?
**A**: Fees apply to all trading and creation activities. However, certain operations like voting and reward claims are fee-free.

### Q: Where do the fees go?
**A**: Fees are split between three treasuries: Protocol (50%), Developer (10%), and DAO (40%). All distributions are automated and on-chain.

### Q: How can I verify fee distributions?
**A**: All fee transactions are on-chain and publicly auditable. Check the FeeManagerV3 contract events or use our analytics dashboard.

### Q: Can the developer fee be removed?
**A**: Yes, through governance. CAST holders can propose and vote to adjust any fee, including reducing the developer fee to 0%.

### Q: What happens if a fee proposal is malicious?
**A**: The 48-hour timelock provides time for community review. Emergency cancellation is available for critical issues.

## Contact & Governance

- **Governance Forum**: discourse.castquest.xyz
- **Discord**: discord.gg/castquest
- **Proposals**: Create proposals via GovernanceV2 contract
- **Emergency Contact**: security@castquest.xyz

## Version History

- **V3.0** (2026-01-22): Initial V3 fee structure with transparent developer fee
- **V2.0** (2025): Previous fee structure (deprecated)
- **V1.0** (2024): Launch version (deprecated)

---

**Last Updated**: 2026-01-22  
**Contract Version**: V3.0  
**Governance**: Controlled by CAST token holders via GovernanceV2

# CastQuest Protocol — Smart Contracts

## Overview

The CastQuest Protocol is built on Base L2 with a set of Solidity smart contracts managing tokens, media, markets, fees, and governance.

**Solidity Version:** `^0.8.23`  
**Framework:** Foundry  
**Chain:** Base Mainnet (Chain ID: 8453)

---

## Contract Architecture

```
packages/contracts/contracts/
├── token/
│   ├── CASTToken.sol          — Main protocol token (ERC-20, max 100M supply)
│   ├── MediaToken.sol         — Per-media ERC-20 token
│   ├── CodeToken.sol          — Code NFT token
│   ├── GameToken.sol          — Game asset token
│   ├── QuestToken.sol         — Quest reward token
│   └── SponsorToken.sol       — Sponsor token
├── factory/
│   └── MediaTokenFactory.sol  — Creates MediaToken instances per upload
├── registry/
│   └── MediaRegistry.sol      — Tracks all deployed media tokens
├── market/
│   ├── Marketplace.sol        — General marketplace
│   └── MediaMarket.sol        — Media-specific market with protocol fees
├── fees/
│   ├── FeeManagerV3.sol       — Fee configuration and collection
│   └── FeeRouter.sol          — Routes fees to CAST treasury
├── governance/
│   └── GovernanceV2.sol       — Protocol governance
├── core/
│   └── CastQuestRegistry.sol  — Central protocol registry
└── libs/
    └── (utility libraries)
```

---

## Key Contracts

### CASTToken

The main protocol token. All protocol fees accrue to the CAST treasury.

- **Standard:** ERC-20
- **Max Supply:** 100,000,000 CAST
- **Decimals:** 18
- **Features:** Minting (owner), access control, events

### MediaTokenFactory

Creates a new ERC-20 media token for each piece of content uploaded to the protocol.

- **Pattern:** Factory
- **Creates:** `MediaToken` instances
- **Tracks:** Registered via `MediaRegistry`

### MediaMarket / Marketplace

Handles trading of media tokens with embedded protocol fees.

- **Protocol Fee:** 2.5% (250 BPS) on all trades
- **Fee Destination:** CAST treasury via `FeeRouter`
- **Features:** Listing, buying, selling, fee distribution

### FeeManagerV3 / FeeRouter

Manages fee configuration and routes collected fees to their destinations.

- **Default Fee:** 250 BPS (2.5%)
- **Max Fee:** Configurable
- **Routes to:** CAST token treasury

### MediaRegistry

Central registry of all deployed media tokens and their metadata.

- **Access Control:** Owner + Operator roles
- **Tracks:** Token addresses, creator addresses, metadata URIs

---

## Fee Structure

| Action | Fee | Destination |
|--------|-----|-------------|
| Media token trade | 2.5% (250 BPS) | CAST treasury |
| Protocol listing | TBD | CAST treasury |
| Creator royalty | Configurable | Creator wallet |

---

## Deployed Addresses

> ⚠️ Addresses below are placeholders. Update after deployment.

### Base Mainnet (Chain ID: 8453)

| Contract | Address |
|----------|---------|
| CASTToken | `0x0000000000000000000000000000000000000000` |
| MediaTokenFactory | `0x0000000000000000000000000000000000000000` |
| MediaRegistry | `0x0000000000000000000000000000000000000000` |
| MediaMarket | `0x0000000000000000000000000000000000000000` |
| FeeManagerV3 | `0x0000000000000000000000000000000000000000` |
| FeeRouter | `0x0000000000000000000000000000000000000000` |

### Base Sepolia (Chain ID: 84532)

| Contract | Address |
|----------|---------|
| CASTToken | `0x0000000000000000000000000000000000000000` |
| MediaTokenFactory | `0x0000000000000000000000000000000000000000` |

---

## Running Tests

```bash
cd packages/contracts

# Run all tests
forge test -vv

# Run with gas report
forge test --gas-report

# Run specific test file
forge test --match-path test/CASTToken.t.sol -vv

# Coverage report
forge coverage
```

---

## Security Audit

See [`docs/AUDIT-REPORT-TEMPLATE.md`](./AUDIT-REPORT-TEMPLATE.md) for the audit report template.

To run automated static analysis:

```bash
bash scripts/audit-contracts.sh
```

**Tools:**
- **Forge**: Unit tests + fuzz tests
- **Slither**: Static analysis (install: `pip install slither-analyzer`)

---

## Deployment

See [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md) for full deployment instructions.

```bash
# Quick deploy to Sepolia
cd packages/contracts
forge script script/Deploy.s.sol --rpc-url base-sepolia --broadcast --verify

# Quick deploy to Mainnet
forge script script/Deploy.s.sol --rpc-url base --broadcast --verify
```

---

## Development

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Build contracts
cd packages/contracts
forge build

# Run Foundry linter
forge fmt --check
```

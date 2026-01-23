# CastQuest V3 Deployment Guide

This guide walks through deploying the complete CastQuest V3 system to testnets and mainnet.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Testnet Deployment](#testnet-deployment)
4. [Mainnet Deployment](#mainnet-deployment)
5. [Post-Deployment](#post-deployment)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools

- **Node.js**: v20.x or higher
- **pnpm**: v9.x or higher
- **Foundry**: Latest version (forge, cast, anvil)
- **Git**: For version control

### Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Install Dependencies

```bash
# From repository root
pnpm install
```

### Required Accounts

1. **Deployer Wallet**: Private key with sufficient ETH for gas
2. **Protocol Treasury**: Multi-sig wallet (e.g., Gnosis Safe)
3. **Developer Treasury**: ENS name or address (monads.skr / solanamobile.base.eth)
4. **DAO Treasury**: DAO-controlled wallet

## Environment Setup

### 1. Create Environment File

Create `.env` in the repository root:

```bash
# Deployer
PRIVATE_KEY=0x...

# RPC Endpoints - Testnet
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
OPTIMISM_SEPOLIA_RPC_URL=https://sepolia.optimism.io

# RPC Endpoints - Mainnet
BASE_RPC_URL=https://mainnet.base.org
OPTIMISM_RPC_URL=https://mainnet.optimism.io

# Block Explorers
BASESCAN_API_KEY=...
OPTIMISM_ETHERSCAN_API_KEY=...

# Frontend Deployment
VERCEL_TOKEN=...
VERCEL_ORG_ID=...
VERCEL_WEB_PROJECT_ID=...
VERCEL_ADMIN_PROJECT_ID=...
```

### 2. Verify Configuration

```bash
# Check Foundry installation
forge --version

# Check deployer balance (Base Sepolia)
cast balance YOUR_DEPLOYER_ADDRESS --rpc-url $BASE_SEPOLIA_RPC_URL

# Verify contracts compile
cd packages/contracts
forge build
```

## Testnet Deployment

### Step 1: Deploy Contracts

```bash
# Option 1: Use deployment script (recommended)
bash scripts/deploy-testnet.sh

# Option 2: Manual deployment to specific network
cd packages/contracts
forge script script/DeployV3.s.sol \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY \
  -vvv
```

### Step 2: Extract ABIs

```bash
# Extract ABIs for frontend integration
bash scripts/extract-abis.sh
```

This creates:
- `packages/sdk/src/abis/*.json` - Contract ABIs
- `packages/sdk/src/abis/index.ts` - TypeScript exports

### Step 3: Update Contract Addresses

Edit `packages/sdk/src/contracts.ts` and update the contract addresses for your deployment:

```typescript
export const CONTRACT_ADDRESSES = {
  84532: { // Base Sepolia
    CASTToken: '0xYourDeployedAddress',
    FeeManagerV3: '0xYourDeployedAddress',
    // ... other contracts
  },
};
```

### Step 4: Build SDK

```bash
pnpm --filter @castquest/sdk build
```

### Step 5: Deploy Frontend

```bash
# Deploy web app
pnpm --filter @castquest/web build
# Deploy to Vercel or your hosting provider

# Deploy admin app
pnpm --filter @castquest/admin build
# Deploy to Vercel or your hosting provider
```

### Step 6: Verify Deployment

1. Check contracts on block explorer (BaseScan)
2. Verify all contracts are verified
3. Test basic operations:
   - Mint CAST tokens
   - Create a media token
   - Test fee collection
   - Verify governance setup

## Mainnet Deployment

⚠️ **WARNING**: Mainnet deployment uses real funds. Triple-check everything!

### Pre-Deployment Checklist

- [ ] All contracts audited
- [ ] Testnet deployment successful
- [ ] Integration tests passing
- [ ] Multi-sig wallets created
- [ ] Sufficient ETH for gas (~0.5 ETH for Base, ~2 ETH for Ethereum)
- [ ] Team approval obtained
- [ ] Deployment plan reviewed

### Step 1: Final Review

```bash
# Review deployment script
cat packages/contracts/script/DeployV3.s.sol

# Check fee configuration
# - Protocol: 2.5% (250 bps)
# - Developer: 0.5% (50 bps)
# - Treasury: 2.0% (200 bps)

# Review deployment addresses
# - Protocol Treasury: Update to multi-sig
# - Developer Treasury: monads.skr or solanamobile.base.eth
# - DAO Treasury: Update to DAO wallet
```

### Step 2: Deploy to Mainnet

```bash
# Interactive deployment (recommended)
bash scripts/deploy-mainnet.sh

# Manual deployment (if needed)
cd packages/contracts
forge script script/DeployV3.s.sol \
  --rpc-url $BASE_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY \
  --slow \
  -vvv
```

The script will:
1. Prompt for confirmation
2. Display deployment parameters
3. Deploy all contracts
4. Verify on block explorer
5. Export deployment addresses

### Step 3: Post-Deployment Configuration

```bash
# Extract deployment addresses
cat packages/contracts/broadcast/DeployV3.s.sol/8453/run-latest.json

# Update SDK with mainnet addresses
# Edit packages/sdk/src/contracts.ts

# Build and test
pnpm build
```

### Step 4: Transfer Admin Roles

⚠️ **Critical**: Transfer admin roles to appropriate addresses

```bash
# Using cast (Foundry CLI)
cast send $CAST_TOKEN_ADDRESS \
  "transferOwnership(address)" $PROTOCOL_TREASURY \
  --rpc-url $BASE_RPC_URL \
  --private-key $PRIVATE_KEY

cast send $FEE_MANAGER_V3_ADDRESS \
  "grantRole(bytes32,address)" \
  $(cast keccak "GOVERNANCE_ROLE()") \
  $GOVERNANCE_ADDRESS \
  --rpc-url $BASE_RPC_URL \
  --private-key $PRIVATE_KEY
```

### Step 5: Deploy Production Frontend

```bash
# Deploy to Vercel production
vercel --prod --cwd apps/web
vercel --prod --cwd apps/admin

# Or use GitHub Actions
git tag v3.0.0
git push origin v3.0.0
```

## Post-Deployment

### Immediate Actions (First Hour)

1. **Verify All Contracts**
   - Check all contracts on block explorer
   - Verify source code published
   - Test read functions

2. **Test Critical Functions**
   - Mint test CAST tokens
   - Create test media token
   - Execute test trade
   - Verify fee collection

3. **Monitor Transactions**
   - Watch for any reverts
   - Check gas usage
   - Verify fee distributions

### First 24 Hours

1. **Set Up Monitoring**
   - Configure alerts for contract events
   - Monitor fee collection
   - Track transaction volume

2. **Update Documentation**
   - Add deployed addresses to docs
   - Update README with links
   - Publish deployment announcement

3. **Community Communication**
   - Announce on Discord/Twitter
   - Share contract addresses
   - Link to fee structure documentation

### First Week

1. **Security Review**
   - Monitor for unusual activity
   - Review all transactions
   - Check for any vulnerabilities

2. **Gradual Rollout**
   - Enable features incrementally
   - Start with limited liquidity
   - Gradually increase limits

3. **Gather Feedback**
   - Monitor user reports
   - Track UX issues
   - Plan improvements

## Troubleshooting

### Contract Deployment Fails

```bash
# Check deployer balance
cast balance $DEPLOYER_ADDRESS --rpc-url $BASE_RPC_URL

# Estimate gas for deployment
forge script script/DeployV3.s.sol --estimate-gas

# Check for contract size issues
forge build --sizes
```

### Verification Fails

```bash
# Manual verification
forge verify-contract \
  --chain-id 8453 \
  --compiler-version v0.8.23 \
  $CONTRACT_ADDRESS \
  src/contracts/token/CASTToken.sol:CASTToken \
  --etherscan-api-key $BASESCAN_API_KEY
```

### ABI Extraction Fails

```bash
# Rebuild contracts
cd packages/contracts
forge clean
forge build

# Check output directory
ls -la out/

# Manually extract specific ABI
jq '.abi' out/CASTToken.sol/CASTToken.json > ../sdk/src/abis/CASTToken.json
```

### Frontend Build Fails

```bash
# Clean and rebuild
pnpm clean
pnpm install --frozen-lockfile
pnpm build

# Check for missing contract addresses
grep "0x0000000000000000000000000000000000000000" packages/sdk/src/contracts.ts
```

## Deployment Checklist

Use this checklist for each deployment:

### Pre-Deployment
- [ ] All tests passing
- [ ] Contracts audited
- [ ] Fee structure reviewed
- [ ] Deployment addresses confirmed
- [ ] Multi-sig wallets created
- [ ] Sufficient gas funds available
- [ ] Team approval obtained

### During Deployment
- [ ] Contracts deployed successfully
- [ ] All contracts verified on explorer
- [ ] ABIs extracted and committed
- [ ] SDK updated with addresses
- [ ] Frontend deployed
- [ ] Initial tests executed

### Post-Deployment
- [ ] Admin roles transferred
- [ ] Monitoring configured
- [ ] Documentation updated
- [ ] Community announced
- [ ] 24-hour monitoring complete

## Support

- **Documentation**: `/docs/`
- **Discord**: discord.gg/castquest
- **GitHub Issues**: github.com/CastQuest/castquest-frames/issues
- **Security**: security@castquest.xyz

## Additional Resources

- [Fee Structure Documentation](./FEE_STRUCTURE.md)
- [Contract Architecture](./architecture.md)
- [API Reference](./sdk/README.md)
- [Governance Guide](./GOVERNANCE.md)

---

**Version**: V3.0  
**Last Updated**: 2026-01-22  
**Maintainer**: CastQuest Core Team

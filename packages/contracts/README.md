# CastQuest Smart Contracts

Production-ready EVM contracts for the CastQuest protocol.

## Architecture

```
contracts/
├── token/
│   ├── CASTToken.sol          # Main protocol token (ERC-20)
│   └── MediaToken.sol          # Per-media tokens ($PIC, $VID, etc.)
├── factory/
│   └── MediaTokenFactory.sol   # Creates media tokens
├── registry/
│   └── MediaRegistry.sol       # Tracks media, owners, risk flags
├── market/
│   └── MediaMarket.sol         # Simple AMM for trading
└── fees/
    └── FeeRouter.sol           # Routes fees to treasury/CAST
```

## Quick Start

```bash
# Install dependencies
forge install

# Build contracts
forge build

# Run tests
forge test -vv

# Run with gas report
forge test --gas-report

# Coverage
forge coverage
```

## Contract Overview

### CASTToken
- Main protocol ERC-20 token
- Symbol: `CAST`
- Max supply: 100M tokens
- Owner-controlled minting
- **ABI**: Standard ERC-20 + `mint(address, uint256)`

### MediaToken
- Per-media ERC-20 tokens (e.g., $PIC for a picture)
- Created by factory
- Total supply minted to owner at creation
- Immutable: name, symbol, totalSupply
- **ABI**: Standard ERC-20 + `mediaId`, `metadataURI`, `owner`

### MediaTokenFactory
- Creates MediaToken instances
- Charges creation fee (default 0.001 ETH)
- Registers in MediaRegistry
- Pausable by owner
- **ABI**: `createMediaToken(CreateMediaTokenConfig) returns (address)`

**CreateMediaTokenConfig:**
```solidity
struct CreateMediaTokenConfig {
    string name;           // Token name
    string symbol;         // Token symbol (e.g., "PIC")
    string mediaId;        // Unique identifier
    string metadataURI;    // IPFS/HTTP link
    address owner;         // Owner address
    uint256 totalSupply;   // Total supply (default 10M)
}
```

### MediaRegistry
- Tracks all media tokens
- Stores: token address, owner, metadata URI, risk flags
- Risk flags: NONE, SPAM, NSFW, SCAM, BLOCKED
- Access-controlled updates (OPERATOR_ROLE)
- **ABI**: 
  - `registerMedia(mediaId, token, owner, metadataURI)`
  - `setRiskFlags(mediaId, flags[])`
  - `getMediaInfo(mediaId) returns (MediaInfo)`

### MediaMarket
- Simple constant-product AMM (x * y = k)
- Supports ETH ⇄ Token swaps
- Protocol fee: 1% (adjustable, max 10%)
- Pausable by owner
- **ABI**:
  - `buyTokens(token, minAmount) payable`
  - `sellTokens(token, amount, minETH)`
  - `getQuoteBuy(token, ethAmount) returns (tokenAmount, fee)`
  - `getQuoteSell(token, tokenAmount) returns (ethAmount, fee)`

**Note**: Production should use Uniswap V2/V3 or similar DEX.

### FeeRouter
- Collects protocol fees from market
- Routes to treasury
- Can swap to CAST (future integration)
- **ABI**:
  - `receive() payable` - Receives fees
  - `distributeFees()` - Send to treasury

## Events

### Factory Events
```solidity
event MediaTokenCreated(
    string indexed mediaId,
    address indexed token,
    address indexed owner,
    string symbol,
    uint256 totalSupply,
    string metadataURI
);
```

### Market Events
```solidity
event TokensPurchased(
    address indexed buyer,
    address indexed token,
    uint256 ethAmount,
    uint256 tokenAmount,
    uint256 fee
);

event TokensSold(
    address indexed seller,
    address indexed token,
    uint256 tokenAmount,
    uint256 ethAmount,
    uint256 fee
);
```

### Registry Events
```solidity
event MediaRegistered(
    string indexed mediaId,
    address indexed tokenAddress,
    address indexed owner,
    string metadataURI
);

event RiskFlagsUpdated(
    string indexed mediaId,
    RiskFlag[] flags
);
```

## Deployment

```bash
# Local (Anvil)
forge script script/Deploy.s.sol --rpc-url localhost --broadcast

# Testnet (Sepolia)
forge script script/Deploy.s.sol --rpc-url sepolia --broadcast --verify
```

## Testing

```bash
# All tests
forge test -vv

# Specific test
forge test --match-test testCreateMediaToken -vvv

# Gas report
forge test --gas-report

# Coverage
forge coverage
```

## Security

- All contracts use OpenZeppelin libraries
- Access control: Ownable, AccessControl
- Pausable markets
- ReentrancyGuard on market functions
- Safe ERC20 transfers

## Auditing Notes

- Factory creates deterministic token addresses
- Registry is append-only (media cannot be deleted)
- Market uses constant-product formula (x*y=k)
- Fee calculations use basis points to avoid rounding errors
- All external calls checked for success

## Integration

### Frontend / SDK
```javascript
import CASTToken from '@castquest/contracts/out/CASTToken.sol/CASTToken.json';
import MediaTokenFactory from '@castquest/contracts/out/MediaTokenFactory.sol/MediaTokenFactory.json';
import MediaMarket from '@castquest/contracts/out/MediaMarket.sol/MediaMarket.json';

// Use ABIs from compiled artifacts in out/
```

### Backend Services
- Core Services ingests `MediaTokenCreated` events
- Indexer tracks `TokensPurchased`, `TokensSold` for market data
- Admin service uses `setRiskFlags` for moderation

## License

MIT

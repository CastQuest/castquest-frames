# CastQuest V3 API Reference

Complete API reference for CastQuest V3 smart contracts.

## Table of Contents

1. [Core Tokens](#core-tokens)
2. [Quest/Game/Code Systems](#questgamecode-systems)
3. [Fee Management](#fee-management)
4. [Markets](#markets)
5. [Governance](#governance)

## Core Tokens

### CASTToken

Main protocol governance token.

**Address**: See [Deployment Guide](./DEPLOYMENT_GUIDE_V3.md)

#### Functions

```solidity
function mint(address to, uint256 amount) external onlyOwner
```
Mint new CAST tokens (up to MAX_SUPPLY).

```solidity
function burn(uint256 amount) external
```
Burn tokens from caller's balance.

#### Events

```solidity
event Minted(address indexed to, uint256 amount)
```

### SponsorToken

Creator sponsorship system with ERC-20 tokens.

#### Functions

```solidity
function registerCreator(string calldata profile) external
```
Register as a creator to receive sponsorships.

```solidity
function sponsor(address creator, uint256 amount) external
```
Sponsor a registered creator.

```solidity
function withdrawSponsorship(address creator, uint256 amount) external
```
Withdraw sponsorship tokens.

#### Events

```solidity
event CreatorRegistered(address indexed creator, string profile)
event Sponsored(address indexed sponsor, address indexed creator, uint256 amount, uint256 totalSponsored)
event SponsorshipWithdrawn(address indexed sponsor, address indexed creator, uint256 amount, uint256 remaining)
```

## Quest/Game/Code Systems

### QuestToken

NFT-based quest completion and rewards system.

#### Functions

```solidity
function completeQuest(
    address user,
    uint256 questId,
    uint256 reward,
    string calldata questType
) external onlyRole(OPERATOR_ROLE) returns (uint256)
```
Complete a quest and mint achievement NFT.

- `user`: Address completing the quest
- `questId`: Unique quest identifier
- `reward`: Reward amount in wei
- `questType`: Type of quest (e.g., "social", "game", "code")
- Returns: Token ID of minted achievement

```solidity
function claimReward(uint256 tokenId) external
```
Claim reward for completed quest.

```solidity
function getUserQuests(address user) external view returns (uint256[] memory)
```
Get all quest tokens for a user.

#### Events

```solidity
event QuestCompleted(address indexed user, uint256 indexed questId, uint256 indexed tokenId, uint256 rewardAmount)
event RewardClaimed(address indexed user, uint256 indexed tokenId, uint256 amount)
```

### GameToken

NFT-based game asset management.

#### Functions

```solidity
function mintGameAsset(
    address to,
    string calldata uri,
    string calldata gameType
) external onlyRole(MINTER_ROLE) returns (uint256)
```
Mint a new game asset NFT.

```solidity
function playGame(
    uint256 tokenId,
    uint256 score,
    bytes calldata gameData
) external
```
Record a game play session.

```solidity
function getLeaderboard(string calldata gameType, uint256 limit)
    external view returns (uint256[] memory tokenIds, uint256[] memory scores)
```
Get leaderboard for a specific game type.

#### Events

```solidity
event GameMinted(address indexed to, uint256 indexed tokenId, string gameType, address indexed creator)
event GamePlayed(address indexed player, uint256 indexed tokenId, uint256 score, uint256 playCount)
event GameScored(address indexed player, uint256 indexed tokenId, uint256 oldScore, uint256 newScore)
```

### CodeToken

NFT-based AI-generated code management.

#### Functions

```solidity
function generateCode(
    address to,
    string calldata prompt,
    string calldata language,
    string calldata codeHash
) external onlyRole(GENERATOR_ROLE) returns (uint256)
```
Generate and mint a code NFT.

- `to`: Recipient address
- `prompt`: AI prompt used
- `language`: Programming language
- `codeHash`: IPFS hash or content hash

```solidity
function executeCode(
    uint256 tokenId,
    bytes calldata input,
    bytes calldata output,
    bool success
) external
```
Record code execution.

```solidity
function verifyCode(uint256 tokenId) external onlyRole(OPERATOR_ROLE)
```
Mark code as verified for quality/safety.

#### Events

```solidity
event CodeGenerated(address indexed to, uint256 indexed tokenId, string language, string prompt, address indexed generator)
event CodeExecuted(address indexed executor, uint256 indexed tokenId, bool success, uint256 executionCount)
event CodeVerified(uint256 indexed tokenId, address indexed verifier)
```

## Fee Management

### FeeManagerV3

Transparent fee management with governance control.

**Fee Structure**:
- Protocol Fee: 2.5% (250 bps)
- Developer Fee: 0.5% (50 bps)
- Treasury Fee: 2.0% (200 bps)
- **Total**: 5.0% (500 bps)

#### Functions

```solidity
function proposeFeeConfiguration(FeeConfiguration calldata newConfig)
    external onlyRole(GOVERNANCE_ROLE)
```
Propose new fee configuration (requires 48-hour timelock).

```solidity
function applyFeeConfiguration() external onlyRole(GOVERNANCE_ROLE)
```
Apply pending fee configuration after timelock expires.

```solidity
function collectFees(address token, uint256 amount)
    external payable onlyRole(OPERATOR_ROLE)
```
Collect fees from a transaction.

- `token`: Token address (address(0) for ETH)
- `amount`: Fee amount

```solidity
function distributeFees(address token) external
```
Distribute collected fees to treasuries.

```solidity
function calculateFees(uint256 amount) external view returns (uint256)
```
Calculate fees for a given amount.

```solidity
function getFeeConfiguration() external view returns (FeeConfiguration memory)
```
Get current fee configuration.

#### Events

```solidity
event FeesCollected(address indexed token, uint256 amount, address indexed collector, uint256 timestamp)
event FeesDistributed(address indexed token, uint256 protocolAmount, uint256 developerAmount, uint256 treasuryAmount)
event FeeConfigUpdated(address indexed updater, FeeConfiguration oldConfig, FeeConfiguration newConfig)
event FeeConfigProposed(FeeConfiguration newConfig, uint256 effectiveTimestamp)
```

#### Structs

```solidity
struct FeeConfiguration {
    uint256 protocolFeeBps;      // Protocol fee in basis points
    uint256 developerFeeBps;     // Developer fee in basis points
    uint256 treasuryFeeBps;      // Treasury fee in basis points
    address protocolTreasury;    // Protocol treasury address
    address developerTreasury;   // Developer treasury address
    address daoTreasury;         // DAO treasury address
    bool feesActive;             // Global fee switch
}
```

## Markets

### Marketplace

Unified marketplace for trading all CastQuest tokens.

#### Functions

```solidity
function listItem(
    address tokenContract,
    uint256 tokenId,
    uint256 price,
    bool isNFT
) external returns (uint256)
```
List an item for sale.

- `tokenContract`: Token contract address
- `tokenId`: Token ID (for NFTs) or 0 for ERC20
- `price`: Sale price in wei
- `isNFT`: True for ERC721, false for ERC20
- Returns: Listing ID

```solidity
function buyItem(uint256 listingId) external payable
```
Buy a listed item.

```solidity
function cancelListing(uint256 listingId) external
```
Cancel a listing (seller only).

```solidity
function getListing(uint256 listingId) external view returns (Listing memory)
```
Get listing details.

#### Events

```solidity
event ItemListed(uint256 indexed listingId, address indexed seller, address indexed tokenContract, uint256 tokenId, uint256 price, bool isNFT)
event ItemSold(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 price, uint256 fee)
event ListingCancelled(uint256 indexed listingId, address indexed seller)
```

## Governance

### GovernanceV2

Enhanced DAO governance with timelocks.

#### Configuration

- **Voting Period**: ~7 days (50,400 blocks)
- **Voting Delay**: ~1 day (7,200 blocks)
- **Quorum**: 4% of total CAST supply
- **Proposal Threshold**: 100,000 CAST
- **Timelock Delay**: 48 hours

#### Functions

```solidity
function createProposal(
    bytes calldata proposalData,
    string calldata description
) external returns (uint256)
```
Create a governance proposal.

- Requires: ≥100,000 CAST balance
- Returns: Proposal ID

```solidity
function vote(uint256 proposalId, bool support) external
```
Cast a vote on a proposal.

- `support`: True for yes, false for no
- Weight: Voter's CAST balance

```solidity
function queueProposal(uint256 proposalId) external
```
Queue a successful proposal for execution.

```solidity
function executeProposal(uint256 proposalId) external onlyRole(EXECUTOR_ROLE)
```
Execute a queued proposal after timelock.

```solidity
function cancelProposal(uint256 proposalId) external
```
Cancel a proposal (proposer or admin only).

```solidity
function getProposalState(uint256 proposalId) external view returns (ProposalState)
```
Get current state of a proposal.

#### Enums

```solidity
enum ProposalState {
    Pending,
    Active,
    Cancelled,
    Defeated,
    Succeeded,
    Queued,
    Expired,
    Executed
}
```

#### Events

```solidity
event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description, uint256 startBlock, uint256 endBlock)
event VoteCast(address indexed voter, uint256 indexed proposalId, bool support, uint256 weight)
event ProposalQueued(uint256 indexed proposalId, uint256 eta)
event ProposalExecuted(uint256 indexed proposalId)
event ProposalCancelled(uint256 indexed proposalId)
```

## Integration Examples

### TypeScript/Frontend

```typescript
import {
  getContractAddress,
  FeeManagerV3ABI,
} from '@castquest/sdk';
import { useReadContract, useWriteContract } from 'wagmi';

// Read current fee configuration
const { data: feeConfig } = useReadContract({
  address: getContractAddress(8453, 'FeeManagerV3'),
  abi: FeeManagerV3ABI,
  functionName: 'getFeeConfiguration',
});

// Calculate fees for an amount
const { data: fees } = useReadContract({
  address: getContractAddress(8453, 'FeeManagerV3'),
  abi: FeeManagerV3ABI,
  functionName: 'calculateFees',
  args: [parseEther('1.0')],
});
```

### Solidity

```solidity
import {FeeManagerV3} from "@castquest/contracts/fees/FeeManagerV3.sol";

contract MyContract {
    FeeManagerV3 public feeManager;
    
    constructor(address _feeManager) {
        feeManager = FeeManagerV3(_feeManager);
    }
    
    function doTransaction(uint256 amount) external payable {
        // Calculate fees
        uint256 fees = feeManager.calculateFees(amount);
        require(msg.value >= amount + fees, "Insufficient payment");
        
        // Collect fees
        feeManager.collectFees{value: fees}(address(0), fees);
        
        // Process transaction
        // ...
    }
}
```

## Error Codes

All contracts use the `Errors` library for consistent error messages:

- `ZERO_ADDRESS`: Invalid zero address provided
- `ZERO_AMOUNT`: Invalid zero amount provided
- `TRANSFER_FAILED`: ETH transfer failed
- `NO_FEES`: No fees available to distribute
- `EXCEEDS_MAX_SUPPLY`: Amount exceeds maximum supply

## Security Considerations

1. **Access Control**: All sensitive functions protected by role-based access control
2. **Reentrancy**: Markets use `ReentrancyGuard` for state-changing functions
3. **Integer Overflow**: Solidity 0.8.23+ has built-in overflow protection
4. **Fee Caps**: Maximum 10% total fees enforced at contract level
5. **Timelocks**: 48-hour minimum timelock for fee changes

## Additional Resources

- [Fee Structure Documentation](./FEE_STRUCTURE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE_V3.md)
- [Contract Source Code](../packages/contracts/contracts/)
- [SDK Documentation](../packages/sdk/README.md)

---

**Version**: V3.0  
**Last Updated**: 2026-01-22  
**Network**: Base, Optimism (EVM-compatible)

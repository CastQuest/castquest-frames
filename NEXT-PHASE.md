# CastQuest Protocol - Next Phase Implementation Plan

## ✅ Phase 1: COMPLETE - Smart Brain Automation

- Intelligent validation and deployment system
- Zero-risk automated commits, tags, and pushes
- Protected core architecture
- Protocol identity and concepts defined

---

## 🚀 Phase 2: Core Contracts (NEXT)

### Priority 1: CAST Token Implementation

**File**: `packages/contracts/contracts/CAST.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CAST - CastQuest Main Protocol Token
 * @notice Main protocol token that accumulates value via protocol fees
 * @dev All media token trading fees (2.5%) are routed to CAST holders
 */
contract CAST is ERC20, Ownable {
    // Protocol fee recipient (treasury or staking contract)
    address public feeRecipient;

    // Protocol fee percentage (basis points: 250 = 2.5%)
    uint256 public protocolFeeBps = 250;

    // Total fees accumulated
    uint256 public totalFeesAccumulated;

    constructor() ERC20("CastQuest", "CAST") {
        _mint(msg.sender, 1_000_000_000 * 10**18); // 1B initial supply
        feeRecipient = msg.sender;
    }

    function setFeeRecipient(address _recipient) external onlyOwner {
        feeRecipient = _recipient;
    }

    function setProtocolFee(uint256 _feeBps) external onlyOwner {
        require(_feeBps <= 500, "Fee too high"); // Max 5%
        protocolFeeBps = _feeBps;
    }

    function receiveFee() external payable {
        totalFeesAccumulated += msg.value;
        // Distribute to fee recipient (could be staking contract)
        payable(feeRecipient).transfer(msg.value);
    }
}
```

### Priority 2: MediaTokenFactory Implementation

**File**: `packages/contracts/contracts/MediaTokenFactory.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MediaToken.sol";
import "./CAST.sol";

/**
 * @title MediaTokenFactory
 * @notice Factory for creating per-media ERC-20 tokens
 * @dev Each media upload creates a new token ($PIC, $VID, etc)
 */
contract MediaTokenFactory {
    CAST public castToken;
    address[] public allTokens;
    mapping(string => address) public tokenByTicker;

    event TokenCreated(
        address indexed token,
        string ticker,
        string name,
        address indexed creator,
        string mediaUrl
    );

    constructor(address _castToken) {
        castToken = CAST(_castToken);
    }

    function createMediaToken(
        string memory ticker,
        string memory name,
        string memory mediaUrl,
        uint256 initialSupply
    ) external returns (address) {
        require(tokenByTicker[ticker] == address(0), "Ticker exists");

        MediaToken token = new MediaToken(
            name,
            ticker,
            initialSupply,
            msg.sender
        );

        address tokenAddress = address(token);
        allTokens.push(tokenAddress);
        tokenByTicker[ticker] = tokenAddress;

        emit TokenCreated(tokenAddress, ticker, name, msg.sender, mediaUrl);

        return tokenAddress;
    }

    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }
}
```

### Priority 3: Bonding Curve Market

**File**: `packages/contracts/contracts/MarketPlace.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CAST.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title MarketPlace
 * @notice Bonding curve market for media tokens
 * @dev Uses bancor formula for price discovery, 2.5% fee to CAST
 */
contract MarketPlace {
    CAST public castToken;

    struct Market {
        address token;
        uint256 poolBalance;
        uint256 reserveBalance;
        uint32 reserveRatio; // in ppm (parts per million)
    }

    mapping(address => Market) public markets;

    event Buy(address indexed token, address indexed buyer, uint256 amount, uint256 cost);
    event Sell(address indexed token, address indexed seller, uint256 amount, uint256 payout);

    constructor(address _castToken) {
        castToken = CAST(_castToken);
    }

    function buy(address token, uint256 amount) external payable {
        Market storage market = markets[token];
        require(market.token != address(0), "Market not found");

        uint256 cost = calculatePurchaseCost(market, amount);
        uint256 fee = (cost * castToken.protocolFeeBps()) / 10000;

        require(msg.value >= cost + fee, "Insufficient payment");

        // Send fee to CAST
        castToken.receiveFee{value: fee}();

        // Update market
        market.reserveBalance += cost;

        // Transfer tokens
        IERC20(token).transfer(msg.sender, amount);

        emit Buy(token, msg.sender, amount, cost);
    }

    function sell(address token, uint256 amount) external {
        Market storage market = markets[token];
        require(market.token != address(0), "Market not found");

        uint256 payout = calculateSalePayout(market, amount);
        uint256 fee = (payout * castToken.protocolFeeBps()) / 10000;

        // Transfer tokens from seller
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        // Update market
        market.reserveBalance -= (payout + fee);

        // Send fee to CAST
        castToken.receiveFee{value: fee}();

        // Send payout to seller
        payable(msg.sender).transfer(payout);

        emit Sell(token, msg.sender, amount, payout);
    }

    function calculatePurchaseCost(Market memory market, uint256 amount)
        public
        pure
        returns (uint256)
    {
        // Simplified bonding curve: linear for MVP
        // Production: Use Bancor formula
        return amount * 1e15; // 0.001 ETH per token
    }

    function calculateSalePayout(Market memory market, uint256 amount)
        public
        pure
        returns (uint256)
    {
        return amount * 9e14; // 0.0009 ETH per token (with slippage)
    }
}
```

---

## 🎨 Phase 3: Builder UI

### Component 1: Media Upload

**File**: `apps/web/components/MediaUpload.tsx`

```typescript
"use client";

import { useState } from "react";
import { useSmartBrain } from "@/hooks/useSmartBrain";

export function MediaUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [ticker, setTicker] = useState("");
  const [name, setName] = useState("");
  const { analyzeMedia, createToken } = useSmartBrain();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);

    // Smart Brain analysis
    const analysis = await analyzeMedia(file);
    setTicker(analysis.suggestedTicker);
    setName(analysis.suggestedName);
  };

  const handleCreate = async () => {
    if (!file) return;

    // Upload to IPFS
    const mediaUrl = await uploadToIPFS(file);

    // Create token via factory
    const token = await createToken({
      ticker,
      name,
      mediaUrl,
      initialSupply: 1000000,
    });

    // Generate frame
    await generateFrame(token);
  };

  return (
    <div className="media-upload">
      <input type="file" onChange={handleUpload} />
      {file && (
        <>
          <input value={ticker} onChange={(e) => setTicker(e.target.value)} />
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <button onClick={handleCreate}>Create Token</button>
        </>
      )}
    </div>
  );
}
```

---

## 🤖 Phase 4: AI Layer

### Smart Brain Analysis Service

**File**: `packages/ai-brain/src/MediaAnalyzer.ts`

```typescript
export class MediaAnalyzer {
  async analyzeImage(file: File): Promise<MediaAnalysis> {
    // Computer vision analysis
    const features = await this.extractFeatures(file);

    return {
      type: "image",
      suggestedTicker: this.generateTicker(features),
      suggestedName: this.generateName(features),
      description: this.generateDescription(features),
      tags: features.tags,
      riskScore: this.calculateRisk(features),
    };
  }

  private generateTicker(features: ImageFeatures): string {
    // AI-powered ticker generation
    // Examples: $SUNSET, $OCEAN, $CITY
    return `$${features.primaryTag.toUpperCase()}`;
  }

  private calculateRisk(features: ImageFeatures): number {
    // Spam/NSFW detection
    // Returns 0-100 score
    return 0; // Safe
  }
}
```

---

## 🎮 Phase 5: Frames Integration

### Farcaster Frame

**File**: `castquest-constellation/castquest-frames/src/TokenPriceFrame.tsx`

```typescript
import { FrameMetadata } from "@coinbase/onchainkit";

export function TokenPriceFrame({ token }: { token: string }) {
  return (
    <FrameMetadata
      buttons={[{ label: "Buy" }, { label: "Sell" }, { label: "View" }]}
      image={`/api/frame/token/${token}/image`}
      postUrl={`/api/frame/token/${token}/action`}
    />
  );
}
```

---

## 🛡️ Phase 6: Admin Console

### Permission Management

**File**: `apps/admin/components/PermissionManager.tsx`

```typescript
"use client";

import { usePermissions } from "@/hooks/usePermissions";

export function PermissionManager() {
  const { roles, updateRole, assignRole } = usePermissions();

  return (
    <div className="permission-manager">
      <h2>Role-Based Access Control</h2>
      {roles.map((role) => (
        <RoleCard key={role.id} role={role} onUpdate={updateRole} />
      ))}
    </div>
  );
}
```

---

## 📋 Implementation Checklist

### Immediate Next Steps (Week 1-2)

- [ ] **Contracts Repository**

  - [ ] Initialize `castquest-contracts` repo
  - [ ] Implement CAST.sol
  - [ ] Implement MediaTokenFactory.sol
  - [ ] Implement MarketPlace.sol
  - [ ] Write deployment scripts
  - [ ] Deploy to Base Sepolia testnet

- [ ] **Builder UI (Phase 1)**

  - [ ] Create MediaUpload component
  - [ ] Integrate Web3 wallet connection
  - [ ] Connect to MediaTokenFactory
  - [ ] IPFS upload integration

- [ ] **Smart Brain Analysis**
  - [ ] Basic image analysis
  - [ ] Ticker generation algorithm
  - [ ] Risk scoring system

### Short-term (Week 3-4)

- [ ] **Market Integration**

  - [ ] Buy/Sell UI components
  - [ ] Price chart integration
  - [ ] Transaction history

- [ ] **Frames**

  - [ ] Token price frame
  - [ ] Trade frame
  - [ ] Farcaster integration

- [ ] **Admin Console**
  - [ ] Fee management UI
  - [ ] Risk monitoring dashboard
  - [ ] Protocol analytics

### Medium-term (Month 2)

- [ ] **Mainnet Deployment**

  - [ ] Audit contracts
  - [ ] Deploy to Base mainnet
  - [ ] Launch initial liquidity

- [ ] **Advanced Features**
  - [ ] Game templates
  - [ ] Token-gated content
  - [ ] Governance system

---

## 🎯 Recommended Next Command

```bash
# Use Smart Brain to commit this roadmap
.smartbrain/brain.sh auto

# Then proceed with contracts repo setup
git clone <castquest-contracts-repo>
cd castquest-contracts
forge init
```

---

**Status**: ✅ Phase 1 Complete - Ready for Phase 2  
**Next**: Implement core contracts (CAST.sol, MediaTokenFactory.sol, MarketPlace.sol)

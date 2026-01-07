# Module 7: Mint & Render Engine

Module 7 provides the mint creation, frame rendering, and automation worker systems.

## Overview

**M7: Mint + Render + Automation Worker MEGA**

Comprehensive engine for:
- NFT mint creation and management
- Mint simulation and claiming
- Frame rendering engine
- Strategy worker automation
- Event logging and tracking

## Core Features

### 1. Mint Management

Create and manage collectible mints:

```typescript
// Create mint
const mint = await client.mints.create({
  name: 'Founder Badge',
  description: 'Early supporter badge',
  supply: 100,
  price: '0.001',
  network: 'base',
  metadata: {
    image: '/media/founder-badge.png',
    attributes: [
      { trait_type: 'Tier', value: 'Founder' },
      { trait_type: 'Edition', value: 'Limited' }
    ]
  }
});

// List mints
const mints = await client.mints.list();

// Get mint details
const mintDetails = await client.mints.get(mintId);
```

### 2. Mint Simulation

Simulate minting before execution:

```typescript
const simulation = await client.mints.simulate(mintId, {
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  quantity: 1
});

console.log('Gas estimate:', simulation.gasEstimate);
console.log('Total cost:', simulation.totalCost);
console.log('Success probability:', simulation.successProbability);
```

### 3. Mint Claiming

Execute mint claims:

```typescript
const result = await client.mints.claim(mintId, {
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  quantity: 1,
  signature: userSignature
});

console.log('Transaction hash:', result.txHash);
console.log('Token IDs:', result.tokenIds);
```

### 4. Frame-Mint Attachment

Attach mints to frames:

```typescript
await client.mints.attachToFrame(mintId, frameId);

// Frame now has mint capability
const frame = await client.frames.get(frameId);
console.log('Attached mint:', frame.mintId);
```

### 5. Quest-Mint Attachment

Attach mints as quest rewards:

```typescript
await client.mints.attachToQuest(mintId, questId);

// Mint distributed on quest completion
```

### 6. Frame Rendering

Render frames to HTML/React:

```typescript
const rendered = await client.frames.render(frameId);

console.log('HTML:', rendered.html);
console.log('React:', rendered.react);
console.log('Metadata:', rendered.metadata);
```

### 7. Worker Automation

Automated background processing:

```typescript
// Trigger worker scan
await client.worker.scan();

// Run specific operation
await client.worker.run('distribute_rewards');

// Get worker status
const status = await client.worker.getStatus();
```

## Data Structure

### Mint Object

```typescript
interface Mint {
  id: string;
  name: string;
  description?: string;
  supply: number;
  claimed: number;
  price: string;
  network: string;
  contractAddress?: string;
  metadata: {
    image: string;
    attributes?: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
  createdAt: string;
}
```

### Mint Event

```typescript
interface MintEvent {
  id: string;
  mintId: string;
  type: 'created' | 'simulated' | 'claimed' | 'attached';
  userId?: string;
  data: Record<string, any>;
  timestamp: string;
}
```

### Worker Event

```typescript
interface WorkerEvent {
  id: string;
  type: 'scan' | 'trigger' | 'execute' | 'error';
  operation: string;
  status: 'success' | 'failure' | 'pending';
  details?: any;
  timestamp: string;
}
```

## API Endpoints

### Create Mint

```typescript
POST /api/mints/create

Request:
{
  "name": "Founder Badge",
  "supply": 100,
  "price": "0.001"
}

Response:
{
  "ok": true,
  "mint": {
    "id": "mint_123",
    "name": "Founder Badge",
    "supply": 100
  }
}
```

### Simulate Mint

```typescript
POST /api/mints/simulate

Request:
{
  "mintId": "mint_123",
  "address": "0x...",
  "quantity": 1
}

Response:
{
  "ok": true,
  "gasEstimate": "21000",
  "totalCost": "0.001",
  "successProbability": 0.99
}
```

### Claim Mint

```typescript
POST /api/mints/claim

Request:
{
  "mintId": "mint_123",
  "address": "0x...",
  "quantity": 1,
  "signature": "0x..."
}

Response:
{
  "ok": true,
  "txHash": "0xabc...",
  "tokenIds": ["1", "2"]
}
```

### Attach to Frame

```typescript
POST /api/mints/attach-to-frame

Request:
{
  "mintId": "mint_123",
  "frameId": "frame_456"
}
```

### Attach to Quest

```typescript
POST /api/mints/attach-to-quest

Request:
{
  "mintId": "mint_123",
  "questId": "quest_789"
}
```

### Render Frame

```typescript
POST /api/frames/render

Request:
{
  "frameId": "frame_456"
}

Response:
{
  "ok": true,
  "html": "<div>...</div>",
  "metadata": {...}
}
```

### Worker Run

```typescript
POST /api/strategy/worker/run

Request:
{
  "operation": "distribute_rewards"
}
```

### Worker Scan

```typescript
POST /api/strategy/worker/scan

Response:
{
  "ok": true,
  "scanned": 150,
  "triggered": 5
}
```

## JSON Data Files

### mints.json
```json
[
  {
    "id": "mint_founder",
    "name": "Founder Badge",
    "supply": 100,
    "claimed": 23,
    "price": "0.001",
    "createdAt": "2024-01-06T12:00:00Z"
  }
]
```

### mint-events.json
```json
[
  {
    "id": "event_1",
    "mintId": "mint_founder",
    "type": "claimed",
    "userId": "user_alice",
    "timestamp": "2024-01-06T13:00:00Z"
  }
]
```

### frames.json
```json
[
  {
    "id": "frame_welcome",
    "templateId": "template_welcome",
    "mintId": "mint_founder",
    "layout": {...},
    "status": "published"
  }
]
```

### worker-events.json
```json
[
  {
    "id": "worker_1",
    "type": "execute",
    "operation": "distribute_rewards",
    "status": "success",
    "timestamp": "2024-01-06T14:00:00Z"
  }
]
```

## Admin Interface

Access at: `http://localhost:3010/mints`

Features:
- List all mints
- Create new mints
- View mint details
- Simulate claims
- Track claim events
- Attach to frames/quests

## Integration Example

Complete minting workflow:

```typescript
import { CastQuestClient } from '@castquest/sdk';

async function completeMintWorkflow() {
  const client = new CastQuestClient({
    apiUrl: 'http://localhost:3010/api'
  });
  
  // 1. Create mint
  const mint = await client.mints.create({
    name: 'Epic Badge',
    supply: 50,
    price: '0.001'
  });
  
  // 2. Create frame
  const frame = await client.frames.create({
    layout: {
      primaryText: 'Collect Epic Badge',
      cta: { label: 'Mint', action: 'mint' }
    }
  });
  
  // 3. Attach mint to frame
  await client.mints.attachToFrame(mint.id, frame.id);
  
  // 4. Simulate claim
  const simulation = await client.mints.simulate(mint.id, {
    address: '0x...',
    quantity: 1
  });
  
  console.log('Simulation:', simulation);
  
  // 5. Claim (in production)
  // const result = await client.mints.claim(mint.id, {...});
  
  return { mint, frame };
}
```

## Best Practices

1. **Simulate First**: Always simulate before claiming
2. **Set Appropriate Supply**: Consider demand
3. **Price Correctly**: Research market prices
4. **Monitor Claims**: Track claim events
5. **Handle Errors**: Implement retry logic
6. **Use Worker**: Automate repetitive tasks

## Next Steps

- [Module M8: Brain](/architecture/modules/m8-brain) - AI automation
- [API Reference](/api/endpoints/mints) - Mints API
- [Strategy Worker](/guide/concepts/strategy-worker) - Worker automation

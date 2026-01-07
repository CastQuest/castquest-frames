# Module 4: BASE API & Objects

Module 4 provides the foundation for blockchain interactions, core data structures, and mobile-friendly admin interface.

## Overview

**M4: BASE API + Mobile Admin + Strategy Dashboard**

Core components:
- Mock BASE blockchain routes for development
- Mobile-responsive admin layout
- Core object definitions
- Strategy worker dashboard
- Data surface layer

## Features

### 1. BASE Chain Mock API

Development-friendly mock blockchain operations:

```typescript
// Mock mint operation
POST /api/base/mint
{
  "address": "0x...",
  "tokenId": "123",
  "quantity": 1
}

// Mock frame onchain operation
POST /api/base/frame
{
  "frameId": "frame_123",
  "action": "publish"
}

// Token information
GET /api/base/token-info/:tokenId

// Transaction status
GET /api/base/tx-status/:txHash
```

### 2. Core Data Objects

**Quest Object**
```typescript
interface Quest {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'completed';
  steps: QuestStep[];
  rewards?: QuestReward[];
  createdAt: string;
  updatedAt: string;
}
```

**Frame Object**
```typescript
interface Frame {
  id: string;
  templateId?: string;
  mediaId?: string;
  layout: FrameLayout;
  metadata: Record<string, any>;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}
```

**Mint Object**
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
  metadata: Record<string, any>;
  createdAt: string;
}
```

### 3. Mobile-Friendly Admin

Responsive admin interface with:
- Touch-optimized controls
- Mobile navigation
- Responsive layouts
- Gesture support

Access at: `http://localhost:3010`

### 4. Strategy Dashboard

Monitor autonomous worker operations:

```
http://localhost:3010/strategy
```

Features:
- Real-time worker status
- Operation logs
- Performance metrics
- Manual triggers
- Configuration editor

## API Routes

### BASE Chain Routes

#### Mint NFT

```typescript
POST /api/base/mint

Request:
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "tokenId": "123",
  "quantity": 1
}

Response:
{
  "ok": true,
  "txHash": "0xabc123...",
  "status": "pending"
}
```

#### Frame Publish

```typescript
POST /api/base/frame

Request:
{
  "frameId": "frame_123",
  "action": "publish",
  "chainId": 8453
}

Response:
{
  "ok": true,
  "txHash": "0xdef456...",
  "contractAddress": "0x..."
}
```

#### Token Info

```typescript
GET /api/base/token-info/:tokenId

Response:
{
  "tokenId": "123",
  "name": "Founder Badge",
  "owner": "0x...",
  "metadata": {
    "image": "ipfs://...",
    "attributes": [...]
  }
}
```

#### Transaction Status

```typescript
GET /api/base/tx-status/:txHash

Response:
{
  "txHash": "0xabc123...",
  "status": "confirmed",
  "blockNumber": 12345678,
  "confirmations": 12
}
```

## Data Storage

### JSON Files

Module 4 uses JSON files for data persistence:

```
data/
├── quests.json
├── quest-steps.json
├── quest-rewards.json
├── quest-progress.json
├── frames.json
├── frame-templates.json
├── mints.json
├── mint-events.json
└── worker-events.json
```

### OracleDB Service

Database abstraction layer:

```typescript
import { OracleDBService } from '@castquest/core-services';

const db = new OracleDBService({
  dataDir: './data',
  tables: ['quests', 'frames', 'mints']
});

// Query data
const quests = await db.query('quests', {
  status: 'active'
});

// Insert data
await db.insert('quests', {
  id: 'quest_123',
  name: 'New Quest',
  status: 'draft'
});

// Update data
await db.update('quests', 'quest_123', {
  status: 'active'
});
```

## Admin Dashboard

### Layout Structure

```
┌──────────────────────────────────────┐
│         Header / Navigation          │
├──────────────────────────────────────┤
│                                      │
│  Sidebar    │    Main Content        │
│             │                        │
│  - Quests   │  ┌──────────────────┐ │
│  - Frames   │  │  Content Area    │ │
│  - Mints    │  │                  │ │
│  - Strategy │  └──────────────────┘ │
│             │                        │
└──────────────────────────────────────┘
```

### Mobile Navigation

Responsive drawer-based navigation:

```typescript
<ShellLayout>
  <MobileDrawer>
    <NavItems />
  </MobileDrawer>
  
  <MainContent>
    {children}
  </MainContent>
</ShellLayout>
```

## Strategy Dashboard

### Dashboard Features

1. **Worker Status**
   - Running/Stopped indicator
   - Uptime tracking
   - Operations processed
   - Queue size

2. **Operation Logs**
   - Real-time log streaming
   - Filterable by type
   - Searchable
   - Exportable

3. **Performance Metrics**
   - Operations per minute
   - Success/failure rates
   - Average processing time
   - Resource usage

4. **Manual Controls**
   - Start/stop worker
   - Trigger specific operations
   - Clear queue
   - View configuration

### Accessing the Dashboard

```bash
# Start admin with strategy dashboard
pnpm --filter ./apps/admin dev -- -p 3010

# Navigate to
http://localhost:3010/strategy
```

## Configuration

### Module Configuration

```typescript
// m4-config.ts
export default {
  baseChain: {
    network: 'base',
    chainId: 8453,
    rpcUrl: process.env.BASE_RPC_URL,
    mock: process.env.NODE_ENV === 'development'
  },
  
  database: {
    type: 'json',
    dataDir: './data',
    autoSave: true,
    backupInterval: 3600000  // 1 hour
  },
  
  admin: {
    port: 3010,
    mobileOptimized: true,
    theme: 'dark'
  },
  
  strategy: {
    enabled: true,
    autoStart: true,
    dashboardPath: '/strategy'
  }
};
```

## Integration Example

Complete M4 integration:

```typescript
import { CastQuestClient } from '@castquest/sdk';
import { OracleDBService } from '@castquest/core-services';

// Initialize database
const db = new OracleDBService({
  dataDir: './data'
});

// Initialize client with BASE mock
const client = new CastQuestClient({
  apiUrl: 'http://localhost:3010/api',
  network: 'base',
  onchain: {
    mock: true,
    rpcUrl: 'http://localhost:8545'
  }
});

// Create quest (stored in JSON)
const quest = await client.quests.create({
  name: 'My Quest',
  description: 'Test quest'
});

// Mock onchain operation
const mintResult = await fetch('http://localhost:3010/api/base/mint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    tokenId: '123'
  })
});

console.log('Mock mint result:', await mintResult.json());
```

## Best Practices

1. **Use Mock in Development**: Enable BASE mock for faster development
2. **Backup JSON Files**: Regularly backup data directory
3. **Monitor Strategy Dashboard**: Keep an eye on worker operations
4. **Mobile Testing**: Test admin on mobile devices
5. **Transaction Validation**: Validate before real blockchain operations

## Troubleshooting

### Mock API Not Responding

```bash
# Check if admin is running
curl http://localhost:3010/api/health

# Check BASE mock routes
curl http://localhost:3010/api/base/token-info/123
```

### Data Not Persisting

- Check data directory permissions
- Verify autoSave is enabled
- Check disk space
- Review error logs

### Strategy Dashboard Not Loading

- Ensure admin is running on port 3010
- Check browser console for errors
- Verify `/strategy` route exists

## Next Steps

- [Module M5B: Quest Engine](/architecture/modules/m5b-quests) - Quest management system
- [Module M6: Templates](/architecture/modules/m6-templates) - Frame templates
- [Module M7: Engine](/architecture/modules/m7-engine) - Mint & render engine
- [Module M8: Brain](/architecture/modules/m8-brain) - Smart Brain AI
- [API Reference](/api/endpoints/base) - BASE API documentation

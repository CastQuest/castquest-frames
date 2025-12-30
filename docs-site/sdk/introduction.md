# SDK Introduction

The CastQuest SDK provides a TypeScript/JavaScript interface for interacting with the CastQuest Protocol.

## Features

- **Type-Safe** - Full TypeScript support with comprehensive types
- **Framework Agnostic** - Works with React, Vue, Node.js, and more
- **Lightweight** - Minimal dependencies
- **Well-Documented** - Complete API documentation with examples

## Installation

```bash
npm install @castquest/sdk
# or
pnpm add @castquest/sdk
# or
yarn add @castquest/sdk
```

## Quick Start

```typescript
import { CastQuestClient } from '@castquest/sdk';

// Initialize the client
const client = new CastQuestClient({
  apiUrl: 'http://localhost:3010/api',
  network: 'base'
});

// Create a quest
const quest = await client.quests.create({
  name: 'My First Quest',
  description: 'Getting started with CastQuest'
});

// Add steps
await client.quests.addStep(quest.id, {
  stepType: 'social',
  description: 'Follow us on Farcaster',
  requirement: 'follow',
  params: { account: 'castquest' }
});

// Activate the quest
await client.quests.activate(quest.id);
```

## Core Modules

### Frames Client
Create and manage frames:

```typescript
const frame = await client.frames.create({
  layout: {
    primaryText: 'Hello World',
    image: '/media/welcome.png'
  }
});
```

### Quest Manager
Manage quests and progress:

```typescript
const progress = await client.quests.getProgress(questId, userId);
await client.quests.completeStep(questId, userId, stepIndex);
```

### Template Engine
Work with frame templates:

```typescript
const frame = await client.templates.apply(templateId, {
  userName: 'Alice',
  questName: 'Getting Started'
});
```

### Mint Controller
Create and manage collectibles:

```typescript
const mint = await client.mints.create({
  name: 'Founder Badge',
  supply: 100,
  price: '0.001'
});
```

## Configuration

Create a `castquest.config.ts` file:

```typescript
import { defineConfig } from '@castquest/sdk';

export default defineConfig({
  apiUrl: process.env.CASTQUEST_API_URL || 'http://localhost:3010/api',
  network: 'base',
  
  // Optional: Custom data directory
  dataDir: './castquest-data',
  
  // Optional: Smart Brain configuration
  smartBrain: {
    enabled: true,
    apiKey: process.env.OPENAI_API_KEY
  },
  
  // Optional: Onchain configuration
  onchain: {
    rpcUrl: process.env.BASE_RPC_URL,
    mock: process.env.NODE_ENV === 'development'
  }
});
```

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions:

```typescript
import type {
  Quest,
  QuestStep,
  Frame,
  FrameTemplate,
  Mint
} from '@castquest/sdk';

const quest: Quest = {
  id: 'quest_123',
  name: 'My Quest',
  description: 'A quest',
  status: 'active',
  // ... TypeScript will ensure all required fields are present
};
```

## Error Handling

The SDK throws typed errors:

```typescript
import { CastQuestError, NotFoundError, ValidationError } from '@castquest/sdk';

try {
  await client.quests.get('invalid_id');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('Quest not found');
  } else if (error instanceof ValidationError) {
    console.log('Validation failed:', error.errors);
  } else if (error instanceof CastQuestError) {
    console.log('CastQuest error:', error.message);
  }
}
```

## React Integration

Use with React hooks:

```typescript
import { useCastQuest } from '@castquest/sdk/react';

function MyComponent() {
  const { client } = useCastQuest();
  const [quests, setQuests] = useState([]);
  
  useEffect(() => {
    client.quests.list().then(setQuests);
  }, [client]);
  
  return (
    <div>
      {quests.map(quest => (
        <div key={quest.id}>{quest.name}</div>
      ))}
    </div>
  );
}
```

## Next Steps

- [Installation Guide](/sdk/installation) - Detailed setup instructions
- [Quick Start](/sdk/quick-start) - Build your first integration
- [API Reference](/sdk/api/index) - Complete API documentation
- [Examples](/sdk/examples/basic) - Code examples and patterns

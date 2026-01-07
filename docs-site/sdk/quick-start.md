# Quick Start

Get up and running with the CastQuest SDK in under 5 minutes.

## Prerequisites

- Node.js 20+ or compatible runtime
- Package manager (npm, pnpm, or yarn)
- Basic TypeScript/JavaScript knowledge

## Installation

Install the SDK in your project:

```bash
npm install @castquest/sdk
# or
pnpm add @castquest/sdk
# or
yarn add @castquest/sdk
```

## Initialize the Client

Create a new client instance:

```typescript
import { CastQuestClient } from '@castquest/sdk';

const client = new CastQuestClient({
  apiUrl: 'http://localhost:3010/api',
  network: 'base'
});
```

## Create Your First Quest

```typescript
// Create a quest
const quest = await client.quests.create({
  name: 'Getting Started',
  description: 'Complete your first quest on CastQuest'
});

console.log('Quest created:', quest.id);

// Add a step
await client.quests.addStep(quest.id, {
  stepType: 'social',
  description: 'Follow @castquest on Farcaster',
  requirement: 'follow',
  params: { account: 'castquest' }
});

// Activate the quest
await client.quests.activate(quest.id);

console.log('Quest is now live!');
```

## Create a Frame

```typescript
const frame = await client.frames.create({
  layout: {
    primaryText: 'Welcome to CastQuest!',
    secondaryText: 'Start your journey in Web3',
    image: '/media/welcome.png',
    cta: {
      label: 'Get Started',
      action: 'navigate',
      params: { url: '/quests' }
    }
  }
});

console.log('Frame created:', frame.id);
```

## Apply a Template

```typescript
// List available templates
const templates = await client.templates.list();

// Apply a template
const frameFromTemplate = await client.templates.apply('template_welcome', {
  userName: 'Alice',
  questName: 'Getting Started'
});

console.log('Frame generated from template:', frameFromTemplate.id);
```

## Create a Mint

```typescript
const mint = await client.mints.create({
  name: 'Founder Badge',
  description: 'Early supporter badge',
  supply: 100,
  price: '0.001',
  network: 'base'
});

// Simulate claiming
const simulation = await client.mints.simulate(mint.id, {
  address: '0x1234...',
  quantity: 1
});

console.log('Gas estimate:', simulation.gasEstimate);
```

## Track Quest Progress

```typescript
const userId = 'user_alice';
const questId = quest.id;

// Get current progress
const progress = await client.quests.getProgress(questId, userId);

console.log('Progress:', progress);
// {
//   questId: 'quest_123',
//   userId: 'user_alice',
//   completedSteps: 1,
//   totalSteps: 3,
//   percentComplete: 33
// }

// Complete a step
await client.quests.completeStep(questId, userId, 0);

// Check if quest is complete
const isComplete = await client.quests.isComplete(questId, userId);
```

## Error Handling

The SDK throws typed errors for better error handling:

```typescript
import { CastQuestError, NotFoundError, ValidationError } from '@castquest/sdk';

try {
  await client.quests.get('invalid_id');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.error('Quest not found');
  } else if (error instanceof ValidationError) {
    console.error('Validation failed:', error.errors);
  } else if (error instanceof CastQuestError) {
    console.error('SDK error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Configuration Options

You can customize the client behavior:

```typescript
const client = new CastQuestClient({
  // Required
  apiUrl: 'http://localhost:3010/api',
  
  // Optional
  network: 'base',                    // Default: 'base'
  timeout: 30000,                     // Request timeout in ms
  retries: 3,                         // Number of retries on failure
  dataDir: './castquest-data',       // Local data directory
  
  // Smart Brain configuration
  smartBrain: {
    enabled: true,
    apiKey: process.env.OPENAI_API_KEY
  },
  
  // Onchain configuration
  onchain: {
    rpcUrl: process.env.BASE_RPC_URL,
    mock: process.env.NODE_ENV === 'development'
  }
});
```

## React Integration

Use the SDK with React hooks:

```typescript
import { useCastQuest } from '@castquest/sdk/react';
import { useEffect, useState } from 'react';

function QuestList() {
  const { client } = useCastQuest();
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    client.quests.list()
      .then(setQuests)
      .finally(() => setLoading(false));
  }, [client]);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <ul>
      {quests.map(quest => (
        <li key={quest.id}>{quest.name}</li>
      ))}
    </ul>
  );
}
```

## Next Steps

Now that you've got the basics down, explore more advanced features:

- [Configuration](/sdk/configuration) - Detailed configuration options
- [API Reference](/sdk/api/index) - Complete API documentation
- [Examples](/sdk/examples/basic) - More code examples
- [Error Handling](/sdk/examples/error-handling) - Advanced error handling patterns

## Common Patterns

### Batch Operations

```typescript
// Create multiple quests at once
const questPromises = [
  client.quests.create({ name: 'Quest 1' }),
  client.quests.create({ name: 'Quest 2' }),
  client.quests.create({ name: 'Quest 3' })
];

const quests = await Promise.all(questPromises);
```

### Polling for Updates

```typescript
async function pollQuestProgress(questId: string, userId: string) {
  const interval = setInterval(async () => {
    const progress = await client.quests.getProgress(questId, userId);
    
    if (progress.percentComplete === 100) {
      clearInterval(interval);
      console.log('Quest complete!');
    }
  }, 5000); // Poll every 5 seconds
}
```

### Caching Results

```typescript
class CachedQuestClient {
  private cache = new Map();
  
  async getQuest(id: string) {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }
    
    const quest = await client.quests.get(id);
    this.cache.set(id, quest);
    return quest;
  }
}
```

## Troubleshooting

### Connection Issues

If you're having trouble connecting to the API:

1. Verify the API is running: `curl http://localhost:3010/api/health`
2. Check your network configuration
3. Ensure firewall isn't blocking the connection

### Type Errors

If you're getting TypeScript errors:

1. Ensure you're using TypeScript 5.0+
2. Check that types are exported correctly: `import type { Quest } from '@castquest/sdk'`
3. Update your `tsconfig.json` to include proper module resolution

### Performance Issues

For better performance:

1. Enable response caching
2. Use batch operations when possible
3. Implement request debouncing for user-triggered actions
4. Consider using the React hooks for automatic state management

## Support

- [GitHub Issues](https://github.com/CastQuest/castquest-frames/issues)
- [Discord Community](https://discord.gg/castquest)
- [Documentation](/)

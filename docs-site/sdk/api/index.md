# SDK API Reference

Complete API documentation for the CastQuest SDK.

## Client Initialization

### CastQuestClient

Main client class for interacting with the CastQuest Protocol.

```typescript
import { CastQuestClient } from '@castquest/sdk';

const client = new CastQuestClient(config);
```

**Parameters:**
- `config`: `CastQuestConfig` - Configuration object

**Returns:** `CastQuestClient` instance

## Core Modules

The SDK is organized into functional modules:

### Quests Module

Manage multi-step quests.

```typescript
client.quests.create(data)
client.quests.list()
client.quests.get(id)
client.quests.update(id, data)
client.quests.delete(id)
client.quests.addStep(questId, step)
client.quests.getProgress(questId, userId)
client.quests.completeStep(questId, userId, stepIndex)
client.quests.activate(questId)
client.quests.deactivate(questId)
```

### Frames Module

Create and manage frames.

```typescript
client.frames.create(data)
client.frames.list()
client.frames.get(id)
client.frames.update(id, data)
client.frames.delete(id)
client.frames.render(id)
client.frames.validate(data)
```

### Templates Module

Work with frame templates.

```typescript
client.templates.create(data)
client.templates.list()
client.templates.get(id)
client.templates.update(id, data)
client.templates.delete(id)
client.templates.apply(id, params)
```

### Mints Module

Create and manage collectible mints.

```typescript
client.mints.create(data)
client.mints.list()
client.mints.get(id)
client.mints.simulate(id, options)
client.mints.claim(id, options)
client.mints.attachToFrame(mintId, frameId)
client.mints.attachToQuest(mintId, questId)
```

### Media Module

Manage media assets.

```typescript
client.media.upload(file)
client.media.list()
client.media.get(id)
client.media.delete(id)
```

### Smart Brain Module

AI-powered suggestions and automation.

```typescript
client.brain.suggest(context)
client.brain.validate(data)
client.brain.optimize(params)
```

## Detailed API

### Quests API

#### create()

Create a new quest.

```typescript
const quest = await client.quests.create({
  name: string;
  description?: string;
  status?: 'draft' | 'active' | 'completed';
});
```

**Returns:** `Promise<Quest>`

#### list()

List all quests.

```typescript
const quests = await client.quests.list();
```

**Returns:** `Promise<Quest[]>`

#### get()

Get a specific quest by ID.

```typescript
const quest = await client.quests.get(questId);
```

**Parameters:**
- `questId`: `string` - Quest identifier

**Returns:** `Promise<Quest>`

#### addStep()

Add a step to a quest.

```typescript
const step = await client.quests.addStep(questId, {
  stepType: 'social' | 'onchain' | 'custom';
  description: string;
  requirement: string;
  params?: Record<string, any>;
});
```

**Returns:** `Promise<QuestStep>`

#### getProgress()

Get user progress for a quest.

```typescript
const progress = await client.quests.getProgress(questId, userId);
```

**Returns:** `Promise<QuestProgress>`

```typescript
interface QuestProgress {
  questId: string;
  userId: string;
  completedSteps: number;
  totalSteps: number;
  percentComplete: number;
  startedAt: string;
  completedAt?: string;
}
```

#### completeStep()

Mark a quest step as complete for a user.

```typescript
await client.quests.completeStep(questId, userId, stepIndex);
```

**Returns:** `Promise<void>`

### Frames API

#### create()

Create a new frame.

```typescript
const frame = await client.frames.create({
  layout: {
    primaryText: string;
    secondaryText?: string;
    image?: string;
    cta?: {
      label: string;
      action: string;
      params?: Record<string, any>;
    };
  };
  metadata?: Record<string, any>;
});
```

**Returns:** `Promise<Frame>`

#### render()

Render a frame to HTML/React.

```typescript
const rendered = await client.frames.render(frameId);
```

**Returns:** `Promise<RenderedFrame>`

#### validate()

Validate frame data.

```typescript
const result = await client.frames.validate(frameData);
```

**Returns:** `Promise<ValidationResult>`

```typescript
interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}
```

### Templates API

#### apply()

Apply a template to generate a frame.

```typescript
const frame = await client.templates.apply(templateId, {
  userName: 'Alice',
  questName: 'Getting Started',
  // ... other template parameters
});
```

**Returns:** `Promise<Frame>`

### Mints API

#### create()

Create a new mint.

```typescript
const mint = await client.mints.create({
  name: string;
  description?: string;
  supply: number;
  price: string;
  network: 'base' | 'ethereum';
  metadata?: Record<string, any>;
});
```

**Returns:** `Promise<Mint>`

#### simulate()

Simulate a mint claim.

```typescript
const simulation = await client.mints.simulate(mintId, {
  address: string;
  quantity: number;
});
```

**Returns:** `Promise<MintSimulation>`

```typescript
interface MintSimulation {
  success: boolean;
  gasEstimate: string;
  totalCost: string;
  warnings?: string[];
}
```

#### claim()

Claim a mint.

```typescript
const result = await client.mints.claim(mintId, {
  address: string;
  quantity: number;
  signature?: string;
});
```

**Returns:** `Promise<ClaimResult>`

## Type Definitions

### Quest

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

### QuestStep

```typescript
interface QuestStep {
  id: string;
  questId: string;
  stepType: 'social' | 'onchain' | 'custom';
  description: string;
  requirement: string;
  params?: Record<string, any>;
  order: number;
}
```

### Frame

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

### FrameLayout

```typescript
interface FrameLayout {
  primaryText: string;
  secondaryText?: string;
  image?: string;
  cta?: {
    label: string;
    action: string;
    params?: Record<string, any>;
  };
}
```

### FrameTemplate

```typescript
interface FrameTemplate {
  id: string;
  name: string;
  description?: string;
  layout: FrameLayout;
  parameters: TemplateParameter[];
  createdAt: string;
  updatedAt: string;
}
```

### Mint

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

## Error Handling

The SDK throws typed errors:

### CastQuestError

Base error class for all SDK errors.

```typescript
class CastQuestError extends Error {
  code: string;
  details?: any;
}
```

### NotFoundError

Thrown when a resource is not found.

```typescript
class NotFoundError extends CastQuestError {
  resourceType: string;
  resourceId: string;
}
```

### ValidationError

Thrown when validation fails.

```typescript
class ValidationError extends CastQuestError {
  errors: ValidationErrorDetail[];
}
```

### NetworkError

Thrown when a network request fails.

```typescript
class NetworkError extends CastQuestError {
  statusCode?: number;
  response?: any;
}
```

## Events

The client emits events for monitoring:

```typescript
client.on('request', (event) => {
  console.log('Request:', event);
});

client.on('response', (event) => {
  console.log('Response:', event);
});

client.on('error', (error) => {
  console.error('Error:', error);
});
```

## Utilities

### Validation Utilities

```typescript
import { validateQuest, validateFrame, validateMint } from '@castquest/sdk/utils';

const isValid = validateQuest(questData);
```

### Type Guards

```typescript
import { isQuest, isFrame, isMint } from '@castquest/sdk/utils';

if (isQuest(data)) {
  // TypeScript knows data is a Quest
}
```

## React Hooks

### useCastQuest

```typescript
import { useCastQuest } from '@castquest/sdk/react';

function MyComponent() {
  const { client } = useCastQuest();
  // Use client...
}
```

### useQuest

```typescript
import { useQuest } from '@castquest/sdk/react';

function QuestDetails({ questId }) {
  const { quest, loading, error } = useQuest(questId);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{quest.name}</div>;
}
```

### useQuests

```typescript
import { useQuests } from '@castquest/sdk/react';

function QuestList() {
  const { quests, loading, error } = useQuests();
  // Render quests...
}
```

## Advanced Usage

### Custom Adapters

Create custom adapters for different backends:

```typescript
import { createAdapter } from '@castquest/sdk';

const customAdapter = createAdapter({
  async fetch(url, options) {
    // Custom fetch logic
  }
});

const client = new CastQuestClient({
  apiUrl: 'http://localhost:3010/api',
  adapter: customAdapter
});
```

### Middleware

Add middleware for request/response processing:

```typescript
client.use(async (context, next) => {
  console.log('Before request');
  await next();
  console.log('After response');
});
```

## Migration Guide

### From v0.0.x to v0.1.x

Breaking changes:
- `client.quest` renamed to `client.quests`
- `client.frame` renamed to `client.frames`
- Updated method signatures for better type safety

## See Also

- [Quick Start](/sdk/quick-start) - Get started with the SDK
- [Configuration](/sdk/configuration) - Configure the SDK
- [Examples](/sdk/examples/basic) - Code examples
- [GitHub Repository](https://github.com/CastQuest/castquest-frames)

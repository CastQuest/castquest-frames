# Module 5B: Quest Engine

Module 5B provides comprehensive multi-step quest management with progress tracking, rewards, and automation.

## Overview

**M5B: Quest Engine MEGA**

Complete quest lifecycle management:
- Quest creation and configuration
- Multi-step workflow management
- Progress tracking per user
- Reward distribution
- Quest triggers and automation
- Admin and web interfaces

## Core Features

### 1. Quest Management

Create and manage quests with multiple steps:

```typescript
// Create quest
const quest = await client.quests.create({
  name: 'Onboarding Quest',
  description: 'Complete your onboarding',
  status: 'draft'
});

// Add steps
await client.quests.addStep(quest.id, {
  stepType: 'social',
  description: 'Follow @castquest',
  requirement: 'follow',
  params: { account: 'castquest' }
});

await client.quests.addStep(quest.id, {
  stepType: 'onchain',
  description: 'Mint your first NFT',
  requirement: 'mint',
  params: { mintId: 'mint_welcome' }
});

// Add rewards
await client.quests.addReward(quest.id, {
  type: 'xp',
  amount: 100
});

// Activate
await client.quests.activate(quest.id);
```

### 2. Progress Tracking

Track user progress through quests:

```typescript
// Get progress
const progress = await client.quests.getProgress(questId, userId);

console.log(`${progress.completedSteps}/${progress.totalSteps} steps complete`);
console.log(`${progress.percentComplete}% complete`);

// Complete a step
await client.quests.completeStep(questId, userId, stepIndex);

// Check completion
const isComplete = await client.quests.isComplete(questId, userId);
```

### 3. Quest Rewards

Define and distribute rewards:

```typescript
// Add multiple reward types
await client.quests.addReward(questId, {
  type: 'xp',
  amount: 100
});

await client.quests.addReward(questId, {
  type: 'badge',
  badgeId: 'badge_onboarding'
});

await client.quests.addReward(questId, {
  type: 'nft',
  mintId: 'mint_reward'
});

// Distribute rewards on completion
await client.quests.distributeRewards(questId, userId);
```

### 4. Quest Triggers

Automate quest activation and completion:

```typescript
// Time-based trigger
await client.quests.addTrigger(questId, {
  type: 'time',
  schedule: '0 0 * * *',  // Daily at midnight
  action: 'activate'
});

// Event-based trigger
await client.quests.addTrigger(questId, {
  type: 'event',
  event: 'user_registered',
  action: 'assign'
});

// Condition-based trigger
await client.quests.addTrigger(questId, {
  type: 'condition',
  condition: 'user.level >= 5',
  action: 'unlock'
});
```

## Data Structure

### Quest Object

```typescript
interface Quest {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'completed';
  steps: QuestStep[];
  rewards: QuestReward[];
  metadata: {
    category?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    estimatedTime?: number;
    prerequisites?: string[];
  };
  createdAt: string;
  updatedAt: string;
}
```

### Quest Step

```typescript
interface QuestStep {
  id: string;
  questId: string;
  stepType: 'social' | 'onchain' | 'custom';
  description: string;
  requirement: string;
  params?: Record<string, any>;
  order: number;
  optional: boolean;
}
```

### Quest Progress

```typescript
interface QuestProgress {
  id: string;
  questId: string;
  userId: string;
  completedSteps: number[];
  totalSteps: number;
  percentComplete: number;
  status: 'not_started' | 'in_progress' | 'completed';
  startedAt?: string;
  completedAt?: string;
}
```

### Quest Reward

```typescript
interface QuestReward {
  id: string;
  questId: string;
  type: 'xp' | 'badge' | 'nft' | 'token' | 'custom';
  amount?: number;
  itemId?: string;
  metadata?: Record<string, any>;
}
```

## API Endpoints

### Create Quest

```typescript
POST /api/quests/create

Request:
{
  "name": "Welcome Quest",
  "description": "Get started with CastQuest",
  "metadata": {
    "category": "onboarding",
    "difficulty": "easy"
  }
}

Response:
{
  "ok": true,
  "quest": {
    "id": "quest_123",
    "name": "Welcome Quest",
    "status": "draft",
    "createdAt": "2024-01-06T12:00:00Z"
  }
}
```

### Add Quest Step

```typescript
POST /api/quests/add-step

Request:
{
  "questId": "quest_123",
  "stepName": "Connect Wallet",
  "stepType": "onchain",
  "requirements": {
    "action": "connect_wallet"
  }
}

Response:
{
  "ok": true,
  "step": {
    "id": "step_456",
    "questId": "quest_123",
    "order": 0
  }
}
```

### Add Quest Reward

```typescript
POST /api/quests/add-reward

Request:
{
  "questId": "quest_123",
  "type": "xp",
  "amount": 100
}

Response:
{
  "ok": true,
  "reward": {
    "id": "reward_789",
    "type": "xp",
    "amount": 100
  }
}
```

### Track Progress

```typescript
POST /api/quests/progress

Request:
{
  "questId": "quest_123",
  "userId": "user_alice"
}

Response:
{
  "questId": "quest_123",
  "userId": "user_alice",
  "completedSteps": 2,
  "totalSteps": 5,
  "percentComplete": 40
}
```

### Complete Quest

```typescript
POST /api/quests/complete

Request:
{
  "questId": "quest_123",
  "userId": "user_alice"
}

Response:
{
  "ok": true,
  "rewards": [
    { "type": "xp", "amount": 100 },
    { "type": "badge", "badgeId": "badge_onboarding" }
  ]
}
```

### Trigger Quest

```typescript
POST /api/quests/trigger

Request:
{
  "questId": "quest_123",
  "action": "activate"
}

Response:
{
  "ok": true,
  "status": "active"
}
```

## JSON Data Files

### quests.json

```json
[
  {
    "id": "quest_welcome",
    "name": "Welcome Quest",
    "description": "Get started",
    "status": "active",
    "steps": ["step_1", "step_2"],
    "rewards": ["reward_xp"],
    "createdAt": "2024-01-06T12:00:00Z"
  }
]
```

### quest-steps.json

```json
[
  {
    "id": "step_1",
    "questId": "quest_welcome",
    "stepType": "social",
    "description": "Follow @castquest",
    "requirement": "follow",
    "order": 0
  }
]
```

### quest-rewards.json

```json
[
  {
    "id": "reward_xp",
    "questId": "quest_welcome",
    "type": "xp",
    "amount": 100
  }
]
```

### quest-progress.json

```json
[
  {
    "id": "progress_1",
    "questId": "quest_welcome",
    "userId": "user_alice",
    "completedSteps": [0, 1],
    "status": "in_progress"
  }
]
```

## Admin Interface

### Quest Management UI

Access at: `http://localhost:3010/quests`

Features:
- List all quests
- Create new quests
- Edit quest details
- Add/remove steps
- Configure rewards
- View progress analytics
- Activate/deactivate quests

### Quest Creation Flow

```
1. Create Quest
   └─> Name, description, metadata

2. Add Steps
   └─> Step type, requirements, order

3. Add Rewards
   └─> Reward type, amount, conditions

4. Configure Triggers
   └─> Trigger type, schedule, action

5. Activate
   └─> Make quest live
```

## Web Interface

### User-Facing Quest Display

Access at: `http://localhost:3000/quests`

Features:
- Browse available quests
- View quest details
- See personal progress
- Complete steps
- Claim rewards

### Quest Detail Page

```
Quest: Welcome to CastQuest
━━━━━━━━━━━━━━━━━━━━━━━

Description: Get started with the protocol

Progress: ██████░░░░ 60% (3/5 steps)

Steps:
✓ 1. Follow @castquest
✓ 2. Create your profile
✓ 3. Connect wallet
  4. Mint your first frame
  5. Complete onboarding

Rewards:
• 100 XP
• Onboarding Badge
• Welcome NFT

[Continue Quest]
```

## Integration Example

Complete quest implementation:

```typescript
import { CastQuestClient } from '@castquest/sdk';

async function createCompleteQuest() {
  const client = new CastQuestClient({
    apiUrl: 'http://localhost:3010/api'
  });
  
  // 1. Create quest
  const quest = await client.quests.create({
    name: 'Epic Adventure',
    description: 'Complete an epic adventure',
    metadata: {
      category: 'adventure',
      difficulty: 'hard',
      estimatedTime: 7200  // 2 hours
    }
  });
  
  // 2. Add steps
  const steps = [
    {
      stepType: 'social',
      description: 'Share your journey',
      requirement: 'share'
    },
    {
      stepType: 'onchain',
      description: 'Complete a transaction',
      requirement: 'tx_confirmed'
    },
    {
      stepType: 'custom',
      description: 'Solve the puzzle',
      requirement: 'puzzle_solved'
    }
  ];
  
  for (const step of steps) {
    await client.quests.addStep(quest.id, step);
  }
  
  // 3. Add rewards
  await client.quests.addReward(quest.id, {
    type: 'xp',
    amount: 500
  });
  
  await client.quests.addReward(quest.id, {
    type: 'nft',
    mintId: 'mint_epic_badge'
  });
  
  // 4. Activate
  await client.quests.activate(quest.id);
  
  console.log('Quest created and activated:', quest.id);
  
  return quest;
}
```

## Best Practices

1. **Clear Step Descriptions**: Make step requirements obvious
2. **Logical Ordering**: Order steps from easy to hard
3. **Appropriate Rewards**: Match rewards to quest difficulty
4. **Test Thoroughly**: Test all steps before activating
5. **Monitor Progress**: Track completion rates
6. **Iterate**: Adjust based on user feedback

## Troubleshooting

### Steps Not Completing

- Verify requirement conditions
- Check user permissions
- Review step dependencies
- Check API logs

### Rewards Not Distributing

- Verify reward configuration
- Check mint availability
- Review distribution logic
- Check user eligibility

### Progress Not Tracking

- Verify user ID format
- Check database connections
- Review progress tracking logic
- Check for race conditions

## Next Steps

- [Module M6: Templates](/architecture/modules/m6-templates) - Frame templates
- [Module M7: Engine](/architecture/modules/m7-engine) - Mint & render
- [Module M8: Brain](/architecture/modules/m8-brain) - AI automation
- [API Reference](/api/endpoints/quests) - Quest API documentation
- [Quest Concept](/guide/concepts/quests) - Quest system overview

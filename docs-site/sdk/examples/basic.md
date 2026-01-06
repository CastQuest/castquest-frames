# Basic Usage Examples

Learn the fundamentals of the CastQuest SDK through practical examples.

## Installation & Setup

```bash
npm install @castquest/sdk
```

```typescript
import { CastQuestClient } from '@castquest/sdk';

const client = new CastQuestClient({
  apiUrl: 'http://localhost:3010/api',
  network: 'base'
});
```

## Example 1: Create a Simple Quest

```typescript
async function createSimpleQuest() {
  // Create the quest
  const quest = await client.quests.create({
    name: 'Welcome Quest',
    description: 'Get started with CastQuest Protocol'
  });
  
  console.log('Quest created:', quest.id);
  
  // Add steps
  await client.quests.addStep(quest.id, {
    stepType: 'social',
    description: 'Follow @castquest on Farcaster',
    requirement: 'follow',
    params: { account: 'castquest' }
  });
  
  await client.quests.addStep(quest.id, {
    stepType: 'social',
    description: 'Share this quest',
    requirement: 'share',
    params: { type: 'cast' }
  });
  
  // Activate the quest
  await client.quests.activate(quest.id);
  
  return quest;
}
```

## Example 2: Track Quest Progress

```typescript
async function trackProgress(questId: string, userId: string) {
  // Get current progress
  const progress = await client.quests.getProgress(questId, userId);
  
  console.log(`Progress: ${progress.completedSteps}/${progress.totalSteps}`);
  console.log(`Percent complete: ${progress.percentComplete}%`);
  
  // Complete a step
  if (progress.completedSteps < progress.totalSteps) {
    await client.quests.completeStep(
      questId,
      userId,
      progress.completedSteps
    );
    
    console.log('Step completed!');
  }
  
  // Check if quest is complete
  const updated = await client.quests.getProgress(questId, userId);
  if (updated.percentComplete === 100) {
    console.log('Quest complete! 🎉');
  }
  
  return updated;
}
```

## Example 3: Create and Render a Frame

```typescript
async function createFrame() {
  const frame = await client.frames.create({
    layout: {
      primaryText: 'Welcome to CastQuest!',
      secondaryText: 'Build composable experiences on Farcaster',
      image: '/media/welcome-banner.png',
      cta: {
        label: 'Get Started',
        action: 'navigate',
        params: { url: '/quests' }
      }
    },
    metadata: {
      tags: ['welcome', 'intro'],
      author: 'castquest-team'
    }
  });
  
  console.log('Frame created:', frame.id);
  
  // Render the frame
  const rendered = await client.frames.render(frame.id);
  console.log('Rendered HTML:', rendered.html);
  
  return frame;
}
```

## Example 4: Work with Templates

```typescript
async function useTemplate() {
  // List available templates
  const templates = await client.templates.list();
  console.log('Available templates:', templates.map(t => t.name));
  
  // Apply a template
  const frame = await client.templates.apply('template_quest_complete', {
    questName: 'Welcome Quest',
    userName: 'Alice',
    rewardAmount: '100',
    rewardType: 'points'
  });
  
  console.log('Frame generated from template:', frame.id);
  
  return frame;
}
```

## Example 5: Create a Collectible Mint

```typescript
async function createMint() {
  const mint = await client.mints.create({
    name: 'Founder Badge',
    description: 'Early supporter of CastQuest Protocol',
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
  
  console.log('Mint created:', mint.id);
  
  // Simulate a claim
  const simulation = await client.mints.simulate(mint.id, {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    quantity: 1
  });
  
  console.log('Gas estimate:', simulation.gasEstimate);
  console.log('Total cost:', simulation.totalCost);
  
  return mint;
}
```

## Example 6: Attach Mint to Quest Reward

```typescript
async function questWithMintReward() {
  // Create a quest
  const quest = await client.quests.create({
    name: 'Complete Tutorial',
    description: 'Learn the basics and earn a badge'
  });
  
  // Add steps
  await client.quests.addStep(quest.id, {
    stepType: 'custom',
    description: 'Read the documentation',
    requirement: 'docs_read'
  });
  
  // Create a mint for the reward
  const mint = await client.mints.create({
    name: 'Tutorial Complete Badge',
    supply: 1000,
    price: '0'
  });
  
  // Attach mint to quest
  await client.mints.attachToQuest(mint.id, quest.id);
  
  console.log('Quest with mint reward created!');
  
  return { quest, mint };
}
```

## Example 7: List and Filter Resources

```typescript
async function listResources() {
  // List all quests
  const allQuests = await client.quests.list();
  console.log('Total quests:', allQuests.length);
  
  // Filter active quests
  const activeQuests = allQuests.filter(q => q.status === 'active');
  console.log('Active quests:', activeQuests.length);
  
  // List frames
  const frames = await client.frames.list();
  console.log('Total frames:', frames.length);
  
  // List mints
  const mints = await client.mints.list();
  console.log('Total mints:', mints.length);
  
  return { allQuests, activeQuests, frames, mints };
}
```

## Example 8: Validate Data Before Submission

```typescript
async function validateBeforeCreate() {
  // Validate frame data
  const frameData = {
    layout: {
      primaryText: 'Hello',
      image: '/media/test.png'
    }
  };
  
  const validation = await client.frames.validate(frameData);
  
  if (validation.valid) {
    const frame = await client.frames.create(frameData);
    console.log('Frame created:', frame.id);
    return frame;
  } else {
    console.error('Validation errors:', validation.errors);
    return null;
  }
}
```

## Example 9: Use Smart Brain for Suggestions

```typescript
async function getSuggestions() {
  // Get content suggestions
  const suggestion = await client.brain.suggest({
    context: 'frame',
    type: 'content',
    params: {
      topic: 'onchain quests',
      tone: 'friendly',
      length: 'short'
    }
  });
  
  console.log('Suggested text:', suggestion.text);
  
  // Create frame with suggested content
  const frame = await client.frames.create({
    layout: {
      primaryText: suggestion.text,
      cta: {
        label: 'Learn More',
        action: 'navigate',
        params: { url: '/quests' }
      }
    }
  });
  
  return frame;
}
```

## Example 10: Batch Operations

```typescript
async function batchCreate() {
  // Create multiple quests in parallel
  const questPromises = [
    client.quests.create({ name: 'Quest 1' }),
    client.quests.create({ name: 'Quest 2' }),
    client.quests.create({ name: 'Quest 3' })
  ];
  
  const quests = await Promise.all(questPromises);
  console.log('Created quests:', quests.map(q => q.id));
  
  // Add steps to all quests
  for (const quest of quests) {
    await client.quests.addStep(quest.id, {
      stepType: 'social',
      description: 'Follow on Farcaster',
      requirement: 'follow'
    });
  }
  
  return quests;
}
```

## Example 11: Error Handling

```typescript
import { 
  NotFoundError, 
  ValidationError, 
  CastQuestError 
} from '@castquest/sdk';

async function handleErrors() {
  try {
    const quest = await client.quests.get('invalid_id');
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.error('Quest not found:', error.resourceId);
    } else if (error instanceof ValidationError) {
      console.error('Validation failed:', error.errors);
    } else if (error instanceof CastQuestError) {
      console.error('SDK error:', error.code, error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}
```

## Example 12: React Integration

```typescript
import { useCastQuest } from '@castquest/sdk/react';
import { useState, useEffect } from 'react';

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
        <li key={quest.id}>
          <h3>{quest.name}</h3>
          <p>{quest.description}</p>
        </li>
      ))}
    </ul>
  );
}
```

## Example 13: Real-time Progress Updates

```typescript
async function monitorProgress(questId: string, userId: string) {
  let previousProgress = 0;
  
  const checkProgress = setInterval(async () => {
    const progress = await client.quests.getProgress(questId, userId);
    
    if (progress.percentComplete !== previousProgress) {
      console.log(`Progress updated: ${progress.percentComplete}%`);
      previousProgress = progress.percentComplete;
      
      if (progress.percentComplete === 100) {
        console.log('Quest completed! 🎉');
        clearInterval(checkProgress);
      }
    }
  }, 5000); // Check every 5 seconds
  
  // Clean up after 5 minutes
  setTimeout(() => clearInterval(checkProgress), 300000);
}
```

## Example 14: Custom Frame Actions

```typescript
async function customFrameAction() {
  const frame = await client.frames.create({
    layout: {
      primaryText: 'Join our community',
      cta: {
        label: 'Connect',
        action: 'custom',
        params: {
          handler: 'connectWallet',
          network: 'base',
          redirect: '/dashboard'
        }
      }
    }
  });
  
  return frame;
}
```

## Example 15: Complete Workflow

```typescript
async function completeWorkflow() {
  // 1. Create a quest
  const quest = await client.quests.create({
    name: 'Complete Onboarding',
    description: 'Welcome to CastQuest!'
  });
  
  // 2. Add steps
  await client.quests.addStep(quest.id, {
    stepType: 'social',
    description: 'Follow @castquest',
    requirement: 'follow'
  });
  
  await client.quests.addStep(quest.id, {
    stepType: 'custom',
    description: 'Create your first frame',
    requirement: 'frame_created'
  });
  
  // 3. Create a reward mint
  const mint = await client.mints.create({
    name: 'Onboarding Complete',
    supply: 500,
    price: '0'
  });
  
  // 4. Attach mint to quest
  await client.mints.attachToQuest(mint.id, quest.id);
  
  // 5. Create announcement frame
  const frame = await client.templates.apply('template_quest_launch', {
    questName: quest.name,
    rewardName: mint.name
  });
  
  // 6. Activate quest
  await client.quests.activate(quest.id);
  
  console.log('Complete workflow finished!');
  console.log('Quest:', quest.id);
  console.log('Mint:', mint.id);
  console.log('Frame:', frame.id);
  
  return { quest, mint, frame };
}
```

## Running the Examples

To run these examples:

```typescript
// main.ts
import { CastQuestClient } from '@castquest/sdk';

const client = new CastQuestClient({
  apiUrl: 'http://localhost:3010/api',
  network: 'base'
});

// Make client available to examples
(global as any).client = client;

// Run an example
createSimpleQuest()
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Error:', error));
```

## Next Steps

- [Error Handling Examples](/sdk/examples/error-handling) - Advanced error handling patterns
- [Frame Validation](/sdk/examples/validation) - Validate frames before submission
- [Quest Integration](/sdk/examples/quest-integration) - Complex quest workflows
- [API Reference](/sdk/api/index) - Complete API documentation

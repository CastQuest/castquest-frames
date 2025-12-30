# Quick Start

Let's create your first quest in CastQuest Protocol! This tutorial will walk you through the basics.

## What You'll Build

By the end of this guide, you'll have:
- A multi-step quest
- Quest steps with requirements
- Rewards for completion
- Progress tracking

## Step 1: Start the Admin Dashboard

If you haven't already, start the admin dashboard:

```bash
pnpm --filter ./apps/admin dev -- -p 3010
```

Open [http://localhost:3010](http://localhost:3010) in your browser.

## Step 2: Navigate to Quests

1. Click on **Quests** in the navigation menu
2. You'll see a list of existing quests (if any)
3. Click the **Create Quest** button

## Step 3: Create Your Quest

Fill in the quest details:

**Name:** `Getting Started Quest`  
**Description:** `Complete your first CastQuest tutorial`

Click **Create Quest**.

## Step 4: Add Quest Steps

Now let's add steps to your quest:

### Step 1: Join the Community

```json
{
  "stepType": "social",
  "description": "Follow @CastQuest on Farcaster",
  "requirement": "follow",
  "target": "castquest"
}
```

### Step 2: Create a Frame

```json
{
  "stepType": "action",
  "description": "Create your first frame",
  "requirement": "frame_create",
  "params": {
    "minFrames": 1
  }
}
```

### Step 3: Mint a Collectible

```json
{
  "stepType": "mint",
  "description": "Mint your first collectible",
  "requirement": "mint_claim",
  "params": {
    "minMints": 1
  }
}
```

## Step 5: Add Rewards

Configure rewards for completing the quest:

```json
{
  "type": "badge",
  "title": "First Quest Completed",
  "description": "Successfully completed the Getting Started quest",
  "image": "/badges/first-quest.png"
}
```

## Step 6: Activate the Quest

1. Review your quest configuration
2. Click **Activate Quest**
3. Your quest is now live!

## Step 7: Test Quest Progress

Open the web app to test your quest:

```bash
pnpm --filter ./apps/web dev
```

Visit [http://localhost:3000/quests](http://localhost:3000/quests) and you'll see your new quest listed.

## Understanding the Data

CastQuest stores all data in JSON files for transparency:

```bash
# View your quest
cat data/quests.json

# View quest steps
cat data/quest-steps.json

# View quest rewards
cat data/quest-rewards.json
```

## Using the API

You can also create quests programmatically using the API:

```typescript
// Create a quest
const response = await fetch('http://localhost:3010/api/quests/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'My API Quest',
    description: 'Created via API'
  })
});

const { quest } = await response.json();
console.log('Quest created:', quest.id);
```

## Next Steps

Now that you've created your first quest, explore more features:

- [Build a Custom Frame](/guide/tutorials/custom-frame) - Create interactive frames
- [Apply Frame Templates](/guide/tutorials/frame-templates) - Use reusable templates
- [Quest Concepts](/guide/concepts/quests) - Deep dive into quest mechanics
- [API Reference](/api/endpoints/quests) - Full API documentation

## Common Patterns

### Quest with Multiple Paths

Create a quest where users can choose different paths:

```typescript
{
  "name": "Choose Your Adventure",
  "steps": [
    { "type": "choice", "options": ["path_a", "path_b"] },
    { "type": "conditional", "branch": "path_a", "action": "..." },
    { "type": "conditional", "branch": "path_b", "action": "..." }
  ]
}
```

### Time-Limited Quest

Add time constraints to your quest:

```typescript
{
  "name": "Daily Challenge",
  "constraints": {
    "startTime": "2025-01-01T00:00:00Z",
    "endTime": "2025-01-01T23:59:59Z"
  }
}
```

### Quest with Prerequisites

Require completion of other quests:

```typescript
{
  "name": "Advanced Quest",
  "prerequisites": ["quest_getting_started", "quest_basics"]
}
```

## Troubleshooting

### Quest Not Appearing

Check that the quest is activated:
```bash
cat data/quests.json | jq '.[] | select(.id=="your-quest-id") | .status'
```

### Steps Not Validating

Ensure the strategy worker is running:
```bash
pnpm --filter @castquest/strategy-worker dev
```

### Progress Not Saving

Check the quest-progress.json file:
```bash
cat data/quest-progress.json
```

## Learn More

- [Quest Engine Architecture](/architecture/modules/m5b-quests)
- [API Endpoints](/api/endpoints/quests)
- [Strategy Worker](/guide/concepts/smart-brain)

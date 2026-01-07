# Apply Frame Templates

Learn how to use frame templates to quickly create consistent, reusable frames.

## What Are Frame Templates?

Frame templates are pre-built frame structures with customizable parameters. They allow you to:
- Create consistent frames across your protocol
- Reduce development time
- Maintain brand consistency
- Enable non-technical users to create frames

## Prerequisites

- CastQuest SDK installed
- Understanding of basic frames
- Access to template library

## Step 1: List Available Templates

First, discover what templates are available:

```typescript
import { CastQuestClient } from '@castquest/sdk';

const client = new CastQuestClient({
  apiUrl: 'http://localhost:3010/api',
  network: 'base'
});

// List all templates
const templates = await client.templates.list();

templates.forEach(template => {
  console.log(`${template.name} - ${template.description}`);
  console.log(`  Parameters:`, template.parameters.map(p => p.name));
});
```

## Step 2: View Template Details

Get detailed information about a specific template:

```typescript
const templateId = 'template_quest_complete';
const template = await client.templates.get(templateId);

console.log('Template:', template.name);
console.log('Description:', template.description);
console.log('Parameters:');

template.parameters.forEach(param => {
  console.log(`  - ${param.name} (${param.type}): ${param.description}`);
  if (param.required) console.log(`    Required: Yes`);
  if (param.default) console.log(`    Default: ${param.default}`);
});
```

## Step 3: Apply a Simple Template

Apply a template with basic parameters:

```typescript
const frame = await client.templates.apply('template_welcome', {
  userName: 'Alice',
  platform: 'CastQuest'
});

console.log('Frame created from template:', frame.id);
```

## Step 4: Quest Completion Template

Use the quest completion template:

```typescript
const questCompleteFrame = await client.templates.apply(
  'template_quest_complete',
  {
    questName: 'Onboarding Quest',
    userName: 'Alice',
    rewardAmount: '100',
    rewardType: 'XP',
    questDuration: '15 minutes',
    completionDate: new Date().toISOString()
  }
);

console.log('Quest completion frame:', questCompleteFrame.id);
```

## Step 5: Achievement Unlock Template

Create an achievement frame:

```typescript
const achievementFrame = await client.templates.apply(
  'template_achievement_unlock',
  {
    achievementName: 'First Quest',
    achievementDescription: 'Complete your first quest',
    achievementIcon: '/media/achievements/first-quest.png',
    userName: 'Alice',
    rarity: 'Common',
    earnedDate: new Date().toISOString()
  }
);
```

## Step 6: NFT Mint Template

Use the NFT mint template:

```typescript
const mintFrame = await client.templates.apply(
  'template_nft_mint',
  {
    nftName: 'Founder Badge',
    nftDescription: 'Early supporter of CastQuest',
    nftImage: '/media/nft/founder-badge.png',
    price: '0.001 ETH',
    supply: '100',
    remaining: '73',
    mintUrl: '/mint/founder-badge'
  }
);
```

## Step 7: Social Share Template

Create a social sharing frame:

```typescript
const shareFrame = await client.templates.apply(
  'template_social_share',
  {
    message: 'Just completed an epic quest on CastQuest!',
    image: '/media/quest-complete.png',
    shareUrl: 'https://castquest.xyz/quest/123',
    ctaLabel: 'Join Me',
    tags: ['web3', 'quests', 'castquest']
  }
);
```

## Step 8: Create Custom Template

Define your own reusable template:

```typescript
const customTemplate = await client.templates.create({
  name: 'Custom Welcome',
  description: 'Welcome message for new users',
  layout: {
    primaryText: '{{greeting}} {{userName}}!',
    secondaryText: 'Welcome to {{platformName}}',
    image: '{{welcomeImage}}',
    cta: {
      label: '{{ctaLabel}}',
      action: 'navigate',
      params: {
        url: '{{ctaUrl}}'
      }
    }
  },
  parameters: [
    {
      name: 'greeting',
      type: 'string',
      description: 'Greeting message',
      required: true,
      default: 'Hello'
    },
    {
      name: 'userName',
      type: 'string',
      description: 'User name',
      required: true
    },
    {
      name: 'platformName',
      type: 'string',
      description: 'Platform name',
      default: 'CastQuest'
    },
    {
      name: 'welcomeImage',
      type: 'string',
      description: 'Welcome image URL',
      default: '/media/welcome-default.png'
    },
    {
      name: 'ctaLabel',
      type: 'string',
      description: 'CTA button label',
      default: 'Get Started'
    },
    {
      name: 'ctaUrl',
      type: 'string',
      description: 'CTA destination URL',
      required: true
    }
  ]
});

console.log('Custom template created:', customTemplate.id);

// Use the custom template
const frame = await client.templates.apply(customTemplate.id, {
  greeting: 'Welcome',
  userName: 'Alice',
  ctaUrl: '/onboarding'
});
```

## Step 9: Template with Conditional Logic

Templates can include conditional parameters:

```typescript
const conditionalFrame = await client.templates.apply(
  'template_conditional_message',
  {
    userName: 'Alice',
    questsCompleted: 5,
    isPremium: true,
    showPremiumBadge: true
  }
);
```

## Step 10: Batch Template Application

Apply templates to multiple items:

```typescript
const users = [
  { name: 'Alice', questsComplete: 5 },
  { name: 'Bob', questsComplete: 3 },
  { name: 'Carol', questsComplete: 8 }
];

const frames = await Promise.all(
  users.map(user => 
    client.templates.apply('template_user_stats', {
      userName: user.name,
      questsCompleted: user.questsComplete,
      rank: calculateRank(user.questsComplete)
    })
  )
);

console.log(`Created ${frames.length} frames from template`);
```

## Built-in Templates

### Welcome Template
```typescript
template_welcome
Parameters: userName, platform
```

### Quest Complete Template
```typescript
template_quest_complete
Parameters: questName, userName, rewardAmount, rewardType
```

### Achievement Unlock Template
```typescript
template_achievement_unlock
Parameters: achievementName, userName, rarity, earnedDate
```

### NFT Mint Template
```typescript
template_nft_mint
Parameters: nftName, price, supply, remaining, mintUrl
```

### Social Share Template
```typescript
template_social_share
Parameters: message, image, shareUrl, ctaLabel
```

### Leaderboard Template
```typescript
template_leaderboard
Parameters: title, topUsers, userRank, userName
```

### Event Announcement Template
```typescript
template_event_announcement
Parameters: eventName, eventDate, eventDescription, registrationUrl
```

## Advanced Template Usage

### Template Inheritance

Create templates that extend other templates:

```typescript
const baseTemplate = await client.templates.get('template_base_frame');

const extendedTemplate = await client.templates.create({
  name: 'Extended Welcome',
  description: 'Welcome with additional features',
  extends: baseTemplate.id,
  additionalParameters: [
    {
      name: 'specialOffer',
      type: 'string',
      description: 'Special offer text'
    }
  ]
});
```

### Template Versioning

Manage template versions:

```typescript
const template = await client.templates.get('template_welcome');

// Create new version
const v2 = await client.templates.createVersion(template.id, {
  changes: 'Updated styling and added new parameter',
  layout: {
    // Updated layout
  }
});

// Use specific version
const frame = await client.templates.apply(
  `${template.id}@v2`,
  parameters
);
```

### Template Preview

Preview template before applying:

```typescript
const preview = await client.templates.preview('template_welcome', {
  userName: 'Alice',
  platform: 'CastQuest'
});

console.log('Preview:', preview);
// Shows how the frame will look with these parameters
```

## Template Best Practices

1. **Clear Parameter Names**: Use descriptive parameter names
2. **Provide Defaults**: Set sensible defaults for optional parameters
3. **Document Parameters**: Include clear descriptions
4. **Validate Input**: Validate parameters before applying
5. **Version Templates**: Track template changes
6. **Test Thoroughly**: Test with various parameter combinations
7. **Reuse Common Patterns**: Create templates for repeated use cases

## Template Management

### Update Template

```typescript
await client.templates.update(templateId, {
  description: 'Updated description',
  parameters: [
    // Updated parameters
  ]
});
```

### Delete Template

```typescript
await client.templates.delete(templateId);
```

### Export/Import Templates

```typescript
// Export template
const exported = await client.templates.export(templateId);
const json = JSON.stringify(exported, null, 2);

// Import template
const imported = await client.templates.import(json);
```

## Troubleshooting

### Missing Required Parameters

If you get a validation error for missing parameters:

```typescript
try {
  await client.templates.apply(templateId, params);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Missing parameters:', error.errors);
  }
}
```

### Invalid Parameter Values

Check parameter types and constraints:

```typescript
const template = await client.templates.get(templateId);
template.parameters.forEach(param => {
  console.log(`${param.name}: ${param.type}`);
  if (param.constraints) {
    console.log('  Constraints:', param.constraints);
  }
});
```

### Template Not Found

Verify template exists:

```typescript
const templates = await client.templates.list();
const exists = templates.some(t => t.id === templateId);

if (!exists) {
  console.error('Template not found:', templateId);
}
```

## Complete Example

Here's a complete example of using templates:

```typescript
import { CastQuestClient } from '@castquest/sdk';

async function completeTemplateExample() {
  const client = new CastQuestClient({
    apiUrl: 'http://localhost:3010/api'
  });
  
  // 1. List templates
  const templates = await client.templates.list();
  console.log('Available templates:', templates.length);
  
  // 2. Get template details
  const template = await client.templates.get('template_quest_complete');
  console.log('Template parameters:', template.parameters);
  
  // 3. Apply template
  const frame = await client.templates.apply(template.id, {
    questName: 'Epic Adventure',
    userName: 'Alice',
    rewardAmount: '500',
    rewardType: 'XP'
  });
  
  console.log('Frame created:', frame.id);
  
  // 4. Render frame
  const rendered = await client.frames.render(frame.id);
  console.log('Rendered frame ready');
  
  return frame;
}
```

## Next Steps

- [Custom Frames](/guide/tutorials/custom-frame) - Build custom frames
- [Deployment](/guide/tutorials/deployment) - Deploy to production
- [Templates Concept](/guide/concepts/templates) - Deep dive into templates
- [API Reference](/api/endpoints/frame-templates) - Template API documentation

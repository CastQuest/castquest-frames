# Build a Custom Frame

Learn how to create custom frames with advanced features and interactions.

## Overview

Custom frames allow you to create rich, interactive experiences on Farcaster with full control over layout, actions, and behavior.

## Prerequisites

- CastQuest SDK installed
- Basic understanding of frames
- Admin dashboard running (optional, for testing)

## Step 1: Basic Frame Structure

Start with a simple frame:

```typescript
import { CastQuestClient } from '@castquest/sdk';

const client = new CastQuestClient({
  apiUrl: 'http://localhost:3010/api',
  network: 'base'
});

const basicFrame = await client.frames.create({
  layout: {
    primaryText: 'Welcome to My Custom Frame',
    secondaryText: 'This is a custom interactive experience',
    image: '/media/custom-frame.png'
  }
});

console.log('Frame created:', basicFrame.id);
```

## Step 2: Add Interactive Elements

Add a call-to-action button:

```typescript
const interactiveFrame = await client.frames.create({
  layout: {
    primaryText: 'Join Our Quest',
    secondaryText: 'Complete challenges and earn rewards',
    image: '/media/quest-banner.png',
    cta: {
      label: 'Start Now',
      action: 'navigate',
      params: {
        url: '/quests/onboarding'
      }
    }
  },
  metadata: {
    category: 'quest',
    tags: ['onboarding', 'interactive']
  }
});
```

## Step 3: Multiple Action Types

Frames support various action types:

### Navigation Action

```typescript
cta: {
  label: 'Learn More',
  action: 'navigate',
  params: { url: '/about' }
}
```

### Mint Action

```typescript
cta: {
  label: 'Collect NFT',
  action: 'mint',
  params: { 
    mintId: 'mint_123',
    quantity: 1
  }
}
```

### Quest Action

```typescript
cta: {
  label: 'Start Quest',
  action: 'quest_start',
  params: { 
    questId: 'quest_456' 
  }
}
```

### Custom Action

```typescript
cta: {
  label: 'Connect Wallet',
  action: 'custom',
  params: { 
    handler: 'connectWallet',
    network: 'base',
    redirect: '/dashboard'
  }
}
```

## Step 4: Dynamic Content

Create frames with dynamic content based on user data:

```typescript
async function createPersonalizedFrame(userId: string) {
  // Fetch user data
  const userData = await getUserData(userId);
  
  // Create personalized frame
  const frame = await client.frames.create({
    layout: {
      primaryText: `Welcome back, ${userData.name}!`,
      secondaryText: `You've completed ${userData.questsComplete} quests`,
      image: userData.avatarUrl || '/media/default-avatar.png',
      cta: {
        label: 'Continue Journey',
        action: 'navigate',
        params: { 
          url: `/dashboard/${userId}` 
        }
      }
    },
    metadata: {
      userId,
      personalized: true
    }
  });
  
  return frame;
}
```

## Step 5: Multi-Step Frame Flow

Create a series of related frames:

```typescript
async function createOnboardingFlow() {
  // Step 1: Welcome
  const welcomeFrame = await client.frames.create({
    layout: {
      primaryText: 'Welcome to CastQuest',
      secondaryText: 'Let\'s get you started',
      cta: {
        label: 'Next',
        action: 'navigate',
        params: { url: '/onboarding/step2' }
      }
    }
  });
  
  // Step 2: Connect Wallet
  const walletFrame = await client.frames.create({
    layout: {
      primaryText: 'Connect Your Wallet',
      secondaryText: 'Securely link your Web3 wallet',
      cta: {
        label: 'Connect',
        action: 'custom',
        params: { 
          handler: 'connectWallet',
          next: '/onboarding/step3'
        }
      }
    }
  });
  
  // Step 3: Complete
  const completeFrame = await client.frames.create({
    layout: {
      primaryText: 'You\'re All Set!',
      secondaryText: 'Start exploring quests',
      cta: {
        label: 'Explore Quests',
        action: 'navigate',
        params: { url: '/quests' }
      }
    }
  });
  
  return {
    welcome: welcomeFrame,
    wallet: walletFrame,
    complete: completeFrame
  };
}
```

## Step 6: Conditional Rendering

Show different content based on conditions:

```typescript
async function createConditionalFrame(user: User) {
  const hasCompletedOnboarding = user.onboardingComplete;
  
  const frame = await client.frames.create({
    layout: {
      primaryText: hasCompletedOnboarding 
        ? 'Welcome Back!' 
        : 'Complete Your Onboarding',
      secondaryText: hasCompletedOnboarding
        ? 'Check out new quests'
        : 'Just a few more steps',
      image: hasCompletedOnboarding
        ? '/media/dashboard.png'
        : '/media/onboarding.png',
      cta: {
        label: hasCompletedOnboarding ? 'View Quests' : 'Continue',
        action: 'navigate',
        params: {
          url: hasCompletedOnboarding 
            ? '/quests' 
            : '/onboarding/resume'
        }
      }
    }
  });
  
  return frame;
}
```

## Step 7: Rich Media Frames

Incorporate rich media:

```typescript
async function createRichMediaFrame() {
  // Upload media first
  const media = await client.media.upload(mediaFile);
  
  const frame = await client.frames.create({
    mediaId: media.id,
    layout: {
      primaryText: 'Check Out Our Latest Quest',
      secondaryText: 'Epic rewards await',
      image: media.url,
      cta: {
        label: 'Join Quest',
        action: 'quest_start',
        params: { questId: 'quest_epic' }
      }
    },
    metadata: {
      mediaType: media.type,
      mediaSize: media.size
    }
  });
  
  return frame;
}
```

## Step 8: Frame Validation

Validate frames before creation:

```typescript
async function createValidatedFrame(frameData: any) {
  // Validate first
  const validation = await client.frames.validate(frameData);
  
  if (!validation.valid) {
    console.error('Validation errors:');
    validation.errors?.forEach(error => {
      console.error(`- ${error}`);
    });
    return null;
  }
  
  if (validation.warnings) {
    console.warn('Validation warnings:');
    validation.warnings.forEach(warning => {
      console.warn(`- ${warning}`);
    });
  }
  
  // Create frame
  const frame = await client.frames.create(frameData);
  return frame;
}
```

## Step 9: Frame Analytics

Track frame performance:

```typescript
async function trackFramePerformance(frameId: string) {
  // Get frame stats
  const stats = await client.frames.getStats(frameId);
  
  console.log('Frame Performance:');
  console.log(`- Views: ${stats.views}`);
  console.log(`- Interactions: ${stats.interactions}`);
  console.log(`- Conversion Rate: ${stats.conversionRate}%`);
  
  return stats;
}
```

## Step 10: A/B Testing Frames

Test different frame variants:

```typescript
async function abTestFrames() {
  const variantA = await client.frames.create({
    layout: {
      primaryText: 'Join Now',
      cta: { label: 'Get Started', action: 'navigate', params: { url: '/join' } }
    },
    metadata: { variant: 'A' }
  });
  
  const variantB = await client.frames.create({
    layout: {
      primaryText: 'Start Your Journey',
      cta: { label: 'Begin', action: 'navigate', params: { url: '/join' } }
    },
    metadata: { variant: 'B' }
  });
  
  // Randomly show one variant
  const showVariant = Math.random() > 0.5 ? variantA : variantB;
  
  return showVariant;
}
```

## Complete Example

Here's a complete custom frame implementation:

```typescript
import { CastQuestClient } from '@castquest/sdk';

async function createCompleteCustomFrame() {
  const client = new CastQuestClient({
    apiUrl: 'http://localhost:3010/api',
    network: 'base'
  });
  
  // 1. Upload media
  const banner = await client.media.upload(bannerFile);
  
  // 2. Create frame with validation
  const frameData = {
    mediaId: banner.id,
    layout: {
      primaryText: 'Epic Quest Adventure',
      secondaryText: 'Complete 5 challenges to earn exclusive NFT',
      image: banner.url,
      cta: {
        label: 'Start Quest',
        action: 'quest_start',
        params: { 
          questId: 'quest_epic_adventure',
          source: 'custom_frame'
        }
      }
    },
    metadata: {
      category: 'quest',
      difficulty: 'intermediate',
      estimatedTime: '2 hours',
      rewards: ['nft', 'points'],
      tags: ['adventure', 'epic', 'nft']
    }
  };
  
  // Validate
  const validation = await client.frames.validate(frameData);
  if (!validation.valid) {
    throw new Error('Frame validation failed');
  }
  
  // Create
  const frame = await client.frames.create(frameData);
  
  // Render
  const rendered = await client.frames.render(frame.id);
  
  console.log('Custom frame created:', frame.id);
  console.log('Rendered HTML:', rendered.html);
  
  return frame;
}
```

## Best Practices

1. **Keep It Simple**: Focus on one clear message per frame
2. **Test Thoroughly**: Validate frames before publishing
3. **Use High-Quality Media**: Ensure images are optimized
4. **Clear CTAs**: Make buttons action-oriented and clear
5. **Mobile-First**: Design for mobile viewports
6. **Analytics**: Track performance and iterate
7. **Accessibility**: Ensure content is accessible
8. **Error Handling**: Handle errors gracefully

## Troubleshooting

### Frame Not Rendering

- Check image URLs are valid
- Ensure media is uploaded successfully
- Validate frame data before creation

### CTA Not Working

- Verify action type is supported
- Check params are correctly formatted
- Test in development environment first

### Poor Performance

- Optimize image sizes
- Reduce unnecessary metadata
- Use caching for frequently accessed frames

## Next Steps

- [Frame Templates](/guide/tutorials/frame-templates) - Use templates for common patterns
- [Deployment](/guide/tutorials/deployment) - Deploy frames to production
- [Frames Concept](/guide/concepts/frames) - Deep dive into frames
- [API Reference](/api/endpoints/frames) - Complete frames API

## Additional Resources

- [Frame Examples](https://github.com/CastQuest/castquest-frames/tree/main/examples/frames)
- [Community Frames](https://discord.gg/castquest)
- [Frame Best Practices](https://docs.castquest.xyz/best-practices/frames)

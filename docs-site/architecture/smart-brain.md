# Smart Brain Runtime

The Smart Brain is CastQuest's AI-powered orchestration system that provides intelligent automation, suggestions, and optimization.

## Overview

Smart Brain combines:
- **AI-Powered Suggestions**: Content generation and optimization
- **Validation Engine**: Data quality and consistency checks
- **Pattern Recognition**: Learns from protocol usage
- **Autonomous Operations**: Safe, auditable automation
- **Risk Scoring**: Evaluates operations before execution

## Architecture

```
┌──────────────────────────────────────────┐
│         Smart Brain Runtime              │
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────┐      ┌────────────────┐ │
│  │   AI       │      │   Validation   │ │
│  │   Engine   │◄────►│   Engine       │ │
│  └────────────┘      └────────────────┘ │
│        │                     │           │
│        ▼                     ▼           │
│  ┌────────────────────────────────────┐ │
│  │      Pattern Recognition           │ │
│  └────────────────────────────────────┘ │
│        │                                 │
│        ▼                                 │
│  ┌────────────────────────────────────┐ │
│  │      Audit & Event Logger          │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

## Core Features

### 1. Content Suggestions

Generate optimized content for frames and quests:

```typescript
const suggestion = await client.brain.suggest({
  context: 'frame',
  type: 'content',
  params: {
    topic: 'onchain quests',
    tone: 'friendly',
    length: 'short',
    audience: 'web3 beginners'
  }
});

console.log('Suggested text:', suggestion.text);
console.log('Confidence:', suggestion.confidence);
```

### 2. Data Validation

Validate data quality before operations:

```typescript
const validation = await client.brain.validate({
  type: 'quest',
  data: questData
});

if (!validation.valid) {
  console.error('Validation issues:', validation.issues);
}
```

### 3. Price Optimization

Optimize mint pricing:

```typescript
const pricing = await client.brain.optimizePrice({
  mintId: 'mint_123',
  historicalData: previousMints,
  targetMarket: 'collectors'
});

console.log('Recommended price:', pricing.recommendedPrice);
console.log('Expected demand:', pricing.demandEstimate);
```

### 4. Pattern Detection

Learn from protocol usage:

```typescript
const patterns = await client.brain.detectPatterns({
  timeRange: '30days',
  metrics: ['quest_completion', 'mint_claims']
});

console.log('Detected patterns:', patterns);
```

## Configuration

### Enable Smart Brain

```typescript
import { CastQuestClient } from '@castquest/sdk';

const client = new CastQuestClient({
  apiUrl: 'http://localhost:3010/api',
  smartBrain: {
    enabled: true,
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 500
  }
});
```

### Advanced Configuration

```typescript
smartBrain: {
  enabled: true,
  apiKey: process.env.OPENAI_API_KEY,
  
  // Model configuration
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 500,
  
  // Feature flags
  features: {
    contentSuggestions: true,
    priceOptimization: true,
    patternRecognition: true,
    autoExecution: false  // Disabled for safety
  },
  
  // Rate limiting
  rateLimit: {
    requestsPerMinute: 10,
    requestsPerDay: 1000
  },
  
  // Audit settings
  audit: {
    logAll: true,
    requireApproval: ['price_change', 'auto_execute']
  }
}
```

## AI Operations

### Content Generation

```typescript
// Generate frame content
const frameContent = await client.brain.generateFrameContent({
  topic: 'quest completion',
  style: 'celebratory',
  variables: {
    userName: 'Alice',
    questName: 'Onboarding'
  }
});

// Generate quest descriptions
const questDesc = await client.brain.generateQuestDescription({
  difficulty: 'beginner',
  category: 'social',
  rewards: ['badge', 'xp']
});
```

### Image Analysis

```typescript
// Analyze image for frame suitability
const analysis = await client.brain.analyzeImage({
  imageUrl: '/media/banner.png',
  context: 'frame_banner'
});

console.log('Quality score:', analysis.quality);
console.log('Suggestions:', analysis.suggestions);
```

### Sentiment Analysis

```typescript
// Analyze user feedback
const sentiment = await client.brain.analyzeSentiment({
  text: userComment,
  context: 'quest_feedback'
});

console.log('Sentiment:', sentiment.score);  // -1 to 1
console.log('Topics:', sentiment.topics);
```

## Validation Engine

### Quest Validation

```typescript
const validation = await client.brain.validate({
  type: 'quest',
  data: {
    name: 'My Quest',
    steps: [
      { type: 'social', requirement: 'follow' },
      { type: 'onchain', requirement: 'mint' }
    ]
  }
});

if (validation.issues) {
  validation.issues.forEach(issue => {
    console.log(`${issue.severity}: ${issue.message}`);
  });
}
```

### Frame Validation

```typescript
const frameValidation = await client.brain.validate({
  type: 'frame',
  data: frameData,
  rules: {
    checkReadability: true,
    checkImageQuality: true,
    checkCtaClarity: true
  }
});
```

## Pattern Recognition

### Usage Patterns

```typescript
const patterns = await client.brain.analyzeUsagePatterns({
  timeRange: '30days',
  entities: ['quests', 'frames', 'mints']
});

console.log('Peak usage times:', patterns.peakTimes);
console.log('Popular categories:', patterns.popularCategories);
console.log('Completion rates:', patterns.completionRates);
```

### Predictive Analytics

```typescript
const prediction = await client.brain.predict({
  metric: 'mint_demand',
  mintId: 'mint_123',
  horizon: '7days'
});

console.log('Predicted demand:', prediction.forecast);
console.log('Confidence interval:', prediction.confidence);
```

## Safety & Auditing

### Audit-First Design

All Smart Brain operations are logged:

```typescript
const auditLog = await client.brain.getAuditLog({
  timeRange: '24hours',
  operations: ['suggest', 'validate', 'optimize']
});

auditLog.entries.forEach(entry => {
  console.log(`${entry.timestamp}: ${entry.operation}`);
  console.log(`  Input:`, entry.input);
  console.log(`  Output:`, entry.output);
  console.log(`  User:`, entry.userId);
});
```

### Manual Approval

Require approval for sensitive operations:

```typescript
// Smart Brain generates suggestion
const suggestion = await client.brain.suggest({
  context: 'price_optimization',
  requireApproval: true
});

// Suggestion is queued for approval
console.log('Suggestion ID:', suggestion.id);
console.log('Status:', suggestion.status);  // 'pending_approval'

// Admin approves
await client.brain.approveSuggestion(suggestion.id);
```

### Risk Scoring

Evaluate operation risk:

```typescript
const riskScore = await client.brain.assessRisk({
  operation: 'price_change',
  params: {
    currentPrice: '0.001',
    newPrice: '0.005',
    mintId: 'mint_123'
  }
});

console.log('Risk level:', riskScore.level);  // 'low', 'medium', 'high'
console.log('Factors:', riskScore.factors);
```

## Integration Examples

### Quest Creation with AI

```typescript
async function createAIAssistedQuest() {
  // Get AI suggestions
  const suggestions = await client.brain.suggest({
    context: 'quest_creation',
    params: {
      category: 'onboarding',
      difficulty: 'beginner'
    }
  });
  
  // Create quest with suggestions
  const quest = await client.quests.create({
    name: suggestions.name,
    description: suggestions.description
  });
  
  // Add AI-suggested steps
  for (const step of suggestions.steps) {
    await client.quests.addStep(quest.id, step);
  }
  
  return quest;
}
```

### Frame Optimization

```typescript
async function optimizeFrame(frameId: string) {
  // Get current frame
  const frame = await client.frames.get(frameId);
  
  // Get AI optimization suggestions
  const optimization = await client.brain.optimize({
    type: 'frame',
    data: frame,
    goals: ['engagement', 'clarity']
  });
  
  // Apply optimizations
  if (optimization.improvements) {
    await client.frames.update(frameId, optimization.improvements);
  }
  
  return optimization;
}
```

### Intelligent Pricing

```typescript
async function optimizeMintPrice(mintId: string) {
  // Analyze historical data
  const analysis = await client.brain.analyzePricing({
    mintId,
    competitors: await getCompetitorMints(),
    marketConditions: await getMarketData()
  });
  
  // Get price recommendation
  const recommendation = analysis.recommendedPrice;
  
  // Update price (with approval)
  await client.mints.updatePrice(mintId, recommendation, {
    requireApproval: true,
    reason: analysis.reasoning
  });
}
```

## Best Practices

1. **Always Enable Audit Logging**: Track all AI operations
2. **Require Approval for Critical Operations**: Don't auto-execute sensitive changes
3. **Monitor AI Costs**: Track API usage and costs
4. **Validate AI Outputs**: Don't blindly trust AI suggestions
5. **Provide Context**: Give AI sufficient context for better results
6. **Set Rate Limits**: Prevent runaway API costs
7. **Review Audit Logs**: Regularly review AI decisions
8. **Use Feature Flags**: Granular control over AI features

## Monitoring

### Usage Metrics

```typescript
const metrics = await client.brain.getMetrics({
  timeRange: '7days'
});

console.log('API calls:', metrics.apiCalls);
console.log('Cost:', metrics.cost);
console.log('Average confidence:', metrics.avgConfidence);
```

### Performance

```typescript
const performance = await client.brain.getPerformance({
  operations: ['suggest', 'validate', 'optimize']
});

console.log('Average response time:', performance.avgResponseTime);
console.log('Success rate:', performance.successRate);
```

## Troubleshooting

### AI Not Responding

- Check API key is valid
- Verify Smart Brain is enabled
- Check rate limits
- Review error logs

### Low Quality Suggestions

- Provide more context
- Adjust temperature setting
- Use higher-quality model
- Review prompt engineering

### High Costs

- Enable rate limiting
- Cache responses
- Reduce temperature
- Use smaller model for simple tasks

## Next Steps

- [Strategy Worker](/guide/concepts/strategy-worker) - Autonomous automation
- [Module M8: Brain](/architecture/modules/m8-brain) - Technical details
- [API Reference](/api/endpoints/brain) - Brain API documentation
- [Best Practices](/guide/advanced/ai-best-practices) - AI usage guidelines

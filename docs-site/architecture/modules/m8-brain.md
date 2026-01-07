# Module 8: Smart Brain

Module 8 provides AI-powered orchestration, suggestions, validation, and autonomous operations.

## Overview

**M8: Smart Brain AI**

Intelligent automation system:
- AI-powered content generation
- Data validation and quality checks
- Pattern recognition and learning
- Price optimization
- Risk assessment
- Audit-first design
- Feature flags for safety

## Core Features

### 1. Content Suggestions

AI-generated content for frames and quests:

```typescript
const suggestion = await client.brain.suggest({
  context: 'frame',
  type: 'content',
  params: {
    topic: 'quest completion',
    tone: 'celebratory',
    length: 'short'
  }
});

console.log('Suggested text:', suggestion.text);
console.log('Confidence:', suggestion.confidence);
```

### 2. Data Validation

AI-powered validation:

```typescript
const validation = await client.brain.validate({
  type: 'quest',
  data: questData,
  rules: {
    checkCompleteness: true,
    checkConsistency: true,
    checkQuality: true
  }
});

if (!validation.valid) {
  console.error('Issues found:', validation.issues);
}
```

### 3. Price Optimization

Optimize mint pricing:

```typescript
const pricing = await client.brain.optimizePrice({
  mintId: 'mint_123',
  historicalData: previousMints,
  marketConditions: currentMarket,
  targetAudience: 'collectors'
});

console.log('Recommended price:', pricing.recommendedPrice);
console.log('Reasoning:', pricing.reasoning);
```

### 4. Pattern Detection

Learn from protocol usage:

```typescript
const patterns = await client.brain.detectPatterns({
  timeRange: '30days',
  metrics: ['quest_completion', 'mint_claims', 'frame_views']
});

console.log('Peak usage times:', patterns.peakTimes);
console.log('Popular categories:', patterns.categories);
console.log('Trends:', patterns.trends);
```

### 5. Risk Assessment

Evaluate operation risks:

```typescript
const riskScore = await client.brain.assessRisk({
  operation: 'price_change',
  params: {
    currentPrice: '0.001',
    newPrice: '0.005',
    mintId: 'mint_123'
  }
});

console.log('Risk level:', riskScore.level);  // low/medium/high
console.log('Factors:', riskScore.factors);
console.log('Mitigation:', riskScore.mitigation);
```

## Data Structure

### Brain Suggestion

```typescript
interface BrainSuggestion {
  id: string;
  context: string;
  type: string;
  result: any;
  confidence: number;
  reasoning?: string;
  alternatives?: any[];
  timestamp: string;
}
```

### Brain Validation

```typescript
interface BrainValidation {
  valid: boolean;
  issues?: Array<{
    severity: 'error' | 'warning' | 'info';
    message: string;
    field?: string;
    suggestion?: string;
  }>;
  score?: number;
}
```

### Brain Pattern

```typescript
interface BrainPattern {
  id: string;
  type: string;
  confidence: number;
  data: Record<string, any>;
  detectedAt: string;
}
```

## Configuration

### Enable Smart Brain

```typescript
const client = new CastQuestClient({
  apiUrl: 'http://localhost:3010/api',
  smartBrain: {
    enabled: true,
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4',
    temperature: 0.7,
    features: {
      contentSuggestions: true,
      priceOptimization: true,
      patternRecognition: true,
      autoExecution: false  // Safety first!
    },
    audit: {
      logAll: true,
      requireApproval: ['price_change', 'auto_execute']
    }
  }
});
```

## API Endpoints

### Suggest Content

```typescript
POST /api/brain/suggest

Request:
{
  "context": "frame",
  "type": "content",
  "params": {
    "topic": "quest completion",
    "tone": "celebratory"
  }
}

Response:
{
  "ok": true,
  "suggestion": {
    "text": "Congratulations! Quest completed!",
    "confidence": 0.95
  }
}
```

### Validate Data

```typescript
POST /api/brain/validate

Request:
{
  "type": "quest",
  "data": {...}
}

Response:
{
  "valid": true,
  "score": 0.92
}
```

### Optimize Price

```typescript
POST /api/brain/optimize-price

Request:
{
  "mintId": "mint_123",
  "targetAudience": "collectors"
}

Response:
{
  "recommendedPrice": "0.003",
  "reasoning": "Based on similar mints..."
}
```

### Detect Patterns

```typescript
POST /api/brain/detect-patterns

Request:
{
  "timeRange": "30days",
  "metrics": ["quest_completion"]
}

Response:
{
  "patterns": [
    {
      "type": "peak_time",
      "data": { "hour": 14, "day": "Monday" }
    }
  ]
}
```

## Safety & Auditing

### Audit Log

All Brain operations are logged:

```typescript
const auditLog = await client.brain.getAuditLog({
  timeRange: '24hours'
});

auditLog.entries.forEach(entry => {
  console.log(`${entry.timestamp}: ${entry.operation}`);
  console.log(`  Confidence: ${entry.confidence}`);
  console.log(`  User: ${entry.userId}`);
});
```

### Manual Approval

Require approval for sensitive operations:

```typescript
// Brain generates suggestion
const suggestion = await client.brain.suggest({
  context: 'price_optimization',
  requireApproval: true
});

// Status: pending_approval
console.log('Status:', suggestion.status);

// Admin approves
await client.brain.approveSuggestion(suggestion.id);
```

### Feature Flags

Control Brain features:

```typescript
{
  features: {
    contentSuggestions: true,      // Safe
    priceOptimization: true,       // Needs approval
    patternRecognition: true,      // Safe
    autoExecution: false,          // Dangerous - disabled
    autonomousTrading: false       // Very dangerous - disabled
  }
}
```

## Integration Examples

### AI-Assisted Quest Creation

```typescript
async function createAIQuest() {
  // Get AI suggestions
  const suggestions = await client.brain.suggest({
    context: 'quest_creation',
    params: {
      category: 'onboarding',
      difficulty: 'beginner'
    }
  });
  
  // Create quest with AI help
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

### Intelligent Price Optimization

```typescript
async function optimizeMintPrice(mintId: string) {
  // Analyze with AI
  const analysis = await client.brain.optimizePrice({
    mintId,
    marketData: await getMarketData()
  });
  
  // Get recommendation
  const newPrice = analysis.recommendedPrice;
  
  // Update with approval
  await client.mints.updatePrice(mintId, newPrice, {
    requireApproval: true,
    reason: analysis.reasoning
  });
}
```

## Best Practices

1. **Enable Audit Logging**: Track all AI operations
2. **Require Approval**: For critical operations
3. **Monitor Costs**: Track API usage
4. **Validate Outputs**: Don't blindly trust AI
5. **Provide Context**: Give AI sufficient information
6. **Set Rate Limits**: Prevent runaway costs
7. **Review Decisions**: Regularly review AI choices
8. **Use Feature Flags**: Granular control

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
const performance = await client.brain.getPerformance();

console.log('Avg response time:', performance.avgResponseTime);
console.log('Success rate:', performance.successRate);
```

## Troubleshooting

### AI Not Responding

- Check API key validity
- Verify Smart Brain enabled
- Check rate limits
- Review error logs

### Low Quality Suggestions

- Provide more context
- Adjust temperature
- Use higher-quality model
- Review prompt engineering

### High Costs

- Enable rate limiting
- Cache responses
- Reduce temperature
- Use smaller model for simple tasks

## Next Steps

- [Smart Brain Runtime](/architecture/smart-brain) - Detailed architecture
- [API Reference](/api/endpoints/brain) - Brain API
- [Strategy Worker](/guide/concepts/strategy-worker) - Autonomous operations
- [Best Practices](/guide/advanced/ai-best-practices) - AI usage guidelines

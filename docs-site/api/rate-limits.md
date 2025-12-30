# Rate Limits

The CastQuest API implements rate limiting to ensure fair usage and system stability.

## Development Mode

**No rate limits** in local development:

```bash
# Unlimited requests in development
curl http://localhost:3001/api/quests
```

## Production Rate Limits

### API Key Limits

| Window | Limit | Burst |
|--------|-------|-------|
| Per second | 20 | 50 |
| Per minute | 100 | - |
| Per hour | 1000 | - |
| Per day | 10,000 | - |

### IP-Based Limits (unauthenticated)

| Window | Limit |
|--------|-------|
| Per minute | 20 |
| Per hour | 100 |

## Rate Limit Headers

All responses include rate limit information:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1703682600
X-RateLimit-Window: 1m
```

## Handling Rate Limits

### Check Headers

```typescript
const response = await fetch('/api/quests');
const remaining = response.headers.get('X-RateLimit-Remaining');
const reset = response.headers.get('X-RateLimit-Reset');

if (parseInt(remaining) < 10) {
  console.warn('Approaching rate limit!');
}
```

### Handle 429 Response

```typescript
async function fetchWithRetry(url: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url);
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      await sleep(parseInt(retryAfter) * 1000);
      continue;
    }
    
    return response;
  }
  
  throw new Error('Max retries exceeded');
}
```

### Exponential Backoff

```typescript
async function exponentialBackoff(fn: () => Promise<any>, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.code === 'RATE_LIMIT_EXCEEDED') {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s, 8s, 16s
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}

// Usage
const result = await exponentialBackoff(() => 
  client.quests.create({ name: 'My Quest' })
);
```

## SDK Built-in Retry

The SDK automatically handles rate limits with exponential backoff:

```typescript
import { CastQuestClient } from '@castquest/sdk';

const client = new CastQuestClient({
  baseUrl: 'https://api.castquest.xyz/api',
  retry: {
    enabled: true,
    maxRetries: 3,
    backoff: 'exponential'
  }
});

// Automatically retries on 429
const quest = await client.quests.create({ name: 'My Quest' });
```

## Rate Limit Tiers

### Free Tier
- 100 requests/minute
- 1,000 requests/hour
- Best effort availability

### Pro Tier
- 500 requests/minute
- 10,000 requests/hour
- 99.9% SLA

### Enterprise Tier
- Custom limits
- Dedicated infrastructure
- 99.99% SLA

Contact team for tier upgrades.

## Burst Allowance

The API allows short bursts above the steady-state rate:

- **Steady state**: 100 requests/minute (1.67 req/s)
- **Burst**: Up to 50 requests in first few seconds
- **Bucket refill**: 1.67 requests/second

This allows for occasional spikes without hitting limits.

## Monitoring

Track your usage in the admin dashboard:

1. Navigate to Settings → API Usage
2. View real-time request rate
3. See historical usage graphs
4. Set up alerts for approaching limits

## Best Practices

1. **Cache responses** when possible
2. **Batch requests** instead of individual calls
3. **Use webhooks** instead of polling
4. **Implement client-side throttling**
5. **Monitor rate limit headers**
6. **Set up alerts** for 80% usage

## Exemptions

Some endpoints have higher/lower limits:

| Endpoint | Limit | Reason |
|----------|-------|--------|
| `/api/frames/render` | 50/min | Computationally expensive |
| `/api/brain/suggest` | 20/min | AI operations |
| `/api/quests` (GET) | 200/min | Read-only, cacheable |

## Next Steps

- [API Overview](./overview.md)
- [Error Handling](./errors.md)
- [Authentication](./authentication.md)

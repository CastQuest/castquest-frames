# Authentication

The CastQuest API authentication system is designed for both development and production environments.

## Development Mode

In local development, authentication is **disabled by default** for ease of use:

```bash
# No authentication required
curl http://localhost:3001/api/quests
```

## Production Authentication

### API Keys

For server-to-server communication:

```bash
curl -H "X-CastQuest-Key: cq_live_your_api_key_here" \
  https://api.castquest.xyz/api/quests
```

**Getting an API Key:**
1. Visit the admin dashboard
2. Navigate to Settings → API Keys
3. Click "Generate New Key"
4. Copy and store securely

### User Sessions

For user-facing operations:

```typescript
// Login returns JWT token
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ address: '0x...' })
});

const { token } = await response.json();

// Use token in subsequent requests
fetch('/api/quests/progress', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Signature Verification

For onchain actions requiring signature verification:

```typescript
import { signMessage } from 'viem';

const message = 'Sign to claim mint';
const signature = await signMessage({ message });

await fetch('/api/mints/claim', {
  method: 'POST',
  body: JSON.stringify({
    mintId: 'mint_123',
    signature
  })
});
```

## Permissions

API keys can have scoped permissions:

- `quests:read` - Read quest data
- `quests:write` - Create/update quests
- `frames:read` - Read frame data
- `frames:write` - Create/update frames
- `mints:execute` - Execute mint operations
- `admin:full` - Full admin access

## Security Best Practices

1. **Never commit API keys** to version control
2. **Rotate keys regularly** (every 90 days)
3. **Use environment variables** for key storage
4. **Implement rate limiting** on your side
5. **Validate signatures** for critical operations

## Next Steps

- [Error Handling](./errors.md)
- [Rate Limits](./rate-limits.md)
- [API Overview](./overview.md)

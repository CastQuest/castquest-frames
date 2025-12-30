# Error Handling

CastQuest API uses consistent error responses across all endpoints.

## Error Response Format

```json
{
  "ok": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": {
      // Optional: Additional context
    }
  }
}
```

## HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

## Error Codes

### Validation Errors

**`VALIDATION_ERROR`**
```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid quest name: must be at least 3 characters",
    "details": {
      "field": "name",
      "received": "ab",
      "expected": "string with min length 3"
    }
  }
}
```

**`MISSING_REQUIRED_FIELD`**
```json
{
  "ok": false,
  "error": {
    "code": "MISSING_REQUIRED_FIELD",
    "message": "Missing required field: name",
    "details": {
      "field": "name"
    }
  }
}
```

### Resource Errors

**`NOT_FOUND`**
```json
{
  "ok": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Quest not found",
    "details": {
      "questId": "quest_invalid123"
    }
  }
}
```

**`ALREADY_EXISTS`**
```json
{
  "ok": false,
  "error": {
    "code": "ALREADY_EXISTS",
    "message": "Quest with this name already exists",
    "details": {
      "name": "Duplicate Quest"
    }
  }
}
```

### Permission Errors

**`UNAUTHORIZED`**
```json
{
  "ok": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "API key required"
  }
}
```

**`FORBIDDEN`**
```json
{
  "ok": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions for this operation",
    "details": {
      "required": "quests:write",
      "provided": "quests:read"
    }
  }
}
```

### Rate Limiting

**`RATE_LIMIT_EXCEEDED`**
```json
{
  "ok": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "details": {
      "limit": 100,
      "window": "1 minute",
      "retryAfter": 45
    }
  }
}
```

### Business Logic Errors

**`QUEST_ALREADY_COMPLETED`**
```json
{
  "ok": false,
  "error": {
    "code": "QUEST_ALREADY_COMPLETED",
    "message": "User has already completed this quest"
  }
}
```

**`INSUFFICIENT_SUPPLY`**
```json
{
  "ok": false,
  "error": {
    "code": "INSUFFICIENT_SUPPLY",
    "message": "Mint supply exhausted",
    "details": {
      "supply": 100,
      "claimed": 100,
      "available": 0
    }
  }
}
```

**`INVALID_SIGNATURE`**
```json
{
  "ok": false,
  "error": {
    "code": "INVALID_SIGNATURE",
    "message": "Signature verification failed"
  }
}
```

### Server Errors

**`INTERNAL_ERROR`**
```json
{
  "ok": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "details": {
      "requestId": "req_abc123"
    }
  }
}
```

## Error Handling in SDK

```typescript
import { CastQuestClient, CastQuestError } from '@castquest/sdk';

try {
  const quest = await client.quests.create({ name: 'ab' });
} catch (error) {
  if (error instanceof CastQuestError) {
    console.log('Error code:', error.code);
    console.log('Message:', error.message);
    console.log('Details:', error.details);
    
    switch (error.code) {
      case 'VALIDATION_ERROR':
        // Handle validation error
        break;
      case 'RATE_LIMIT_EXCEEDED':
        // Wait and retry
        await sleep(error.details.retryAfter * 1000);
        break;
      default:
        // Handle other errors
    }
  }
}
```

## Debugging

### Request ID

All responses include a unique request ID in headers:

```
X-Request-ID: req_abc123def456
```

Use this when reporting issues or debugging.

### Error Logs

Errors are logged to `data/error-events.json`:

```json
{
  "timestamp": "2025-12-27T10:30:00Z",
  "requestId": "req_abc123",
  "endpoint": "/api/quests/create",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid quest name"
  }
}
```

## Best Practices

1. **Always check `ok` field** before accessing data
2. **Handle specific error codes** for better UX
3. **Implement exponential backoff** for rate limits
4. **Log requestId** for debugging
5. **Validate inputs client-side** before API calls

## Next Steps

- [API Overview](./overview.md)
- [Rate Limits](./rate-limits.md)
- [SDK Error Handling](/sdk/examples/error-handling.md)

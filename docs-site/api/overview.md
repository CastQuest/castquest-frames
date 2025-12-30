# API Overview

The CastQuest Protocol provides a comprehensive REST API for managing frames, quests, mints, and media.

## Base URL

```
http://localhost:3001/api  # Development
https://api.castquest.xyz/api  # Production (placeholder)
```

## API Design Principles

### 1. **RESTful Design**
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Resource-based URLs
- JSON request/response bodies

### 2. **Consistent Response Format**

```typescript
// Success Response
{
  "ok": true,
  "data": { /* resource data */ },
  "message"?: string
}

// Error Response
{
  "ok": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### 3. **Transparent Operations**
- All operations logged to JSON event files
- No hidden state mutations
- Explicit side effects

## API Categories

### [Quests API](./endpoints/quests.md)
Manage multi-step quests with progress tracking.

**Key Endpoints:**
- `POST /api/quests/create` - Create a new quest
- `POST /api/quests/add-step` - Add step to quest
- `POST /api/quests/progress` - Update user progress
- `POST /api/quests/complete` - Mark quest complete

### [Frames API](./endpoints/frames.md)
Work with frame instances and rendering.

**Key Endpoints:**
- `POST /api/frames/render` - Render a frame
- `GET /api/frames/:id` - Get frame data
- `POST /api/frames/validate` - Validate frame schema

### [Frame Templates API](./endpoints/frame-templates.md)
Create and manage reusable frame templates.

**Key Endpoints:**
- `POST /api/frame-templates/create` - Create template
- `POST /api/frame-templates/apply` - Apply template to generate frame
- `PUT /api/frame-templates/update` - Update template
- `DELETE /api/frame-templates/delete` - Delete template

### [Mints API](./endpoints/mints.md)
Create and manage collectible mints.

**Key Endpoints:**
- `POST /api/mints/create` - Create a mint
- `POST /api/mints/simulate` - Simulate claim
- `POST /api/mints/claim` - Execute claim
- `POST /api/mints/attach-to-frame` - Link mint to frame

### [BASE Chain API](./endpoints/base.md)
Mock BASE blockchain operations.

**Key Endpoints:**
- `POST /api/base/mint` - Simulate onchain mint
- `GET /api/base/token-info` - Get token metadata
- `GET /api/base/tx-status` - Check transaction status

### [Strategy Worker API](./endpoints/strategy.md)
Control autonomous worker operations.

**Key Endpoints:**
- `POST /api/strategy/worker/scan` - Scan for pending actions
- `POST /api/strategy/worker/run` - Execute worker tasks

### [Smart Brain API](./endpoints/brain.md)
Get AI-powered suggestions and validation.

**Key Endpoints:**
- `POST /api/brain/suggest` - Get suggestions
- `POST /api/brain/validate` - Validate schema
- `POST /api/brain/analyze` - Analyze context

## Authentication

Currently, the API is designed for operator-controlled environments and does not require authentication in development mode.

**Production Authentication** (planned):
- API key in header: `X-CastQuest-Key`
- JWT tokens for user sessions
- Signature verification for onchain actions

See [Authentication Guide](./authentication.md) for details.

## Rate Limiting

Development: No rate limits

Production (planned):
- 100 requests/minute per API key
- 1000 requests/hour per IP
- Burst allowance: 20 requests/second

See [Rate Limits](./rate-limits.md) for details.

## Error Handling

All errors follow consistent structure. See [Error Handling Guide](./errors.md).

Common error codes:
- `VALIDATION_ERROR` - Invalid input parameters
- `NOT_FOUND` - Resource not found
- `ALREADY_EXISTS` - Duplicate resource
- `INTERNAL_ERROR` - Server error

## Versioning

API version is included in response headers:

```
X-CastQuest-API-Version: 0.1.0
```

Currently on version **0.1.0** (alpha).

## OpenAPI Specification

Download the complete OpenAPI 3.0 spec:
- JSON: `http://localhost:3001/api/openapi.json`
- YAML: `http://localhost:3001/api/openapi.yaml`

Import into tools like Postman, Insomnia, or Swagger UI.

## SDK Support

Use the official SDK for type-safe API access:

```typescript
import { CastQuestClient } from '@castquest/sdk';

const client = new CastQuestClient({
  baseUrl: 'http://localhost:3001/api',
  chainId: 8453 // BASE
});

const quest = await client.quests.create({
  name: 'My First Quest',
  description: 'Learn the basics'
});
```

See [SDK Documentation](/sdk/introduction.md) for details.

## Next Steps

- [API Endpoints](/api/endpoints/quests.md) - Detailed endpoint docs
- [Authentication](/api/authentication.md) - Auth setup
- [Error Handling](/api/errors.md) - Error codes reference
- [SDK Quickstart](/sdk/quick-start.md) - Use the SDK

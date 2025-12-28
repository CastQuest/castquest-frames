# CastQuest Core Services API Documentation

Base URL: `http://localhost:3001/api/v1`

## Authentication

Most endpoints require a JWT token obtained from the login endpoint.

Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Admin endpoints require an API key:

```
X-API-Key: <admin-api-key>
```

## Response Format

All responses follow this structure:

**Success Response:**

```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

---

## User Endpoints

### Register New User

**POST** `/users/register`

Create a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "secure-password-123"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "status": "pending",
      "emailVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "message": "Registration successful. Please check your email for verification."
  }
}
```

---

### Login

**POST** `/users/login`

Authenticate and receive JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "secure-password-123"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "status": "active",
      "emailVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Verify Email

**POST** `/users/verify-email`

Verify email address with token from email.

**Request Body:**

```json
{
  "token": "verification-token-from-email"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "message": "Email verified successfully"
  }
}
```

---

### Get Profile

**GET** `/users/profile`

**Auth:** Required

Get current user profile.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "status": "active",
      "emailVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastLoginAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

## Wallet Endpoints

### Add Wallet

**POST** `/wallets`

**Auth:** Required

Add an EVM wallet to your account.

**Request Body:**

```json
{
  "address": "0x1234567890123456789012345678901234567890",
  "type": "eoa",
  "label": "Main Wallet"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "wallet": {
      "id": "uuid",
      "userId": "uuid",
      "address": "0x1234567890123456789012345678901234567890",
      "type": "eoa",
      "label": "Main Wallet",
      "isPrimary": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### List Wallets

**GET** `/wallets`

**Auth:** Required

Get all wallets for current user.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "wallets": [
      {
        "id": "uuid",
        "address": "0x1234...",
        "type": "eoa",
        "label": "Main Wallet",
        "isPrimary": true
      }
    ]
  }
}
```

---

### Remove Wallet

**DELETE** `/wallets/:id`

**Auth:** Required

Remove a wallet from your account.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "message": "Wallet removed successfully"
  }
}
```

---

## Media Endpoints

### Search Media

**GET** `/media`

**Auth:** Optional

Search and filter media/tokens.

**Query Parameters:**

- `search` - Search by name, ticker, or description
- `owner` - Filter by owner address
- `status` - Filter by status (active, flagged, banned)
- `mediaType` - Filter by type (image, video, audio, text)
- `limit` - Results per page (default: 20)
- `offset` - Pagination offset (default: 0)

**Example:** `GET /media?search=sunset&limit=10`

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "media": [
      {
        "id": "uuid",
        "mediaId": "media_001",
        "tokenAddress": "0x1111...",
        "ticker": "PIC",
        "name": "Epic Sunset",
        "description": "A beautiful sunset",
        "mediaType": "image",
        "mediaUrl": "https://...",
        "thumbnailUrl": "https://...",
        "currentPrice": "1000000000000000000",
        "riskScore": 0,
        "riskFlags": []
      }
    ],
    "total": 1,
    "limit": 10,
    "offset": 0
  }
}
```

---

### Get Media Details

**GET** `/media/:id`

**Auth:** Optional

Get detailed information about a specific media item.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "media": {
      "id": "uuid",
      "mediaId": "media_001",
      "tokenAddress": "0x1111...",
      "ownerAddress": "0x1234...",
      "ticker": "PIC",
      "name": "Epic Sunset",
      "description": "A beautiful sunset over the ocean",
      "mediaType": "image",
      "mediaUrl": "https://example.com/sunset.jpg",
      "thumbnailUrl": "https://example.com/sunset_thumb.jpg",
      "metadataUri": "ipfs://QmExample1",
      "status": "active",
      "riskScore": 0,
      "riskFlags": [],
      "currentPrice": "1000000000000000000",
      "marketCap": "1000000000000000000000",
      "totalSupply": "1000000000000000000000",
      "blockNumber": "12345678",
      "transactionHash": "0xabc123",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### Get Media by Token Address

**GET** `/media/by-address/:address`

**Auth:** Optional

Get media by token contract address.

**Response:** `200 OK` (same structure as Get Media Details)

---

### Get Media by Owner

**GET** `/media/by-owner/:owner`

**Auth:** Optional

List all media owned by a specific address.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "media": [
      // Array of media objects
    ],
    "total": 5
  }
}
```

---

## Market Endpoints

### Get Market Signals

**GET** `/markets/signals`

**Auth:** Optional

Get timeline "tiny indicator" signals for media tokens.

**Query Parameters:**

- `tokenAddresses` - Comma-separated list of token addresses
- `limit` - Number of results (default: 50)

**Example:** `GET /markets/signals?tokenAddresses=0x1111...,0x2222...`

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "signals": [
      {
        "tokenAddress": "0x1111...",
        "ticker": "PIC",
        "currentPrice": "1000000000000000000",
        "priceChange24h": "5.25",
        "volume24h": "50000000000000000000",
        "status": "green"
      }
    ]
  }
}
```

**Status Values:**

- `green` - Price up > 10%
- `red` - Price down > 10%
- `neutral` - Price change < 10%

---

### Get Current Prices

**GET** `/markets/prices`

**Auth:** Optional

Get current prices for multiple tokens.

**Query Parameters:**

- `tokenAddresses` - Comma-separated token addresses

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "prices": {
      "0x1111...": "1000000000000000000",
      "0x2222...": "500000000000000000"
    }
  }
}
```

---

### Get Market Data

**GET** `/markets/:tokenAddress`

**Auth:** Optional

Get detailed market data for a specific token.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "market": {
      "tokenAddress": "0x1111...",
      "ticker": "PIC",
      "currentPrice": "1000000000000000000",
      "priceChange24h": "5.25",
      "priceChange7d": "15.50",
      "volume24h": "50000000000000000000",
      "volume7d": "250000000000000000000",
      "holders": 125,
      "transactions24h": 45,
      "liquidity": "10000000000000000000",
      "marketCap": "1000000000000000000000",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

## Admin Endpoints

**Auth:** Admin API Key Required (X-API-Key header)

### Get Statistics

**GET** `/admin/stats`

Get aggregated platform statistics.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 1250,
      "activeUsers": 850,
      "totalMedia": 5600,
      "totalVolume24h": "1500000000000000000000",
      "flaggedContent": 12
    }
  }
}
```

---

### Get Risk View

**GET** `/admin/risk-view`

Get list of content flagged for risk review.

**Query Parameters:**

- `status` - Filter by status (flagged, banned)
- `riskFlags` - Filter by risk flag types

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "flaggedContent": [
      {
        "mediaId": "media_xyz",
        "ticker": "BAD",
        "riskScore": 85,
        "riskFlags": ["SPAM", "NSFW"],
        "reportCount": 15,
        "status": "flagged"
      }
    ]
  }
}
```

---

### Update Risk Flags

**POST** `/admin/risk-flags`

Update risk flags for media content.

**Request Body:**

```json
{
  "mediaId": "media_xyz",
  "riskFlags": ["SPAM", "NSFW"],
  "action": "add",
  "reason": "Multiple user reports"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "message": "Risk flags updated successfully",
    "media": {
      "mediaId": "media_xyz",
      "riskFlags": ["SPAM", "NSFW"],
      "status": "flagged"
    }
  }
}
```

---

### Get Audit Logs

**GET** `/admin/audit-logs`

View audit trail of admin actions.

**Query Parameters:**

- `userId` - Filter by user ID
- `action` - Filter by action type
- `limit` - Results per page
- `offset` - Pagination offset

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "uuid",
        "adminUserId": "uuid",
        "action": "update_risk_flags",
        "targetId": "media_xyz",
        "details": {
          "riskFlags": ["SPAM"],
          "reason": "User report"
        },
        "timestamp": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 150
  }
}
```

---

## Error Codes

Common error codes returned by the API:

- `UNAUTHORIZED` - No or invalid authentication token
- `FORBIDDEN` - Insufficient permissions
- `VALIDATION_ERROR` - Request validation failed
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

---

## Rate Limiting

All API endpoints are rate-limited:

- **Default:** 100 requests per 15 minutes per IP
- **Authenticated:** Higher limits based on user tier
- **Admin:** No rate limits

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

---

## Webhooks (Coming Soon)

Subscribe to real-time events:

- New media created
- Price alerts
- Risk flags added
- Large transactions

---

## SDK Usage

For TypeScript/JavaScript projects, use the official SDK:

```typescript
import { CastQuestClient } from "@castquest/sdk";

const client = new CastQuestClient({
  apiUrl: "http://localhost:3001",
  apiKey: "your-api-key",
});

// Example: Get media
const media = await client.media.search({ search: "sunset" });
```

See [@castquest/sdk](../sdk) for full documentation.

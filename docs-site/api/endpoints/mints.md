# Mints API

NFT mint creation and claiming endpoints.

## Overview

The Mints API allows you to create and manage collectible mints.

**Base URL**: `/api/mints`

## Endpoints

### Create Mint

```
POST /api/mints/create
```

Creates a new mint.

**Request Body:**
```json
{
  "name": "Founder Badge",
  "supply": 100,
  "price": "0.001"
}
```

### Simulate Mint

```
POST /api/mints/simulate
```

Simulates a mint claim.

**Request Body:**
```json
{
  "mintId": "mint_123",
  "address": "0x...",
  "quantity": 1
}
```

**Response:**
```json
{
  "ok": true,
  "gasEstimate": "21000",
  "totalCost": "0.001"
}
```

### Claim Mint

```
POST /api/mints/claim
```

Claims a mint.

**Request Body:**
```json
{
  "mintId": "mint_123",
  "address": "0x...",
  "quantity": 1,
  "signature": "0x..."
}
```

### Attach to Frame

```
POST /api/mints/attach-to-frame
```

Attaches a mint to a frame.

### Attach to Quest

```
POST /api/mints/attach-to-quest
```

Attaches a mint as a quest reward.

### List Mints

```
GET /api/mints
```

Returns all mints.

## See Also

- [Mints Concept](/guide/concepts/mints)
- [Module M7](/architecture/modules/m7-engine)

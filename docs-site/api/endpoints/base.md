# BASE Chain API

Mock BASE blockchain operation endpoints.

## Overview

BASE Chain API provides mock blockchain operations for development.

**Base URL**: `/api/base`

## Endpoints

### Mint NFT

```
POST /api/base/mint
```

Mock NFT minting operation.

**Request Body:**
```json
{
  "address": "0x...",
  "tokenId": "123",
  "quantity": 1
}
```

**Response:**
```json
{
  "ok": true,
  "txHash": "0xabc...",
  "status": "pending"
}
```

### Publish Frame

```
POST /api/base/frame
```

Mock frame publish operation.

### Token Info

```
GET /api/base/token-info/:tokenId
```

Gets token information.

### Transaction Status

```
GET /api/base/tx-status/:txHash
```

Gets transaction status.

**Response:**
```json
{
  "txHash": "0xabc...",
  "status": "confirmed",
  "blockNumber": 12345678
}
```

## See Also

- [Module M4](/architecture/modules/m4-objects)
- [Deployment Guide](/guide/tutorials/deployment)

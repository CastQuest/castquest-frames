# Strategy Worker API

Autonomous worker operation endpoints.

## Overview

Strategy Worker API provides control over background automation.

**Base URL**: `/api/strategy`

## Endpoints

### Run Worker

```
POST /api/strategy/worker/run
```

Triggers a worker operation.

**Request Body:**
```json
{
  "operation": "distribute_rewards"
}
```

### Scan for Work

```
POST /api/strategy/worker/scan
```

Triggers a worker scan.

**Response:**
```json
{
  "ok": true,
  "scanned": 150,
  "triggered": 5
}
```

### Get Worker Status

```
GET /api/strategy/worker/status
```

Gets current worker status.

**Response:**
```json
{
  "running": true,
  "uptime": 3600000,
  "operationsProcessed": 1250
}
```

### Get Event Logs

```
GET /api/strategy/worker/events
```

Gets worker event logs.

## See Also

- [Strategy Worker Concept](/guide/concepts/strategy-worker)
- [Module M7](/architecture/modules/m7-engine)

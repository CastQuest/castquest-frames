# Quests API

Quest creation and management endpoints.

## Overview

The Quests API allows you to create, manage, and track multi-step quests.

**Base URL**: `/api/quests`

## Endpoints

### Create Quest

```
POST /api/quests/create
```

Creates a new quest.

**Request Body:**
```json
{
  "name": "Welcome Quest",
  "description": "Get started with CastQuest"
}
```

**Response:**
```json
{
  "ok": true,
  "quest": {
    "id": "quest_123",
    "name": "Welcome Quest",
    "status": "draft",
    "createdAt": "2024-01-06T12:00:00Z"
  }
}
```

### List Quests

```
GET /api/quests
```

Returns all quests.

**Response:**
```json
{
  "quests": [
    {
      "id": "quest_123",
      "name": "Welcome Quest",
      "status": "active"
    }
  ]
}
```

### Add Quest Step

```
POST /api/quests/add-step
```

Adds a step to a quest.

**Request Body:**
```json
{
  "questId": "quest_123",
  "stepName": "Connect Wallet",
  "requirements": {}
}
```

### Add Quest Reward

```
POST /api/quests/add-reward
```

Adds a reward to a quest.

**Request Body:**
```json
{
  "questId": "quest_123",
  "type": "xp",
  "amount": 100
}
```

### Track Progress

```
POST /api/quests/progress
```

Gets user progress for a quest.

**Request Body:**
```json
{
  "questId": "quest_123",
  "userId": "user_alice"
}
```

**Response:**
```json
{
  "questId": "quest_123",
  "userId": "user_alice",
  "completedSteps": 2,
  "totalSteps": 5,
  "percentComplete": 40
}
```

### Complete Quest

```
POST /api/quests/complete
```

Marks a quest as complete for a user.

### Trigger Quest

```
POST /api/quests/trigger
```

Triggers a quest action.

## See Also

- [Quest Concept](/guide/concepts/quests)
- [Module M5B](/architecture/modules/m5b-quests)
- [SDK Reference](/sdk/api/index)

# Smart Brain API

AI-powered suggestion and automation endpoints.

## Overview

Smart Brain API provides AI-powered suggestions, validation, and optimization.

**Base URL**: `/api/brain`

## Endpoints

### Get Suggestion

```
POST /api/brain/suggest
```

Gets AI-powered suggestions.

**Request Body:**
```json
{
  "context": "frame",
  "type": "content",
  "params": {
    "topic": "quest completion",
    "tone": "celebratory"
  }
}
```

**Response:**
```json
{
  "ok": true,
  "suggestion": {
    "text": "Congratulations!",
    "confidence": 0.95
  }
}
```

### Validate Data

```
POST /api/brain/validate
```

Validates data with AI.

**Request Body:**
```json
{
  "type": "quest",
  "data": {}
}
```

### Optimize Price

```
POST /api/brain/optimize-price
```

Gets AI price optimization.

### Detect Patterns

```
POST /api/brain/detect-patterns
```

Detects usage patterns.

### Assess Risk

```
POST /api/brain/assess-risk
```

Assesses operation risk.

### Get Audit Log

```
GET /api/brain/audit-log
```

Gets AI operation audit log.

## See Also

- [Smart Brain Concept](/guide/concepts/smart-brain)
- [Module M8](/architecture/modules/m8-brain)
- [Smart Brain Runtime](/architecture/smart-brain)

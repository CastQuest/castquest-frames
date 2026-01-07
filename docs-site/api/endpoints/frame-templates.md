# Frame Templates API

Frame template creation and application endpoints.

## Overview

The Frame Templates API allows you to create reusable frame templates.

**Base URL**: `/api/frame-templates`

## Endpoints

### Create Template

```
POST /api/frame-templates/create
```

Creates a new template.

**Request Body:**
```json
{
  "name": "Welcome Template",
  "layout": {
    "primaryText": "Welcome {{userName}}!"
  },
  "parameters": [
    { "name": "userName", "type": "string", "required": true }
  ]
}
```

### Apply Template

```
POST /api/frame-templates/apply
```

Applies a template with parameters.

**Request Body:**
```json
{
  "templateId": "template_123",
  "parameters": {
    "userName": "Alice"
  }
}
```

**Response:**
```json
{
  "ok": true,
  "frame": {
    "id": "frame_456",
    "layout": {
      "primaryText": "Welcome Alice!"
    }
  }
}
```

### List Templates

```
GET /api/frame-templates
```

Returns all templates.

### Update Template

```
POST /api/frame-templates/update
```

Updates a template.

### Delete Template

```
POST /api/frame-templates/delete
```

Deletes a template.

## See Also

- [Templates Concept](/guide/concepts/templates)
- [Module M6](/architecture/modules/m6-templates)
- [Template Tutorial](/guide/tutorials/frame-templates)

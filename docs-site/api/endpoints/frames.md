# Frames API

Frame creation and rendering endpoints.

## Overview

The Frames API allows you to create, manage, and render frames.

**Base URL**: `/api/frames`

## Endpoints

### Create Frame

```
POST /api/frames/create
```

Creates a new frame.

**Request Body:**
```json
{
  "layout": {
    "primaryText": "Hello World",
    "image": "/media/welcome.png"
  }
}
```

### Render Frame

```
POST /api/frames/render
```

Renders a frame to HTML/React.

**Request Body:**
```json
{
  "frameId": "frame_123"
}
```

**Response:**
```json
{
  "ok": true,
  "html": "<div>...</div>",
  "metadata": {}
}
```

### List Frames

```
GET /api/frames
```

Returns all frames.

### Get Frame

```
GET /api/frames/:id
```

Gets a specific frame.

### Update Frame

```
PUT /api/frames/:id
```

Updates a frame.

### Delete Frame

```
DELETE /api/frames/:id
```

Deletes a frame.

## See Also

- [Frames Concept](/guide/concepts/frames)
- [Module M7](/architecture/modules/m7-engine)
- [Custom Frame Tutorial](/guide/tutorials/custom-frame)

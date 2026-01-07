# Module 6: Frame Templates

Module 6 provides a powerful template engine for creating reusable, parameterized frame structures.

## Overview

**M6: Frame Template Engine MEGA**

Template-based frame generation:
- Reusable frame templates
- Parameter substitution
- Template inheritance
- Variable templates
- Admin and web interfaces
- Template marketplace (future)

## Core Features

### 1. Template Creation

Create reusable templates:

```typescript
const template = await client.templates.create({
  name: 'Welcome Template',
  description: 'Welcome message for new users',
  layout: {
    primaryText: 'Welcome {{userName}}!',
    secondaryText: 'Join us on {{platformName}}',
    image: '{{welcomeImage}}',
    cta: {
      label: '{{ctaLabel}}',
      action: 'navigate',
      params: {
        url: '{{ctaUrl}}'
      }
    }
  },
  parameters: [
    { name: 'userName', type: 'string', required: true },
    { name: 'platformName', type: 'string', default: 'CastQuest' },
    { name: 'welcomeImage', type: 'string', default: '/media/welcome.png' },
    { name: 'ctaLabel', type: 'string', default: 'Get Started' },
    { name: 'ctaUrl', type: 'string', required: true }
  ]
});
```

### 2. Template Application

Apply templates with custom parameters:

```typescript
const frame = await client.templates.apply(templateId, {
  userName: 'Alice',
  ctaUrl: '/onboarding'
});
```

### 3. Template Management

Update and manage templates:

```typescript
// Update template
await client.templates.update(templateId, {
  description: 'Updated description'
});

// Delete template
await client.templates.delete(templateId);

// List templates
const templates = await client.templates.list();
```

## Data Structure

### Frame Template

```typescript
interface FrameTemplate {
  id: string;
  name: string;
  description?: string;
  layout: FrameLayout;
  parameters: TemplateParameter[];
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Template Parameter

```typescript
interface TemplateParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'url' | 'color';
  description?: string;
  required: boolean;
  default?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: any[];
  };
}
```

## API Endpoints

### Create Template

```typescript
POST /api/frame-templates/create

Request:
{
  "name": "Quest Complete",
  "layout": {
    "primaryText": "Quest {{questName}} Complete!",
    "secondaryText": "You earned {{reward}} XP"
  },
  "parameters": [
    { "name": "questName", "type": "string", "required": true },
    { "name": "reward", "type": "number", "required": true }
  ]
}
```

### Update Template

```typescript
POST /api/frame-templates/update

Request:
{
  "templateId": "template_123",
  "description": "Updated description"
}
```

### Delete Template

```typescript
POST /api/frame-templates/delete

Request:
{
  "templateId": "template_123"
}
```

### Apply Template

```typescript
POST /api/frame-templates/apply

Request:
{
  "templateId": "template_123",
  "parameters": {
    "questName": "Epic Adventure",
    "reward": 500
  }
}

Response:
{
  "ok": true,
  "frame": {
    "id": "frame_789",
    "layout": {
      "primaryText": "Quest Epic Adventure Complete!",
      "secondaryText": "You earned 500 XP"
    }
  }
}
```

## JSON Data Files

### frame-templates.json

```json
[
  {
    "id": "template_welcome",
    "name": "Welcome Template",
    "layout": {
      "primaryText": "Welcome {{userName}}!",
      "image": "{{image}}"
    },
    "parameters": [
      { "name": "userName", "type": "string", "required": true },
      { "name": "image", "type": "url", "default": "/media/welcome.png" }
    ],
    "createdAt": "2024-01-06T12:00:00Z"
  }
]
```

## Admin Interface

Access at: `http://localhost:3010/frame-templates`

Features:
- List all templates
- Create new templates
- Edit templates
- Preview templates
- Test with sample data
- Delete templates

## Web Interface

Access at: `http://localhost:3000/frames/templates`

Features:
- Browse public templates
- Preview templates
- Apply templates
- Customize parameters

## Built-in Templates

### Welcome Template
- User onboarding
- Parameters: userName, platformName

### Quest Complete
- Quest completion celebration
- Parameters: questName, reward, userName

### Achievement Unlock
- Achievement notifications
- Parameters: achievementName, rarity, earnedDate

### NFT Mint
- NFT minting promotion
- Parameters: nftName, price, supply

### Social Share
- Social media sharing
- Parameters: message, image, shareUrl

## Best Practices

1. **Clear Parameter Names**: Use descriptive names
2. **Provide Defaults**: Set sensible defaults
3. **Document Parameters**: Include descriptions
4. **Validate Input**: Add validation rules
5. **Test Thoroughly**: Test with various inputs
6. **Version Templates**: Track changes

## Next Steps

- [Module M7: Engine](/architecture/modules/m7-engine) - Mint & render engine
- [Module M8: Brain](/architecture/modules/m8-brain) - AI automation
- [API Reference](/api/endpoints/frame-templates) - Template API
- [Template Tutorial](/guide/tutorials/frame-templates) - Using templates

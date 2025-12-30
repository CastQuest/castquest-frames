# Templates

Frame templates are reusable designs that can be applied with different parameters to generate frames quickly and consistently.

## What Are Templates?

A frame template is:
- A reusable frame design
- Parameterized content slots
- Consistent styling and layout
- Version-controlled

## Template Structure

```typescript
interface FrameTemplate {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, TemplateParameter>;
  layout: {
    structure: 'single' | 'split' | 'grid' | 'custom';
    slots: TemplateSlot[];
  };
  style: {
    theme?: 'light' | 'dark' | 'custom';
    colors?: Record<string, string>;
    fonts?: Record<string, string>;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: string;
  };
}

interface TemplateParameter {
  name: string;
  type: 'string' | 'number' | 'image' | 'color';
  required: boolean;
  default?: any;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
  };
}

interface TemplateSlot {
  id: string;
  type: 'text' | 'image' | 'action';
  paramRef: string;  // References a parameter
  style?: Record<string, any>;
}
```

## Creating Templates

### Via Admin Panel

1. Navigate to `/frame-templates/create`
2. Name your template
3. Define parameters
4. Design the layout
5. Set default values
6. Save and publish

### Via API

```typescript
const response = await fetch('/api/frame-templates/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Quest Welcome Card',
    description: 'Welcome card for new quest participants',
    parameters: {
      questName: {
        type: 'string',
        required: true
      },
      userName: {
        type: 'string',
        required: true
      },
      questImage: {
        type: 'image',
        required: false,
        default: '/images/default-quest.png'
      }
    },
    layout: {
      structure: 'split',
      slots: [
        {
          id: 'title',
          type: 'text',
          paramRef: 'questName',
          style: { fontSize: '24px', fontWeight: 'bold' }
        },
        {
          id: 'greeting',
          type: 'text',
          paramRef: 'userName',
          style: { fontSize: '16px' }
        },
        {
          id: 'image',
          type: 'image',
          paramRef: 'questImage'
        }
      ]
    }
  })
});

const { template } = await response.json();
```

## Applying Templates

Generate frames from templates:

```typescript
const response = await fetch('/api/frame-templates/apply', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    templateId: 'template_quest_welcome',
    params: {
      questName: 'Getting Started',
      userName: 'Alice',
      questImage: '/media/getting-started.png'
    }
  })
});

const { frame } = await response.json();
```

## Template Parameters

### String Parameters
Text content that can be substituted:

```typescript
{
  title: {
    type: 'string',
    required: true,
    validation: {
      pattern: '^[A-Za-z0-9 ]{1,50}$'
    }
  }
}
```

### Number Parameters
Numeric values:

```typescript
{
  progress: {
    type: 'number',
    required: true,
    validation: {
      min: 0,
      max: 100
    }
  }
}
```

### Image Parameters
Image URLs or paths:

```typescript
{
  heroImage: {
    type: 'image',
    required: false,
    default: '/images/placeholder.png'
  }
}
```

### Color Parameters
Color values:

```typescript
{
  accentColor: {
    type: 'color',
    required: false,
    default: '#5f67ee'
  }
}
```

## Template Layouts

### Single Layout
One main content area:

```typescript
{
  structure: 'single',
  slots: [
    { id: 'main', type: 'text', paramRef: 'content' }
  ]
}
```

### Split Layout
Two sections (e.g., image + text):

```typescript
{
  structure: 'split',
  slots: [
    { id: 'left', type: 'image', paramRef: 'image' },
    { id: 'right', type: 'text', paramRef: 'description' }
  ]
}
```

### Grid Layout
Multiple cells in a grid:

```typescript
{
  structure: 'grid',
  slots: [
    { id: 'cell_1', type: 'image', paramRef: 'image1' },
    { id: 'cell_2', type: 'image', paramRef: 'image2' },
    { id: 'cell_3', type: 'image', paramRef: 'image3' },
    { id: 'cell_4', type: 'text', paramRef: 'caption' }
  ]
}
```

### Custom Layout
Fully customizable:

```typescript
{
  structure: 'custom',
  slots: [
    {
      id: 'header',
      type: 'text',
      paramRef: 'title',
      style: {
        position: 'absolute',
        top: '20px',
        left: '20px'
      }
    },
    // ... more custom slots
  ]
}
```

## Template Versioning

Templates support versioning for safe updates:

```typescript
{
  metadata: {
    version: '1.2.0',
    changelog: [
      { version: '1.2.0', changes: 'Added color customization' },
      { version: '1.1.0', changes: 'Improved layout' },
      { version: '1.0.0', changes: 'Initial release' }
    ]
  }
}
```

Apply specific versions:

```typescript
await fetch('/api/frame-templates/apply', {
  method: 'POST',
  body: JSON.stringify({
    templateId: 'template_123',
    version: '1.1.0',  // Use specific version
    params: { ... }
  })
});
```

## Template Inheritance

Create templates that extend others:

```typescript
{
  name: 'Premium Quest Card',
  extendsTemplate: 'template_quest_welcome',
  overrides: {
    style: {
      theme: 'dark',
      colors: {
        primary: '#gold'
      }
    }
  },
  additionalParams: {
    isPremium: {
      type: 'boolean',
      required: false,
      default: true
    }
  }
}
```

## Smart Brain Integration

Get AI-powered template suggestions:

```typescript
const suggestions = await fetch('/api/brain/suggest', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    context: 'template',
    type: 'layout',
    params: {
      purpose: 'quest_completion',
      style: 'celebratory'
    }
  })
}).then(r => r.json());

console.log(suggestions);
// {
//   suggestions: [
//     {
//       name: 'Victory Banner',
//       layout: { ... },
//       reasoning: 'Best for celebrating achievements'
//     },
//     ...
//   ]
// }
```

## Template Best Practices

### Design for Reusability
- Keep layouts flexible
- Use semantic parameter names
- Provide sensible defaults
- Document parameter usage

### Maintain Consistency
- Use consistent color schemes
- Follow typography hierarchy
- Maintain spacing standards
- Test across viewport sizes

### Version Carefully
- Use semantic versioning
- Document breaking changes
- Test thoroughly before releasing
- Maintain backwards compatibility when possible

### Optimize for Performance
- Minimize image sizes
- Use efficient layouts
- Avoid excessive parameters
- Cache rendered frames

## Template Library

CastQuest includes built-in templates:

### Quest Templates
- `quest-welcome` - Welcome new participants
- `quest-progress` - Show progress updates
- `quest-complete` - Celebrate completion

### Social Templates
- `social-announcement` - Announcements
- `social-poll` - Interactive polls
- `social-share` - Shareable content

### Mint Templates
- `mint-preview` - Showcase collectibles
- `mint-countdown` - Launch countdowns
- `mint-claimed` - Claim confirmations

### Custom Templates
Create your own for specific needs!

## Managing Templates

### Update Template

```typescript
await fetch('/api/frame-templates/update', {
  method: 'PUT',
  body: JSON.stringify({
    templateId: 'template_123',
    updates: {
      description: 'Updated description',
      parameters: {
        newParam: {
          type: 'string',
          required: false
        }
      }
    }
  })
});
```

### Delete Template

```typescript
await fetch('/api/frame-templates/delete', {
  method: 'DELETE',
  body: JSON.stringify({
    templateId: 'template_123'
  })
});
```

### List Templates

```typescript
const templates = await fetch('/api/frame-templates')
  .then(r => r.json());
```

## Advanced Features

### Conditional Rendering
Show different content based on parameters:

```typescript
{
  slots: [
    {
      id: 'message',
      type: 'text',
      paramRef: 'status',
      conditions: {
        'completed': 'Congratulations!',
        'in_progress': 'Keep going!',
        'not_started': 'Ready to begin?'
      }
    }
  ]
}
```

### Dynamic Styling
Apply styles based on parameters:

```typescript
{
  slots: [
    {
      id: 'badge',
      type: 'image',
      paramRef: 'badgeImage',
      dynamicStyle: {
        border: '${rarity === "legendary" ? "gold" : "silver"} 2px solid'
      }
    }
  ]
}
```

### Nested Templates
Compose complex templates from simpler ones:

```typescript
{
  layout: {
    slots: [
      {
        id: 'header',
        type: 'template',
        templateRef: 'template_header'
      },
      {
        id: 'body',
        type: 'text',
        paramRef: 'content'
      },
      {
        id: 'footer',
        type: 'template',
        templateRef: 'template_footer'
      }
    ]
  }
}
```

## Next Steps

- [Frames](/guide/concepts/frames) - Apply templates to create frames
- [Tutorial: Frame Templates](/guide/tutorials/frame-templates) - Build your first template
- [API Reference](/api/endpoints/frame-templates) - Full API documentation
- [Smart Brain](/guide/concepts/smart-brain) - AI-powered template suggestions

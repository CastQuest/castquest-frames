# SDK Installation

Install and configure the CastQuest SDK in your project.

## Package Manager Installation

### npm

```bash
npm install @castquest/sdk
```

### pnpm

```bash
pnpm add @castquest/sdk
```

### yarn

```bash
yarn add @castquest/sdk
```

## Peer Dependencies

The SDK requires the following peer dependencies:

```json
{
  "typescript": "^5.0.0",
  "viem": "^2.0.0"
}
```

Install them if not already present:

```bash
pnpm add -D typescript
pnpm add viem
```

## TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  }
}
```

## Environment Variables

Create a `.env` file:

```bash
# CastQuest API
CASTQUEST_API_URL=http://localhost:3010/api

# BASE Chain
BASE_RPC_URL=https://mainnet.base.org
BASE_CHAIN_ID=8453

# Smart Brain (optional)
OPENAI_API_KEY=sk-...

# Development
NODE_ENV=development
```

## Verification

Verify the installation:

```typescript
import { CastQuestClient } from '@castquest/sdk';

const client = new CastQuestClient({
  apiUrl: process.env.CASTQUEST_API_URL
});

console.log('CastQuest SDK installed successfully!');
```

## Framework-Specific Setup

### Next.js

Add to `next.config.js`:

```javascript
module.exports = {
  transpilePackages: ['@castquest/sdk']
};
```

### Vite

No additional configuration needed!

### Create React App

If using CRA, you may need to use CRACO for custom webpack config.

## Troubleshooting

### Module Not Found

Ensure the package is installed in your `node_modules`:

```bash
ls node_modules/@castquest/sdk
```

### Type Errors

Ensure TypeScript is properly configured and `@types/node` is installed:

```bash
pnpm add -D @types/node
```

### Import Errors

Use the correct import syntax:

```typescript
// ✅ Correct
import { CastQuestClient } from '@castquest/sdk';

// ❌ Incorrect
import CastQuestClient from '@castquest/sdk';
```

## Next Steps

- [Quick Start](/sdk/quick-start) - Build your first integration
- [Configuration](/sdk/configuration) - Detailed configuration options
- [API Reference](/sdk/api/index) - Complete API documentation

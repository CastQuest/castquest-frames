# Environment Setup

Configure your CastQuest development environment with the necessary environment variables and settings.

## Environment Files

CastQuest uses environment-specific configuration files:

- `.env.local` - Local development (ignored by git)
- `.env.development` - Development defaults
- `.env.production` - Production settings

## Admin App Configuration

Create `apps/admin/.env.local`:

```bash
# App Configuration
NEXT_PUBLIC_APP_NAME="CastQuest Admin"
NEXT_PUBLIC_APP_URL=http://localhost:3010

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3010/api

# Data Storage
DATA_DIR=../../data

# Strategy Worker
STRATEGY_WORKER_ENABLED=true
STRATEGY_WORKER_INTERVAL=30000

# Smart Brain
SMART_BRAIN_ENABLED=true
SMART_BRAIN_MODEL=gpt-4
OPENAI_API_KEY=your_openai_api_key_here

# BASE Chain (Mock)
BASE_RPC_URL=https://base.llamarpc.com
BASE_CHAIN_ID=8453
BASE_MOCK_MODE=true

# Development
NODE_ENV=development
```

## Web App Configuration

Create `apps/web/.env.local`:

```bash
# App Configuration
NEXT_PUBLIC_APP_NAME="CastQuest"
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3010/api
NEXT_PUBLIC_ADMIN_URL=http://localhost:3010

# Farcaster Integration
NEXT_PUBLIC_FARCASTER_HUB_URL=https://hub.farcaster.xyz
FARCASTER_APP_FID=your_app_fid_here

# BASE Chain
NEXT_PUBLIC_BASE_RPC_URL=https://base.llamarpc.com
NEXT_PUBLIC_BASE_CHAIN_ID=8453

# Development
NODE_ENV=development
```

## SDK Configuration

For SDK usage in external projects:

```typescript
// castquest.config.ts
import { defineConfig } from '@castquest/sdk'

export default defineConfig({
  apiUrl: 'http://localhost:3010/api',
  network: 'base',
  mock: true,
  
  // Optional: Custom data directory
  dataDir: './castquest-data',
  
  // Optional: Smart Brain configuration
  smartBrain: {
    enabled: true,
    apiKey: process.env.OPENAI_API_KEY
  }
})
```

## Data Directory Structure

The `data/` directory stores all protocol data:

```
data/
├── frames.json              # Frame instances
├── frame-templates.json     # Reusable templates
├── quests.json              # Quest definitions
├── quest-steps.json         # Quest step definitions
├── quest-progress.json      # User progress tracking
├── quest-rewards.json       # Reward configurations
├── mints.json               # Mint collectibles
├── mint-events.json         # Mint claim events
├── media.json               # Media assets
├── modules.json             # Module configurations
├── brain-events.json        # Smart Brain logs
├── brain-suggestions.json   # AI suggestions
└── worker-events.json       # Strategy worker logs
```

## Port Configuration

Default ports used by CastQuest:

- **3010** - Admin dashboard
- **3000** - Web app
- **3001** - API gateway (if separate)
- **5173** - Documentation site (VitePress)

### Changing Ports

To use different ports:

```bash
# Admin on port 3011
pnpm --filter ./apps/admin dev -- -p 3011

# Web on port 3002
pnpm --filter ./apps/web dev -- -p 3002

# Update .env files accordingly
NEXT_PUBLIC_APP_URL=http://localhost:3011
```

## Smart Brain Configuration

### OpenAI Setup

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add to your `.env.local`:

```bash
OPENAI_API_KEY=sk-...
SMART_BRAIN_MODEL=gpt-4
```

### Custom AI Provider

To use a different AI provider:

```typescript
// packages/ai-brain/src/config.ts
export const aiConfig = {
  provider: 'anthropic', // or 'cohere', 'huggingface'
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-opus'
}
```

## BASE Chain Configuration

### Local Development (Mock Mode)

```bash
BASE_MOCK_MODE=true
BASE_RPC_URL=http://localhost:8545
```

### BASE Testnet

```bash
BASE_MOCK_MODE=false
BASE_RPC_URL=https://sepolia.base.org
BASE_CHAIN_ID=84532
```

### BASE Mainnet

```bash
BASE_MOCK_MODE=false
BASE_RPC_URL=https://mainnet.base.org
BASE_CHAIN_ID=8453
```

## Strategy Worker Configuration

Configure background automation:

```bash
# Enable/disable worker
STRATEGY_WORKER_ENABLED=true

# Scan interval (milliseconds)
STRATEGY_WORKER_INTERVAL=30000

# Max concurrent operations
STRATEGY_WORKER_MAX_CONCURRENT=5

# Log level
STRATEGY_WORKER_LOG_LEVEL=info
```

## Logging Configuration

Control log output:

```bash
# Log level: debug, info, warn, error
LOG_LEVEL=info

# Log format: json, pretty
LOG_FORMAT=pretty

# Enable specific loggers
LOG_QUESTS=true
LOG_FRAMES=true
LOG_MINTS=true
LOG_BRAIN=true
LOG_WORKER=true
```

## Database Configuration (Future)

CastQuest currently uses JSON files. For production deployments, database support is planned:

```bash
# PostgreSQL (Future)
DATABASE_URL=postgresql://user:pass@localhost:5432/castquest

# Redis (Future - for caching)
REDIS_URL=redis://localhost:6379
```

## Security Configuration

### API Keys

Store sensitive keys securely:

```bash
# Never commit these!
OPENAI_API_KEY=sk-...
FARCASTER_APP_SECRET=...
WEBHOOK_SECRET=...

# Use different keys for different environments
```

### CORS Configuration

Configure CORS for API access:

```bash
# Allowed origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:3010

# Allow credentials
CORS_CREDENTIALS=true
```

## Verification

Verify your environment setup:

```bash
# Check environment variables
node -e "console.log(process.env.DATA_DIR)"

# Test API connection
curl http://localhost:3010/api/health

# Check data directory
ls -la data/

# Verify workspace linking
pnpm list --depth 0
```

## Troubleshooting

### Environment Variables Not Loading

Ensure your `.env.local` files are in the correct location:
- `apps/admin/.env.local` (not `apps/admin/app/.env.local`)
- `apps/web/.env.local` (not `apps/web/app/.env.local`)

### Data Directory Not Found

Create the data directory manually if needed:

```bash
mkdir -p data
chmod 755 data
```

### Port Conflicts

Check for processes using your ports:

```bash
# On Linux/Mac
lsof -i :3010
kill -9 <PID>

# On Windows
netstat -ano | findstr :3010
taskkill /PID <PID> /F
```

## Next Steps

- [Quick Start](/guide/quick-start) - Create your first quest
- [API Reference](/api/overview) - Explore API endpoints
- [Deployment](/guide/tutorials/deployment) - Deploy to production

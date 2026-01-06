# Deploy to Production

Learn how to deploy CastQuest Protocol to production environments.

## Overview

This guide covers deploying all CastQuest components to production, including:
- Admin dashboard
- Web application
- API services
- Database setup
- Blockchain configuration
- Monitoring and maintenance

## Prerequisites

- Node.js 20+ installed
- pnpm 9.x installed
- Access to deployment platform (Vercel, Railway, etc.)
- Domain name (optional)
- RPC endpoints for target networks

## Deployment Options

### Option 1: Vercel (Recommended for Apps)

Perfect for Next.js applications (admin and web).

#### Step 1: Prepare for Deployment

```bash
# Build locally first to test
pnpm build

# Test production build
pnpm start
```

#### Step 2: Configure Vercel

Create `vercel.json` in app directory:

```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "env": {
    "CASTQUEST_API_URL": "@castquest-api-url",
    "BASE_RPC_URL": "@base-rpc-url",
    "OPENAI_API_KEY": "@openai-api-key"
  }
}
```

#### Step 3: Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy admin dashboard
cd apps/admin
vercel --prod

# Deploy web app
cd apps/web
vercel --prod
```

### Option 2: Railway (Full Stack)

Great for deploying the entire stack including services.

#### Step 1: Create Railway Project

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init
```

#### Step 2: Configure Services

Create `railway.json`:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "pnpm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Step 3: Deploy

```bash
railway up
```

### Option 3: Docker (Self-Hosted)

Deploy using Docker containers.

#### Step 1: Create Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@9.0.0

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ packages/
COPY apps/ apps/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build
RUN pnpm build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages ./packages
COPY --from=base /app/apps ./apps
COPY --from=base /app/package.json ./

EXPOSE 3000
EXPOSE 3010

CMD ["pnpm", "start"]
```

#### Step 2: Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  admin:
    build: .
    ports:
      - "3010:3010"
    environment:
      - NODE_ENV=production
      - PORT=3010
      - CASTQUEST_DATA_DIR=/data
    volumes:
      - admin-data:/data
    restart: unless-stopped

  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - CASTQUEST_API_URL=http://admin:3010/api
    depends_on:
      - admin
    restart: unless-stopped

volumes:
  admin-data:
```

#### Step 3: Deploy

```bash
docker-compose up -d
```

## Environment Configuration

### Production Environment Variables

Create `.env.production`:

```bash
# API Configuration
CASTQUEST_API_URL=https://api.castquest.xyz/api
NODE_ENV=production

# Blockchain Configuration
BASE_RPC_URL=https://mainnet.base.org
CHAIN_ID=8453

# Smart Brain (AI)
OPENAI_API_KEY=sk-...
SMART_BRAIN_ENABLED=true

# Data Storage
CASTQUEST_DATA_DIR=/var/lib/castquest

# Monitoring
SENTRY_DSN=https://...
LOG_LEVEL=warn

# Security
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://castquest.xyz
```

### Environment-Specific Configs

```typescript
// config/production.ts
export default {
  api: {
    url: process.env.CASTQUEST_API_URL,
    timeout: 30000
  },
  blockchain: {
    network: 'base',
    rpcUrl: process.env.BASE_RPC_URL,
    mock: false
  },
  cache: {
    enabled: true,
    ttl: 3600
  },
  logging: {
    level: 'warn',
    pretty: false
  }
};
```

## Database Setup

### JSON File Storage (Simple)

For simple deployments:

```bash
# Ensure data directory exists
mkdir -p /var/lib/castquest/data

# Set permissions
chmod 755 /var/lib/castquest/data
```

### PostgreSQL (Scalable)

For production scale:

```bash
# Install Postgres
# Configure connection
DATABASE_URL=postgresql://user:pass@host:5432/castquest

# Run migrations
pnpm db:migrate
```

## Blockchain Configuration

### Mainnet RPC Endpoints

```bash
# Base Mainnet
BASE_RPC_URL=https://mainnet.base.org

# Backup RPCs
BASE_RPC_BACKUP_1=https://base.llamarpc.com
BASE_RPC_BACKUP_2=https://base.meowrpc.com
```

### Smart Contract Deployment

```bash
# Deploy contracts to Base
cd packages/contracts
forge script script/Deploy.s.sol:DeployScript --rpc-url $BASE_RPC_URL --broadcast --verify
```

## Security Checklist

- [ ] Environment variables secured
- [ ] API keys not in code
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation in place
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] Authentication required
- [ ] Regular security audits

## Monitoring Setup

### Application Monitoring

```typescript
// Add Sentry for error tracking
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: 'production',
  tracesSampleRate: 1.0
});
```

### Performance Monitoring

```typescript
// Add performance tracking
import { performance } from 'perf_hooks';

app.use((req, res, next) => {
  const start = performance.now();
  res.on('finish', () => {
    const duration = performance.now() - start;
    console.log(`${req.method} ${req.url} ${duration}ms`);
  });
  next();
});
```

### Health Checks

```typescript
// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## CDN Configuration

Use CDN for static assets:

```typescript
// next.config.js
module.exports = {
  assetPrefix: process.env.CDN_URL || '',
  images: {
    domains: ['cdn.castquest.xyz']
  }
};
```

## Continuous Deployment

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install pnpm
        run: npm install -g pnpm@9.0.0
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
      
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Backup Strategy

### Automated Backups

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/castquest"
DATA_DIR="/var/lib/castquest/data"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" "$DATA_DIR"

# Keep last 7 days
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +7 -delete
```

### Database Backups

```bash
# Backup Postgres
pg_dump castquest > backup_$(date +%Y%m%d).sql

# Upload to cloud storage
aws s3 cp backup_$(date +%Y%m%d).sql s3://castquest-backups/
```

## Scaling Considerations

### Horizontal Scaling

- Deploy multiple instances behind load balancer
- Use session store (Redis) for state
- Implement caching layer

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Enable compression

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .next node_modules
pnpm install
pnpm build
```

### Connection Issues

```bash
# Check API connectivity
curl https://api.castquest.xyz/health

# Check RPC connectivity
curl $BASE_RPC_URL -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### Performance Issues

- Enable caching
- Optimize images
- Use CDN
- Enable compression
- Minimize bundle size

## Rollback Plan

### Quick Rollback

```bash
# Revert to previous deployment
vercel rollback

# Or with Railway
railway rollback
```

### Manual Rollback

```bash
# Checkout previous version
git checkout <previous-commit>

# Redeploy
vercel --prod
```

## Post-Deployment

### Smoke Tests

```bash
# Test critical endpoints
curl https://castquest.xyz/api/health
curl https://castquest.xyz/api/quests
curl https://castquest.xyz/api/frames
```

### Monitor Logs

```bash
# View logs
vercel logs

# Or Railway
railway logs
```

### Performance Check

- Check response times
- Monitor error rates
- Review resource usage

## Maintenance

### Regular Updates

```bash
# Update dependencies
pnpm update

# Rebuild and redeploy
pnpm build && vercel --prod
```

### Security Patches

```bash
# Check for vulnerabilities
pnpm audit

# Fix automatically
pnpm audit fix
```

## Next Steps

- [Custom Frames](/guide/tutorials/custom-frame) - Build custom content
- [Frame Templates](/guide/tutorials/frame-templates) - Use templates
- [Monitoring Guide](/guide/advanced/monitoring) - Set up monitoring
- [Scaling Guide](/guide/advanced/scaling) - Scale your deployment

## Support

- [GitHub Discussions](https://github.com/CastQuest/castquest-frames/discussions)
- [Discord Community](https://discord.gg/castquest)
- [Documentation](/)

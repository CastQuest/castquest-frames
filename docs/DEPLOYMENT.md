# 🚀 CastQuest Deployment Guide

This guide covers deployment strategies for the CastQuest Frames platform, including both User and Admin dashboards.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Dashboard Deployments](#dashboard-deployments)
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [AWS Deployment](#aws-deployment)
- [Database Setup](#database-setup)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
- Node.js 20+ (LTS recommended)
- pnpm 9+
- Git
- PostgreSQL 15+
- Redis 7+ (for admin dashboard)

### Access Requirements
- GitHub repository access
- Cloud platform credentials (Vercel/AWS/other)
- Database connection strings
- Domain names (for production)

---

## Environment Configuration

### User Dashboard Environment Variables

Create `apps/web/.env.production`:

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://castquest.io

# API Configuration
NEXT_PUBLIC_API_URL=https://api.castquest.io
NEXT_PUBLIC_FARCASTER_API_KEY=your_farcaster_api_key

# Database
DATABASE_URL=postgresql://user:pass@host:5432/castquest?sslmode=require

# Authentication
NEXTAUTH_URL=https://castquest.io
NEXTAUTH_SECRET=your_nextauth_secret_min_32_chars

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_MARKETPLACE_ENABLED=true
NEXT_PUBLIC_AI_BUILDER_ENABLED=true

# Storage (Optional)
AWS_S3_BUCKET=castquest-media
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key

# Smart Brain (Optional)
SMART_BRAIN_API_KEY=your_brain_api_key
SMART_BRAIN_ENDPOINT=https://brain.castquest.io
```

### Admin Dashboard Environment Variables

Create `apps/admin/.env.production`:

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://admin.castquest.io

# API Configuration
NEXT_PUBLIC_API_URL=https://admin.castquest.io
NEXT_PUBLIC_ADMIN_SECRET=your_admin_secret_min_32_chars

# Database
DATABASE_URL=postgresql://user:pass@host:5432/castquest?sslmode=require

# Redis (Required for admin)
REDIS_URL=redis://user:pass@host:6379?ssl=true

# Authentication
ADMIN_JWT_SECRET=your_jwt_secret_min_32_chars
ADMIN_SESSION_DURATION=86400

# Security
ENABLE_2FA=true
MAX_LOGIN_ATTEMPTS=5
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60

# Risk Management
ENABLE_RISK_DETECTION=true
RISK_DETECTION_THRESHOLD=0.85
AI_RISK_MODEL_VERSION=v2.0

# Monitoring
MONITORING_INTERVAL=30000
ENABLE_AUDIT_LOG=true
ALERT_WEBHOOK_URL=https://alerts.castquest.io/webhook

# System Health
ENABLE_HEALTH_CHECKS=true
HEALTH_CHECK_INTERVAL=60000
```

---

## Dashboard Deployments

### Local Production Build

Test production builds locally before deploying:

```bash
# Build both dashboards
pnpm build

# Test user dashboard
cd apps/web
pnpm start

# Test admin dashboard (in new terminal)
cd apps/admin
PORT=3010 pnpm start
```

### Production Build Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Assets optimized and compressed
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Monitoring setup complete
- [ ] Backup strategy in place
- [ ] SSL certificates valid
- [ ] Domain DNS configured
- [ ] CDN configured (optional)

---

## Vercel Deployment

Vercel is the recommended platform for Next.js deployments.

### User Dashboard Deployment

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy User Dashboard**
```bash
cd apps/web
vercel

# Follow prompts:
# - Set up and deploy: Y
# - Which scope: Your account/org
# - Link to existing project: N
# - Project name: castquest-user-dashboard
# - Directory: ./
# - Override settings: N
```

3. **Configure Environment Variables**
```bash
# Set production environment variables
vercel env add NEXT_PUBLIC_API_URL production
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
# ... add all required variables
```

4. **Deploy to Production**
```bash
vercel --prod
```

5. **Configure Domain**
```bash
vercel domains add castquest.io
# Follow DNS configuration instructions
```

### Admin Dashboard Deployment

1. **Deploy Admin Dashboard**
```bash
cd apps/admin
vercel

# Project name: castquest-admin-dashboard
```

2. **Configure Environment Variables**
```bash
vercel env add NEXT_PUBLIC_ADMIN_SECRET production
vercel env add DATABASE_URL production
vercel env add REDIS_URL production
vercel env add ADMIN_JWT_SECRET production
# ... add all required variables
```

3. **Deploy to Production**
```bash
vercel --prod
```

4. **Configure Admin Domain**
```bash
vercel domains add admin.castquest.io
```

### Vercel Configuration Files

**User Dashboard** (`apps/web/vercel.json`):
```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1", "sfo1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

**Admin Dashboard** (`apps/admin/vercel.json`):
```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/",
      "destination": "/dashboard"
    }
  ]
}
```

---

## Docker Deployment

For self-hosted or custom infrastructure deployments.

### Docker Setup

1. **User Dashboard Dockerfile** (`apps/web/Dockerfile`):
```dockerfile
# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@9

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web ./apps/web
COPY packages ./packages

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build application
WORKDIR /app/apps/web
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
```

2. **Admin Dashboard Dockerfile** (`apps/admin/Dockerfile`):
```dockerfile
# Build stage
FROM node:20-alpine AS builder

RUN npm install -g pnpm@9

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/admin ./apps/admin
COPY packages ./packages

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/admin
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV PORT 3010

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/public ./public

USER nextjs

EXPOSE 3010

CMD ["node", "server.js"]
```

3. **Docker Compose** (`docker-compose.yml`):
```yaml
version: '3.8'

services:
  # User Dashboard
  user-dashboard:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - postgres
    restart: unless-stopped
    networks:
      - castquest-network

  # Admin Dashboard
  admin-dashboard:
    build:
      context: .
      dockerfile: apps/admin/Dockerfile
    ports:
      - "3010:3010"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - ADMIN_JWT_SECRET=${ADMIN_JWT_SECRET}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - castquest-network

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=${DB_USER:-castquest}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME:-castquest}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - castquest-network

  # Redis Cache
  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - castquest-network

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - user-dashboard
      - admin-dashboard
    restart: unless-stopped
    networks:
      - castquest-network

networks:
  castquest-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
```

4. **Deploy with Docker Compose**:
```bash
# Create .env file
cp .env.example .env
# Edit .env with production values

# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Stop services
docker-compose down
```

---

## AWS Deployment

### AWS ECS Deployment

1. **Setup AWS CLI**
```bash
# Install AWS CLI
brew install awscli  # macOS
# or
pip install awscli  # Python

# Configure credentials
aws configure
```

2. **Create ECR Repositories**
```bash
# User dashboard repository
aws ecr create-repository \
  --repository-name castquest/user-dashboard \
  --region us-east-1

# Admin dashboard repository
aws ecr create-repository \
  --repository-name castquest/admin-dashboard \
  --region us-east-1
```

3. **Build and Push Images**
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com

# Build user dashboard
docker build -t castquest/user-dashboard -f apps/web/Dockerfile .
docker tag castquest/user-dashboard:latest \
  ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/castquest/user-dashboard:latest
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/castquest/user-dashboard:latest

# Build admin dashboard
docker build -t castquest/admin-dashboard -f apps/admin/Dockerfile .
docker tag castquest/admin-dashboard:latest \
  ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/castquest/admin-dashboard:latest
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/castquest/admin-dashboard:latest
```

4. **Create ECS Task Definitions** (`ecs-task-user.json`):
```json
{
  "family": "castquest-user-dashboard",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "user-dashboard",
      "image": "${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/castquest/user-dashboard:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:${AWS_ACCOUNT_ID}:secret:castquest/database-url"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/castquest-user-dashboard",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

5. **Deploy to ECS**
```bash
# Register task definition
aws ecs register-task-definition \
  --cli-input-json file://ecs-task-user.json

# Create/Update service
aws ecs update-service \
  --cluster castquest \
  --service user-dashboard \
  --task-definition castquest-user-dashboard \
  --force-new-deployment
```

---

## Database Setup

### PostgreSQL Setup

1. **Run Migrations**
```bash
# Development
pnpm prisma migrate dev

# Production
pnpm prisma migrate deploy
```

2. **Seed Database** (optional)
```bash
pnpm prisma db seed
```

3. **Backup Database**
```bash
# Create backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore backup
psql $DATABASE_URL < backup-20260105.sql
```

### Redis Setup

1. **Configure Redis**
```bash
# For production, enable password and persistence
redis-server --requirepass your_redis_password --save 900 1
```

2. **Test Connection**
```bash
redis-cli -h host -p 6379 -a password ping
```

---

## Monitoring & Maintenance

### Health Checks

**User Dashboard Health Endpoint**: `/api/health`
```json
{
  "status": "healthy",
  "timestamp": "2026-01-05T12:00:00Z",
  "version": "1.0.0",
  "uptime": 86400
}
```

**Admin Dashboard Health Endpoint**: `/api/health`
```json
{
  "status": "healthy",
  "timestamp": "2026-01-05T12:00:00Z",
  "database": "connected",
  "redis": "connected",
  "services": {
    "risk_detection": "operational",
    "monitoring": "operational"
  }
}
```

### Monitoring Setup

1. **Logging**
```bash
# View application logs
docker-compose logs -f user-dashboard
docker-compose logs -f admin-dashboard

# AWS CloudWatch
aws logs tail /ecs/castquest-user-dashboard --follow
```

2. **Metrics**
- Setup CloudWatch dashboards for CPU, memory, network
- Configure alerts for high error rates
- Monitor database connections and query performance
- Track API response times

3. **Uptime Monitoring**
- Use services like UptimeRobot, Pingdom, or custom solutions
- Monitor both dashboard endpoints
- Check SSL certificate expiration
- Verify DNS resolution

### Backup Strategy

1. **Database Backups**
```bash
# Daily automated backups
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz
```

2. **Application State**
- Backup environment variables (encrypted)
- Backup configuration files
- Document deployment procedures

---

## Troubleshooting

### Common Deployment Issues

**Build Failures**
```bash
# Clear build cache
rm -rf .next node_modules/.cache
pnpm install --force
pnpm build
```

**Environment Variables Not Loading**
```bash
# Verify .env files exist
ls -la apps/web/.env.production
ls -la apps/admin/.env.production

# Check variable names (must start with NEXT_PUBLIC_ for client-side)
```

**Database Connection Issues**
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check connection string format
# Should be: postgresql://user:pass@host:port/db?sslmode=require
```

**Memory Issues**
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" pnpm build

# Or in Dockerfile
ENV NODE_OPTIONS="--max-old-space-size=2048"
```

**Port Already in Use**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
lsof -ti:3010 | xargs kill -9
```

### Rollback Procedure

**Vercel Rollback**
```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

**Docker Rollback**
```bash
# Use previous image tag
docker-compose down
# Edit docker-compose.yml to use previous tag
docker-compose up -d
```

**Database Rollback**
```bash
# Restore from backup
psql $DATABASE_URL < backup-previous.sql

# Or use Prisma
pnpm prisma migrate resolve --rolled-back migration_name
```

---

## Security Checklist

Before deploying to production:

- [ ] All secrets stored securely (not in code)
- [ ] HTTPS enabled with valid SSL certificates
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Database connections use SSL
- [ ] Admin dashboard has additional authentication
- [ ] 2FA enabled for admin accounts
- [ ] Audit logging enabled
- [ ] Regular security updates scheduled
- [ ] Backup and disaster recovery tested
- [ ] Monitoring and alerting configured

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## Support

For deployment issues:
- 📖 Check [docs/DASHBOARDS.md](./DASHBOARDS.md)
- 🐛 [Report Issues](https://github.com/CastQuest/castquest-frames/issues)
- 💬 [Discord Support](https://discord.gg/castquest)
- 📧 [Email Support](mailto:support@castquest.io)

---

**Last Updated:** 2026-01-05  
**Version:** 1.0.0

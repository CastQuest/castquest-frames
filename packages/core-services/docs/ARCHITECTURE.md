# CastQuest Core Services - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      CONSUMER APPLICATIONS                       │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ apps/web │  │apps/admin│  │  Frames  │  │   SDK    │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
└───────┼─────────────┼─────────────┼─────────────┼───────────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                          │
        ┌─────────────────▼──────────────────┐
        │    @castquest/core-services API    │
        │    http://localhost:4000/api/v1    │
        └─────────────────┬──────────────────┘
                          │
        ┌─────────────────▼──────────────────┐
        │         Express Server              │
        │  ┌────────────────────────────┐    │
        │  │ Middleware Stack           │    │
        │  │ • Helmet (security)        │    │
        │  │ • CORS                     │    │
        │  │ • Rate Limiting            │    │
        │  │ • JWT Auth                 │    │
        │  │ • Request Logging          │    │
        │  └────────────────────────────┘    │
        └─────────────────┬──────────────────┘
                          │
        ┌─────────────────▼──────────────────┐
        │          Module Layer               │
        │                                     │
        │  ┌─────────┐  ┌─────────┐         │
        │  │  Users  │  │ Wallets │         │
        │  │ Service │  │ Service │         │
        │  └────┬────┘  └────┬────┘         │
        │                                     │
        │  ┌─────────┐  ┌─────────┐         │
        │  │  Media  │  │ Markets │         │
        │  │ Service │  │ Service │         │
        │  └────┬────┘  └────┬────┘         │
        │                                     │
        │  ┌─────────┐                       │
        │  │  Risk   │                       │
        │  │ Service │                       │
        │  └────┬────┘                       │
        └───────┼──────────────────────────┘
                │
        ┌───────▼──────────────────────────┐
        │      Database Layer               │
        │   ┌──────────────────────┐       │
        │   │   Drizzle ORM        │       │
        │   └──────────┬───────────┘       │
        │              │                    │
        │   ┌──────────▼───────────┐       │
        │   │  PostgreSQL Database  │       │
        │   │  • users              │       │
        │   │  • wallets            │       │
        │   │  • media_metadata     │       │
        │   │  • market_snapshots   │       │
        │   │  • audit_logs         │       │
        │   └──────────────────────┘       │
        └──────────────────────────────────┘
                          │
        ┌─────────────────▼──────────────────┐
        │     External Integrations           │
        │  ┌────────────┐  ┌────────────┐   │
        │  │ Blockchain │  │  AI Brain  │   │
        │  │  Events    │  │   Signals  │   │
        │  └────────────┘  └────────────┘   │
        └────────────────────────────────────┘
```

## API Endpoint Structure

### Public Endpoints (No Auth)

- `GET /health` - Health check
- `GET /api/v1/media` - Search media
- `GET /api/v1/media/:id` - Media details
- `GET /api/v1/markets/signals` - Market signals
- `GET /api/v1/markets/prices` - Current prices

### Authenticated Endpoints (JWT)

- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `GET /api/v1/users/profile` - User profile
- `POST /api/v1/wallets` - Add wallet
- `GET /api/v1/wallets` - List wallets
- `DELETE /api/v1/wallets/:id` - Remove wallet

### Admin Endpoints (API Key)

- `GET /api/v1/admin/stats` - Platform statistics
- `GET /api/v1/admin/risk-view` - Flagged content
- `POST /api/v1/admin/risk-flags` - Update flags
- `GET /api/v1/admin/audit-logs` - Audit trail

## Data Flow

### User Registration Flow

```
Client Request
    │
    ▼
POST /api/v1/users/register
    │
    ▼
Validate Input (Zod)
    │
    ▼
Hash Password (bcrypt)
    │
    ▼
Insert User → Database
    │
    ▼
Generate Verification Token
    │
    ▼
Send Email (nodemailer)
    │
    ▼
Return User + Token
```

### Media Search Flow

```
Client Request
    │
    ▼
GET /api/v1/media?search=sunset
    │
    ▼
Parse Query Parameters
    │
    ▼
Build Database Query (Drizzle)
    │
    ▼
Execute Query → PostgreSQL
    │
    ▼
Transform Results
    │
    ▼
Return JSON Response
```

### Market Signal Flow

```
Blockchain Events
    │
    ▼
Event Listener (Worker)
    │
    ▼
Process Price Data
    │
    ▼
Calculate 24h % Change
    │
    ▼
Determine Status (green/red/neutral)
    │
    ▼
Store in market_snapshots
    │
    ▼
GET /api/v1/markets/signals
    │
    ▼
Return Cached Signals
```

## Database Schema Relationships

```
┌─────────────┐         ┌──────────────┐
│    users    │────────▶│   wallets    │
│ - id        │  1:N    │ - id         │
│ - email     │         │ - userId     │
│ - status    │         │ - address    │
└─────────────┘         │ - type       │
      │                 └──────────────┘
      │ 1:N
      │
      ▼
┌─────────────────┐     ┌──────────────┐
│ media_metadata  │────▶│ market_snap  │
│ - id            │ 1:N │ - id         │
│ - tokenAddress  │     │ - tokenAddr  │
│ - creatorUserId │     │ - price      │
│ - ticker        │     │ - volume24h  │
│ - riskFlags     │     │ - timestamp  │
└─────────────────┘     └──────────────┘
```

## Security Layers

1. **Network Level**

   - CORS configuration
   - Rate limiting (100 req/15min)
   - Helmet security headers

2. **Authentication Level**

   - JWT tokens (7-day expiry)
   - Admin API keys
   - Password hashing (bcrypt)

3. **Application Level**

   - Input validation (Zod)
   - SQL injection prevention (Drizzle ORM)
   - XSS protection (sanitization)

4. **Audit Level**
   - Request logging (Winston)
   - Admin action audit trail
   - Error tracking

## Deployment Architecture

```
┌───────────────────────────────────┐
│      Load Balancer (Optional)     │
└──────────────┬────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
┌─────────┐         ┌─────────┐
│ API     │         │ API     │
│ Server  │         │ Server  │
│ (Node)  │         │ (Node)  │
└────┬────┘         └────┬────┘
     │                   │
     └──────────┬────────┘
                │
                ▼
        ┌───────────────┐
        │   PostgreSQL  │
        │   Primary DB  │
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │   PostgreSQL  │
        │  Replica (RO) │
        └───────────────┘
```

## Performance Considerations

### Caching Strategy

- Market data cached in database (15-minute refresh)
- Media metadata cached for fast search
- User sessions stored in database

### Indexing

- User email (unique index)
- Wallet addresses (unique index)
- Media token addresses (unique index)
- Owner addresses (index for filtering)
- Status fields (index for queries)

### Query Optimization

- Pagination for large result sets
- Selective field projection
- Compound indexes for common queries
- Connection pooling (20 connections)

## Monitoring & Observability

### Metrics

- Request rate per endpoint
- Response time (p50, p95, p99)
- Error rates
- Database query time
- Active connections

### Logging

- Request/response logging
- Error stack traces
- Admin action audit trail
- Database query logging (dev only)

### Health Checks

- `/health` endpoint
- Database connectivity check
- Uptime monitoring
- Version information

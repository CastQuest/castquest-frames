# CastQuest Core Services

**Version**: 1.0.0  
**Role**: Shared domain models, APIs, and onchain event ingestion

---

## Overview

CastQuest Core Services is the central backend service layer that all frontend apps, frames, admin panels, and SDKs depend on. It provides:

- **User & wallet management** - Email auth, verification, wallet mapping
- **Media & token registry** - Offchain mirror of onchain data
- **Market data ingestion** - Real-time price, volume, holder data
- **REST APIs** - Consistent, strongly-typed endpoints
- **Security & abuse control** - Rate limiting, audit logs, risk signals

---

## Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration

# Run database migrations
pnpm db:migrate

# Seed database (optional)
pnpm db:seed

# Start development server
pnpm dev
```

Server starts at: `http://localhost:4000`

### Production

```bash
# Build
pnpm build

# Start
pnpm start
```

---

## Architecture

```
packages/core-services/
├── src/
│   ├── modules/
│   │   ├── users/          # User accounts & authentication
│   │   ├── wallets/        # EVM wallet management
│   │   ├── media/          # Media & token metadata
│   │   ├── markets/        # Market data & signals
│   │   └── risk/           # Risk assessment & abuse control
│   ├── lib/
│   │   ├── db/             # Database (Drizzle ORM + PostgreSQL)
│   │   ├── config.ts       # Configuration
│   │   └── logger.ts       # Winston logging
│   ├── types/
│   │   └── index.ts        # Shared TypeScript types
│   └── server.ts           # Express server
├── tests/                  # Unit tests
├── package.json
└── tsconfig.json
```

---

## API Endpoints

### Base URL

- **Development**: `http://localhost:4000/api/v1`
- **Production**: `https://api.castquest.xyz/api/v1`

### Health Check

```
GET /health
```

Response:

```json
{
  "status": "healthy",
  "timestamp": "2025-12-28T...",
  "uptime": 12345,
  "database": "connected",
  "version": "v1"
}
```

### Users

```
POST   /api/v1/users/register       # Register new user
POST   /api/v1/users/login          # Login
POST   /api/v1/users/verify-email   # Verify email
GET    /api/v1/users/:id            # Get user by ID
GET    /api/v1/users/email/:email   # Get user by email
```

### Wallets

```
POST   /api/v1/wallets                    # Add wallet
GET    /api/v1/wallets/user/:userId       # Get user's wallets
GET    /api/v1/wallets/address/:address   # Get wallet by address
PUT    /api/v1/wallets/:id/primary        # Set as primary
```

### Media (Coming Soon)

```
GET    /api/v1/media                     # List all media tokens
GET    /api/v1/media/:tokenAddress       # Get media details
GET    /api/v1/media/search              # Search media tokens
POST   /api/v1/media                     # Create media metadata (admin)
```

### Markets (Coming Soon)

```
GET    /api/v1/markets/:tokenAddress              # Get market signal
GET    /api/v1/markets/:tokenAddress/price-history # Price history
GET    /api/v1/markets/:tokenAddress/trades       # Trade history
GET    /api/v1/markets/trending                   # Trending tokens
```

### Risk (Coming Soon)

```
GET    /api/v1/risk/:tokenAddress    # Get risk assessment
POST   /api/v1/risk/assess           # Create assessment (admin)
GET    /api/v1/risk/flagged          # Get flagged tokens
```

---

## Domain Models

### User

```typescript
interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  status: UserStatus; // pending, active, suspended, banned
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}
```

### Wallet

```typescript
interface Wallet {
  id: string;
  userId: string;
  address: string; // EVM address
  type: WalletType; // eoa, smart_wallet, multisig
  label?: string;
  isPrimary: boolean;
  createdAt: Date;
  lastUsedAt?: Date;
}
```

### MediaMetadata

```typescript
interface MediaMetadata {
  mediaId: string;
  tokenAddress: string;
  ownerAddress: string;
  ticker: string;
  name: string;
  description: string;
  mediaType: MediaType; // image, video, audio, text
  mediaUrl: string;
  status: TokenStatus; // pending, active, flagged, banned
  riskScore: number; // 0-100
  riskFlags: string[];
  createdAt: Date;
  blockNumber: bigint;
  transactionHash: string;
}
```

### MarketSignal

```typescript
interface MarketSignal {
  tokenAddress: string;
  currentPrice: string;
  priceChangePercent24h: number;
  volume24h: string;
  trades24h: number;
  holderCount: number;
  status: MarketStatus; // green, red, neutral
  lastUpdated: Date;
}
```

---

## Database

### Technology

- **PostgreSQL** for primary data storage
- **Drizzle ORM** for type-safe database queries
- **Connection pooling** for performance

### Schema Management

```bash
# Create migration
pnpm db:migrate

# Reset database
pnpm db:reset

# Seed data
pnpm db:seed
```

### Tables

- `users` - User accounts
- `verification_tokens` - Email verification & password reset
- `wallets` - EVM wallet mappings
- `media_metadata` - Media token metadata
- `market_signals` - Computed market data
- `price_points` - Time series price data
- `trades` - Trading history
- `risk_assessments` - Risk evaluations
- `audit_logs` - Admin action tracking

---

## Security

### Authentication

- Email/password registration
- JWT tokens for API authentication
- Email verification required
- Secure password hashing (bcrypt)

### Rate Limiting

- 100 requests per 15 minutes per IP
- Configurable via environment variables
- Applied to all `/api/*` endpoints

### Audit Logging

All admin actions are logged:

- User ID
- Action type
- Resource affected
- Timestamp
- IP address
- User agent

### CORS

- Production: Restricted to `castquest.xyz` domains
- Development: Open (all origins)

---

## Configuration

### Environment Variables

See `.env.example` for all available variables:

**Required**:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT signing
- `PORT` - Server port (default: 4000)

**Optional**:

- `SMTP_*` - Email configuration
- `RPC_URL_*` - Blockchain RPC endpoints
- `REDIS_URL` - Redis for caching

---

## Development

### Scripts

```bash
pnpm dev          # Start dev server with hot reload
pnpm build        # Build for production
pnpm start        # Start production server
pnpm test         # Run tests
pnpm test:watch   # Run tests in watch mode
pnpm typecheck    # TypeScript type checking
pnpm lint         # ESLint
```

### Testing

```bash
# Run all tests
pnpm test

# Run specific test
pnpm test src/modules/users/service.test.ts

# Watch mode
pnpm test:watch
```

### Logging

Logs are written to:

- `logs/all.log` - All logs
- `logs/error.log` - Errors only
- Console output (colorized)

Log levels: `error`, `warn`, `info`, `http`, `debug`

---

## Integration

### Consuming from Other Repos

```typescript
// Import shared types
import {
  User,
  Wallet,
  MediaMetadata,
  MarketSignal,
} from "@castquest/core-services";

// Make API calls
const response = await fetch("http://localhost:4000/api/v1/users/123");
const { success, data } = await response.json();
```

### SDK Integration

The `@castquest/sdk` package will wrap these APIs:

```typescript
import { CastQuestSDK } from "@castquest/sdk";

const sdk = new CastQuestSDK({
  apiUrl: "http://localhost:4000/api/v1",
  apiKey: "your-api-key",
});

const user = await sdk.users.getById("123");
const wallets = await sdk.wallets.getByUserId("123");
const market = await sdk.markets.getSignal("0x...");
```

---

## Deployment

### Codespaces

On startup:

1. Dependencies auto-install
2. Database migrations run
3. Seed data loaded (optional)
4. Server starts on port 4000

### Production

```bash
# Build
pnpm build

# Set environment variables
export NODE_ENV=production
export DATABASE_URL=postgresql://...
export JWT_SECRET=...

# Run migrations
pnpm db:migrate

# Start server
pnpm start
```

### Docker (Coming Soon)

```bash
docker build -t castquest-core-services .
docker run -p 4000:4000 castquest-core-services
```

---

## Roadmap

### Phase 1 (Current)

- ✅ User accounts & authentication
- ✅ Wallet management
- ✅ Database schema
- ✅ Basic API structure

### Phase 2

- [ ] Media token ingestion from blockchain
- [ ] Market data computation
- [ ] Risk assessment integration
- [ ] Search & filtering APIs

### Phase 3

- [ ] WebSocket support for real-time updates
- [ ] Redis caching layer
- [ ] GraphQL API
- [ ] Advanced analytics

---

## Support

- **Documentation**: This README
- **Issues**: GitHub Issues
- **API Docs**: `/api/v1/docs` (coming soon)

---

## License

MIT License - CastQuest 2025

---

**CastQuest Core Services v1.0.0**  
_The backbone of the CastQuest protocol_

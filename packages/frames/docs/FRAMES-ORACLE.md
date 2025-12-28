# CastQuest Frames Oracle - Complete Documentation

## Overview

The **CastQuest Frames Oracle** is a production-ready Farcaster Frames implementation that brings media token market signals directly into social timelines. Frames are optimized for speed, clarity, and actionability.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    FARCASTER TIMELINE                        │
│  (Users see frames embedded in casts/feeds)                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ User clicks/views
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    FRAMES SERVER (Port 3002)                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Frame Routes:                                       │   │
│  │  • /api/frames/tiny-signal?token=ADDRESS            │   │
│  │  • /api/frames/token-detail?token=ADDRESS           │   │
│  │  • /api/frames/cast-overview                        │   │
│  └────────────────┬────────────────────────────────────┘   │
│                   │                                          │
│  ┌────────────────▼─────────────────────────────────────┐  │
│  │  Image Generation:                                    │  │
│  │  • generateTinySignalSVG()                           │  │
│  │  • generateTokenDetailSVG()                          │  │
│  │  • generateCASTOverviewSVG()                         │  │
│  └────────────────┬─────────────────────────────────────┘  │
└───────────────────┼──────────────────────────────────────────┘
                    │
                    │ Fetches data
                    ↓
┌─────────────────────────────────────────────────────────────┐
│              CORE SERVICES API (Port 4000)                   │
│  • GET /markets/:tokenAddress                               │
│  • GET /media/by-address/:address                           │
│  • GET /markets/signals                                     │
└─────────────────────────────────────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────────────────┐
│                    POSTGRESQL DATABASE                       │
│  • market_snapshots (price, volume, holders)                │
│  • media_metadata (token details, descriptions)             │
│  • risk_flags (SPAM, NSFW, SCAM checks)                     │
└─────────────────────────────────────────────────────────────┘
```

## Frame Types

### 1. Tiny Market Signal Frame

**Purpose**: Compact, timeline-optimized market snapshot

**Endpoint**: `/api/frames/tiny-signal?token=ADDRESS`

**Display Elements**:

- Status indicator (color-coded circle)
- Token ticker (`$PIC`, `$VID`, etc.)
- Current price (in ETH)
- 24h percentage change
- CastQuest branding

**Color Coding**:

```javascript
+10% or more     → Bright Green (#00FF00)
+0.01% to +9.99% → Light Green (#88FF88)
0%               → Neutral Gray (#888888)
-0.01% to -9.99% → Light Red (#FF8888)
-10% or worse    → Bright Red (#FF0000)
```

**Actions**:

1. **View Details** → Opens `token-detail` frame
2. **Refresh** → Reloads frame with latest data
3. **Open CastQuest** → Links to web app

**Use Cases**:

- Quick price checks in timeline
- Token discovery feeds
- Automated bot posts
- Portfolio tracking casts

---

### 2. Token Detail Frame

**Purpose**: Comprehensive token metrics and trading interface

**Endpoint**: `/api/frames/token-detail?token=ADDRESS`

**Display Elements**:

- Token header (ticker + name)
- Large price display
- 24h change percentage (color-coded)
- Metrics grid:
  - 24h Volume
  - Market Cap
  - Holder Count
- Trading call-to-action

**Actions**:

1. **Buy** → Direct link to CastQuest buy interface
2. **Sell** → Direct link to CastQuest sell interface
3. **Explorer** → Opens token on Base block explorer
4. **Back** → Returns to tiny signal frame

**Use Cases**:

- Pre-trade research
- Due diligence
- Sharing token details
- Community discussions

---

### 3. CAST Protocol Overview

**Purpose**: Main protocol token statistics and governance

**Endpoint**: `/api/frames/cast-overview`

**Display Elements**:

- Protocol branding (purple gradient)
- $CAST price and market cap
- Protocol metrics:
  - 24h fees collected
  - 24h total volume
  - Active token count
  - Holder count

**Actions**:

1. **Buy $CAST** → Trading interface
2. **View Fees** → Protocol fee dashboard
3. **Governance** → DAO voting interface
4. **Learn More** → About page

**Use Cases**:

- Protocol marketing
- Community updates
- Governance proposals
- Fee distribution announcements

## Technical Implementation

### Frame Metadata

All frames use Farcaster Frame Specification v2:

```html
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="data:image/svg+xml;base64,..." />
<meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
<meta property="fc:frame:button:1" content="Button Label" />
<meta property="fc:frame:button:1:action" content="post|link|mint" />
<meta property="fc:frame:button:1:target" content="https://..." />
```

### Image Generation

Frames generate SVG images server-side:

```typescript
// 1. Fetch data from Core Services
const signal = await fetchMarketSignal(tokenAddress);

// 2. Generate SVG with data
const svg = generateTinySignalSVG(signal);

// 3. Convert to data URL
const imageUrl = svgToDataURL(svg);

// 4. Embed in HTML meta tags
<meta property="fc:frame:image" content="${imageUrl}">
```

**SVG Advantages**:

- Sharp rendering at any size
- Programmatic generation
- Small file size
- No external dependencies

### API Integration

Frames communicate with Core Services:

```typescript
const API_URL = process.env.NEXT_PUBLIC_CORE_API_URL ||
                'http://localhost:4000/api/v1';

// Market data
GET /markets/:tokenAddress
→ { currentPrice, priceChange24h, volume24h, holders }

// Token metadata
GET /media/by-address/:address
→ { ticker, name, description, riskFlags, status }

// Protocol stats
GET /markets/signals
→ { totalVolume, activeTokens, fees }
```

## Development Guide

### Prerequisites

- Node.js 20+
- pnpm 8+
- Core Services running on port 4000

### Setup

```bash
# Navigate to frames package
cd packages/frames

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env

# Start development server
pnpm dev
```

Server starts on `http://localhost:3002`

### Testing Locally

**1. Demo Page**:
Visit `http://localhost:3002` for interactive demo with all frames

**2. Direct Frame URLs**:

```bash
# Tiny signal (replace ADDRESS)
http://localhost:3002/api/frames/tiny-signal?token=0x1111...

# Token detail
http://localhost:3002/api/frames/token-detail?token=0x1111...

# CAST overview
http://localhost:3002/api/frames/cast-overview
```

**3. Farcaster Validator**:

```bash
# Get ngrok tunnel for external testing
ngrok http 3002

# Use tunnel URL in validator
https://warpcast.com/~/developers/frames
```

### Master Orchestrator Commands

```bash
# Start frames server
./scripts/master.sh frames start

# Check status
./scripts/master.sh frames status

# Run health diagnostics
./scripts/master.sh frames health

# View logs
./scripts/master.sh frames logs

# Stop server
./scripts/master.sh frames stop

# Restart
./scripts/master.sh frames restart

# Build production
./scripts/master.sh frames build

# Run tests
./scripts/master.sh frames test
```

## Deployment

### Production Build

```bash
# Build optimized bundle
pnpm build

# Start production server
pnpm start
```

### Environment Variables

```bash
# Production API URL
NEXT_PUBLIC_CORE_API_URL=https://api.castquest.xyz/api/v1

# Optional: Analytics, monitoring, etc.
```

### Deployment Platforms

**Vercel** (Recommended):

```bash
vercel deploy
```

**Docker**:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3002
CMD ["pnpm", "start"]
```

**Traditional Server**:

```bash
# On server
git clone <repo>
cd packages/frames
pnpm install
pnpm build
pm2 start "pnpm start" --name castquest-frames
```

## Security

### Input Validation

All token addresses validated:

```typescript
// Must be valid Ethereum address
if (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
  return error("Invalid token address");
}
```

### XSS Prevention

- SVG generation uses sanitized inputs
- No user HTML injection
- Data URL encoding for images

### API Security

- Fetches only from trusted Core Services API
- No direct database access
- Rate limiting handled by backend

### CORS Configuration

```javascript
// next.config.js
headers: [
  {
    source: "/api/frames/:path*",
    headers: [
      { key: "Access-Control-Allow-Origin", value: "*" },
      { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
    ],
  },
];
```

## Performance

### Caching Strategy

```typescript
// Tiny signal: 1 minute
'Cache-Control': 'public, max-age=60'

// Token detail: 2 minutes
'Cache-Control': 'public, max-age=120'

// CAST overview: 5 minutes
'Cache-Control': 'public, max-age=300'
```

### Optimization Techniques

1. **SVG over PNG**: 10x smaller, scalable
2. **Data URLs**: No external requests
3. **API batching**: Parallel data fetching
4. **Edge caching**: CDN-ready responses

### Performance Targets

- **Frame load**: < 500ms
- **Image generation**: < 100ms
- **API fetch**: < 200ms
- **Total TTFB**: < 800ms

## Monitoring

### Health Checks

```bash
# Full diagnostics
./scripts/master.sh frames health

# Output:
✓ Dependencies installed
✓ Server running on port 3002
✓ Tiny signal frame responding
✓ Token detail frame responding
✓ CAST overview frame responding
✓ Core Services available (port 4000)
```

### Key Metrics

Monitor:

- Frame load times
- API response times
- Error rates by frame type
- Button click rates
- Frame impression counts

### Logging

All operations logged:

```bash
# View logs
./scripts/master.sh frames logs

# Or directly
tail -f logs/frames-*.log
```

## Troubleshooting

### Common Issues

**Frame not displaying**:

```bash
# Check server is running
./scripts/master.sh frames status

# Check Core Services
curl http://localhost:4000/api/v1/health

# View logs
./scripts/master.sh frames logs
```

**Image not loading**:

- Verify SVG generation (check logs)
- Check image size (max 10MB)
- Validate data URL encoding

**Buttons not working**:

- Verify meta tag syntax
- Check target URLs
- Test with Farcaster validator

**API errors**:

- Ensure Core Services running (port 4000)
- Verify token address format
- Check API logs

### Debug Mode

```bash
# Enable verbose logging
DEBUG=* pnpm dev

# Or set in .env
NODE_ENV=development
```

## Frame URL Patterns

### Deterministic URLs

All frame URLs follow predictable patterns:

```bash
# Tiny signal for any token
/api/frames/tiny-signal?token={ADDRESS}

# Token detail for any token
/api/frames/token-detail?token={ADDRESS}

# Protocol overview (no params)
/api/frames/cast-overview
```

### URL Encoding

Token addresses must be:

- Lowercase or mixed case (checksummed)
- 42 characters (0x + 40 hex)
- URL-encoded if embedding

### Deep Linking

Frames support navigation:

```
Timeline → Tiny Signal → View Details → Token Detail → Buy
                                                      → Sell
                                                      → Explorer
                                                      → Back
```

## Integration Examples

### Embed in Cast

```typescript
// Post frame URL in cast
const frameUrl = `https://frames.castquest.xyz/api/frames/tiny-signal?token=${tokenAddress}`;
await publishCast(frameUrl);
```

### Automated Bot

```typescript
// Monitor tokens and post signals
for (const token of hotTokens) {
  if (token.priceChange24h >= 10) {
    const frameUrl = buildTinySignalUrl(token.address);
    await postToFarcaster(frameUrl);
  }
}
```

### Web App Integration

```html
<!-- Embed frame preview -->
<iframe
  src="/api/frames/token-detail?token=0x..."
  width="1200"
  height="630"
  frameborder="0"
>
</iframe>
```

## Future Enhancements

### Planned Features

1. **Interactive Charts**: Price history within frame
2. **Portfolio Frames**: Multi-token overview
3. **Trade Execution**: Buy/sell within frame
4. **Governance Frames**: Vote on proposals
5. **Quest Frames**: Progress tracking
6. **Leaderboard Frames**: Top tokens/holders

### API Expansion

- Historical data endpoints
- Advanced filtering
- Real-time WebSocket updates
- Personalized recommendations

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for:

- Code style guidelines
- Testing requirements
- PR process
- Frame design standards

## Support

- **Documentation**: `/packages/frames/README.md`
- **API Docs**: `/packages/core-services/docs/API.md`
- **Issues**: GitHub Issues
- **Discord**: [CastQuest Community]

## License

MIT - See [LICENSE](../../LICENSE)

---

## Quick Reference

### Commands

```bash
frames start      # Start server (port 3002)
frames stop       # Stop server
frames restart    # Restart server
frames status     # Check status
frames health     # Full diagnostics
frames build      # Production build
frames test       # Run tests
frames logs       # View logs
```

### Endpoints

```
/api/frames/tiny-signal?token=ADDRESS   # Market signal
/api/frames/token-detail?token=ADDRESS  # Full metrics
/api/frames/cast-overview               # Protocol stats
```

### Ports

- **Frames**: 3002
- **Core Services**: 4000
- **Contracts RPC**: 8545 (if local testnet)

### Status Colors

```
Green:   +10% or more
Red:     -10% or worse
Neutral: Between -10% and +10%
```

---

**CastQuest Frames Oracle** - Making tokens feel alive in timelines ✨

# @castquest/frames

Farcaster frames for CastQuest - Timeline-native market signals and token details.

## Overview

This package provides Farcaster Frame implementations for displaying media token information directly in social feeds. Frames are optimized for speed, readability, and actionability.

## Frames

### 1. Tiny Market Signal (`/api/frames/tiny-signal`)

Compact frame showing:

- Token ticker (e.g., $PIC)
- Current price
- 24h percentage change
- Color-coded status (green/red/neutral)

**Usage:**

```
/api/frames/tiny-signal?token=0x1111111111111111111111111111111111111111
```

**Buttons:**

- View Details → Opens detailed token frame
- Refresh → Updates data
- Open CastQuest → Links to web app

### 2. Token Detail Frame (`/api/frames/token-detail`)

Full metrics view showing:

- Price and 24h change
- Volume (24h)
- Market cap
- Holder count
- Token description

**Usage:**

```
/api/frames/token-detail?token=0x1111111111111111111111111111111111111111
```

**Buttons:**

- Buy → Opens trading interface
- Sell → Opens trading interface
- Explorer → Links to Base block explorer
- Back → Returns to tiny signal frame

### 3. CAST Protocol Overview (`/api/frames/cast-overview`)

Protocol-level statistics:

- $CAST token price & market cap
- Protocol fees collected (24h)
- Total volume (24h)
- Active tokens count
- Holder count

**Usage:**

```
/api/frames/cast-overview
```

**Buttons:**

- Buy $CAST → Opens trading
- View Fees → Protocol fee dashboard
- Governance → DAO interface
- Learn More → About page

## Development

### Prerequisites

- Node.js 20+
- pnpm 8+
- Running Core Services API (port 4000)

### Setup

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit NEXT_PUBLIC_CORE_API_URL if needed

# Start development server
pnpm dev
```

Server runs on `http://localhost:3002`

### Testing Frames

1. **Local Testing**: Visit `http://localhost:3002` for demo page with all frame URLs

2. **Farcaster Validator**: Use the official frame validator:

   - https://warpcast.com/~/developers/frames
   - Enter your frame URL
   - Test button interactions

3. **Integration Testing**:

   ```bash
   # Ensure Core Services is running
   cd ../core-services
   pnpm dev

   # In another terminal
   cd ../frames
   pnpm dev
   ```

## API Integration

Frames fetch data from Core Services API:

```typescript
// Default: http://localhost:4000/api/v1
const API_URL = process.env.NEXT_PUBLIC_CORE_API_URL;

// Endpoints used:
GET /markets/:tokenAddress          # Market signal data
GET /media/by-address/:address      # Token metrics
GET /markets/signals                # Protocol stats
```

## Frame Architecture

### Frame Flow

```
User sees cast with frame
    ↓
Frame loads from /api/frames/*
    ↓
Server fetches data from Core Services
    ↓
Server generates SVG image
    ↓
Returns HTML with frame meta tags
    ↓
User sees image + buttons
    ↓
User clicks button
    ↓
POST to frame endpoint
    ↓
Server handles action (redirect/refresh)
```

### Meta Tags

Frames use Farcaster Frame specification:

```html
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="..." />
<meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
<meta property="fc:frame:button:1" content="Label" />
<meta property="fc:frame:button:1:action" content="post|link" />
<meta property="fc:frame:button:1:target" content="..." />
```

### Image Generation

Images are generated server-side as SVG, then converted to data URLs:

```typescript
// Generate SVG
const svg = generateTinySignalSVG(signal);

// Convert to data URL
const imageUrl = svgToDataURL(svg);

// Include in meta tag
<meta property="fc:frame:image" content="${imageUrl}">
```

## Color Coding

Market signal status colors:

- **Green** (#00FF00): +10% or more (24h)
- **Red** (#FF0000): -10% or worse (24h)
- **Neutral** (#888888): Between -10% and +10%
- **Light Green** (#88FF88): Positive but < +10%
- **Light Red** (#FF8888): Negative but > -10%

## Security

- All user input (token addresses) validated
- No SQL injection (uses Core Services API)
- XSS prevention (SVG generation, no user HTML)
- Rate limiting handled by Core Services
- CORS configured for frame endpoints

## Performance

- **Caching**: Frames cached 1-5 minutes
- **CDN-ready**: Static SVG generation
- **Lazy loading**: Data fetched on-demand
- **Minimal deps**: Fast cold starts

## Deployment

```bash
# Build production bundle
pnpm build

# Start production server
pnpm start

# Or deploy to Vercel/similar
vercel deploy
```

### Environment Variables

```bash
NEXT_PUBLIC_CORE_API_URL=https://api.castquest.xyz/api/v1
```

## Master Orchestrator Integration

Frames can be managed via master.sh:

```bash
# Start frames server
./scripts/master.sh frames start

# Check frame status
./scripts/master.sh frames health

# Run tests
./scripts/master.sh frames test
```

## Troubleshooting

**Frame not loading:**

- Check Core Services is running (port 4000)
- Verify token address is valid
- Check browser console for errors

**Image not displaying:**

- SVG generation may have failed
- Check image size (max 10MB for Farcaster)
- Verify data URL encoding

**Buttons not working:**

- Check meta tag syntax
- Verify target URLs are correct
- Test with Farcaster validator

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development guidelines.

## License

MIT

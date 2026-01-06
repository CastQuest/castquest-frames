# CastQuest Admin Dashboard Pages

This directory contains 21 production-ready dashboard pages for the CastQuest admin application, featuring Smart Wallet integration with Privy authentication.

## Pages Structure

### Main Dashboard
- **`/dashboard`** - Overview page with protocol metrics, activity feed, and risk alerts

### Quest Management
- **`/dashboard/quests`** - Quest management list with search and filtering
- **`/dashboard/quests/[id]`** - Individual quest detail page with requirements and leaderboard

### Frame Management
- **`/dashboard/frames`** - Frame management list (existing)
- **`/dashboard/frames/[id]`** - Individual frame detail page
- **`/dashboard/builder`** - Frame builder interface

### Activity & Treasury
- **`/dashboard/activity`** - Activity feed for platform events
- **`/dashboard/treasury`** - Treasury management and fund tracking

### Settings
- **`/dashboard/settings`** - Settings hub
- **`/dashboard/settings/profile`** ⭐ - User profile with Smart Wallet integration
- **`/dashboard/settings/security`** - Security settings
- **`/dashboard/settings/notifications`** - Notification preferences

### Admin Section
- **`/dashboard/admin`** - Admin overview dashboard
- **`/dashboard/admin/users`** - User management list
- **`/dashboard/admin/users/[id]`** - Individual user detail with wallet info
- **`/dashboard/admin/quests`** - Admin quest management
- **`/dashboard/admin/frames`** - Admin frame management

### Developer Tools
- **`/dashboard/developer`** - Developer hub
- **`/dashboard/developer/logs`** - System logs viewer
- **`/dashboard/developer/api-keys`** - API key management
- **`/dashboard/developer/sandbox`** - Developer sandbox environment

## Features

### Smart Wallet Integration (Profile Page)
The `/dashboard/settings/profile` page includes comprehensive Privy integration:
- **Authentication**: Login/logout with Privy
- **Wallet Display**: Show embedded and external wallets
- **Wallet Actions**: Copy address, view on block explorer
- **Balance Display**: ETH, USDC, and CAST token balances
- **Social Accounts**: Link Farcaster, Google, Twitter, GitHub
- **Email Verification**: Verify email addresses

### Design System
All pages follow the PR #48 design aesthetic:
- **Dark Gradient Backgrounds**: `from-slate-950 via-purple-950 to-slate-950`
- **Animated Blobs**: Pulsing background effects
- **Glassmorphism**: `backdrop-blur-xl` with `bg-slate-900/80`
- **Gradient Accents**: Purple/Pink/Cyan theme
- **Framer Motion**: Smooth animations and transitions
- **Lucide React Icons**: Consistent iconography
- **Hover Effects**: Interactive card and button states

## Dependencies

The following packages were added for Privy integration:
- `@privy-io/react-auth@^1.55.0` - Privy authentication
- `@privy-io/wagmi-connector@^0.1.11` - Wagmi integration
- `wagmi@^2.5.7` - Ethereum wallet connector
- `viem@^2.7.15` - Ethereum utilities
- `@tanstack/react-query@^5.17.0` - Data fetching (already included)

## Setup

### 1. Environment Configuration
Copy `.env.example` and add your Privy App ID:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_PRIVY_APP_ID=your_actual_privy_app_id
NEXT_PUBLIC_BASE_CHAIN_ID=8453
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Run Development Server
```bash
pnpm dev
```

The admin app will be available at `http://localhost:3001`

## Usage

### Using Privy Authentication
The `AppPrivyProvider` is automatically included in the root layout. All pages have access to Privy hooks:

```tsx
'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';

export default function MyPage() {
  const { user, login, logout, authenticated } = usePrivy();
  const { wallets } = useWallets();
  
  // Your component logic
}
```

### Design Pattern
Follow the existing design pattern for new pages:

```tsx
'use client';

import { motion } from 'framer-motion';
import { Icon } from 'lucide-react';

export default function MyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Page Title
          </h1>
          <p className="text-slate-400">Page description</p>
        </motion.div>
        
        {/* Your content */}
      </div>
    </div>
  );
}
```

## Implementation Status

✅ **Phase 1: Infrastructure**
- Dependencies added
- PrivyProvider created
- Root layout updated
- Environment configuration

✅ **Phase 2: Pages (21 total)**
- All dashboard pages created
- Dynamic routes implemented
- Consistent design system applied

✅ **Phase 3: Smart Wallet**
- Privy authentication integrated
- Wallet display components
- Connected accounts management
- Balance display functionality

⏳ **Phase 4: Testing**
- Build verification needed
- End-to-end testing with live Privy credentials
- Responsive design testing

## Next Steps

1. **Add Privy App ID**: Sign up at [privy.io](https://privy.io) and add your App ID to `.env.local`
2. **Test Authentication**: Test the login flow on `/dashboard/settings/profile`
3. **Build Pages**: Add more functionality to template pages (builder, activity, etc.)
4. **Connect APIs**: Wire up pages to backend services
5. **Add Tests**: Write unit and integration tests

## Contributing

When adding new dashboard pages:
1. Follow the existing design patterns
2. Use Framer Motion for animations
3. Maintain consistent spacing and typography
4. Add TypeScript interfaces for data structures
5. Use Lucide React for icons
6. Keep the gradient background pattern

## Support

For issues or questions:
- Check the implementation summary in `/IMPLEMENTATION_SUMMARY.md`
- Review Privy documentation: https://docs.privy.io
- See the main README: `/README.md`

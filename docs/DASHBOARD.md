# CastQuest Nexus Dashboard

A unified, role-based dashboard layout for CastQuest with dark mode and neon glow effects.

## Features

### 🎨 Design System
- **Dark Mode**: Black background with neutral tones
- **Neon Glow Effects**: Cyan/blue glow borders and shadows using `neo-ux-core` theme
- **Responsive Layout**: Mobile-first design with hamburger menu
- **OKX-Style Borders**: Glowing borders on cards and panels

### 👥 Role-Based Navigation

#### User Role
- Dashboard
- Quests
- Frames Browser
- Media Upload
- Wallet
- Treasury Stats
- AI Agent Status

#### Admin Role
- Dashboard
- User Management
- Quest/Frame Approval
- Treasury Controls
- KYC/Compliance
- System Logs
- RBAC Permissions
- Audit Logs

#### Developer Role
- Dashboard
- API Docs
- SDK Exports
- Frames Builder
- Contract Viewer
- Remix Templates
- Deployment Tools

### 📱 Layout Components

#### Top Navigation Bar
- Logo and menu toggle (hamburger icon)
- Search bar (desktop only)
- Notifications bell with badge
- Wallet connect button
- Role switcher dropdown

#### Sidebar
- Fixed position on desktop
- Slide-out drawer on mobile
- Role-specific navigation items
- Icons from lucide-react

#### Content Area
- Dynamic outlet for page content
- Glowing card components with `shadow-[0_0_20px_rgba(0,255,255,0.3)]`
- Responsive padding and margins

#### Bottom Navigation
- Fixed position across all screen sizes
- Quick links: Home, Profile, Settings, Logout
- Icon + text layout

## Installation

The dashboard is already integrated into the admin app at `apps/admin/app/(dashboard)/`.

### Dependencies
- `next`: 14.0.0
- `react`: 18.2.0
- `lucide-react`: ^0.562.0
- `@castquest/neo-ux-core`: workspace package

## Usage

### Accessing the Dashboard

Navigate to the dashboard route:
```
http://localhost:3001/(dashboard)
```

### Switching Roles

Use the role switcher dropdown in the top navigation bar, or pass a query parameter:
```
http://localhost:3001/(dashboard)?role=Admin
http://localhost:3001/(dashboard)?role=Developer
http://localhost:3001/(dashboard)?role=User
```

### Development

```bash
# Start the admin app
pnpm --filter @castquest/admin dev

# Or use the master orchestrator
./scripts/master.sh services start
```

## File Structure

```
apps/admin/app/(dashboard)/
├── layout.tsx          # Main dashboard layout component
└── page.tsx            # Sample dashboard page
```

## Theme Integration

The dashboard uses the `neo-ux-core` theme:

```typescript
import { neo } from "@castquest/neo-ux-core";

// Colors
neo.colors.bg.primary       // bg-black
neo.colors.bg.secondary     // bg-neutral-900
neo.colors.bg.tertiary      // bg-neutral-800
neo.colors.text.primary     // text-neutral-100
neo.colors.text.accent      // text-emerald-400
neo.colors.border.glow      // border-emerald-500/30

// Glow effects
neo.glow.idle               // shadow-[0_0_10px_rgba(0,255,255,0.3)]
neo.glow.active             // shadow-[0_0_15px_rgba(0,255,255,0.6)]
neo.glow.success            // shadow-[0_0_20px_rgba(16,185,129,0.6)]
neo.glow.error              // shadow-[0_0_20px_rgba(239,68,68,0.6)]
```

## Customization

### Adding New Navigation Items

Edit the `navigationByRole` object in `layout.tsx`:

```typescript
const navigationByRole: Record<Role, NavItem[]> = {
  User: [
    { name: "New Feature", href: "/new-feature", icon: Star },
    // ... existing items
  ],
  // ... other roles
};
```

### Modifying Theme Colors

Update `packages/neo-ux-core/src/theme.ts`:

```typescript
export const neo = {
  glow: {
    custom: "shadow-[0_0_20px_rgba(255,0,255,0.5)]",
  },
  // ... existing theme
};
```

## Mobile Responsiveness

The dashboard is fully responsive:

- **Mobile (< 768px)**: Sidebar hidden, hamburger menu, simplified search
- **Tablet (768px - 1024px)**: Collapsible sidebar
- **Desktop (> 1024px)**: Fixed sidebar, full search bar

## Components

### GlowPanel
Wraps content with glowing borders and dark background.

### Navigation Items
Dynamic rendering based on role with lucide-react icons.

### Search Bar
Full-width on desktop, hidden on mobile (can be accessed via menu).

### Notifications
Bell icon with badge indicator for unread notifications.

## Best Practices

1. **Keep navigation items focused** - Max 8 items per role
2. **Use semantic icons** - Choose icons that clearly represent the action
3. **Maintain consistent spacing** - Use neo.spacing utilities
4. **Test all roles** - Verify navigation for User, Admin, Developer roles
5. **Mobile-first** - Design for small screens first, then scale up

## Future Enhancements

- [ ] Role-based route guards
- [ ] Context API for global role state
- [ ] Notification system integration
- [ ] Wallet connection integration
- [ ] Search functionality
- [ ] Breadcrumb navigation
- [ ] Tab persistence across sessions
- [ ] Keyboard shortcuts

## Troubleshooting

### Sidebar not showing
Check that `sidebarOpen` state is being toggled correctly.

### Icons not loading
Ensure `lucide-react` is installed:
```bash
pnpm add lucide-react
```

### Theme not applying
Verify `@castquest/neo-ux-core` is built:
```bash
pnpm --filter @castquest/neo-ux-core build
```

### Hydration mismatch
The layout uses `mounted` state to prevent SSR/client mismatches.

## Support

For issues or questions:
- GitHub Issues: https://github.com/CastQuest/castquest-frames/issues
- Documentation: See main README.md

---

**Built with** ❤️ **by the CastQuest Team**

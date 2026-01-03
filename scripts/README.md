# CastQuest Scripts

This directory contains executable shell scripts for setting up and managing the CastQuest full-stack monorepo.

## 2026 Production Stack Scripts

These scripts help you scaffold a modern full-stack application using Next.js, Expo, Supabase, Tailwind CSS, Shadcn/UI, and Turborepo.

### Setup Scripts

#### 1. `setup.sh`
Initialize the workspace, pnpm, and directory structure.

```bash
./scripts/setup.sh
```

- Checks Node.js and pnpm versions
- Verifies required directories exist
- Validates workspace configuration (pnpm-workspace.yaml, turbo.json)

#### 2. `install.sh`
Install dependencies for apps/web (Next.js), apps/mobile (Expo), and packages (ui, sdk).

```bash
./scripts/install.sh
```

- Installs all dependencies via pnpm
- Adds Turborepo to the workspace
- Installs Tailwind CSS and Shadcn/UI dependencies
- Verifies all installations

#### 3. `config.sh`
Set up environment variables, Supabase CLI, and Drizzle config.

```bash
./scripts/config.sh
```

- Creates .env.example and .env.local files
- Checks/installs Supabase CLI
- Configures Drizzle ORM
- Installs database dependencies

### Build Scripts

#### 4. `ui.sh`
Scaffold the shared UI library with Tailwind and Shadcn/UI.

```bash
./scripts/ui.sh
```

- Scaffolds packages/ui structure
- Installs Tailwind CSS dependencies
- Installs Shadcn/UI components (@radix-ui, lucide-react)
- Builds the UI package

#### 5. `sdk.sh`
Build the shared Supabase SDK and service layer.

```bash
./scripts/sdk.sh
```

- Installs Supabase client libraries
- Sets up Drizzle ORM
- Generates TypeScript types from Supabase
- Builds the SDK package

#### 6. `api.sh`
Generate API routes and Supabase Edge Functions.

```bash
./scripts/api.sh
```

- Creates Next.js API routes structure
- Generates auth callback routes
- Scaffolds user management endpoints
- Sets up Supabase Edge Functions directory

### Feature Scripts

#### 7. `user.sh`
Scaffold user features (Auth flows, Dashboard, Realtime sync).

```bash
./scripts/user.sh
```

- Creates authentication pages (login, signup, reset-password)
- Generates user dashboard
- Adds realtime subscription hooks
- Sets up user profile components

#### 8. `admin.sh`
Scaffold the Admin Panel (User directory, Protected routes).

```bash
./scripts/admin.sh
```

- Creates admin user management pages
- Generates admin layout with navigation
- Sets up protected route middleware
- Adds role-based access control

## Usage

### Quick Start

Run all scripts in sequence for complete setup:

```bash
# 1. Initialize workspace
./scripts/setup.sh

# 2. Install all dependencies
./scripts/install.sh

# 3. Configure environment
./scripts/config.sh

# 4. Scaffold UI library
./scripts/ui.sh

# 5. Build SDK
./scripts/sdk.sh

# 6. Generate API routes
./scripts/api.sh

# 7. Create user features
./scripts/user.sh

# 8. Setup admin panel
./scripts/admin.sh
```

### Dry Run Mode

All scripts support a dry-run mode to preview what they would do without making changes:

```bash
DRY_RUN=true ./scripts/setup.sh
DRY_RUN=true ./scripts/install.sh
# etc...
```

## Technology Stack

- **Frontend Framework**: Next.js 14+ with App Router
- **Mobile Framework**: Expo ~50.0 with expo-router
- **UI Library**: Tailwind CSS + Shadcn/UI
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **ORM**: Drizzle ORM
- **Build Tool**: Turborepo
- **Package Manager**: pnpm 9+
- **Node Version**: 20+

## Directory Structure

After running all scripts, your monorepo will have:

```
castquest-frames/
├── apps/
│   ├── web/           (Next.js app)
│   ├── mobile/        (Expo app)
│   └── admin/         (Admin panel)
├── packages/
│   ├── ui/            (Shared UI components)
│   └── sdk/           (Supabase SDK & services)
├── scripts/           (These setup scripts)
├── turbo.json         (Turborepo config)
└── pnpm-workspace.yaml (pnpm workspace config)
```

## Other Scripts

This directory also contains other utility scripts for the CastQuest ecosystem:

- `master.sh` - Master orchestration script
- `healer.sh` - Self-healing utilities
- `contracts.sh` - Smart contract operations
- `ai.sh` - AI/Smart Brain operations
- And many more...

See individual script files for specific documentation.

## Contributing

When adding new scripts:

1. Follow the existing naming convention
2. Make scripts executable: `chmod +x scripts/your-script.sh`
3. Include a shebang: `#!/usr/bin/env bash`
4. Use `set -euo pipefail` for safety
5. Support DRY_RUN mode
6. Add clear echo messages
7. Document in this README

## License

See LICENSE in the root directory.

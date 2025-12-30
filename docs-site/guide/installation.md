# Installation

This guide will walk you through setting up CastQuest Protocol on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher
- **pnpm** 8.0.0 or higher
- **Git** 2.30.0 or higher

### Check Your Versions

```bash
node --version  # Should be v18.0.0 or higher
pnpm --version  # Should be 8.0.0 or higher
git --version   # Should be 2.30.0 or higher
```

### Installing pnpm

If you don't have pnpm installed:

```bash
npm install -g pnpm
```

## Clone the Repository

```bash
git clone https://github.com/CastQuest/castquest-frames.git
cd castquest-frames
```

## Install Dependencies

Install all workspace dependencies:

```bash
pnpm install
```

This command will:
- Install dependencies for all apps and packages
- Link workspace packages together
- Build internal dependencies

The installation may take a few minutes depending on your internet connection.

## Verify Installation

Check that all workspaces are properly linked:

```bash
pnpm list --depth 0
```

You should see all packages listed without errors.

## Workspace Structure

After installation, your workspace contains:

```
castquest-frames/
├── apps/
│   ├── admin/       # Admin dashboard (Next.js)
│   └── web/         # Public web app (Next.js)
├── packages/
│   ├── ai-brain/    # Smart Brain AI module
│   ├── contracts/   # Solidity smart contracts
│   ├── neo-ux/      # UI components
│   ├── neo-ux-core/ # Core UI primitives
│   ├── sdk/         # CastQuest SDK
│   └── strategy-worker/ # Background automation
├── data/            # JSON data files
├── docs/            # Documentation
└── scripts/         # Automation scripts
```

## Start the Admin Dashboard

```bash
pnpm --filter ./apps/admin dev -- -p 3010
```

Visit [http://localhost:3010](http://localhost:3010) to access the admin dashboard.

## Common Installation Issues

### Port Already in Use

If port 3010 is already in use, you can specify a different port:

```bash
pnpm --filter ./apps/admin dev -- -p 3011
```

### Node Version Mismatch

If you encounter issues with Node.js versions, use [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install 18
nvm use 18
```

### pnpm Lock File Issues

If you have dependency resolution issues:

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Permission Errors

On Unix systems, you may need to adjust permissions:

```bash
chmod +x scripts/*.sh
```

## Development Scripts

Available scripts in the root directory:

```bash
# Start admin dashboard
pnpm --filter ./apps/admin dev -- -p 3010

# Start web app
pnpm --filter ./apps/web dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

## Environment Setup

Create environment files for each app:

```bash
# Admin app
cp apps/admin/.env.example apps/admin/.env.local

# Web app
cp apps/web/.env.example apps/web/.env.local
```

Edit the `.env.local` files with your configuration. See [Environment Setup](/guide/environment-setup) for details.

## Next Steps

Now that you have CastQuest installed:

- [Quick Start](/guide/quick-start) - Create your first quest
- [Environment Setup](/guide/environment-setup) - Configure your environment
- [Core Concepts](/guide/concepts/frames) - Learn the fundamentals

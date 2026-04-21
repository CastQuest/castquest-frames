# Contributing to CastQuest

Thank you for contributing to CastQuest — a modular Web3 social protocol built on Base.

## Getting Started

### Prerequisites

- **Node.js** ≥20.0.0
- **pnpm** ≥9.0.0 (`npm install -g pnpm@9`)
- **Git**
- **Foundry** (for contract work): https://getfoundry.sh

### Setup

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/castquest-frames
cd castquest-frames

# 2. Install dependencies
pnpm install

# 3. Set up environment
bash scripts/setup-env.sh
# Edit .env.local, apps/web/.env.local, apps/admin/.env.local with real values

# 4. Start development
pnpm dev:web    # Web app at http://localhost:3000
pnpm dev:admin  # Admin app at http://localhost:3001
```

## Contribution Areas

| Area | Directory | Skills |
|------|-----------|--------|
| Web App | `apps/web/` | Next.js, React, TypeScript |
| Admin App | `apps/admin/` | Next.js, React, TypeScript |
| SDK | `packages/sdk/` | TypeScript |
| Smart Contracts | `packages/contracts/` | Solidity, Foundry |
| UI Components | `packages/neo-ux-core/` | React, TypeScript, Tailwind |
| Core Services | `packages/core-services/` | TypeScript, Drizzle ORM |
| AI Brain | `packages/ai-brain/` | TypeScript |
| Documentation | `docs/` | Markdown |

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feat/my-feature
```

### 2. Make Changes

Follow the existing code style. Key conventions:
- **TypeScript** for all new code
- **2 spaces** indentation
- **PascalCase** for components, **camelCase** for functions
- Use `@castquest/neo-ux-core` components for UI

### 3. Verify Your Changes

```bash
# Lint
pnpm lint

# Type check
pnpm typecheck

# Tests
pnpm test

# Build
pnpm -r build
```

All checks must pass before opening a PR.

### 4. Open a Pull Request

- Use a clear title: `feat: Add X`, `fix: Resolve Y`, `docs: Update Z`
- Describe what changed and why
- Reference any related issues
- CI must be green

## Package-Specific Notes

### packages/neo-ux-core

After modifying UI components:
```bash
pnpm --filter @castquest/neo-ux-core build
```

The `tsup.config.ts` builds with `"use client"` banner — all components are client-side.

### packages/sdk

After modifying SDK:
```bash
pnpm --filter @castquest/sdk build
```

### packages/contracts

```bash
cd packages/contracts
forge build    # Build
forge test     # Test
forge fmt      # Format
```

Run the audit script before any contract PR:
```bash
bash scripts/audit-contracts.sh
```

## Code Quality

- Tests are in `tests/` or `*.test.ts` co-located with source
- All service method mocks must match actual method signatures
- No unused imports or variables in strict contexts

## Security

- Never commit `.env` files or private keys
- Report security issues privately via GitHub Security Advisories
- All contract changes require audit review

## Questions?

- Open an issue for bugs or feature requests
- Check `docs/` for technical documentation
- See `CHANGELOG.md` for recent changes

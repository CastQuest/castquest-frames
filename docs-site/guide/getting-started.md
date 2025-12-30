# Getting Started

Get up and running with CastQuest Protocol in under 5 minutes.

## Prerequisites

- Node.js 18+
- pnpm 8+
- Git

## Quick Install

```bash
# Clone the repo
git clone https://github.com/CastQuest/castquest-frames.git
cd castquest-frames

# Install dependencies
pnpm install

# Start the admin dashboard
pnpm --filter ./apps/admin dev -- -p 3010
```

Visit [http://localhost:3010](http://localhost:3010) to see the admin dashboard.

## What's Next?

### For Developers
- [Installation Guide](/guide/installation) - Detailed setup instructions
- [Quick Start Tutorial](/guide/quick-start) - Create your first quest
- [API Reference](/api/overview) - Explore the API

### For Operators
- [Environment Setup](/guide/environment-setup) - Configure your instance
- [Architecture Overview](/architecture/overview) - Understand the system
- [Deployment Guide](/guide/tutorials/deployment) - Go to production

### For Designers
- [Frame Concepts](/guide/concepts/frames) - Learn about frames
- [Template Tutorial](/guide/tutorials/frame-templates) - Create templates
- [Smart Brain](/guide/concepts/smart-brain) - AI-powered design assistance

## Core Concepts

Before diving in, understand these key concepts:

### Frames
Interactive social media posts that can be minted as collectibles.

### Quests
Multi-step challenges with progress tracking and rewards.

### Templates
Reusable frame designs with parameter substitution.

### Mints
Collectible NFTs attached to frames or quests.

### Smart Brain
AI-powered automation and suggestions.

## Architecture Quick Look

```
Media → Templates → Frames → Render → Mints → Quests → Strategy → Onchain
```

CastQuest is a pipeline-based protocol where each component is transparent and inspectable.

## Need Help?

- [GitHub Discussions](https://github.com/CastQuest/castquest-frames/discussions)
- [Contributing Guide](/docs/CONTRIBUTING)
- [Troubleshooting](/guide/installation#common-installation-issues)

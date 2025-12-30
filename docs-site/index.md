---
layout: home

hero:
  name: "CastQuest Protocol"
  text: "Sovereign Frames & Onchain Quests"
  tagline: Build composable, transparent, and operator-controlled experiences on Farcaster
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/CastQuest/castquest-frames
    - theme: alt
      text: Read Whitepaper
      link: /whitepaper/vision

features:
  - icon: 🔓
    title: Sovereignty First
    details: Run everything locally. Inspect all flows. No hidden magic or vendor lock-in. Full control over your protocol instance.
  
  - icon: 📊
    title: Transparent by Design
    details: JSON data surfaces, clear logs, explicit flows. Every action is traceable and auditable. See exactly what happens.
  
  - icon: 🧩
    title: Modular Architecture
    details: Self-contained modules (M4-M8) that are script-installable and composable. Extend or replace any component.
  
  - icon: 🎨
    title: Expressive Media
    details: Rich visual frames, dynamic quests, and customizable templates. Create engaging onchain experiences.
  
  - icon: 🤖
    title: Smart Brain AI
    details: AI-powered suggestions, validation, and autonomous operations. Intelligent automation without black boxes.
  
  - icon: ⚡
    title: Strategy Worker
    details: Autonomous background processing with transparent event logs. Reliable automation at scale.
---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/CastQuest/castquest-frames.git
cd castquest-frames

# Install dependencies
pnpm install

# Start the admin dashboard
pnpm --filter ./apps/admin dev -- -p 3010

# Visit http://localhost:3010
```

## Architecture Overview

CastQuest is built on a modular architecture with five core modules:

- **M4: Objects** - BASE API mock, mobile admin, and core data structures
- **M5B: Quests** - Multi-step quest flows with progress tracking and rewards
- **M6: Templates** - Reusable frame templates with parameter substitution
- **M7: Engine** - Mint creation, frame rendering, and worker automation
- **M8: Brain** - AI-powered suggestions, validation, and smart automation

[Learn more about the architecture →](/architecture/overview)

## Key Features

### 🎯 Quest System
Create multi-step quests with rewards, progress tracking, and completion logic.

### 🖼️ Frame Templates
Build reusable frame templates that can be applied with different parameters.

### 💎 Minting Engine
Create collectible mints with simulation, claiming, and attachment to frames or quests.

### 🔧 Strategy Worker
Autonomous background worker that scans, triggers, and executes protocol actions.

### 🧠 Smart Brain
AI-powered system that provides suggestions, validates data, and optimizes operations.

## Community & Support

- [GitHub Discussions](https://github.com/CastQuest/castquest-frames/discussions)
- [Contributing Guide](/docs/CONTRIBUTING)
- [Contributor Recognition](/docs/contributor-cards)

## Protocol Status

**Version:** 0.1.0 (MEGA Protocol Spine Release)  
**Status:** Stable  
**License:** MIT

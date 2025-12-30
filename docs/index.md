<!-- docs-site/index.md -->
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
    details: Run everything locally. Inspect all flows. No hidden magic or vendor lock-in.
  
  - icon: 📊
    title: Transparent by Design
    details: JSON data surfaces, clear logs, explicit flows. See everything that happens.
  
  - icon: 🧩
    title: Modular Architecture
    details: Self-contained modules (M4-M8) that are script-installable and composable.
  
  - icon: 🎨
    title: Expressive Media
    details: Rich visual frames, dynamic quests, and customizable templates.
  
  - icon: 🤖
    title: Smart Brain
    details: AI-powered suggestions, validation, and autonomous operations.
  
  - icon: ⚡
    title: Strategy Worker
    details: Autonomous background processing with transparent event logs.
---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/CastQuest/castquest-frames.git
cd castquest-frames

# Install dependencies
pnpm install

# Start the admin dashboard
pnpm --filter @castquest/admin dev

# Visit http://localhost:3001
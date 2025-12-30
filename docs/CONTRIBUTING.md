# Contributing to CastQuest

Thank you for your interest in contributing to the CastQuest Protocol.

## Principles

- **Sovereignty first** — Operators must be able to run and inspect everything locally.
- **Transparency** — JSON data surfaces, clear logs, explicit flows.
- **Modularity** — Each module (M4, M5B, M6, M7, M8) should be self-contained and script-installable.
- **Expressiveness** — Media, frames, and quests should remain visually and conceptually rich.

## How to Contribute

1. **Explore the architecture**

   Start with:

   - [Architecture](./architecture.md)
   - [Modules](./modules.md)
   - [Smart Brain](./smart-brain.md)

2. **Pick a surface**

   Common areas to work on:

   - New frame templates
   - Quest definitions and flows
   - Strategy Worker behaviors
   - Smart Brain suggestions and validation

3. **Make your changes**

   - Keep logic small and composable.
   - Log meaningful events to JSON files (e.g. `worker-events.json`, `brain-events.json`).
   - Avoid hidden magic; favor explicit flows and files.

4. **Add or update docs**

   - Update or create diagrams in `architecture.md` or `flows.md` as needed.
   - Document new endpoints, files, or behaviors in `smart-brain.md` or `modules.md`.
   - If you add an operator surface, mention it in `docs/index.md`.

5. **Open a pull request**

   - Describe what you changed and why.
   - Include screenshots or snippets where helpful.
   - Call out any new JSON files, endpoints, or CLI scripts.

## Code Style

- Prefer explicit over clever.
- Keep API handlers small and testable.
- Use consistent naming for data files and endpoints.

## Recognition

CastQuest treats documentation, strategy, and design as first-class contributions.  
If you add something meaningful, add yourself to `contributor-cards.md` with a short, clear description of your impact.

---

# Package Configuration

This is the configuration for the CastQuest documentation site, powered by VitePress.

## Scripts

- `dev`: Start the development server.
- `build`: Generate the static site.
- `preview`: Preview the static site.
- `generate-api-docs`: Generate API documentation from OpenAPI specs.

## Dependencies

- `vitepress`: For building and serving the documentation.
- `vue`: For interactive components in the documentation.

## Dev Dependencies

- `@types/node`: TypeScript definitions for Node.js, used in development scripts.

---

# VitePress Configuration

This is the configuration for the VitePress documentation site for the CastQuest Protocol.

## Site Metadata

- **Title**: CastQuest Protocol
- **Description**: Sovereign, composable protocol for Farcaster frames and onchain quests

## Theme Configuration

- **Logo**: `/logo.svg`

### Navigation

- **Guide**: `/guide/getting-started`
- **Architecture**: `/architecture/overview`
- **API Reference**: `/api/overview`
- **SDK**: `/sdk/introduction`
- **Whitepaper**: `/whitepaper/vision`

### Sidebar Configuration

#### Guide Sidebar

- **Getting Started**
  - [Introduction](/guide/introduction)
  - [Installation](/guide/installation)
  - [Quick Start](/guide/quick-start)
  - [Environment Setup](/guide/environment-setup)
- **Core Concepts**
  - [Frames](/guide/concepts/frames)
  - [Quests](/guide/concepts/quests)
  - [Mints](/guide/concepts/mints)
  - [Templates](/guide/concepts/templates)
- **Tutorials**
  - [Create Your First Quest](/guide/tutorials/first-quest)
  - [Build a Custom Frame](/guide/tutorials/custom-frame)
  - [Deploy to Production](/guide/tutorials/deployment)

#### Architecture Sidebar

- **Architecture**
  - [Overview](/architecture/overview)
  - [Modules](/architecture/modules)
  - [Data Flow](/architecture/flows)
  - [Smart Brain](/architecture/smart-brain)
- **Modules Deep Dive**
  - [M4: Objects](/architecture/modules/m4-objects)
  - [M5B: Quests](/architecture/modules/m5b-quests)
  - [M6: Templates](/architecture/modules/m6-templates)
  - [M7: Engine](/architecture/modules/m7-engine)
  - [M8: Brain](/architecture/modules/m8-brain)

#### API Sidebar

- **API Reference**
  - [Overview](/api/overview)
  - [Authentication](/api/authentication)
  - [Error Handling](/api/errors)
- **Endpoints**
  - [Quests](/api/endpoints/quests)
  - [Frames](/api/endpoints/frames)
  - [Frame Templates](/api/endpoints/frame-templates)
  - [Mints](/api/endpoints/mints)
  - [Media](/api/endpoints/media)
  - [Strategy Worker](/api/endpoints/strategy)
  - [Smart Brain](/api/endpoints/brain)

#### SDK Sidebar

- **SDK Documentation**
  - [Introduction](/sdk/introduction)
  - [Installation](/sdk/installation)
  - [Quick Start](/sdk/quick-start)
- **API Reference**: `/sdk/api/index`
- **Examples**
  - [Basic Usage](/sdk/examples/basic)
  - [Frame Validation](/sdk/examples/validation)
  - [Transaction Building](/sdk/examples/transactions)

#### Whitepaper Sidebar

- **Whitepaper**
  - [Vision & Problem](/whitepaper/vision)
  - [Protocol Design](/whitepaper/protocol)
  - [Architecture](/whitepaper/architecture)
  - [Roadmap](/whitepaper/roadmap)

### Social Links

- **GitHub**: [CastQuest GitHub](https://github.com/CastQuest/castquest-frames)

### Search

- **Provider**: `local`

### Footer

- **Message**: Released under the MIT License.
- **Copyright**: Copyright © 2025 CastQuest Protocol

## Markdown Configuration

- **Theme**
  - **Light**: `github-light`
  - **Dark**: `github-dark`
- **Line Numbers**: `true`

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
```

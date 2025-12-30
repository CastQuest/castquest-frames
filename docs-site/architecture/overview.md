# Architecture Overview

CastQuest Protocol is built on a modular, operator-controlled architecture that prioritizes sovereignty, transparency, and composability.

## High-Level Architecture

```mermaid
flowchart TB
    subgraph "User-Facing Apps"
        Web[Web App]
        Admin[Admin Dashboard]
        Mobile[Mobile App - Future]
    end
    
    subgraph "Core Packages"
        SDK[@castquest/sdk]
        Brain[AI Brain]
        NeoUX[@castquest/neo-ux-core]
        Contracts[Smart Contracts]
    end
    
    subgraph "Data Layer"
        JSON[JSON Data Store]
        Indexer[Onchain Indexer]
    end
    
    subgraph "Execution Layer"
        Worker[Strategy Worker]
        BASE[BASE Chain Mock]
    end
    
    Web --> SDK
    Admin --> SDK
    SDK --> Brain
    SDK --> Contracts
    Worker --> JSON
    Brain --> JSON
    Indexer --> BASE
```

## Core Principles

### 1. **Sovereignty First**
- All data stored in transparent JSON files
- No vendor lock-in or hidden APIs
- Local-first development and operation

### 2. **Module-Based Architecture**
Each module (M4-M8) is:
- Self-contained
- Script-installable
- Independently deployable
- Composable with other modules

### 3. **Transparent Data Flow**
```
Media → Templates → Frames → Render → Mints → Quests → Strategy → Onchain
```

### 4. **AI-Native Design**
Smart Brain provides:
- Intelligent suggestions
- Validation and safety checks
- Autonomous operations
- Event tracking and logging

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Custom Neo UX system with glow effects
- **State**: JSON file-based data store
- **Blockchain**: Base (EVM-compatible)
- **AI**: Multi-agent Smart Brain orchestration
- **Monorepo**: pnpm workspaces

## Next Steps

- [Module Breakdown](./modules.md) - Detailed module documentation
- [Data Flow](./flows.md) - End-to-end flow diagrams
- [Smart Brain](./smart-brain.md) - AI engine architecture

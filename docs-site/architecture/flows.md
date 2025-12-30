# Protocol Data Flows

This document illustrates the end-to-end data flows through the CastQuest Protocol.

## Core Pipeline

```mermaid
flowchart LR
    Media[Media Upload] --> Template[Apply Template]
    Template --> Frame[Generate Frame]
    Frame --> Render[Render Frame]
    Render --> Mint[Create Mint]
    Mint --> Quest[Attach to Quest]
    Quest --> Strategy[Strategy Worker]
    Strategy --> Onchain[BASE Chain]
    Strategy -.Trigger.-> Template
```

## Flow 1: Media → Frame Template → Frame

### Step-by-Step

1. **Upload Media**
   - Upload or reference media asset
   - Store in `data/media.json`

2. **Create Frame Template**
   - Define reusable template at `/frame-templates/create`
   - Set parameters and layout
   - Store in `data/frame-templates.json`

3. **Apply Template**
   - Call `/api/frame-templates/apply`
   - Provide template ID and parameters
   - Generate frame entry

4. **View Frame**
   - Navigate to `/frames/[id]`
   - Preview rendered output

### Diagram

```mermaid
sequenceDiagram
    participant User
    participant Admin
    participant API
    participant JSON
    
    User->>Admin: Upload Media
    Admin->>JSON: Save to media.json
    User->>Admin: Create Template
    Admin->>JSON: Save to frame-templates.json
    User->>API: Apply Template
    API->>JSON: Read template
    API->>JSON: Write frame to frames.json
    API->>User: Return frame ID
```

## Flow 2: Quest Creation → Progress → Completion

### Step-by-Step

1. **Create Quest**
   - Define quest at `/quests/create`
   - Set name and description

2. **Add Steps**
   - Call `/api/quests/add-step`
   - Define step requirements

3. **Add Rewards**
   - Call `/api/quests/add-reward`
   - Attach mint or frame

4. **Track Progress**
   - Call `/api/quests/progress`
   - Update user completion

5. **Complete Quest**
   - Call `/api/quests/complete`
   - Distribute rewards

### Diagram

```mermaid
stateDiagram-v2
    [*] --> Created: Create Quest
    Created --> InProgress: User Starts
    InProgress --> InProgress: Complete Step
    InProgress --> Completed: Complete Final Step
    Completed --> RewardsDistributed: Claim Rewards
    RewardsDistributed --> [*]
```

## Flow 3: Mint Creation → Render → Claim

### Step-by-Step

1. **Create Mint**
   - Define mint at `/mints/create`
   - Set supply and metadata

2. **Attach to Frame**
   - Call `/api/mints/attach-to-frame`
   - Link mint to frame display

3. **Render Frame**
   - Call `/api/frames/render`
   - Generate visual output

4. **Simulate Claim**
   - Call `/api/mints/simulate`
   - Validate before onchain

5. **Execute Claim**
   - Call `/api/mints/claim`
   - Update supply and ownership

### Diagram

```mermaid
flowchart TB
    Create[Create Mint] --> Attach[Attach to Frame]
    Attach --> Render[Render Frame]
    Render --> User[User Views]
    User --> Simulate[Simulate Claim]
    Simulate --> Valid{Valid?}
    Valid -->|Yes| Claim[Execute Claim]
    Valid -->|No| Error[Show Error]
    Claim --> Update[Update Supply]
    Update --> Onchain[BASE Chain TX]
```

## Flow 4: Strategy Worker Automation

### Step-by-Step

1. **Scan for Pending Actions**
   - Worker calls `/api/strategy/worker/scan`
   - Identifies pending tasks

2. **Execute Actions**
   - Worker calls `/api/strategy/worker/run`
   - Processes tasks sequentially

3. **Log Events**
   - Write to `data/worker-events.json`
   - Track success/failure

4. **Trigger Follow-ups**
   - Based on results, trigger new actions
   - Can create frames, quests, mints

### Diagram

```mermaid
sequenceDiagram
    participant Worker
    participant API
    participant JSON
    participant Brain
    
    loop Every Interval
        Worker->>API: /strategy/worker/scan
        API->>JSON: Read pending actions
        API->>Worker: Return pending list
        
        Worker->>API: /strategy/worker/run
        API->>Brain: Get suggestions
        Brain->>API: Recommended actions
        API->>JSON: Execute & log
        API->>Worker: Return results
    end
```

## Flow 5: Smart Brain Suggestions

### Step-by-Step

1. **User Requests Suggestion**
   - Call `/api/brain/suggest`
   - Provide context (quest/frame/template)

2. **Brain Analyzes Context**
   - Read relevant JSON data
   - Apply heuristics and patterns

3. **Generate Suggestions**
   - Return actionable recommendations
   - Include confidence scores

4. **User Applies Suggestion**
   - Execute recommended action
   - Log outcome to brain-events.json

### Diagram

```mermaid
flowchart LR
    Request[User Request] --> Context[Gather Context]
    Context --> Analyze[Brain Analysis]
    Analyze --> Suggest[Generate Suggestions]
    Suggest --> User[Return to User]
    User --> Apply[User Applies]
    Apply --> Log[Log Outcome]
    Log --> Learn[Brain Learns]
```

## Cross-Module Flows

### Complete Quest with Mint Reward

```mermaid
flowchart TB
    QCreate[Create Quest in M5B] --> QSteps[Add Steps]
    MCreate[Create Mint in M7] --> Attach[Attach Mint to Quest]
    QSteps --> Attach
    Attach --> Progress[User Progresses]
    Progress --> Complete[Complete Quest]
    Complete --> Claim[Claim Mint Reward]
    Claim --> BASE[Onchain TX via M4]
```

### Template → Frame → Quest Integration

```mermaid
flowchart LR
    T[Create Template M6] --> F[Generate Frame M7]
    F --> Q[Attach to Quest M5B]
    Q --> W[Worker Monitors M7]
    W --> B[Brain Optimizes M8]
    B --> T
```

## Next Steps

- [Module Architecture](./modules.md)
- [API Endpoints](/api/overview.md)
- [SDK Integration](/sdk/introduction.md)

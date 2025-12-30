flowchart LR
  A[Media] --> B[Templates]
  B --> C[Frames]
  C --> R[Renderer]
  R --> D[Mints]
  D --> E[Quests]
  E --> F[Strategy Worker]
  F -->|Triggers| B
  F -->|Triggers| C
  F -->|Triggers| D
  F -->|Triggers| E
  F --> G[BASE Mock Onchain]
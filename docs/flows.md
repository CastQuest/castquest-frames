# Protocol Flows

## 1. Media → Frame Template → Frame

1. Upload or reference media (web/admin).
2. Create a frame template in `/frame-templates/create`.
3. Apply a template via `/api/frame-templates/apply` to generate a frame entry.
4. Inspect frame at `/frames/[id]`.

```mermaid
flowchart LR
  M[Media] --> T[Frame Template]
  T --> F[Frame]
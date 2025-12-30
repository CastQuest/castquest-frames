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
   - [Smart Brain](./sdk/smart-brain.md)

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
   - Document new endpoints, files, or behaviors in `sdk/smart-brain.md` or `modules.md`.
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

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

## Dashboard Development Guidelines

When contributing to the User or Admin dashboards:

### Design System
- Use the **neo-glow theme** with purple (#a855f7), cyan (#06b6d4), and pink (#ec4899) colors
- Apply glassmorphism effects with `backdrop-blur-xl` and transparent backgrounds
- Add glow effects on hover and interactive elements
- Use Framer Motion for smooth animations

### Component Structure
- Keep components focused and reusable
- Use TypeScript for all dashboard components
- Co-locate styles with components
- Export types alongside implementations

### User Dashboard (`apps/web`)
- Focus on creator experience and ease of use
- Ensure all features work without admin privileges
- Test with different user roles and permissions
- Optimize for mobile devices

### Admin Dashboard (`apps/admin`)
- Implement proper permission checks for all features
- Use RBAC system for access control
- Add audit logging for sensitive operations
- Include proper error handling and validation
- Test with different admin roles (Super Admin, Admin, Moderator, Viewer)

### Testing Dashboards
```bash
# User dashboard
cd apps/web && pnpm dev
# Visit: http://localhost:3000/dashboard

# Admin dashboard
cd apps/admin && pnpm dev -- -p 3010
# Visit: http://localhost:3010/dashboard

# Run both with self-healing script
./scripts/self-healing-ui.sh
```

### Adding New Dashboard Features
1. Create component in appropriate `components/` directory
2. Add route in `app/dashboard/` if needed
3. Update types and interfaces
4. Add tests for new functionality
5. Update `docs/DASHBOARDS.md` with feature documentation
6. Test across different screen sizes
7. Verify animations work smoothly

### Performance Guidelines
- Keep bundle size under 250KB (gzipped)
- Lazy load heavy components with dynamic imports
- Optimize images with Next.js Image component
- Use API caching with revalidation
- Aim for Lighthouse score > 90

## Recognition

CastQuest treats documentation, strategy, and design as first-class contributions.  
If you add something meaningful, add yourself to `contributor-cards.md` with a short, clear description of your impact.

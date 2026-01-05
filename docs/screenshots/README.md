# Dashboard Screenshots

This directory contains screenshots for the CastQuest Dashboards documentation.

## Expected Files

### User Dashboard Screenshots
- `user-overview.png` - User Dashboard Overview showing main interface
- `user-ai-builder.png` - AI Frame Builder interface with natural language prompt
- `user-analytics.png` - Analytics Dashboard with metrics and charts
- `user-community.png` - Community Hub with social feed
- `user-marketplace.png` - Marketplace with frame templates
- `user-quests.png` - Quest System with daily/weekly challenges
- `user-leaderboard.png` - Leaderboard with rankings
- `user-nft-mints.png` - NFT Mints management interface

### Admin Dashboard Screenshots
- `admin-overview.png` - Admin Dashboard Overview with key metrics
- `admin-tokens.png` - Token Management interface ($CAST, $PIC, $VID, $AUDIO)
- `admin-risk.png` - Risk Management with AI detection system
- `admin-monitoring.png` - System Health monitoring dashboard
- `admin-permissions.png` - RBAC Permission System interface
- `admin-fees.png` - Fee Controls and adjustments
- `admin-analytics.png` - Protocol-wide analytics and revenue

## Guidelines

### Screenshot Standards
- **Resolution**: Minimum 1920x1080 for desktop views
- **Format**: PNG with transparency where applicable
- **Quality**: High quality, optimized for web
- **Content**: Use realistic sample data, avoid lorem ipsum
- **Theme**: Neo-glow theme with purple/cyan/pink gradients

### Naming Convention
- Use lowercase with hyphens
- Prefix with dashboard type (user- or admin-)
- Be descriptive but concise
- Use .png extension

### Privacy
- Do not include real user data
- Use placeholder/demo accounts
- Blur or redact sensitive information

## Usage in Documentation

Screenshots are referenced in `docs/DASHBOARDS.md` and `README.md`:

```markdown
![User Dashboard Overview](./screenshots/user-overview.png)
![Admin Dashboard Overview](./screenshots/admin-overview.png)
```

## Contributing Screenshots

When adding new screenshots:
1. Follow the naming convention
2. Ensure consistent styling with neo-glow theme
3. Update this README with the new file description
4. Reference the screenshot in relevant documentation
5. Compress images before committing (use tools like TinyPNG)

## File Status

Currently, this directory contains placeholder documentation. Screenshots will be added as the dashboards are deployed and stabilized.

To generate screenshots:
1. Run the dashboard locally: `pnpm dev` or `pnpm dev:admin`
2. Navigate to the relevant section
3. Use browser dev tools or screenshot tools
4. Save with appropriate naming
5. Optimize and commit

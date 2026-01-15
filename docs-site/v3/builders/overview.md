# CastQuest V3 Builders Overview

## Introduction

CastQuest V3 provides **4 AI-powered builders** that enable creators to generate content and functionality without deep technical knowledge. V3 introduces the revolutionary **UI Builder** for AI-generated interfaces.

## The 4 Builders

### 1. Code Builder

**Purpose**: AI-generated code modules and smart contracts

**Capabilities**:
- Generate Solidity contracts from descriptions
- Create JavaScript/TypeScript modules
- Build API integrations
- Generate tests and documentation

**Interface**:
- Natural language prompts
- Template library
- Code review and suggestions
- One-click deployment

**Example Workflow**:
```
Prompt: "Create an ERC-721 contract with 10% royalties"
→ Code Builder generates contract
→ Adds OpenZeppelin imports
→ Implements royalty standard (EIP-2981)
→ Includes tests and deployment script
→ Deploys to testnet for verification
```

**Templates**:
- ERC-20/721/1155 tokens
- Auction contracts
- Staking mechanisms
- Governance systems
- Yield strategies

**Output Formats**:
- Solidity smart contracts
- TypeScript/JavaScript modules
- Python scripts
- Documentation (Markdown)

### 2. Frame Builder

**Purpose**: Farcaster frame creation and customization

**Capabilities**:
- Build frames from templates
- Clone and modify existing frames
- Integrate with protocol APIs
- A/B test frame variants

**Interface**:
- Drag-and-drop editor
- Template marketplace
- Preview and testing
- Analytics integration

**Example Workflow**:
```
Creator: "Create minting frame for new drop"
→ Frame Builder suggests templates
→ Creator selects "Gallery Mint"
→ Customizes images and text
→ Sets pricing and parameters
→ Deploys to Farcaster
→ Monitors engagement
```

**Frame Types**:
- **Mint Frames**: Direct minting on Farcaster
- **Gallery Frames**: Showcase collections
- **Poll Frames**: Community polling
- **Game Frames**: Interactive games
- **Commerce Frames**: Buy/sell directly

**Cloning**:
- Clone any public frame
- Maintain attribution to original creator
- Customize for your brand
- Deploy with one click

### 3. Game Builder

**Purpose**: AI-generated games and interactive experiences

**Capabilities**:
- Generate games from text descriptions
- Create game economies and rewards
- Build leaderboards and achievements
- Integrate with GAME tokens

**Interface**:
- Prompt-based generation
- Visual game editor
- Economy designer
- Playtesting tools

**Example Workflow**:
```
Prompt: "Create trivia game about NFT history with rewards"
→ Game Builder generates questions
→ Creates point system and rewards
→ Designs UI and UX
→ Integrates GAME token rewards
→ Deploys playable version
→ Tracks player metrics
```

**Game Types**:
- **Trivia**: Question-answer games with rewards
- **Puzzle**: Logic and pattern games
- **Clicker**: Idle and incremental games
- **Adventure**: Choose-your-own-adventure
- **Prediction**: Guess outcomes for rewards

**Economy Features**:
- In-game currency (GAME tokens)
- NFT rewards for achievements
- Leaderboard prizes
- Play-to-earn mechanics
- Staking and governance

### 4. UI Builder (V3 NEW)

**Purpose**: AI-generated user interfaces and dashboards

**Capabilities**:
- Generate custom dashboard layouts
- Create responsive components
- Build admin panels
- Design data visualizations

**Interface**:
- Natural language prompts
- Component library
- Live preview
- Export to code

**Example Workflow**:
```
Prompt: "Create portfolio dashboard with MC tracking"
→ UI Builder generates layout
→ Adds metric cards for tokens
→ Creates charts for MC history
→ Includes transaction feed
→ Exports as React components
→ Integrates with app
```

**Dashboard Types**:
- **User Dashboard**: Portfolio, yields, transactions
- **Admin Dashboard**: Protocol metrics, agent oversight
- **Dev Dashboard**: API usage, integrations, logs
- **Creator Dashboard**: Sales, engagement, community

**Component Library**:
- Metric cards with live data
- Interactive charts (line, bar, pie)
- Data tables with sorting/filtering
- Transaction feeds
- Wallet connections
- Token balances

**Design System**:
- **Neon Glass aesthetic**
- Aura glow effects
- FX glass blur
- Neo borders
- Gradient text animations

**Customization**:
- Color schemes (dark/light)
- Typography choices
- Layout variations (grid, flex)
- Animation preferences
- Responsive breakpoints

## Builder Coordination

Builders work together for complex projects:

**Example: Launch New Creator Project**
```
1. Code Builder: Create custom smart contract
2. Frame Builder: Build minting frame
3. Game Builder: Create community game
4. UI Builder: Generate project dashboard
→ Integrated project ready in <1 hour
```

**Example: Complete Marketplace**
```
1. Code Builder: Marketplace contracts
2. UI Builder: Trading interface
3. Frame Builder: Farcaster shopping frame
4. Game Builder: Purchase rewards game
→ Full marketplace experience
```

## AI Assistance

All builders use AI agents for enhancement:

- **CreationAgent**: Asset generation support
- **UiAgent**: Interface optimization
- **PricingAgent**: Economic parameter suggestions
- **CurationAgent**: Quality scoring

## Technical Architecture

### Builder Stack

**Backend**:
- AI model: GPT-4, Claude, Codex
- Code generation: Template + fine-tuning
- Validation: Automated testing
- Deployment: Containerized execution

**Frontend**:
- React-based editors
- Real-time preview
- Version control integration
- Export to multiple formats

### Safety and Validation

**Code Review**:
- Automated security scanning
- Gas optimization analysis
- Best practice checks
- Vulnerability detection

**Testing**:
- Unit tests auto-generated
- Integration tests on testnet
- Performance benchmarks
- Security audits (for critical code)

**Deployment**:
- Testnet deployment first
- Mainnet deployment after validation
- Monitoring and analytics
- Rollback capabilities

## Access and Pricing

### Free Tier

**Includes**:
- Unlimited Code Builder (public templates)
- 10 Frame Builder deployments/month
- 5 Game Builder games/month
- 3 UI Builder exports/month

### Creator Tier ($50/month)

**Includes**:
- Unlimited all builders
- Advanced templates
- Priority AI generation
- Premium support

### Enterprise Tier (Custom)

**Includes**:
- Dedicated AI instances
- Custom model training
- White-label builders
- SLA guarantees

## Builder Marketplace

### Template Marketplace

**Buy/Sell Templates**:
- Creators publish templates
- Earn CODE tokens from purchases
- Curated quality templates
- Ratings and reviews

**Popular Templates**:
- "Auction Frame" — 500 uses
- "Mint Dashboard" — 300 uses
- "Yield Strategy Contract" — 200 uses

### Builder Services

**Hire Builder Experts**:
- Get custom templates made
- Commission full projects
- Receive training and consulting
- Pay with CAST or ETH

## Integration with Protocol

### Smart Contracts

Builders deploy directly to:
- Base L2 (default)
- Creator L3s
- Other supported L2s
- Testnets for development

### Token Integration

Generated code automatically integrates:
- MEDIA, FRAM, GAME, CODE tokens
- Protocol fee structures
- Buyback mechanisms
- Royalty distributions

### API Access

Builders use protocol APIs:
- Minting endpoints
- Marketplace listing
- Frame deployment
- Analytics tracking

## Best Practices

### Code Builder

✅ **Do**:
- Start with templates when possible
- Test on testnet extensively
- Review generated code carefully
- Get security audits for financial code

❌ **Don't**:
- Deploy unreviewed code to mainnet
- Assume AI-generated code is bug-free
- Skip testing
- Ignore gas optimization

### Frame Builder

✅ **Do**:
- A/B test different designs
- Monitor engagement metrics
- Clone successful frames
- Optimize for mobile

❌ **Don't**:
- Copy frames without attribution
- Overload with too much content
- Ignore Farcaster best practices
- Skip preview testing

### Game Builder

✅ **Do**:
- Balance economies carefully
- Playtest with real users
- Iterate based on feedback
- Keep games simple initially

❌ **Don't**:
- Create unfair game mechanics
- Ignore player feedback
- Over-complicate on first version
- Neglect mobile experience

### UI Builder

✅ **Do**:
- Use design system components
- Test on multiple devices
- Keep dashboards clean and focused
- Update based on user behavior

❌ **Don't**:
- Clutter with too many metrics
- Ignore accessibility
- Override design system styles
- Skip responsive testing

## Future Enhancements

### Planned Features

- **AR/VR Builder**: Create immersive experiences
- **Video Builder**: AI video generation and editing
- **Audio Builder**: Music and sound creation
- **3D Builder**: 3D asset generation

### Community Requests

Vote on new builder features:
- Multi-language support
- Collaborative editing
- Version control integration
- Advanced AI models

## Learning Resources

### Tutorials

- [Code Builder Quickstart](https://guide.castquest.xyz/builders/code)
- [Frame Builder Guide](https://guide.castquest.xyz/builders/frames)
- [Game Economy Design](https://guide.castquest.xyz/builders/games)
- [UI Builder Tutorial](https://guide.castquest.xyz/builders/ui)

### Examples

Browse example projects:
- [Builder Examples Repo](https://github.com/CastQuest/builder-examples)
- [Template Library](https://app.castquest.xyz/templates)
- [Community Showcases](https://showcase.castquest.xyz)

### Support

- **Documentation**: [docs.castquest.xyz/builders](https://docs.castquest.xyz/builders)
- **Discord**: #builders channel
- **Office Hours**: Weekly Q&A sessions
- **Email**: builders@castquest.xyz

---

**Version**: 3.0.0  
**Total Builders**: 4  
**Templates**: 100+ and growing

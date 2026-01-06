# CastQuest Smart Brain - Oracle Brain DB

**Version**: 1.0.0  
**Role**: Protocol Architect & AI Agent Coordinator

## Identity

The CastQuest Smart Brain is an intelligent automation system that:

- **Validates** every change against architecture safety rules
- **Documents** all modifications automatically
- **Commits** with comprehensive validation reports
- **Tags** releases with semantic versioning
- **Pushes** to master with zero risk to core architecture

## Core Concepts

### Protocol Architecture

```
CAST (Main Token)
├── Value Accrual: Protocol fees from all markets
├── Governance: Platform parameters and upgrades
└── Utility: Required for advanced features

Media Tokens (Per-Upload ERC-20)
├── Pattern: $PIC, $VID, $AUDIO, etc.
├── Creation: MediaTokenFactory.sol
├── Trading: Bonding curve markets
└── Fees: Route to CAST holders

Markets
├── Type: Bonding curve AMM
├── Protocol Fee: 2.5% to CAST
├── Liquidity: Bootstrap from token creation
└── Trading: Buy/Sell with slippage protection

Frames (Timeline-Native UI)
├── Platforms: Farcaster, Web
├── Actions: Buy, Sell, View, Trade
├── Display: Price, % change, volume, holders
└── Integration: One-click from social feeds

Builder (Token Creation UI)
├── Upload: Media (image, video, audio)
├── AI Analysis: Smart Brain categorization
├── Token Setup: Ticker, name, description
├── Generation: Token + Frame + optional Game
└── Deploy: One-click to mainnet

Admin Console
├── Permissions: Role-based access control
├── Fees: Protocol fee adjustments
├── Risk: Spam detection and flagging
├── Monitoring: Protocol health dashboards
└── Controls: Pause switches and emergency actions
```

## Repository Structure

```
CastQuest Ecosystem
├── castquest-frames (THIS REPO)
│   ├── Core SDK & Orchestration
│   ├── Smart Brain automation
│   └── Master control scripts
│
├── castquest-contracts
│   ├── CAST.sol (main token)
│   ├── MediaTokenFactory.sol
│   ├── MarketPlace.sol
│   └── Deployment scripts
│
├── castquest-builder
│   ├── Media upload UI
│   ├── Token creation flow
│   ├── Frame generation
│   └── AI integration
│
├── castquest-admin
│   ├── Permission management
│   ├── Fee controls
│   ├── Risk monitoring
│   └── Protocol dashboards
│
├── castquest-ai
│   ├── Media analysis
│   ├── Token naming
│   ├── Description generation
│   └── Risk detection
│
└── castquest-games
    ├── Game templates
    ├── Frame-based games
    └── Token-gated experiences
```

## Usage

### Quick Start

```bash
# Show Smart Brain identity
.smartbrain/brain.sh identity

# Validate current changes
.smartbrain/brain.sh validate

# Auto-deploy with validation
.smartbrain/brain.sh auto

# Run Smart Brain Oracle for insights
.smartbrain/oracle.sh all
```

### Full Auto-Deploy Workflow

```bash
# Make your changes in VS Code...

# Deploy with custom message
.smartbrain/brain.sh deploy feat "Add media upload feature" media-upload

# This will:
# 1. Stage all changes
# 2. Run architecture safety validation
# 3. Run protocol integrity checks
# 4. Run security scan
# 5. Generate documentation
# 6. Create intelligent commit
# 7. Create semantic version tag
# 8. Push to master with tags
# 9. Run health check via master.sh
```

### Watch Mode (Continuous Deployment)

```bash
# Start watch mode
.smartbrain/brain.sh watch

# Now every change you make is automatically:
# - Validated
# - Committed
# - Tagged
# - Pushed
# Press Ctrl+C to stop
```

### Manual Workflow

```bash
# Step 1: Validate
.smartbrain/brain.sh validate

# Step 2: Commit
.smartbrain/brain.sh commit "Your commit message"

# Step 3: Tag
.smartbrain/brain.sh tag feature-name

# Step 4: Push
.smartbrain/brain.sh push
```

## Validation Rules

### Architecture Safety (Critical)

- ✅ Protected paths cannot be deleted
- ✅ Core contracts are immutable without review
- ✅ SDK interfaces maintain backwards compatibility
- ✅ Permission system cannot be bypassed

Protected Paths:

- `packages/sdk/src/core/**`
- `packages/contracts/contracts/CAST.sol`
- `packages/contracts/contracts/MediaTokenFactory.sol`
- `apps/admin/app/api/permissions/**`
- `.smartbrain/**`

### Protocol Integrity (Critical)

- ✅ Fee calculations remain consistent
- ✅ CAST value accrual is preserved
- ✅ Market mechanics are not compromised
- ✅ Token creation flow is validated

### Security Scan (High)

- ✅ No hardcoded secrets or private keys
- ✅ No SQL injection vulnerabilities
- ✅ No unprotected admin routes
- ✅ Authentication required for sensitive endpoints

### Documentation (Medium)

- ✅ New functions have inline comments
- ✅ New components have usage examples
- ✅ API changes are documented
- ✅ Architecture changes update diagrams

## Integration with Master.sh

The Smart Brain works seamlessly with `scripts/master.sh` and the Oracle:

```bash
# Use Smart Brain for git operations
.smartbrain/brain.sh auto

# Use Oracle for dependency insights
.smartbrain/oracle.sh all

# Use master.sh for system operations
scripts/master.sh deploy production
scripts/master.sh workers start
scripts/master.sh monitor

# Combined health workflow
.smartbrain/oracle.sh all && scripts/master.sh health
```

## Smart Brain Oracle

The Smart Brain Oracle provides AI-powered repository insights:

### Features

- **Dependency Health Analysis**: Version consistency and compatibility checks
- **Security Vulnerability Detection**: Automated scanning for known issues
- **Version Upgrade Recommendations**: Intelligent upgrade suggestions with compatibility analysis
- **Deprecated Package Monitoring**: Track and alert on obsolete packages
- **Performance Improvement Suggestions**: Optimization recommendations
- **Monorepo Structure Analysis**: Architecture insights and improvements
- **Predictive Maintenance Warnings**: Proactive alerts before issues arise
- **Dependency Graph Visualization**: Visual representation of relationships
- **Smart Conflict Resolution**: Intelligent dependency conflict fixing

### Oracle Usage

```bash
# Run all analyses
.smartbrain/oracle.sh all

# Specific analyses
.smartbrain/oracle.sh analyze        # Dependency health
.smartbrain/oracle.sh security       # Security scan
.smartbrain/oracle.sh upgrades       # Upgrade recommendations
.smartbrain/oracle.sh deprecated     # Deprecated packages
.smartbrain/oracle.sh performance    # Performance tips
.smartbrain/oracle.sh structure      # Monorepo analysis
.smartbrain/oracle.sh warnings       # Predictive warnings
.smartbrain/oracle.sh graph          # Dependency graph
.smartbrain/oracle.sh conflicts      # Conflict resolution
.smartbrain/oracle.sh integration    # System integration status
.smartbrain/oracle.sh report         # Comprehensive report

# View generated report
cat ORACLE-REPORT.md
```

### Oracle Integration with CI/CD

The Oracle is integrated into the GitHub Actions workflow:

```yaml
# .github/workflows/dependency-health.yml
- name: Run Smart Brain Oracle
  run: .smartbrain/oracle.sh report

- name: Upload Oracle Report
  uses: actions/upload-artifact@v3
  with:
    name: oracle-report
    path: ORACLE-REPORT.md
```

See [docs/DEPENDENCY-HEALTH.md](../docs/DEPENDENCY-HEALTH.md) for comprehensive documentation.

## Configuration

Configuration is stored in `.smartbrain/config.json`:

```json
{
  "automation": {
    "autoValidate": true,
    "autoDocument": true,
    "autoCommit": true,
    "autoTag": true,
    "autoPush": true
  },
  "coreArchitecture": {
    "protectedPaths": ["..."],
    "validationRules": {"..."}
  }
}
```

## State Tracking

The Smart Brain maintains state in:

- `.smartbrain/state.json` - Current state (JSON)
- `.smartbrain/state.log` - Event log (append-only)
- `.smartbrain/last-change-summary.md` - Latest change documentation

## Output Format

Every Smart Brain commit includes:

```
feat: Your descriptive message

Smart Brain Validation Report:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Architecture safety: PASSED
✅ Protocol integrity: PASSED
✅ Security scan: PASSED

Changes:
• Files modified: X
• Lines added: Y
• Lines removed: Z

Automated by CastQuest Smart Brain v1.0.0
Zero-risk deployment protocol
```

## Protocol Design Principles

### 1. Multi-Repo Coherence

- Each repo has a clear boundary
- Interfaces are well-defined
- Dependencies are explicit
- Changes propagate cleanly

### 2. Zero-Risk Deployment

- All changes validated before commit
- Core architecture is protected
- Rollback is automatic on failure
- State is always recoverable

### 3. Codespace Optimization

- Fast bootstrap (<2 minutes)
- Clear folder structures
- Consistent naming patterns
- Minimal friction for contributors

### 4. Extensibility

- Easy to add new tokens
- Simple game template integration
- Pluggable frame types
- AI agent coordination

## Examples

### Example 1: Add New Media Token Type

```bash
# 1. Create token contract
vim packages/contracts/contracts/AudioToken.sol

# 2. Update factory
vim packages/contracts/contracts/MediaTokenFactory.sol

# 3. Add builder UI
vim apps/web/components/AudioUpload.tsx

# 4. Deploy with Smart Brain
.smartbrain/brain.sh deploy feat "Add audio token support" audio-tokens

# Smart Brain will:
# - Validate contract doesn't break CAST economics
# - Ensure factory integration is safe
# - Check UI follows patterns
# - Document the changes
# - Commit, tag, and push
```

### Example 2: Add New Frame Type

```bash
# 1. Create frame component
vim castquest-constellation/castquest-frames/src/GameFrame.tsx

# 2. Add metadata
vim castquest-constellation/castquest-frames/src/frame-metadata.ts

# 3. Deploy
.smartbrain/brain.sh auto

# Result: Validated, documented, committed, tagged, pushed
```

### Example 3: Update Protocol Fee

```bash
# 1. Update market contract
vim packages/contracts/contracts/MarketPlace.sol

# 2. Smart Brain will detect this change
.smartbrain/brain.sh validate

# Warning: Protocol fee changes detected - manual review recommended

# 3. After review, deploy
.smartbrain/brain.sh deploy fix "Adjust protocol fee to 2.0%" fee-update
```

## Behavior Guidelines

### What Smart Brain Does:

✅ Validates architecture safety automatically  
✅ Protects core contracts from breaking changes  
✅ Generates documentation for every commit  
✅ Creates semantic version tags  
✅ Maintains validation reports  
✅ Integrates with master.sh orchestrator

### What Smart Brain Doesn't Do:

❌ Make code changes for you  
❌ Override critical security violations  
❌ Push without validation passing  
❌ Delete protected paths  
❌ Modify fees without warnings

## Advanced Features

### Custom Validation Rules

Add rules to `.smartbrain/config.json`:

```json
{
  "changeValidation": {
    "rules": [
      {
        "id": "custom-rule",
        "description": "Your custom validation",
        "severity": "high",
        "checks": ["..."]
      }
    ]
  }
}
```

### Pre-Commit Hooks

Install Smart Brain as a git hook:

```bash
# .git/hooks/pre-commit
#!/bin/bash
.smartbrain/brain.sh validate || exit 1
```

### CI/CD Integration

Use Smart Brain in GitHub Actions:

```yaml
- name: Smart Brain Validation
  run: .smartbrain/brain.sh validate
```

## Troubleshooting

### Validation Failures

```bash
# View detailed logs
cat logs/brain-*.log

# Run specific validation
.smartbrain/brain.sh validate-arch
.smartbrain/brain.sh validate-security

# Skip validation (NOT RECOMMENDED)
git commit --no-verify
```

### State Reset

```bash
# Reset Smart Brain state
rm -f .smartbrain/state.json .smartbrain/state.log

# Re-initialize
.smartbrain/brain.sh identity
```

## Best Practices

1. **Always validate before pushing**

   ```bash
   .smartbrain/brain.sh validate
   ```

2. **Use auto-deploy for routine changes**

   ```bash
   .smartbrain/brain.sh auto
   ```

3. **Use manual workflow for sensitive changes**

   ```bash
   # Review first
   git diff

   # Then deploy
   .smartbrain/brain.sh deploy
   ```

4. **Check logs after deployment**

   ```bash
   tail -f logs/brain-*.log
   ```

5. **Integrate with master.sh for full control**
   ```bash
   .smartbrain/brain.sh auto && scripts/master.sh deploy production
   ```

## Support

- **Documentation**: `docs/`
- **Logs**: `logs/brain-*.log`
- **State**: `.smartbrain/state.log`
- **Config**: `.smartbrain/config.json`

---

**CastQuest Smart Brain v1.0.0**  
_Protocol Architect & AI Agent Coordinator_  
_Zero-risk deployments with architectural protection_  
✅ **Production Ready**

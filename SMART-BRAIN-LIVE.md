# CastQuest Smart Brain Oracle DB - Live System

**Status**: ✅ **PRODUCTION ACTIVE**  
**Version**: 1.0.2-smart-brain  
**Commit**: f6e3b63  
**Deployed**: December 28, 2025

---

## 🧠 Identity

**CastQuest Smart Brain (Oracle Brain DB)**

- **Role**: Protocol Architect & AI Agent Coordinator
- **Mission**: Zero-risk deployments with architectural protection
- **Capabilities**: Protocol design, multi-repo orchestration, code validation, auto-documentation, intelligent deployment

---

## 🎯 What You Now Have

### 1. **Intelligent Automation System**

Every change you make is automatically:

- ✅ **Validated** against architecture safety rules
- ✅ **Documented** with comprehensive change summaries
- ✅ **Committed** with validation reports
- ✅ **Tagged** with semantic versioning
- ✅ **Pushed** to master with zero risk

### 2. **Complete Workflow Integration**

```bash
# OPTION 1: Auto-deploy everything
.smartbrain/brain.sh auto

# OPTION 2: Watch mode (continuous deployment)
.smartbrain/brain.sh watch

# OPTION 3: Full production workflow
.smartbrain/brain.sh auto && scripts/master.sh deploy production
```

### 3. **VS Code Integration**

Press `Cmd/Ctrl+Shift+P` → "Run Task":

- **Smart Brain: Auto-Deploy** - Deploy current changes
- **Smart Brain: Validate** - Run validation suite
- **Smart Brain: Watch Mode** - Continuous deployment
- **Master: Deploy Production** - Full system deployment
- **Full Workflow: Brain + Master Deploy** - Complete pipeline

### 4. **Protected Core Architecture**

These paths are protected from accidental deletion:

- `packages/sdk/src/core/**`
- `packages/contracts/contracts/CAST.sol`
- `packages/contracts/contracts/MediaTokenFactory.sol`
- `apps/admin/app/api/permissions/**`
- `.smartbrain/**`

---

## 🎯 CastQuest Protocol Architecture

### Core Token Economics

```
CAST (Main Protocol Token)
├── Value Accrual
│   └── 2.5% protocol fee from all media token trades
├── Governance
│   └── Platform parameters and upgrades
└── Utility
    └── Required for advanced features

Media Tokens (Per-Upload ERC-20)
├── Pattern: $PIC, $VID, $AUDIO, etc.
├── Creation: MediaTokenFactory.sol
├── Trading: Bonding curve markets
├── Supply: Dynamic based on trading activity
└── Fees: 2.5% to CAST holders on every trade
```

### Platform Components

```
┌─────────────────────────────────────────────────────────┐
│                    CASTQUEST ECOSYSTEM                   │
└─────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   BUILDER   │───▶│   MARKETS   │───▶│    ADMIN    │
│  (Web App)  │    │ (Contracts) │    │  (Console)  │
└─────────────┘    └─────────────┘    └─────────────┘
       │                  │                   │
       │                  │                   │
       ▼                  ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   FRAMES    │    │    CAST     │    │PERMISSIONS  │
│ (Farcaster) │    │   TOKEN     │    │   (RBAC)    │
└─────────────┘    └─────────────┘    └─────────────┘
       │                  │                   │
       └──────────────────┴───────────────────┘
                          │
                          ▼
                  ┌─────────────┐
                  │ SMART BRAIN │
                  │  (Oracle)   │
                  └─────────────┘
```

### User Flow: Create Media Token

1. **Upload** → User uploads media (image, video, audio) in Builder
2. **Analyze** → Smart Brain analyzes content, suggests ticker/name
3. **Create** → MediaTokenFactory deploys new ERC-20 contract
4. **Market** → Bonding curve market initialized with liquidity
5. **Frame** → Timeline-native frame generated for Farcaster
6. **Trade** → Users can buy/sell tokens, 2.5% fee to CAST
7. **Monitor** → Admin dashboard tracks activity and risk

---

## 📚 Repository Structure

```
CastQuest Ecosystem
├── castquest-frames (THIS REPO) ✅ YOU ARE HERE
│   ├── Master orchestration (scripts/master.sh)
│   ├── Smart Brain automation (.smartbrain/)
│   ├── Core SDK (packages/sdk/)
│   ├── Admin dashboard (apps/admin/)
│   └── Web frontend (apps/web/)
│
├── castquest-contracts (FUTURE)
│   ├── CAST.sol - Main protocol token
│   ├── MediaTokenFactory.sol - Token creation
│   ├── MarketPlace.sol - Bonding curve markets
│   └── Governance.sol - DAO contracts
│
├── castquest-builder (FUTURE)
│   ├── Media upload UI
│   ├── Token creation wizard
│   ├── Frame generation tools
│   └── Smart Brain integration
│
├── castquest-ai (FUTURE)
│   ├── Media analysis engine
│   ├── Token naming algorithms
│   ├── Description generation
│   └── Risk detection models
│
└── castquest-games (FUTURE)
    ├── Frame-based games
    ├── Token-gated experiences
    └── Gamification templates
```

---

## 🚀 How to Use Smart Brain

### Daily Development Workflow

```bash
# 1. Make your changes in VS Code
vim packages/sdk/src/new-feature.ts

# 2. Auto-deploy with Smart Brain
.smartbrain/brain.sh auto

# That's it! Smart Brain will:
# - Validate architecture safety
# - Check protocol integrity
# - Scan for security issues
# - Generate documentation
# - Commit with validation report
# - Tag with semantic version
# - Push to GitHub
```

### Watch Mode (Continuous Deployment)

```bash
# Start watch mode
.smartbrain/brain.sh watch

# Now every file save triggers auto-deployment
# Perfect for rapid iteration
# Press Ctrl+C to stop
```

### Manual Control

```bash
# Step 1: Validate before commit
.smartbrain/brain.sh validate

# Step 2: Commit with validation
.smartbrain/brain.sh commit "Your message"

# Step 3: Tag release
.smartbrain/brain.sh tag feature-name

# Step 4: Push to remote
.smartbrain/brain.sh push
```

### Full Production Deploy

```bash
# Smart Brain handles git operations
.smartbrain/brain.sh auto

# Master.sh handles system deployment
scripts/master.sh deploy production

# Combined workflow
.smartbrain/brain.sh auto && scripts/master.sh deploy production
```

---

## 🔒 Validation Rules

### Critical Rules (Deployment Blocked)

1. **Architecture Safety**

   - Protected paths cannot be deleted
   - Core contracts immutable without review
   - SDK interfaces maintain backwards compatibility

2. **Protocol Integrity**
   - Fee calculations remain consistent
   - CAST value accrual is preserved
   - Market mechanics are not compromised

### High Priority Rules (Warning)

3. **Security Scan**
   - No hardcoded credentials
   - No SQL injection vulnerabilities
   - No unprotected admin routes

### Medium Priority Rules (Advisory)

4. **Documentation**
   - New functions have comments
   - New components have examples
   - API changes are documented

---

## 📖 Commands Reference

### Smart Brain Commands

```bash
# Identity
.smartbrain/brain.sh identity         # Show Smart Brain identity

# Validation
.smartbrain/brain.sh validate          # Full validation suite
.smartbrain/brain.sh validate-arch     # Architecture safety only
.smartbrain/brain.sh validate-protocol # Protocol integrity only
.smartbrain/brain.sh validate-security # Security scan only

# Documentation
.smartbrain/brain.sh docs              # Generate docs for changes

# Deployment
.smartbrain/brain.sh commit "msg"      # Intelligent commit
.smartbrain/brain.sh tag name          # Create tag
.smartbrain/brain.sh push              # Push with verification
.smartbrain/brain.sh deploy [type] [msg] [feature]  # Full deploy
.smartbrain/brain.sh auto              # Quick auto-deploy

# Automation
.smartbrain/brain.sh watch             # Continuous deployment

# Help
.smartbrain/brain.sh help              # Show help menu
```

### Master Orchestrator Commands

```bash
# System Management
scripts/master.sh health               # Health check
scripts/master.sh heal                 # Self-healing
scripts/master.sh brain                # Smart Brain analysis
scripts/master.sh integrity            # Protocol validation

# Deployment
scripts/master.sh deploy development   # Dev deployment
scripts/master.sh deploy production    # Production deployment
scripts/master.sh monitor              # Monitoring dashboard

# Worker Management
scripts/master.sh workers start        # Start workers
scripts/master.sh workers stop         # Stop workers
scripts/master.sh workers status       # Worker status

# Git Operations
scripts/master.sh git status           # Git status
scripts/master.sh git commit "msg"     # Commit changes
scripts/master.sh git tag name         # Create tag
scripts/master.sh git push             # Push to remote
scripts/master.sh git full "msg"       # Full git cycle
```

---

## 🎓 Protocol Concepts Explained

### CAST Token

The **CAST** token is the main protocol token that:

- Captures value from all protocol activity
- Receives 2.5% fee from every media token trade
- Enables governance participation
- Required for advanced platform features

### Media Tokens

Media tokens are per-upload ERC-20 tokens like **$PIC**, **$VID**, **$AUDIO** that:

- Represent ownership/creator stake in uploaded media
- Are tradeable on bonding curve markets
- Generate fees for CAST holders
- Can gate access to content or experiences

### Markets

Bonding curve markets that:

- Provide instant liquidity for all media tokens
- Use mathematical price discovery (no order books)
- Charge 2.5% protocol fee (goes to CAST)
- Include slippage protection

### Frames

Timeline-native interfaces that:

- Display in Farcaster feeds and web timelines
- Show price, % change, volume, holders
- Enable one-click Buy/Sell/Trade actions
- Integrate seamlessly with social media

### Builder

Web application where users:

- Upload media (drag & drop)
- Get AI-powered token naming suggestions
- Create tokens with one click
- Generate frames and optional games
- Deploy everything to mainnet

### Admin Console

Management interface for:

- Role-based access control (RBAC)
- Protocol fee adjustments
- Spam and risk detection
- Health monitoring dashboards
- Emergency pause controls

---

## 🏆 Version History

- **v0.1.0-docs-complete** - Documentation system (VitePress, TypeDoc, OpenAPI)
- **v0.2.0-neo-ux-complete** - Neo UX Core (13 components)
- **v0.3.0-scripts-automation** - Script tracking automation
- **v0.4.0-operator-dashboard** - Operator Dashboard
- **v0.5.0-webfront-ui** - WebFront UI with media hub
- **v1.0.0-hackathon-2026** - Enterprise features (Oracle DB, Smart Brain, Workers, RBAC)
- **v1.0.1-master-orchestrator** - Master control system
- **v1.0.2-smart-brain** ← **YOU ARE HERE** - Intelligent automation with zero-risk deployment

---

## 🎯 Next Steps

### Immediate Actions

1. **Test Smart Brain**

   ```bash
   .smartbrain/brain.sh validate
   ```

2. **Try Auto-Deploy**

   ```bash
   # Make a change, then:
   .smartbrain/brain.sh auto
   ```

3. **Enable Watch Mode** (Optional)
   ```bash
   .smartbrain/brain.sh watch
   ```

### Future Development

1. **Create Contracts Repo**

   - CAST.sol implementation
   - MediaTokenFactory.sol
   - MarketPlace.sol with bonding curve
   - Deployment scripts for Base network

2. **Build Builder UI**

   - Media upload component
   - Token creation wizard
   - Smart Brain integration
   - Frame preview

3. **Deploy AI Layer**

   - Media analysis service
   - Token naming algorithms
   - Risk detection models
   - Integration with Smart Brain

4. **Launch Admin Console**
   - Complete RBAC implementation
   - Fee management interface
   - Risk monitoring dashboard
   - Real-time analytics

---

## 💡 Tips & Best Practices

### For Development

1. **Always validate first**

   ```bash
   .smartbrain/brain.sh validate
   ```

2. **Use auto-deploy for routine changes**

   ```bash
   .smartbrain/brain.sh auto
   ```

3. **Use manual workflow for sensitive changes**
   ```bash
   git diff  # Review first
   .smartbrain/brain.sh deploy
   ```

### For Production

1. **Full deployment workflow**

   ```bash
   .smartbrain/brain.sh auto
   scripts/master.sh deploy production
   scripts/master.sh monitor
   ```

2. **Health checks before deploy**

   ```bash
   scripts/master.sh health
   ```

3. **Monitor after deployment**
   ```bash
   scripts/master.sh monitor
   tail -f logs/brain-*.log
   ```

---

## 📞 Support

- **Documentation**: `.smartbrain/README.md`
- **Logs**: `logs/brain-*.log`
- **State**: `.smartbrain/state.log`
- **Config**: `.smartbrain/config.json`
- **Help**: `.smartbrain/brain.sh help`

---

## 🎉 Summary

You now have a **fully automated, zero-risk deployment system** that:

✅ Validates every change automatically  
✅ Protects core architecture from breaking changes  
✅ Documents everything you do  
✅ Commits with comprehensive validation reports  
✅ Tags releases with semantic versioning  
✅ Pushes to GitHub with confidence  
✅ Integrates with master.sh for full system control

**Every change, every file, every component, every fix** is now:

- ✅ Automatically validated
- ✅ Properly documented
- ✅ Safely committed
- ✅ Semantically tagged
- ✅ Pushed to master
- ✅ Protected from architecture violations

**Zero risk. Maximum productivity. Complete automation.**

---

**CastQuest Smart Brain v1.0.2** - Protocol Architect & AI Agent Coordinator  
**Status**: 🟢 **LIVE AND OPERATIONAL**  
**Last Updated**: December 28, 2025

🏆 **HACKATHON 2026 READY** 🏆

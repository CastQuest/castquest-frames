# 🧠 Smart Brain Oracle Audit System

[![CI](https://github.com/CastQuest/castquest-frames/actions/workflows/ci.yml/badge.svg)](https://github.com/CastQuest/castquest-frames/actions/workflows/ci.yml)
[![Deploy](https://github.com/CastQuest/castquest-frames/actions/workflows/deploy.yml/badge.svg)](https://github.com/CastQuest/castquest-frames/actions/workflows/deploy.yml)

## Overview

The CastQuest audit system provides comprehensive smart contract auditing with self-healing capabilities, integrated into the master orchestrator.

## Components

### 1. **audit.sh** - Smart Brain Oracle Audit
Comprehensive audit script that performs:
- Pre-audit system checks (Foundry, Node.js version)
- Self-healing dependency management
- Code quality analysis (error constants, zero-address checks, access control)
- Compilation verification
- Test suite execution
- Gas usage analysis
- Automated report generation

### 2. **healer.sh** - Enhanced Self-Healing System
Comprehensive auto-healing script with 8 major steps:
- Package export integrity verification
- Import path validation
- Workspace integrity checks
- Key package rebuilding
- TypeScript configuration validation
- Git repository integrity
- Security & dependency audits
- Environment configuration validation

### 3. **contracts.sh** - Enhanced Contracts Workflow
Updated build script with:
- Self-healing dependency auto-repair
- Automatic audit integration
- Color-coded status output
- Smart Brain analysis trigger

### 4. **master.sh Integration**
Enhanced commands in master orchestrator:
- `audit` - Run Smart Brain Oracle audit
- `heal` - Execute comprehensive self-healing
- `ci` - Run local CI/CD simulation (NEW)

Audit also runs automatically during `deploy production` workflow.

### 5. **CI/CD Workflows** (NEW)
Enhanced GitHub Actions workflows with:

#### ci.yml - Multi-Stage CI Pipeline
- **Lint & Type Check** - Code quality validation
- **Build** - Compile all packages with artifact upload
- **Test** - Run test suite with results upload
- **Security** - Dependency vulnerability scanning
- **Health Check** - Overall pipeline status validation

#### deploy.yml - Production Deployment
- **Pre-Deploy Audit** - Security and system health checks
- **Build Application** - Compile for production
- **Deploy to Production** - Docker image building and deployment

## Usage

### Run Standalone Audit
```bash
./scripts/audit.sh
```

### Run Self-Healing
```bash
./scripts/healer.sh
# Or via master orchestrator:
./scripts/master.sh heal
```

### Run via Master Orchestrator
```bash
./scripts/master.sh audit
```

### Run Local CI/CD Simulation (NEW)
```bash
./scripts/master.sh ci
```
Simulates the full CI/CD pipeline locally:
1. System health check
2. Dependency installation
3. Linting
4. Type checking
5. Building
6. Testing

### Run Contracts Workflow (includes audit)
```bash
./scripts/contracts.sh
```

### Deploy with Audit
```bash
./scripts/master.sh deploy production
```
The audit runs at step 9 of the deployment process.

## Features

### Self-Healing (Enhanced)
- Automatically detects missing Foundry dependencies
- Auto-installs OpenZeppelin contracts and forge-std if missing
- Repairs broken dependency states
- Validates package exports and import paths
- Rebuilds key packages automatically
- Runs security audits on dependencies
- Validates TypeScript and workspace configuration

### Audit Checks
1. ✅ Foundry installation and version
2. ✅ Node.js version (20+ required)
3. ✅ Contract directory structure
4. ✅ Dependencies (openzeppelin-contracts, forge-std)
5. ✅ Error constant usage
6. ✅ Zero-address validation
7. ✅ Access control patterns
8. ✅ Reentrancy guards
9. ✅ Compilation success (Solc 0.8.23)
10. ✅ Test suite execution
11. ✅ Gas usage analysis

### CI/CD Integration (NEW)
- Multi-stage pipeline with separate jobs for lint, build, test, security
- Artifact upload for build outputs and test results
- Security vulnerability scanning with pnpm audit
- Health check aggregation across all pipeline stages
- Pre-deploy audit for production deployments

### Local CI Simulation (NEW)
Run the full CI/CD pipeline locally before pushing:
```bash
./scripts/master.sh ci
```
Includes:
- System health verification
- Dependency installation
- Linting
- Type checking
- Building all packages
- Running test suite
- Detailed summary report

### Reports Generated

#### AUDIT-REPORT.md
Comprehensive markdown report with:
- Executive summary
- Code quality metrics
- Security patterns detected
- Contract inventory
- Test coverage status
- Gas analysis
- Recommendations
- Compliance checklist

#### Audit Logs
Detailed logs saved to: `logs/audit-TIMESTAMP.log`

## Integration Points

### Master Orchestrator Flow
```
deploy production
  ├─ 1. System health check
  ├─ 2. Protocol integrity
  ├─ 3. Self-healing
  ├─ 4. Phase 2 check
  ├─ 5. Smart Brain analysis
  ├─ 6. Port cleanup
  ├─ 7. Dependencies install
  ├─ 8. Build packages
  ├─ 9. Smart Brain Oracle Audit  ← NEW
  ├─ 10. Production deployment
  └─ 11. Start worker system
```

### contracts.sh Flow
```
contracts.sh
  ├─ Self-healing: Dependency check
  ├─ Compilation
  ├─ Testing
  └─ Smart Brain Oracle Audit  ← NEW
```

## Output Examples

### Success Output
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 🧠 SMART BRAIN ORACLE AUDIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[SUCCESS] Foundry detected: forge Version: 1.5.1-stable
[SUCCESS] Node.js: v20.19.6 (✓ >= 20.0.0)
[SUCCESS] Dependencies present ✓
[SUCCESS]   ✓ openzeppelin-contracts
[SUCCESS]   ✓ forge-std
[SUCCESS] Found 8 Solidity files
[SUCCESS]   ✓ Error constants: 150 usages
[SUCCESS]   ✓ Zero-address checks: 30
[SUCCESS]   ✓ Access control: 20 modifiers
[SUCCESS] ✅ Compilation successful
[SUCCESS] ✅ All tests passed
[SUCCESS] Audit report generated: AUDIT-REPORT.md
```

### Metrics Tracked
- Error constant usage count
- Zero-address validation count
- Reentrancy guard usage
- Access control points
- Test coverage
- Compiler warnings
- Gas usage per function

## Commands Reference

### Master Orchestrator
```bash
# System health and integrity
./scripts/master.sh health
./scripts/master.sh heal
./scripts/master.sh integrity

# CI/CD simulation (NEW)
./scripts/master.sh ci

# Full audit
./scripts/master.sh audit

# Deploy with audit
./scripts/master.sh deploy production

# Contract management
./scripts/master.sh contracts build
./scripts/master.sh contracts test
./scripts/master.sh contracts status
```

### Direct Scripts
```bash
# Audit only
./scripts/audit.sh

# Self-healing only
./scripts/healer.sh

# Contracts with audit
./scripts/contracts.sh
```

### CI/CD Workflows
```bash
# Triggered automatically on push/PR to main/master
# Can also be triggered manually via GitHub Actions UI

# Local simulation
./scripts/master.sh ci
```

## Files Created

### During Audit
- `AUDIT-REPORT.md` - Main audit report (root directory)
- `logs/audit-TIMESTAMP.log` - Detailed audit log

### Audit Report Sections
1. Executive Summary
2. Code Quality Metrics
3. Security Patterns
4. Contract Inventory
5. Test Coverage
6. Gas Analysis
7. Recommendations
8. Compliance Checklist

## Next Steps After Audit

1. Review `AUDIT-REPORT.md`
2. Address any warnings or recommendations
3. Check `logs/audit-*.log` for detailed output
4. Run tests to ensure compliance
5. Consider third-party security audit for mainnet

## Continuous Integration

The audit system integrates seamlessly with CI/CD:

```yaml
# Example GitHub Actions workflow
- name: Smart Brain Audit
  run: ./scripts/master.sh audit
```

## Self-Healing Examples

### Missing Dependencies
```
[WARN] Dependencies missing - auto-healing initiated
[INFO] Installing Foundry dependencies...
[SUCCESS] Dependencies installed via self-healing
```

### Outdated Node.js
```
[ERROR] Node.js v18.0.0 is too old. Required: Node.js 20+
[WARN] Install Node 20+: https://nodejs.org
```

## Troubleshooting

### Foundry Not Found
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Node.js Too Old
```bash
nvm install 20
nvm use 20
```

### Dependencies Missing
```bash
cd packages/contracts
forge install
```

---

**Smart Brain Oracle** - Comprehensive automated auditing for CastQuest smart contracts

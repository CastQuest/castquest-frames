# Dependency Health Monitoring

> Comprehensive guide to maintaining repository health through automated dependency management

**Version:** 1.0.0  
**Last Updated:** 2026-01-06

---

## Overview

The CastQuest Frames repository includes a comprehensive dependency health monitoring system that ensures consistency, security, and optimal performance across the monorepo.

### Key Features

- ✅ **Automated Dependency Scanning** - Daily health checks via GitHub Actions
- ✅ **Version Harmonization** - Consistent dependency versions across packages
- ✅ **Security Monitoring** - Automated vulnerability detection
- ✅ **Smart Brain Oracle** - AI-powered insights and recommendations
- ✅ **Pre-commit Hooks** - Prevent broken dependencies from being committed
- ✅ **Repair Scripts** - Automated fixes for common issues

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                  Dependency Health System                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │  Pre-commit      │      │  GitHub Actions  │            │
│  │  Hooks           │      │  Workflow        │            │
│  │  (.husky)        │      │  (CI/CD)         │            │
│  └────────┬─────────┘      └────────┬─────────┘            │
│           │                         │                       │
│           └─────────┬───────────────┘                       │
│                     │                                       │
│           ┌─────────▼─────────┐                            │
│           │   Repair Script    │                            │
│           │  (bash script)     │                            │
│           └─────────┬─────────┘                            │
│                     │                                       │
│           ┌─────────▼─────────┐                            │
│           │  Smart Brain       │                            │
│           │  Oracle            │                            │
│           │  (AI insights)     │                            │
│           └─────────┬─────────┘                            │
│                     │                                       │
│           ┌─────────▼─────────┐                            │
│           │  Master.sh         │                            │
│           │  Health Check      │                            │
│           └───────────────────┘                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Tools & Scripts

### 1. Repair Dependencies Script

**Location:** `scripts/repair-dependencies.sh`

Comprehensive tool for dependency management and repair.

#### Usage

```bash
# Run full health check
./scripts/repair-dependencies.sh health

# Full repair workflow
./scripts/repair-dependencies.sh repair

# Clean dependencies
./scripts/repair-dependencies.sh clean

# Install dependencies
./scripts/repair-dependencies.sh install

# Build packages in order
./scripts/repair-dependencies.sh build

# Check version consistency
./scripts/repair-dependencies.sh harmonize

# Dry run mode
DRY_RUN=true ./scripts/repair-dependencies.sh repair
```

#### Features

- **Clean Installation**: Removes node_modules and reinstalls
- **Version Harmonization**: Ensures consistent versions
- **Build Order Validation**: Builds in correct dependency order
- **Workspace Link Verification**: Checks pnpm workspace links
- **Documentation Checks**: Validates required docs exist
- **Broken Symlink Detection**: Finds and reports broken links
- **Port Conflict Detection**: Checks if ports are in use
- **Comprehensive Health Check**: Runs all validations

### 2. Smart Brain Oracle

**Location:** `.smartbrain/oracle.sh`

AI-powered repository insights and recommendations.

#### Usage

```bash
# Run all analyses
.smartbrain/oracle.sh all

# Analyze dependency health
.smartbrain/oracle.sh analyze

# Check security vulnerabilities
.smartbrain/oracle.sh security

# Recommend upgrades
.smartbrain/oracle.sh upgrades

# Generate comprehensive report
.smartbrain/oracle.sh report
```

#### Features

- **Dependency Health Analysis**: Version consistency checks
- **Security Vulnerability Detection**: Scans for known issues
- **Version Upgrade Recommendations**: Suggests compatible upgrades
- **Deprecated Package Monitoring**: Tracks obsolete packages
- **Performance Suggestions**: Optimization recommendations
- **Monorepo Structure Analysis**: Architecture insights
- **Predictive Warnings**: Proactive maintenance alerts
- **Dependency Graph Visualization**: Visual representation
- **Smart Conflict Resolution**: Intelligent dependency fixing

### 3. Master.sh Health Check

**Location:** `scripts/master.sh`

Enhanced orchestrator with comprehensive health checks.

#### Usage

```bash
# Run comprehensive health check
./scripts/master.sh health

# Full audit
./scripts/master.sh audit

# Self-healing
./scripts/master.sh heal

# Integrity check
./scripts/master.sh integrity
```

#### Health Check Features

- Package.json validation (valid JSON)
- Workspace dependency verification
- Build artifact checks (dist/ directories)
- Port conflict detection (3000, 3001, 3010, 4000)
- TypeScript version consistency
- Broken symlink detection
- Environment file verification
- Linting validation
- Type checking
- Dependency version consistency reporting

### 4. Pre-commit Hooks

**Location:** `.husky/pre-commit`

Automated validation before commits.

#### Features

- **Package.json Validation**: Ensures valid JSON
- **Workspace Reference Checks**: Validates workspace:* syntax
- **TypeScript Config Validation**: Checks tsconfig.json
- **Linting**: Auto-fixes and re-stages files
- **Dependency Consistency**: Prevents broken dependencies

#### Setup

```bash
# Install husky and hooks
pnpm install
pnpm run prepare

# Bypass hook (not recommended)
git commit --no-verify
```

### 5. GitHub Actions Workflow

**Location:** `.github/workflows/dependency-health.yml`

Automated CI/CD health checks.

#### Triggers

- **Push**: On main and develop branches
- **Pull Request**: On main and develop branches
- **Schedule**: Daily at 2 AM UTC
- **Manual**: Via workflow_dispatch

#### Features

- Package.json validation
- Dependency version consistency checks
- Workspace link verification
- Build tests for all packages
- Security audit (pnpm audit)
- Documentation link validation
- PR comment with results
- Auto-create issues for failures
- Dependency health badge generation
- Oracle report artifacts

---

## Dependency Standards

### Version Requirements

| Package | Version | Reason |
|---------|---------|--------|
| **TypeScript** | 5.3.3 | Consistency across packages |
| **@types/node** | 20.10.6 | Matches Node.js 20.x |
| **Next.js** | 14.2.18+ | Security patches |
| **React** | 18.2.0+ | Stable release |
| **Node.js** | 20.x | Specified in .nvmrc |
| **pnpm** | 9.x | Required for workspace |

### Workspace Dependencies

All internal packages should use `workspace:*` syntax:

```json
{
  "dependencies": {
    "@castquest/neo-ux-core": "workspace:*",
    "@castquest/sdk": "workspace:*",
    "@castquest/core-services": "workspace:*"
  }
}
```

### Build Order

Packages must be built in dependency order:

1. `packages/neo-ux-core` - UI components (no dependencies)
2. `packages/sdk` - Protocol SDK (no internal deps)
3. `packages/core-services` - Backend services
4. `apps/admin` - Admin dashboard (depends on neo-ux-core, sdk, core-services)
5. `apps/web` - User dashboard (depends on neo-ux-core)

---

## Common Issues & Solutions

### Issue: Version Mismatch

**Symptoms:**
- Multiple TypeScript versions detected
- Build failures in CI

**Solution:**
```bash
# Check versions
./scripts/repair-dependencies.sh harmonize

# Update manually if needed
# Edit package.json files to use consistent versions
pnpm install

# Rebuild
pnpm -r build
```

### Issue: Workspace Links Broken

**Symptoms:**
- Import errors for @castquest/* packages
- Module not found errors

**Solution:**
```bash
# Clean and reinstall
./scripts/repair-dependencies.sh clean
./scripts/repair-dependencies.sh install

# Verify links
./scripts/repair-dependencies.sh verify-links
```

### Issue: Port Conflicts

**Symptoms:**
- EADDRINUSE errors
- Dashboards won't start

**Solution:**
```bash
# Check ports
./scripts/repair-dependencies.sh check-ports

# Kill processes (automatic in repair script)
# Or manually:
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Issue: Build Artifacts Missing

**Symptoms:**
- Import errors
- Module resolution failures

**Solution:**
```bash
# Check artifacts
./scripts/repair-dependencies.sh check-artifacts

# Rebuild all packages
./scripts/repair-dependencies.sh build

# Or rebuild specific package
cd packages/neo-ux-core && pnpm build
```

### Issue: Security Vulnerabilities

**Symptoms:**
- pnpm audit reports issues
- GitHub Dependabot alerts

**Solution:**
```bash
# Check vulnerabilities
.smartbrain/oracle.sh security

# Auto-fix vulnerabilities
pnpm audit --fix

# Manual updates if needed
pnpm update <package-name>
```

---

## Best Practices

### 1. Regular Health Checks

Run health checks frequently:

```bash
# Daily
./scripts/master.sh health

# Weekly
.smartbrain/oracle.sh all
```

### 2. Before Commits

Always run pre-commit checks:

```bash
# Automatic with husky
git commit -m "Your message"

# Manual check
./scripts/repair-dependencies.sh health
```

### 3. Before Pull Requests

Validate everything works:

```bash
# Full validation
./scripts/repair-dependencies.sh repair

# Build all packages
pnpm -r build

# Run health check
./scripts/master.sh health
```

### 4. After Dependency Changes

When updating dependencies:

```bash
# Update dependencies
pnpm update <package>

# Verify consistency
./scripts/repair-dependencies.sh harmonize

# Rebuild and test
pnpm -r build
pnpm test
```

### 5. Monitoring

Check automated reports:

- Review GitHub Actions workflow results
- Check Oracle reports in artifacts
- Monitor dependency health badge
- Review auto-created issues

---

## Automation & CI/CD

### GitHub Actions Integration

The dependency health workflow runs automatically:

```yaml
# .github/workflows/dependency-health.yml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
```

### Features

- **PR Comments**: Automatic health reports on PRs
- **Issue Creation**: Auto-creates issues for failures
- **Artifacts**: Oracle reports saved for 30 days
- **Health Badge**: Status badge for README

### Integration with Smart Brain

The health system integrates with Smart Brain:

```bash
# Smart Brain validation before commit
.smartbrain/brain.sh validate

# Combined workflow
.smartbrain/oracle.sh all && ./scripts/master.sh health
```

---

## Metrics & Monitoring

### Health Indicators

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| **Dependency Consistency** | 100% | < 100% | < 90% |
| **Security Vulnerabilities** | 0 | 1-3 moderate | 1+ critical/high |
| **Build Success Rate** | 100% | < 100% | < 90% |
| **Broken Links** | 0 | 1-2 | 3+ |
| **TypeScript Errors** | 0 | 1-5 | 6+ |
| **Port Conflicts** | 0 | 1 | 2+ |

### Reporting

- **Daily**: Automated health check report
- **Weekly**: Oracle comprehensive analysis
- **On-demand**: Manual health checks
- **PR**: Health status in PR comments

---

## Troubleshooting

### Debug Mode

Enable verbose logging:

```bash
# Repair script
VERBOSE=true ./scripts/repair-dependencies.sh health

# Dry run mode
DRY_RUN=true ./scripts/repair-dependencies.sh repair
```

### Check Logs

Review detailed logs:

```bash
# GitHub Actions logs
# Visit: https://github.com/CastQuest/castquest-frames/actions

# Oracle reports
# Check: ORACLE-REPORT.md

# Pre-commit logs
# Shown in terminal during commit
```

### Manual Intervention

If automated tools fail:

```bash
# Reset everything
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
pnpm -r build

# Verify manually
./scripts/master.sh health
.smartbrain/oracle.sh all
```

---

## Configuration

### Environment Variables

```bash
# Repair script
export DRY_RUN=true          # Don't make changes
export VERBOSE=true          # Detailed logging
export PNPM=/path/to/pnpm   # Custom pnpm path

# Pre-commit hooks
export HUSKY=0               # Disable husky
```

### Customization

Modify scripts for your needs:

- **Repair Script**: Edit `scripts/repair-dependencies.sh`
- **Oracle Logic**: Edit `.smartbrain/oracle.sh`
- **Health Checks**: Edit `scripts/master.sh`
- **Pre-commit Rules**: Edit `.husky/pre-commit`
- **CI Workflow**: Edit `.github/workflows/dependency-health.yml`

---

## Support & Resources

### Documentation

- **Main README**: [README.md](../README.md)
- **Dashboards Guide**: [DASHBOARDS.md](./DASHBOARDS.md)
- **Smart Brain**: [.smartbrain/README.md](../.smartbrain/README.md)
- **Contributing**: [CONTRIBUTING.md](../CONTRIBUTING.md)

### Scripts

- `./scripts/repair-dependencies.sh --help`
- `.smartbrain/oracle.sh --help`
- `./scripts/master.sh --help`

### Community

- **Issues**: [GitHub Issues](https://github.com/CastQuest/castquest-frames/issues)
- **Discussions**: [GitHub Discussions](https://github.com/CastQuest/castquest-frames/discussions)
- **Discord**: Community server (link in README)

---

## Changelog

### v1.0.0 (2026-01-06)

- ✅ Initial release of dependency health system
- ✅ Repair dependencies script
- ✅ Smart Brain Oracle integration
- ✅ Enhanced master.sh health checks
- ✅ Pre-commit hooks with validation
- ✅ GitHub Actions workflow
- ✅ Comprehensive documentation

---

**Maintained by**: CastQuest Team  
**License**: MIT  
**Repository**: [castquest-frames](https://github.com/CastQuest/castquest-frames)

# Dependency Health Monitoring System

## Overview

The CastQuest Frames repository includes a comprehensive dependency health monitoring system that ensures consistency, security, and reliability across the monorepo workspace.

## Components

### 1. Repair Script (`scripts/repair-dependencies.sh`)

The automated repair script performs comprehensive dependency maintenance:

```bash
# Run full repair with automatic fixes
bash scripts/repair-dependencies.sh

# Dry run to see what would be changed
DRY_RUN=true bash scripts/repair-dependencies.sh

# Verbose output for debugging
VERBOSE=true bash scripts/repair-dependencies.sh
```

**Features:**
- Clean dependency installation (removes all node_modules)
- Version harmonization automation
- Build packages in dependency order
- Workspace link verification
- Broken symlink detection
- package.json validation
- Missing dependency scanning
- Colored terminal output for easy reading
- Exit codes suitable for CI/CD integration

### 2. Health Check Command (`scripts/master.sh health`)

The master orchestrator script includes comprehensive health checks:

```bash
# Run all health checks
bash scripts/master.sh health

# Get JSON output for CI/CD
bash scripts/master.sh health --json > health-report.json

# Auto-repair issues found
bash scripts/master.sh health --fix
```

**Health Checks Include:**
1. **Package.json Validation** - Ensures all package.json files are valid JSON
2. **Workspace Dependencies** - Verifies all workspace links are correct
3. **Build Artifacts** - Checks that all packages build successfully
4. **Port Conflicts** - Detects if ports 3000, 3001, 3010 are available
5. **TypeScript Configs** - Validates tsconfig.json consistency
6. **Broken Symlinks** - Finds and reports broken symbolic links
7. **Environment Files** - Checks for required .env files
8. **Service Startup** - Tests that services can start properly
9. **Version Consistency** - Ensures dependency versions match across workspace
10. **Security Audit** - Runs pnpm audit for vulnerabilities

### 3. Smart Brain Oracle (`.smartbrain/oracle.sh`)

AI-powered repository insights and maintenance predictions:

```bash
# Analyze dependency health
.smartbrain/oracle.sh analyze

# Get upgrade recommendations
.smartbrain/oracle.sh recommend-upgrades

# Security vulnerability scan
.smartbrain/oracle.sh security-scan

# Visualize dependency graph
.smartbrain/oracle.sh visualize-deps

# Performance analysis
.smartbrain/oracle.sh performance

# Predict impact of changes
.smartbrain/oracle.sh predict-impact package-name@version
```

**Features:**
- Dependency intelligence with compatibility analysis
- Security analysis with severity scores
- Performance optimization suggestions
- Monorepo health monitoring
- Predictive maintenance
- Integration with existing Smart Brain validation

### 4. CI/CD Automation (`.github/workflows/dependency-health.yml`)

Automated health checks run on:
- Every push to main branch
- Every pull request
- Daily at 6 AM UTC
- Manual workflow dispatch

**Actions Performed:**
- Full health check execution
- Smart Brain oracle analysis
- Security audit with pnpm audit
- Version consistency validation
- PR comments with health status
- Auto-create issues on critical failures
- Generate and upload health reports

### 5. Pre-commit Hooks (`.husky/pre-commit`)

Prevents problematic commits before they reach the repository:

```bash
# Automatically runs on git commit
git commit -m "Your changes"

# Skip hooks if needed (not recommended)
git commit --no-verify -m "Emergency fix"
```

**Validations:**
- package.json syntax validation
- Workspace dependency checks
- TypeScript config validation
- Linting on changed files
- Smart Brain quick validation

## Dependency Version Policies

### Standard Versions

The repository maintains consistent versions across all packages:

| Dependency | Version | Reason |
|------------|---------|--------|
| TypeScript | 5.3.3 | Stable, widely supported |
| @types/node | 20.10.6 | Matches Node.js 20.x LTS |
| Next.js | 14.2.18 | Latest stable 14.x with security patches |
| React | 18.2.0 | Stable, production-ready |
| Node.js | 20.19.6 | LTS version (see .nvmrc) |
| pnpm | 9.0.0 | Latest with improved workspace support |

### Version Consistency Rules

1. **Exact versions** for frameworks (React, Next.js) to avoid breaking changes
2. **Caret ranges (^)** for tools and utilities to allow patch updates
3. **Workspace protocol (workspace:*)** for internal packages
4. **Aligned versions** across all apps and packages for shared dependencies

## Upgrade Procedures

### Minor/Patch Updates

For safe, incremental updates:

```bash
# 1. Check for available updates
pnpm outdated

# 2. Update specific package
pnpm update package-name --latest

# 3. Run repair script
bash scripts/repair-dependencies.sh

# 4. Test thoroughly
pnpm -r build
pnpm -r test

# 5. Commit changes
git add pnpm-lock.yaml package.json
git commit -m "chore: update package-name to vX.Y.Z"
```

### Major Updates

For breaking changes:

```bash
# 1. Check Smart Brain oracle recommendations
.smartbrain/oracle.sh recommend-upgrades

# 2. Review breaking changes
.smartbrain/oracle.sh predict-impact package-name@new-version

# 3. Create feature branch
git checkout -b chore/update-package-name

# 4. Update package.json manually
# Edit the version in package.json

# 5. Run full repair and validation
bash scripts/repair-dependencies.sh
bash scripts/master.sh health

# 6. Fix any breaking changes
# Update code as needed

# 7. Test comprehensively
pnpm -r build
pnpm -r test

# 8. Create PR with full testing notes
```

### Security Updates

For urgent security patches:

```bash
# 1. Check vulnerabilities
pnpm audit

# 2. Get oracle security analysis
.smartbrain/oracle.sh security-scan

# 3. Apply security updates
pnpm audit --fix

# 4. Verify no breaking changes
bash scripts/repair-dependencies.sh
pnpm -r build

# 5. Deploy hotfix if critical
```

## Rollback Strategies

### Quick Rollback

If a dependency update causes issues:

```bash
# 1. Revert package.json changes
git checkout HEAD~1 -- package.json pnpm-lock.yaml

# 2. Clean install
bash scripts/repair-dependencies.sh

# 3. Verify system health
bash scripts/master.sh health
```

### Full Rollback

For more complex issues:

```bash
# 1. Identify last known good commit
git log --oneline --grep="dependency"

# 2. Create rollback branch
git checkout -b hotfix/rollback-dependencies

# 3. Revert to specific commit
git revert <commit-hash>

# 4. Clean and rebuild
bash scripts/repair-dependencies.sh
pnpm -r build

# 5. Create emergency PR
```

## Troubleshooting

### Common Issues

#### Issue: "Workspace dependency not found"

```bash
# Solution: Clean and rebuild workspace links
rm -rf node_modules
bash scripts/repair-dependencies.sh
```

#### Issue: "TypeScript version mismatch"

```bash
# Solution: Harmonize TypeScript versions
# Manually edit package.json files to use 5.3.3
# Then run:
pnpm install
bash scripts/repair-dependencies.sh
```

#### Issue: "Build fails after dependency update"

```bash
# Solution: Clear build cache and rebuild
find . -name "dist" -type d -not -path "*/node_modules/*" -exec rm -rf {} +
pnpm -r build
```

#### Issue: "Port already in use"

```bash
# Solution: Clean ports using master script
bash scripts/master.sh clean-ports
```

### Getting Help

1. **Check Health Report**: Run `bash scripts/master.sh health --json` for detailed diagnostics
2. **Oracle Analysis**: Run `.smartbrain/oracle.sh analyze` for AI-powered insights
3. **View Logs**: Check `/tmp/repair-*.log` for detailed error information
4. **CI/CD Reports**: Review GitHub Actions workflow runs for automated health checks

## Integration with Smart Brain

The dependency health system integrates with the existing Smart Brain validation framework:

- **Validation Rules**: Uses same rule framework as `.smartbrain/brain.sh`
- **Event-Driven**: Triggers Smart Brain agents on dependency changes
- **Pattern Recognition**: Learns from past dependency issues
- **Predictive Analysis**: Forecasts potential problems before they occur

### Smart Brain Oracle Features

1. **Dependency Intelligence**
   - Analyze dependency health scores
   - Suggest version upgrades with compatibility analysis
   - Detect deprecated packages with alternatives
   - Predict breaking changes before upgrading

2. **Security Analysis**
   - Vulnerability scanning with severity scores
   - CVE tracking and alerting
   - License compliance checking
   - Supply chain risk assessment

3. **Performance Optimization**
   - Bundle size analysis
   - Unused dependency detection
   - Duplicate package identification
   - Tree-shaking opportunities

4. **Monorepo Health**
   - Workspace structure optimization
   - Circular dependency detection
   - Build order optimization
   - Package boundary violations

## Best Practices

1. **Run health checks before committing**: Use pre-commit hooks
2. **Review oracle recommendations weekly**: Check for security updates
3. **Test after every update**: Run full build and test suite
4. **Document breaking changes**: Update CHANGELOG.md
5. **Use feature branches**: Never update dependencies directly on main
6. **Monitor CI/CD**: Watch for automated health check failures
7. **Keep dependencies minimal**: Only add what's truly needed
8. **Prefer stable versions**: Avoid experimental or beta packages
9. **Update regularly**: Don't let dependencies get too stale
10. **Use workspace protocol**: For internal package dependencies

## Monitoring Dashboard

The admin dashboard (port 3001) includes a dependency health section:

- **Real-time Health Score**: Visual indicator of overall health
- **Outdated Packages**: List of packages with available updates
- **Security Vulnerabilities**: Critical CVEs requiring attention
- **Build Status**: Current build health across packages
- **Update History**: Timeline of recent dependency changes

Access at: `http://localhost:3001/dashboard/dependencies`

## Resources

- **Repair Script**: `scripts/repair-dependencies.sh`
- **Health Check**: `scripts/master.sh health`
- **Smart Brain Oracle**: `.smartbrain/oracle.sh`
- **CI/CD Workflow**: `.github/workflows/dependency-health.yml`
- **Pre-commit Hook**: `.husky/pre-commit`
- **Dashboard Docs**: [DASHBOARDS.md](./DASHBOARDS.md)
- **Contributing Guide**: [CONTRIBUTING.md](../CONTRIBUTING.md)

## Maintenance Schedule

- **Daily**: Automated CI/CD health checks
- **Weekly**: Manual review of oracle recommendations
- **Monthly**: Review and update outdated dependencies
- **Quarterly**: Major version upgrade planning
- **As Needed**: Security patches and critical updates

---

For questions or issues with the dependency health system, please:
1. Check this documentation first
2. Run the repair script with `--verbose` flag
3. Review CI/CD workflow logs
4. Consult the Smart Brain oracle
5. Create an issue on GitHub with full health report

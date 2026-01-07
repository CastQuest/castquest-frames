# Post-Merge Actions for Repository Cleanup PR

This document outlines the actions to be taken **after** this PR is merged into the main branch.

## 1. Branch Cleanup

Delete the following 27 stale branches that have been merged or superseded:

```bash
# Delete all stale branches in one command
git branch -d \
  copilot/add-admin-dashboard-ui \
  copilot/add-comprehensive-dashboard-documentation \
  copilot/add-dashboard-pages-with-integration \
  copilot/add-user-dashboard-page \
  copilot/build-admin-dashboard-page \
  copilot/build-production-system \
  copilot/enhance-dashboard-profile-page \
  copilot/fix-broken-links-in-docs \
  copilot/fix-dependency-issues-and-documentation \
  copilot/fix-dependency-versions-and-docs \
  copilot/fix-esbuild-version-conflict \
  copilot/fix-merge-conflicts-dashboard \
  copilot/fix-routing-inconsistencies \
  copilot/fix-typescript-errors-core-services \
  copilot/fix-typescript-errors-core-services-again \
  copilot/initialize-full-stack-monorepo \
  copilot/integrate-dashboard-and-cleanup \
  copilot/integrate-unified-nexus-dashboards \
  copilot/merge-dashboard-implementation \
  copilot/perform-repository-audit \
  copilot/replace-admin-dashboard-design \
  copilot/replace-admin-dashboard-design-again \
  copilot/restore-dashboard-components-broken-imports \
  copilot/scaffold-dashboard-pages \
  copilot/setup-copilot-instructions \
  copilot/update-master-script-content \
  pr-36

# Delete remote branches (optional, can be done via GitHub UI)
git push origin --delete copilot/add-admin-dashboard-ui
git push origin --delete copilot/add-comprehensive-dashboard-documentation
# ... (repeat for all branches)
```

## 2. Set Main as Default Branch

If not already configured:

1. Go to GitHub repository **Settings** → **Branches**
2. Change **Default branch** to `main`
3. Save changes

## 3. Master Branch Decision

Choose one of the following options:

### Option A: Delete Master Branch (Recommended)
If `main` is now the canonical branch and `master` is no longer needed:

```bash
git branch -D master
git push origin --delete master
```

### Option B: Keep Master as Mirror
If you want to keep `master` in sync with `main`:

```bash
git checkout master
git merge main --ff-only
git push origin master
```

Then set up a GitHub Action to auto-sync `master` with `main`.

### Option C: Archive Master
Keep the branch but mark it as archived in branch protection rules.

## 4. Verification Checklist

After merging, verify the following on the main branch:

```bash
# Install dependencies
pnpm install

# Verify build works
pnpm build

# Check that no tsbuildinfo files exist
find . -name "*.tsbuildinfo" -not -path "*/node_modules/*"

# Test dev environments
pnpm dev:admin  # Should start on port 3001
pnpm dev:web    # Should start on port 3000

# Test docs site
pnpm docs:dev   # Should start docs site

# Test new scripts
pnpm dev:all    # Should start both apps
pnpm lint       # Should lint all packages
pnpm typecheck  # Should typecheck all packages
```

## 5. Update CI/CD (If Applicable)

If your CI/CD pipelines reference any of the deleted branches or scripts:

1. Update workflow files to remove references to deleted branches
2. Update any hardcoded script paths
3. Ensure workflows run against `main` as default

## 6. Team Communication

Notify team members about:

1. **Deleted branches**: Teams should delete their local copies
2. **New scripts**: `pnpm dev:all`, `pnpm clean`, `pnpm lint`, etc.
3. **Default branch change**: Update their local repos

Team members should run:
```bash
git checkout main
git pull origin main
git remote prune origin
git branch -d copilot/cleanup-dead-duplicate-files
```

## 7. Documentation Updates

Consider updating:

1. **CONTRIBUTING.md** - Reference new script commands
2. **Team wiki/docs** - Update setup instructions if needed
3. **Onboarding docs** - Ensure they reference `main` not `master`

## Cleanup Summary

This PR successfully:
- ✅ Removed 10 dead/duplicate/deprecated files (saved 323KB)
- ✅ Updated .gitignore to prevent future build artifacts
- ✅ Fixed README.md emoji encoding and removed duplicates
- ✅ Added 7 new npm scripts for better DX
- ✅ Enhanced documentation navigation
- ✅ Consolidated script documentation

**Total files cleaned:** 10 deleted, 5 updated
**Total lines changed:** -619 deletions, +102 insertions
**Net reduction:** 517 lines removed

---

**Note:** This file can be deleted after all post-merge actions are completed.

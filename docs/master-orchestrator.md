# CastQuest Master Orchestrator Documentation

## Overview

The Master Orchestrator (`scripts/master.sh`) is the central command and control script for the entire CastQuest platform. It provides unified access to all system operations, from deployment to monitoring, health checks, and autonomous worker management.

## Architecture

```
Master Orchestrator
├── System Management
│   ├── Health Monitoring
│   ├── Self-Healing Protocols
│   ├── Smart Brain Integration
│   └── Protocol Integrity
├── Deployment Pipeline
│   ├── Development Environment
│   ├── Production Deployment
│   └── Dependency Management
├── Worker Orchestration
│   ├── Autonomous Worker System
│   ├── Task Scheduling
│   └── Health Monitoring
├── Port Management
│   └── Automated Cleanup
└── Git Operations
    ├── Commit Automation
    ├── Tag Management
    └── Push to Remote
```

## Usage

### Basic Command Structure

```bash
./scripts/master.sh <command> [options]
```

### System Management Commands

#### Health Check
```bash
./scripts/master.sh health
```
Performs comprehensive system health check:
- Node.js and pnpm versions
- Git availability
- Workspace structure validation
- Required directories verification

#### Self-Healing
```bash
./scripts/master.sh heal
```
Executes self-healing protocols:
- `mega-neo-self-healer-v5.sh` - Component repair
- `castquest-mega-selfheal.sh` - Full system regeneration
- `mega-neo-workspace-validator.sh` - Workspace validation

#### Smart Brain Analysis
```bash
./scripts/master.sh brain
```
Runs Smart Brain deep thinking analysis:
- Pattern recognition across codebase
- Autonomous learning from events
- Suggestion generation
- Memory consolidation

#### Protocol Integrity
```bash
./scripts/master.sh integrity
```
Validates protocol integrity:
- Schema validation
- Data consistency checks
- API endpoint verification
- Security audit

### Deployment Commands

#### Development Deployment
```bash
./scripts/master.sh deploy development
```
Deploys system for local development:
1. System health check
2. Protocol integrity validation
3. Self-healing execution
4. Smart Brain analysis
5. Port cleanup
6. Dependency installation
7. Package building
8. Development server startup
9. Worker system activation

#### Production Deployment
```bash
./scripts/master.sh deploy production
```
Deploys system for production:
1. All development steps
2. Production build optimization
3. Oracle DB initialization
4. Security hardening
5. Performance optimization
6. Monitoring activation

#### Monitoring Dashboard
```bash
./scripts/master.sh monitor
```
Launches real-time monitoring dashboard:
- System uptime and resources
- Active processes
- Git status
- Worker health
- Oracle DB statistics
- Smart Brain activity

### Worker Management

#### Start Workers
```bash
./scripts/master.sh workers start
```
Starts autonomous worker system with:
- Task queue initialization
- Health monitoring
- Auto-scaling configuration
- Priority scheduling

#### Stop Workers
```bash
./scripts/master.sh workers stop
```
Gracefully stops all workers:
- Task completion
- Connection cleanup
- Resource deallocation

#### Worker Status
```bash
./scripts/master.sh workers status
```
Shows current worker status:
- Active workers count
- Running tasks
- Queue depth
- Health status

### Port Management

```bash
./scripts/master.sh ports
```
Cleans and resets ports:
- Kills processes on common ports (3000, 3010, 5173, 8080)
- Frees up resources
- Prevents port conflicts

### Git Operations

#### Status
```bash
./scripts/master.sh git status
```
Shows git repository status

#### Commit
```bash
./scripts/master.sh git commit "Your commit message"
```
Commits all changes with provided message

#### Tag
```bash
./scripts/master.sh git tag v1.0.0 "Release message"
```
Creates annotated tag with message

#### Push
```bash
./scripts/master.sh git push
```
Pushes current branch and all tags to remote

#### Full Cycle
```bash
./scripts/master.sh git full "Complete feature implementation"
```
Executes complete git workflow:
1. Stages all changes
2. Commits with message
3. Displays latest tag
4. Pushes to remote
5. Pushes all tags

### Utility Commands

#### View Logs
```bash
./scripts/master.sh logs
```
Displays last 50 lines of master orchestrator log

#### Help
```bash
./scripts/master.sh help
```
Shows complete help menu with all commands

## Integration with Other Scripts

### Smart Brain Console
- **Script**: `mega-brain-console-neo.sh`
- **Purpose**: AI-powered deep thinking and learning
- **Integration**: Called during deployment and brain command

### Self-Healing Scripts
- **v5**: `mega-neo-self-healer-v5.sh` - Latest self-healing protocol
- **Mega**: `castquest-mega-selfheal.sh` - Full system regeneration
- **Validator**: `mega-neo-workspace-validator.sh` - Structure validation

### Worker Console
- **Script**: `mega-worker-console-neo.sh`
- **Purpose**: Autonomous worker orchestration
- **Integration**: Started/stopped via workers command

### Port Management
- **Script**: `mega-port-cleaner.sh`
- **Purpose**: Port conflict resolution
- **Integration**: Called before deployments

### Deployment Scripts
- **Deploy**: `hackathon-deploy.sh` - Production deployment
- **Monitor**: `hackathon-monitor.sh` - Real-time monitoring

## Logging

All operations are logged to:
```
logs/master-YYYYMMDD-HHMMSS.log
```

Log format:
```
[HH:MM:SS] [LEVEL] Message
```

Levels:
- `SUCCESS` - Operation completed successfully
- `WARNING` - Non-critical issue
- `ERROR` - Critical failure
- `STEP` - Operation stage

## Environment Variables

```bash
# Optional configuration
export CASTQUEST_ENV=production        # Environment mode
export CASTQUEST_LOG_LEVEL=debug       # Logging verbosity
export CASTQUEST_WORKERS=5             # Worker pool size
export CASTQUEST_AUTO_HEAL=true        # Enable auto-healing
```

## Examples

### Complete Deployment Workflow
```bash
# 1. Clean environment
./scripts/master.sh ports

# 2. Run health check
./scripts/master.sh health

# 3. Self-heal any issues
./scripts/master.sh heal

# 4. Deploy production
./scripts/master.sh deploy production

# 5. Start monitoring
./scripts/master.sh monitor
```

### Development Workflow
```bash
# 1. Start development environment
./scripts/master.sh deploy development

# 2. Work on features...

# 3. Commit and push
./scripts/master.sh git full "feat: Add new feature"

# 4. Check worker status
./scripts/master.sh workers status
```

### Emergency Recovery
```bash
# 1. Stop all workers
./scripts/master.sh workers stop

# 2. Clean ports
./scripts/master.sh ports

# 3. Run self-healing
./scripts/master.sh heal

# 4. Check integrity
./scripts/master.sh integrity

# 5. Restart system
./scripts/master.sh deploy development
```

## Best Practices

### 1. Always Check Health First
Before any major operation:
```bash
./scripts/master.sh health
```

### 2. Use Self-Healing Regularly
Weekly maintenance:
```bash
./scripts/master.sh heal
```

### 3. Monitor Production
Keep monitoring running:
```bash
./scripts/master.sh monitor
```

### 4. Clean Git Workflow
Use full cycle for consistency:
```bash
./scripts/master.sh git full "Descriptive message"
```

### 5. Worker Management
Start workers after deployment:
```bash
./scripts/master.sh workers start
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
./scripts/master.sh ports
```

#### Dependencies Not Installed
```bash
cd /workspaces/castquest-frames
pnpm install
```

#### Workers Not Starting
```bash
./scripts/master.sh workers stop
./scripts/master.sh ports
./scripts/master.sh workers start
```

#### Git Push Failures
```bash
git status
git pull origin master --rebase
./scripts/master.sh git push
```

## Security Considerations

1. **Credentials**: Never commit credentials to git
2. **Environment Variables**: Use `.env` files (gitignored)
3. **Logs**: Sanitize sensitive data from logs
4. **Permissions**: Restrict master.sh execution to authorized users

## Performance Optimization

### Parallel Execution
The master script executes independent operations in parallel:
- Health checks
- Self-healing protocols
- Worker initialization

### Resource Management
- Automatic port cleanup
- Worker pool sizing
- Memory optimization

### Caching
- pnpm dependency caching
- Build artifact caching
- Git object caching

## Integration Points

### Oracle Database
```bash
# Initialize Oracle
scripts/init-oracle.sql

# Check connection
./scripts/master.sh integrity
```

### Smart Brain
```bash
# Run deep thinking
./scripts/master.sh brain

# View suggestions
cat data/brain-suggestions.json
```

### Autonomous Workers
```bash
# Monitor workers
./scripts/master.sh workers status

# View worker events
cat data/worker-events.json
```

## Version History

- **v1.0.0** - Initial master orchestrator
- Integrated with Hackathon 2026 release
- Production-ready deployment pipeline

## License

MIT License - CastQuest 2026

## Support

For issues or questions:
1. Check logs: `./scripts/master.sh logs`
2. Run health check: `./scripts/master.sh health`
3. Review documentation: `docs/`
4. GitHub Issues: https://github.com/CastQuest/castquest-frames

---

**Last Updated**: December 28, 2025  
**Version**: 1.0.0  
**Status**: Production Stable ✅

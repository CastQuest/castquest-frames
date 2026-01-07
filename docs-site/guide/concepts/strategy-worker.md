# Strategy Worker

The Strategy Worker is an autonomous background processing system that scans, triggers, and executes protocol operations.

## Overview

The Strategy Worker provides:
- **Autonomous Operation**: Runs in the background without manual intervention
- **Event-Driven**: Responds to protocol events and triggers
- **Transparent Logging**: All operations are logged for audit
- **Configurable**: Customize scan intervals and triggers
- **Fault-Tolerant**: Handles errors gracefully and retries failed operations

## Architecture

```
┌─────────────────────────────────────┐
│       Strategy Worker System        │
├─────────────────────────────────────┤
│  ┌─────────────┐   ┌─────────────┐ │
│  │   Scanner   │   │   Executor  │ │
│  │   Engine    │──▶│   Engine    │ │
│  └─────────────┘   └─────────────┘ │
│         │                  │        │
│         ▼                  ▼        │
│  ┌─────────────────────────────┐   │
│  │      Event Logger           │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## Core Components

### Scanner Engine

Periodically scans for work to do:

```typescript
interface ScannerConfig {
  interval: number;        // Scan interval in ms
  enabled: boolean;        // Enable/disable scanner
  targets: string[];       // What to scan for
  filters?: ScanFilter[];  // Optional filters
}
```

### Executor Engine

Executes triggered operations:

```typescript
interface ExecutorConfig {
  maxConcurrent: number;   // Max parallel operations
  retryAttempts: number;   // Retry failed operations
  retryDelay: number;      // Delay between retries
  timeout: number;         // Operation timeout
}
```

### Event Logger

Logs all worker activity:

```typescript
interface WorkerEvent {
  id: string;
  type: 'scan' | 'trigger' | 'execute' | 'error';
  timestamp: string;
  operation: string;
  status: 'success' | 'failure' | 'pending';
  details?: any;
}
```

## Configuration

### Basic Configuration

```typescript
import { StrategyWorker } from '@castquest/strategy-worker';

const worker = new StrategyWorker({
  scanner: {
    interval: 30000,        // Scan every 30 seconds
    enabled: true,
    targets: ['quests', 'mints', 'frames']
  },
  executor: {
    maxConcurrent: 5,
    retryAttempts: 3,
    retryDelay: 5000,
    timeout: 30000
  },
  logging: {
    level: 'info',
    logFile: './logs/worker.log'
  }
});
```

### Advanced Configuration

```typescript
const worker = new StrategyWorker({
  scanner: {
    interval: 60000,
    enabled: true,
    targets: ['quests', 'mints'],
    filters: [
      {
        type: 'quest',
        condition: 'status === "active"'
      }
    ]
  },
  executor: {
    maxConcurrent: 10,
    retryAttempts: 5,
    retryDelay: 10000,
    timeout: 60000,
    hooks: {
      beforeExecute: async (operation) => {
        console.log('Executing:', operation);
      },
      afterExecute: async (operation, result) => {
        console.log('Completed:', result);
      }
    }
  },
  triggers: {
    questComplete: {
      enabled: true,
      action: 'distributeRewards'
    },
    mintThreshold: {
      enabled: true,
      threshold: 10,
      action: 'notifyLowSupply'
    }
  }
});
```

## Starting the Worker

### Standalone Mode

```bash
# Start worker as standalone process
pnpm worker:start

# Or with custom config
pnpm worker:start --config worker.config.json
```

### Programmatic Start

```typescript
import { StrategyWorker } from '@castquest/strategy-worker';

const worker = new StrategyWorker(config);

// Start worker
await worker.start();

console.log('Worker started successfully');

// Stop worker
process.on('SIGINT', async () => {
  await worker.stop();
  process.exit(0);
});
```

### Integration with Admin Dashboard

The worker runs automatically when the admin dashboard starts:

```typescript
// Admin dashboard automatically starts worker
pnpm --filter ./apps/admin dev
```

## Worker Operations

### Quest Operations

Automated quest management:

```typescript
// Auto-activate scheduled quests
worker.on('questScheduled', async (quest) => {
  if (shouldActivate(quest)) {
    await client.quests.activate(quest.id);
  }
});

// Auto-complete expired quests
worker.on('questExpired', async (quest) => {
  await client.quests.deactivate(quest.id);
});

// Distribute rewards on completion
worker.on('questCompleted', async (quest, userId) => {
  await distributeRewards(quest.id, userId);
});
```

### Mint Operations

Automated mint management:

```typescript
// Monitor supply levels
worker.on('mintSupplyLow', async (mint) => {
  if (mint.remaining < mint.lowThreshold) {
    await notifyLowSupply(mint);
  }
});

// Auto-close sold out mints
worker.on('mintSoldOut', async (mint) => {
  await client.mints.close(mint.id);
});
```

### Frame Operations

Automated frame management:

```typescript
// Archive old frames
worker.on('frameExpired', async (frame) => {
  if (isExpired(frame)) {
    await client.frames.archive(frame.id);
  }
});

// Generate analytics
worker.on('frameStatsUpdate', async (frame) => {
  await updateFrameAnalytics(frame.id);
});
```

## Monitoring

### View Worker Status

```typescript
const status = await worker.getStatus();

console.log('Worker Status:', status);
// {
//   running: true,
//   uptime: 3600000,
//   operationsProcessed: 1250,
//   lastScan: '2024-01-06T12:00:00Z',
//   queueSize: 5
// }
```

### View Event Logs

```typescript
const events = await worker.getEvents({
  limit: 100,
  type: 'execute',
  status: 'success'
});

events.forEach(event => {
  console.log(`${event.timestamp}: ${event.operation} - ${event.status}`);
});
```

### Dashboard View

Access worker dashboard at:
```
http://localhost:3010/strategy
```

Features:
- Real-time status
- Operation logs
- Performance metrics
- Manual triggers
- Configuration editor

## Custom Triggers

### Define Custom Trigger

```typescript
worker.addTrigger({
  name: 'customTrigger',
  description: 'Custom trigger for specific condition',
  condition: async () => {
    // Your condition logic
    const data = await fetchData();
    return data.someValue > threshold;
  },
  action: async () => {
    // Action to execute
    await performCustomAction();
  },
  interval: 60000  // Check every minute
});
```

### Time-Based Trigger

```typescript
worker.addTrigger({
  name: 'dailyReport',
  schedule: '0 0 * * *',  // Cron format: daily at midnight
  action: async () => {
    await generateDailyReport();
  }
});
```

### Event-Based Trigger

```typescript
worker.onEvent('quest.created', async (quest) => {
  // Auto-add default steps
  await addDefaultSteps(quest.id);
});
```

## Error Handling

### Retry Logic

Failed operations are automatically retried:

```typescript
worker.on('operationFailed', async (operation, error, attempt) => {
  console.error(`Attempt ${attempt} failed:`, error);
  
  if (attempt >= config.executor.retryAttempts) {
    // Max retries exceeded
    await logFailedOperation(operation, error);
  }
});
```

### Error Notifications

Configure error notifications:

```typescript
worker.on('error', async (error) => {
  // Send alert
  await sendAlert({
    type: 'worker_error',
    message: error.message,
    timestamp: new Date()
  });
});
```

## Performance Tuning

### Optimize Scan Interval

```typescript
// Adjust based on load
const optimalInterval = calculateOptimalInterval({
  currentLoad: worker.getLoad(),
  targetLatency: 60000
});

worker.updateConfig({
  scanner: {
    interval: optimalInterval
  }
});
```

### Adjust Concurrency

```typescript
// Scale based on system resources
const maxConcurrent = Math.floor(os.cpus().length * 2);

worker.updateConfig({
  executor: {
    maxConcurrent
  }
});
```

## Best Practices

1. **Start Simple**: Begin with basic configuration, add complexity as needed
2. **Monitor Regularly**: Check worker logs and status frequently
3. **Set Appropriate Intervals**: Balance responsiveness with resource usage
4. **Handle Errors Gracefully**: Implement robust error handling
5. **Log Everything**: Enable comprehensive logging for debugging
6. **Test Triggers**: Test custom triggers before deploying
7. **Use Circuit Breakers**: Prevent cascading failures
8. **Implement Rate Limiting**: Avoid overwhelming external services

## Troubleshooting

### Worker Not Starting

```bash
# Check logs
tail -f logs/worker.log

# Verify configuration
node -e "require('./worker.config.json')"

# Check port availability
lsof -i :4000
```

### Operations Not Executing

- Check trigger conditions
- Verify scanner is enabled
- Review executor configuration
- Check for errors in logs

### High Resource Usage

- Reduce scan interval
- Lower max concurrent operations
- Optimize trigger conditions
- Add rate limiting

## API Reference

### Start Worker

```typescript
await worker.start();
```

### Stop Worker

```typescript
await worker.stop();
```

### Get Status

```typescript
const status = await worker.getStatus();
```

### Get Events

```typescript
const events = await worker.getEvents(options);
```

### Add Trigger

```typescript
worker.addTrigger(trigger);
```

### Remove Trigger

```typescript
worker.removeTrigger(triggerId);
```

### Update Configuration

```typescript
worker.updateConfig(newConfig);
```

## Next Steps

- [Smart Brain](/guide/concepts/smart-brain) - AI-powered automation
- [Quest System](/guide/concepts/quests) - Understand quest automation
- [API Reference](/api/endpoints/strategy) - Strategy Worker API
- [Advanced Patterns](/guide/advanced/worker-patterns) - Advanced worker patterns

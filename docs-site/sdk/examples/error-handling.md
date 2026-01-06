# Error Handling

Comprehensive error handling patterns for the CastQuest SDK.

## Error Types

The SDK provides typed errors for better error handling:

```typescript
import {
  CastQuestError,      // Base error class
  NotFoundError,       // Resource not found
  ValidationError,     // Validation failed
  NetworkError,        // Network request failed
  AuthenticationError, // Authentication failed
  RateLimitError,      // Rate limit exceeded
  TimeoutError         // Request timeout
} from '@castquest/sdk';
```

## Basic Error Handling

### Try-Catch Pattern

```typescript
async function getQuest(questId: string) {
  try {
    const quest = await client.quests.get(questId);
    return quest;
  } catch (error) {
    console.error('Failed to get quest:', error);
    throw error;
  }
}
```

### Type-Specific Handling

```typescript
async function getQuestSafely(questId: string) {
  try {
    return await client.quests.get(questId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.error('Quest not found:', questId);
      return null;
    } else if (error instanceof NetworkError) {
      console.error('Network error:', error.statusCode);
      // Retry logic could go here
      throw error;
    } else if (error instanceof CastQuestError) {
      console.error('SDK error:', error.code, error.message);
      throw error;
    } else {
      console.error('Unexpected error:', error);
      throw error;
    }
  }
}
```

## Validation Errors

### Handling Validation Errors

```typescript
async function createQuestWithValidation(data: any) {
  try {
    const quest = await client.quests.create(data);
    return { success: true, quest };
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('Validation failed:');
      error.errors.forEach(err => {
        console.error(`- ${err.field}: ${err.message}`);
      });
      
      return {
        success: false,
        errors: error.errors
      };
    }
    throw error;
  }
}
```

### Pre-validation

```typescript
async function createFrameWithPreValidation(data: any) {
  // Validate before creating
  const validation = await client.frames.validate(data);
  
  if (!validation.valid) {
    console.error('Validation errors:', validation.errors);
    return { success: false, errors: validation.errors };
  }
  
  try {
    const frame = await client.frames.create(data);
    return { success: true, frame };
  } catch (error) {
    console.error('Failed to create frame:', error);
    return { success: false, error };
  }
}
```

## Network Errors

### Retry Logic

```typescript
async function getQuestWithRetry(
  questId: string,
  maxRetries: number = 3
): Promise<Quest | null> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await client.quests.get(questId);
    } catch (error) {
      lastError = error as Error;
      
      if (error instanceof NetworkError && error.statusCode >= 500) {
        console.log(`Attempt ${attempt} failed, retrying...`);
        // Exponential backoff
        await sleep(Math.pow(2, attempt) * 1000);
        continue;
      }
      
      // Don't retry for client errors
      throw error;
    }
  }
  
  console.error(`Failed after ${maxRetries} attempts:`, lastError);
  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### Timeout Handling

```typescript
async function getQuestWithTimeout(
  questId: string,
  timeoutMs: number = 10000
) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new TimeoutError('Request timeout')), timeoutMs);
  });
  
  try {
    return await Promise.race([
      client.quests.get(questId),
      timeoutPromise
    ]);
  } catch (error) {
    if (error instanceof TimeoutError) {
      console.error('Request timed out after', timeoutMs, 'ms');
      throw error;
    }
    throw error;
  }
}
```

## Rate Limiting

### Handle Rate Limits

```typescript
async function handleRateLimit<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof RateLimitError) {
        const retryAfter = error.retryAfter || 60;
        console.log(`Rate limited. Retrying after ${retryAfter}s...`);
        await sleep(retryAfter * 1000);
        continue;
      }
      throw error;
    }
  }
  
  throw new Error('Max retries exceeded for rate limit');
}

// Usage
const quest = await handleRateLimit(() => 
  client.quests.get(questId)
);
```

## Authentication Errors

### Handle Authentication

```typescript
async function authenticatedRequest<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error('Authentication failed. Please log in again.');
      
      // Trigger re-authentication
      await refreshToken();
      
      // Retry the operation
      return await operation();
    }
    throw error;
  }
}

async function refreshToken() {
  // Implementation for token refresh
  console.log('Refreshing authentication token...');
}
```

## Batch Operation Error Handling

### Partial Failures

```typescript
async function createMultipleQuestsWithErrorHandling(
  questsData: Array<{ name: string; description?: string }>
) {
  const results = await Promise.allSettled(
    questsData.map(data => client.quests.create(data))
  );
  
  const successful: Quest[] = [];
  const failed: Array<{ data: any; error: Error }> = [];
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successful.push(result.value);
    } else {
      failed.push({
        data: questsData[index],
        error: result.reason
      });
    }
  });
  
  console.log(`Created ${successful.length} quests`);
  console.log(`Failed to create ${failed.length} quests`);
  
  if (failed.length > 0) {
    console.error('Failures:', failed);
  }
  
  return { successful, failed };
}
```

### Sequential Error Handling

```typescript
async function createQuestsSequentially(
  questsData: Array<{ name: string; description?: string }>
) {
  const results: {
    successful: Quest[];
    failed: Array<{ data: any; error: Error }>;
  } = {
    successful: [],
    failed: []
  };
  
  for (const data of questsData) {
    try {
      const quest = await client.quests.create(data);
      results.successful.push(quest);
    } catch (error) {
      results.failed.push({
        data,
        error: error as Error
      });
      
      // Optionally stop on first error
      // break;
    }
  }
  
  return results;
}
```

## Custom Error Handler

### Create Error Handler Wrapper

```typescript
class ErrorHandler {
  private retryCount = 3;
  private retryDelay = 1000;
  
  async execute<T>(
    operation: () => Promise<T>,
    options?: {
      retries?: number;
      onRetry?: (attempt: number, error: Error) => void;
      shouldRetry?: (error: Error) => boolean;
    }
  ): Promise<T> {
    const maxRetries = options?.retries ?? this.retryCount;
    const shouldRetry = options?.shouldRetry ?? this.defaultShouldRetry;
    
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries && shouldRetry(lastError)) {
          options?.onRetry?.(attempt, lastError);
          await sleep(this.retryDelay * attempt);
          continue;
        }
        
        throw lastError;
      }
    }
    
    throw lastError;
  }
  
  private defaultShouldRetry(error: Error): boolean {
    if (error instanceof NetworkError) {
      return error.statusCode >= 500;
    }
    if (error instanceof TimeoutError) {
      return true;
    }
    return false;
  }
}

// Usage
const errorHandler = new ErrorHandler();

const quest = await errorHandler.execute(
  () => client.quests.get(questId),
  {
    retries: 5,
    onRetry: (attempt, error) => {
      console.log(`Retry attempt ${attempt} after error:`, error.message);
    }
  }
);
```

## Logging Errors

### Error Logger

```typescript
class ErrorLogger {
  log(error: Error, context?: Record<string, any>) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      name: error.name,
      message: error.message,
      stack: error.stack,
      context
    };
    
    if (error instanceof CastQuestError) {
      errorInfo['code'] = error.code;
      errorInfo['details'] = error.details;
    }
    
    console.error('Error logged:', JSON.stringify(errorInfo, null, 2));
    
    // Send to error tracking service
    // this.sendToErrorTracking(errorInfo);
  }
}

const errorLogger = new ErrorLogger();

try {
  await client.quests.get(questId);
} catch (error) {
  errorLogger.log(error as Error, {
    operation: 'getQuest',
    questId
  });
  throw error;
}
```

## React Error Boundary

### Error Boundary Component

```typescript
import React from 'react';

class CastQuestErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('CastQuest error:', error, errorInfo);
    
    if (error instanceof CastQuestError) {
      // Handle SDK-specific errors
      this.handleCastQuestError(error);
    }
  }
  
  handleCastQuestError(error: CastQuestError) {
    // Log to error tracking service
    console.error('SDK Error:', error.code, error.message);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <CastQuestErrorBoundary>
      <YourApp />
    </CastQuestErrorBoundary>
  );
}
```

## Best Practices

### 1. Always Handle Specific Errors First

```typescript
try {
  await operation();
} catch (error) {
  if (error instanceof NotFoundError) {
    // Handle not found
  } else if (error instanceof ValidationError) {
    // Handle validation
  } else if (error instanceof CastQuestError) {
    // Handle other SDK errors
  } else {
    // Handle unexpected errors
  }
}
```

### 2. Log Errors with Context

```typescript
try {
  await client.quests.create(data);
} catch (error) {
  console.error('Failed to create quest:', {
    error: error.message,
    data,
    timestamp: new Date().toISOString()
  });
}
```

### 3. Provide User-Friendly Messages

```typescript
try {
  await operation();
} catch (error) {
  if (error instanceof ValidationError) {
    showUserMessage('Please check your input and try again.');
  } else if (error instanceof NetworkError) {
    showUserMessage('Connection error. Please check your internet.');
  } else {
    showUserMessage('An unexpected error occurred. Please try again.');
  }
}
```

### 4. Implement Circuit Breaker

```typescript
class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private threshold = 5;
  private timeout = 60000;
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      throw new Error('Circuit breaker is open');
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private isOpen(): boolean {
    return this.failureCount >= this.threshold &&
           Date.now() - this.lastFailureTime < this.timeout;
  }
  
  private onSuccess() {
    this.failureCount = 0;
  }
  
  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
  }
}
```

## Next Steps

- [Basic Examples](/sdk/examples/basic) - Learn basic SDK usage
- [API Reference](/sdk/api/index) - Complete API documentation
- [Configuration](/sdk/configuration) - Configure error handling behavior

# Configuration

Configure the CastQuest SDK to match your development and production environments.

## Basic Configuration

The simplest way to configure the SDK:

```typescript
import { CastQuestClient } from '@castquest/sdk';

const client = new CastQuestClient({
  apiUrl: 'http://localhost:3010/api',
  network: 'base'
});
```

## Configuration File

For larger projects, create a `castquest.config.ts` file:

```typescript
import { defineConfig } from '@castquest/sdk';

export default defineConfig({
  // Required: API endpoint URL
  apiUrl: process.env.CASTQUEST_API_URL || 'http://localhost:3010/api',
  
  // Network configuration
  network: 'base',
  
  // Optional: Local data directory for caching
  dataDir: './castquest-data',
  
  // Optional: Request timeout in milliseconds
  timeout: 30000,
  
  // Optional: Number of retry attempts
  retries: 3,
  
  // Optional: Smart Brain AI configuration
  smartBrain: {
    enabled: true,
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4',
    temperature: 0.7
  },
  
  // Optional: Onchain configuration
  onchain: {
    rpcUrl: process.env.BASE_RPC_URL,
    mock: process.env.NODE_ENV === 'development',
    gasMultiplier: 1.2
  },
  
  // Optional: Logging configuration
  logging: {
    level: 'info', // 'debug' | 'info' | 'warn' | 'error'
    pretty: true
  }
});
```

Then load it in your application:

```typescript
import config from './castquest.config';
import { CastQuestClient } from '@castquest/sdk';

const client = new CastQuestClient(config);
```

## Environment Variables

Common environment variables:

```bash
# .env
CASTQUEST_API_URL=http://localhost:3010/api
CASTQUEST_NETWORK=base
BASE_RPC_URL=https://mainnet.base.org
OPENAI_API_KEY=sk-...
NODE_ENV=development
```

Load them in your configuration:

```typescript
import { config as loadEnv } from 'dotenv';
loadEnv();

export default defineConfig({
  apiUrl: process.env.CASTQUEST_API_URL!,
  network: process.env.CASTQUEST_NETWORK as 'base' | 'ethereum',
  smartBrain: {
    enabled: true,
    apiKey: process.env.OPENAI_API_KEY
  }
});
```

## Configuration Options Reference

### Core Options

#### apiUrl
- **Type**: `string`
- **Required**: Yes
- **Description**: Base URL for the CastQuest API
- **Example**: `'http://localhost:3010/api'`

#### network
- **Type**: `'base' | 'ethereum' | 'polygon' | 'optimism'`
- **Default**: `'base'`
- **Description**: Target blockchain network

#### dataDir
- **Type**: `string`
- **Default**: `'./castquest-data'`
- **Description**: Directory for local data storage and caching

#### timeout
- **Type**: `number` (milliseconds)
- **Default**: `30000`
- **Description**: Request timeout duration

#### retries
- **Type**: `number`
- **Default**: `3`
- **Description**: Number of retry attempts for failed requests

### Smart Brain Options

Configure AI-powered features:

```typescript
smartBrain: {
  // Enable/disable Smart Brain features
  enabled: boolean;
  
  // OpenAI API key
  apiKey?: string;
  
  // Model to use
  model?: 'gpt-4' | 'gpt-3.5-turbo';
  
  // Temperature for text generation (0-1)
  temperature?: number;
  
  // Maximum tokens in response
  maxTokens?: number;
}
```

### Onchain Options

Configure blockchain interactions:

```typescript
onchain: {
  // RPC endpoint URL
  rpcUrl?: string;
  
  // Use mock blockchain (for development)
  mock?: boolean;
  
  // Gas price multiplier for transactions
  gasMultiplier?: number;
  
  // Private key for signing (use with caution!)
  privateKey?: string;
  
  // Wallet configuration
  wallet?: {
    type: 'injected' | 'walletconnect' | 'private-key';
    config?: any;
  };
}
```

### Logging Options

Configure logging behavior:

```typescript
logging: {
  // Log level
  level: 'debug' | 'info' | 'warn' | 'error';
  
  // Pretty print logs
  pretty?: boolean;
  
  // Custom logger instance
  logger?: Logger;
}
```

## Advanced Configuration

### Multiple Environments

Set up different configurations for different environments:

```typescript
// config/development.ts
export default defineConfig({
  apiUrl: 'http://localhost:3010/api',
  network: 'base',
  onchain: { mock: true },
  logging: { level: 'debug', pretty: true }
});

// config/production.ts
export default defineConfig({
  apiUrl: 'https://api.castquest.xyz/api',
  network: 'base',
  onchain: { 
    mock: false,
    rpcUrl: process.env.BASE_RPC_URL 
  },
  logging: { level: 'warn', pretty: false }
});

// config/index.ts
import dev from './development';
import prod from './production';

export default process.env.NODE_ENV === 'production' ? prod : dev;
```

### Custom HTTP Client

Provide your own HTTP client:

```typescript
import axios from 'axios';

const client = new CastQuestClient({
  apiUrl: 'http://localhost:3010/api',
  httpClient: axios.create({
    headers: {
      'X-Custom-Header': 'value'
    }
  })
});
```

### Request Interceptors

Add custom request/response handling:

```typescript
import { CastQuestClient, RequestInterceptor } from '@castquest/sdk';

const authInterceptor: RequestInterceptor = async (config) => {
  const token = await getAuthToken();
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
};

const client = new CastQuestClient({
  apiUrl: 'http://localhost:3010/api',
  interceptors: {
    request: [authInterceptor],
    response: [
      (response) => {
        console.log('Response received:', response.status);
        return response;
      }
    ]
  }
});
```

### Caching Strategy

Configure caching behavior:

```typescript
const client = new CastQuestClient({
  apiUrl: 'http://localhost:3010/api',
  cache: {
    enabled: true,
    ttl: 60000, // Cache TTL in ms
    maxSize: 100, // Max cached items
    keyGenerator: (request) => `${request.method}:${request.url}`
  }
});
```

## TypeScript Configuration

Ensure your `tsconfig.json` is properly configured:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "types": ["@castquest/sdk"]
  }
}
```

## Framework-Specific Configuration

### Next.js

```typescript
// next.config.js
module.exports = {
  env: {
    CASTQUEST_API_URL: process.env.CASTQUEST_API_URL,
  },
  webpack: (config) => {
    // Add any necessary webpack configuration
    return config;
  }
};
```

### Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    'process.env.CASTQUEST_API_URL': JSON.stringify(process.env.CASTQUEST_API_URL)
  }
});
```

### Create React App

```typescript
// .env
REACT_APP_CASTQUEST_API_URL=http://localhost:3010/api

// Usage
const client = new CastQuestClient({
  apiUrl: process.env.REACT_APP_CASTQUEST_API_URL!
});
```

## Validation

The SDK validates configuration at initialization:

```typescript
try {
  const client = new CastQuestClient({
    apiUrl: 'invalid-url' // Will throw an error
  });
} catch (error) {
  console.error('Invalid configuration:', error.message);
}
```

## Best Practices

1. **Never commit secrets**: Use environment variables for API keys
2. **Use different configs for different environments**: Separate development from production
3. **Set appropriate timeouts**: Adjust based on your network conditions
4. **Enable caching in production**: Reduce API calls and improve performance
5. **Use TypeScript**: Get compile-time validation of configuration
6. **Document your configuration**: Help your team understand the setup

## Troubleshooting

### Configuration Not Loading

If your configuration isn't being applied:

1. Check the file path is correct
2. Ensure the export is default: `export default defineConfig(...)`
3. Verify environment variables are loaded

### Type Errors

If TypeScript complains about configuration:

1. Update to latest SDK version
2. Check your `tsconfig.json` settings
3. Import types explicitly: `import type { CastQuestConfig } from '@castquest/sdk'`

### Connection Issues

If the client can't connect:

1. Verify `apiUrl` is correct
2. Check the API is running
3. Ensure network/firewall allows connections
4. Try increasing `timeout` value

## Next Steps

- [Quick Start](/sdk/quick-start) - Start building with the SDK
- [API Reference](/sdk/api/index) - Explore all available methods
- [Examples](/sdk/examples/basic) - See configuration in action

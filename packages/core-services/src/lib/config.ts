import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  apiVersion: process.env.API_VERSION || 'v1',
  
  database: {
    url: process.env.DATABASE_URL || 'postgresql://castquest:castquest@localhost:5432/castquest_dev',
    poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '20', 10),
  },
  
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    verificationTokenExpiresIn: process.env.VERIFICATION_TOKEN_EXPIRES_IN || '24h',
    adminApiKey: process.env.ADMIN_API_KEY || 'dev-admin-key',
  },
  
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
    fromEmail: process.env.FROM_EMAIL || 'noreply@castquest.xyz',
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  blockchain: {
    rpcUrl: process.env.RPC_URL_BASE || 'https://mainnet.base.org',
    rpcUrlTestnet: process.env.RPC_URL_BASE_SEPOLIA || 'https://sepolia.base.org',
    chainId: parseInt(process.env.CHAIN_ID || '8453', 10),
    
    contracts: {
      castToken: process.env.CAST_TOKEN_ADDRESS || '',
      mediaTokenFactory: process.env.MEDIA_TOKEN_FACTORY_ADDRESS || '',
      marketplace: process.env.MARKETPLACE_ADDRESS || '',
    },
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
} as const;

export type Config = typeof config;

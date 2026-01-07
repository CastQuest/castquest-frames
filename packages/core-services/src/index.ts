/**
 * CastQuest Core Services
 * 
 * Shared domain models, APIs, and onchain event ingestion for the CastQuest platform.
 * 
 * @packageDocumentation
 */

// Export all types
export * from './types';

// Export database schema (for migrations in other packages)
export * as schema from './lib/db/schema';

// Export database utilities
export { checkDatabaseHealth, closeDatabase, db } from './lib/db';

// Export configuration
export { config } from './lib/config';

// Export logger
export { logger } from './lib/logger';

// Export middleware
export { authenticateAdmin, authenticateJWT, optionalAuth } from './lib/middleware/auth';

// Export services (for direct usage in other packages)
export { MarketsService } from './modules/markets/service';
export { MediaService } from './modules/media/service';
export { RiskService } from './modules/risk/service';
export { UserService } from './modules/users/service';
export { WalletService } from './modules/wallets/service';


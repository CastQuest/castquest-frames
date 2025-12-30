import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { config } from '../config';
import { logger } from '../logger';
import * as schema from './schema';

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: config.database.url,
  max: config.database.poolSize,
});

// Test connection
pool.on('connect', () => {
  logger.info('Database connection established');
});

pool.on('error', (err) => {
  logger.error('Database connection error:', err);
});

// Create Drizzle ORM instance
export const db = drizzle(pool, { schema, logger: config.env === 'development' });

// Helper to close database connections
export const closeDatabase = async () => {
  await pool.end();
  logger.info('Database connections closed');
};

// Health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
};

import { sql } from 'drizzle-orm';
import { logger } from '../logger';
import { db } from './index';
import { runMigrations } from './migrate';
import { seedDatabase } from './seed';

/**
 * Reset database - Drop all tables, run migrations, and seed
 */
async function resetDatabase() {
  logger.info('⚠️  Resetting database...');
  
  try {
    // Drop all tables
    await db.execute(sql`DROP SCHEMA public CASCADE`);
    await db.execute(sql`CREATE SCHEMA public`);
    logger.info('✅ Dropped all tables');
    
    // Run migrations
    await runMigrations();
    
    // Seed database
    await seedDatabase();
    
    logger.info('✅ Database reset completed successfully');
    
  } catch (error) {
    logger.error('❌ Reset failed:', error);
    throw error;
  }
}

// Run reset if executed directly
if (require.main === module) {
  resetDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error('Reset error:', error);
      process.exit(1);
    });
}

export { resetDatabase };

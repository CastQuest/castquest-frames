import bcrypt from 'bcrypt';
import { logger } from '../logger';
import { db } from './index';
import { mediaMetadata, users, wallets } from './schema';

/**
 * Seed database with test data
 */
async function seedDatabase() {
  logger.info('Starting database seeding...');
  
  try {
    // Create test users
    const passwordHash = await bcrypt.hash('password123', 10);
    
    const [testUser1] = await db.insert(users).values({
      email: 'alice@example.com',
      passwordHash,
      emailVerified: true,
      status: 'active',
    }).returning();
    
    const [testUser2] = await db.insert(users).values({
      email: 'bob@example.com',
      passwordHash,
      emailVerified: true,
      status: 'active',
    }).returning();
    
    logger.info(`✅ Created ${2} test users`);
    
    // Create test wallets
    await db.insert(wallets).values([
      {
        userId: testUser1.id,
        address: '0x1234567890123456789012345678901234567890',
        type: 'eoa',
        label: 'Main Wallet',
        isPrimary: true,
      },
      {
        userId: testUser2.id,
        address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        type: 'smart_wallet',
        label: 'Smart Wallet',
        isPrimary: true,
      },
    ]);
    
    logger.info(`✅ Created test wallets`);
    
    // Create test media
    await db.insert(mediaMetadata).values([
      {
        mediaId: 'media_001',
        tokenAddress: '0x1111111111111111111111111111111111111111',
        ownerAddress: '0x1234567890123456789012345678901234567890',
        creatorUserId: testUser1.id,
        ticker: 'PIC',
        name: 'Epic Sunset',
        description: 'A beautiful sunset over the ocean',
        mediaType: 'image',
        mediaUrl: 'https://example.com/sunset.jpg',
        thumbnailUrl: 'https://example.com/sunset_thumb.jpg',
        metadataUri: 'ipfs://QmExample1',
        status: 'active',
        riskScore: 0,
        riskFlags: [],
        currentPrice: '1000000000000000000', // 1 ETH
        totalSupply: '1000000000000000000000', // 1000 tokens
        blockNumber: BigInt(12345678),
        transactionHash: '0xabc123',
      },
      {
        mediaId: 'media_002',
        tokenAddress: '0x2222222222222222222222222222222222222222',
        ownerAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        creatorUserId: testUser2.id,
        ticker: 'VID',
        name: 'Cool Video',
        description: 'An awesome video clip',
        mediaType: 'video',
        mediaUrl: 'https://example.com/video.mp4',
        thumbnailUrl: 'https://example.com/video_thumb.jpg',
        metadataUri: 'ipfs://QmExample2',
        status: 'active',
        riskScore: 0,
        riskFlags: [],
        currentPrice: '500000000000000000', // 0.5 ETH
        totalSupply: '500000000000000000000', // 500 tokens
        blockNumber: BigInt(12345679),
        transactionHash: '0xdef456',
      },
    ]);
    
    logger.info(`✅ Created test media`);
    logger.info('✅ Database seeding completed successfully');
    
  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run seeding if executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error('Seed error:', error);
      process.exit(1);
    });
}

export { seedDatabase };

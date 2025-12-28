import { db } from '@/lib/db';
import { wallets } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { logger } from '@/lib/logger';

export class WalletService {
  /**
   * Add a new wallet for a user
   */
  async addWallet(params: {
    userId: string;
    address: string;
    type: 'eoa' | 'smart_wallet' | 'multisig';
    label?: string;
    isPrimary?: boolean;
  }) {
    // Check if wallet already exists
    const existing = await db.query.wallets.findFirst({
      where: eq(wallets.address, params.address.toLowerCase()),
    });
    
    if (existing) {
      throw new Error('Wallet address already registered');
    }
    
    // If setting as primary, unset other primary wallets
    if (params.isPrimary) {
      await db.update(wallets)
        .set({ isPrimary: false })
        .where(eq(wallets.userId, params.userId));
    }
    
    // Create wallet
    const [wallet] = await db.insert(wallets).values({
      userId: params.userId,
      address: params.address.toLowerCase(),
      type: params.type,
      label: params.label,
      isPrimary: params.isPrimary ?? false,
      lastUsedAt: new Date(),
    }).returning();
    
    logger.info(`Wallet added: ${wallet.id} for user: ${params.userId}`);
    
    return wallet;
  }
  
  /**
   * Get all wallets for a user
   */
  async getWalletsByUserId(userId: string) {
    return await db.query.wallets.findMany({
      where: eq(wallets.userId, userId),
      orderBy: (wallets, { desc }) => [desc(wallets.isPrimary), desc(wallets.createdAt)],
    });
  }
  
  /**
   * Get wallet by address
   */
  async getWalletByAddress(address: string) {
    return await db.query.wallets.findFirst({
      where: eq(wallets.address, address.toLowerCase()),
    });
  }
  
  /**
   * Get user ID by wallet address
   */
  async getUserIdByAddress(address: string): Promise<string | null> {
    const wallet = await this.getWalletByAddress(address);
    return wallet?.userId ?? null;
  }
  
  /**
   * Set a wallet as primary
   */
  async setPrimaryWallet(walletId: string) {
    const wallet = await db.query.wallets.findFirst({
      where: eq(wallets.id, walletId),
    });
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    
    // Unset all primary wallets for this user
    await db.update(wallets)
      .set({ isPrimary: false })
      .where(eq(wallets.userId, wallet.userId));
    
    // Set this wallet as primary
    await db.update(wallets)
      .set({ isPrimary: true })
      .where(eq(wallets.id, walletId));
    
    logger.info(`Primary wallet set: ${walletId}`);
  }
  
  /**
   * Update wallet last used timestamp
   */
  async updateLastUsed(address: string) {
    await db.update(wallets)
      .set({ lastUsedAt: new Date() })
      .where(eq(wallets.address, address.toLowerCase()));
  }
  
  /**
   * Delete a wallet
   */
  async deleteWallet(walletId: string) {
    await db.delete(wallets).where(eq(wallets.id, walletId));
    logger.info(`Wallet deleted: ${walletId}`);
  }
}

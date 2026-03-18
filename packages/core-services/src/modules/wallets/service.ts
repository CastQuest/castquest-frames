import { db } from '@/lib/db';
import { wallets } from '@/lib/db/schema';
import type { Wallet } from '@/lib/db/schema';
import { logger } from '@/lib/logger';
import { eq } from 'drizzle-orm';

export class WalletService {
  /**
   * Add a new wallet for a user.
   *
   * Overload 1 – positional args (used by tests and simple callers):
   *   addWallet(userId, address, type, label?, isPrimary?)
   *
   * Overload 2 – options object (preferred for new code):
   *   addWallet({ userId, address, type, label?, isPrimary? })
   */
  async addWallet(
    userId: string,
    address: string,
    type: 'eoa' | 'smart_wallet' | 'multisig',
    label?: string,
    isPrimary?: boolean,
  ): Promise<Wallet>;
  async addWallet(params: {
    userId: string;
    address: string;
    type: 'eoa' | 'smart_wallet' | 'multisig';
    label?: string;
    isPrimary?: boolean;
  }): Promise<Wallet>;
  async addWallet(
    userIdOrParams: string | {
      userId: string;
      address: string;
      type: 'eoa' | 'smart_wallet' | 'multisig';
      label?: string;
      isPrimary?: boolean;
    },
    address?: string,
    type?: 'eoa' | 'smart_wallet' | 'multisig',
    label?: string,
    isPrimary?: boolean,
  ): Promise<Wallet> {
    if (typeof userIdOrParams === 'string') {
      if (!address) throw new Error('address is required');
      if (!type) throw new Error('type is required');
      return this._addWalletImpl({ userId: userIdOrParams, address, type, label, isPrimary });
    }
    return this._addWalletImpl(userIdOrParams);
  }

  private async _addWalletImpl(params: {
    userId: string;
    address: string;
    type: 'eoa' | 'smart_wallet' | 'multisig';
    label?: string;
    isPrimary?: boolean;
  }): Promise<Wallet> {
    const existing = await db.query.wallets.findFirst({
      where: eq(wallets.address, params.address.toLowerCase()),
    });
    
    if (existing) {
      throw new Error('Wallet already exists');
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
   * Alias for getWalletsByUserId
   */
  async getUserWallets(userId: string) {
    return this.getWalletsByUserId(userId);
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

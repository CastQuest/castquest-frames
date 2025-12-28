import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '../src/lib/db';
import { WalletService } from '../src/modules/wallets/service';

vi.mock('../src/lib/db', () => ({
  db: {
    query: {
      wallets: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../src/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('WalletService', () => {
  let walletService: WalletService;

  beforeEach(() => {
    walletService = new WalletService();
    vi.clearAllMocks();
  });

  describe('addWallet', () => {
    it('should add a new wallet to user account', async () => {
      const mockWallet = {
        id: 'wallet-123',
        userId: 'user-123',
        address: '0x1234567890123456789012345678901234567890',
        type: 'eoa',
        label: 'Main Wallet',
        isPrimary: false,
        createdAt: new Date(),
      };

      vi.mocked(db.query.wallets.findFirst).mockResolvedValue(null);
      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockWallet]),
        }),
      } as any);

      const result = await walletService.addWallet(
        'user-123',
        '0x1234567890123456789012345678901234567890',
        'eoa',
        'Main Wallet'
      );

      expect(result).toBeDefined();
      expect(result.address).toBe('0x1234567890123456789012345678901234567890');
    });

    it('should throw error if wallet already exists', async () => {
      vi.mocked(db.query.wallets.findFirst).mockResolvedValue({
        id: 'existing-wallet',
        address: '0x1234567890123456789012345678901234567890',
      } as any);

      await expect(
        walletService.addWallet(
          'user-123',
          '0x1234567890123456789012345678901234567890',
          'eoa',
          'Main Wallet'
        )
      ).rejects.toThrow('Wallet already exists');
    });
  });

  describe('getUserWallets', () => {
    it('should return all wallets for a user', async () => {
      const mockWallets = [
        {
          id: 'wallet-1',
          userId: 'user-123',
          address: '0x1111111111111111111111111111111111111111',
          type: 'eoa',
          isPrimary: true,
        },
        {
          id: 'wallet-2',
          userId: 'user-123',
          address: '0x2222222222222222222222222222222222222222',
          type: 'smart_wallet',
          isPrimary: false,
        },
      ];

      vi.mocked(db.query.wallets.findMany).mockResolvedValue(mockWallets as any);

      const result = await walletService.getUserWallets('user-123');

      expect(result).toHaveLength(2);
      expect(result[0].address).toBe('0x1111111111111111111111111111111111111111');
    });
  });
});

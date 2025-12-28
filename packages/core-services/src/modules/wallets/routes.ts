import { Router, Request, Response } from 'express';
import { WalletService } from './service';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const router = Router();
const walletService = new WalletService();

// ============================================================================
// Validation Schemas
// ============================================================================

const addWalletSchema = z.object({
  userId: z.string().uuid(),
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  type: z.enum(['eoa', 'smart_wallet', 'multisig']),
  label: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

// ============================================================================
// Routes
// ============================================================================

/**
 * POST /api/v1/wallets
 * Add a new wallet for a user
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = addWalletSchema.parse(req.body);
    
    const wallet = await walletService.addWallet(body);
    
    res.status(201).json({
      success: true,
      data: { wallet },
    });
  } catch (error: any) {
    logger.error('Add wallet error:', error);
    res.status(400).json({
      success: false,
      error: {
        code: 'ADD_WALLET_FAILED',
        message: error.message || 'Failed to add wallet',
      },
    });
  }
});

/**
 * GET /api/v1/wallets/user/:userId
 * Get all wallets for a user
 */
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const wallets = await walletService.getWalletsByUserId(req.params.userId);
    
    res.json({
      success: true,
      data: { wallets },
    });
  } catch (error: any) {
    logger.error('Get wallets error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve wallets',
      },
    });
  }
});

/**
 * GET /api/v1/wallets/address/:address
 * Get wallet by address
 */
router.get('/address/:address', async (req: Request, res: Response) => {
  try {
    const wallet = await walletService.getWalletByAddress(req.params.address);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'WALLET_NOT_FOUND',
          message: 'Wallet not found',
        },
      });
    }
    
    res.json({
      success: true,
      data: { wallet },
    });
  } catch (error: any) {
    logger.error('Get wallet error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve wallet',
      },
    });
  }
});

/**
 * PUT /api/v1/wallets/:id/primary
 * Set wallet as primary
 */
router.put('/:id/primary', async (req: Request, res: Response) => {
  try {
    await walletService.setPrimaryWallet(req.params.id);
    
    res.json({
      success: true,
      data: { message: 'Primary wallet updated' },
    });
  } catch (error: any) {
    logger.error('Set primary wallet error:', error);
    res.status(400).json({
      success: false,
      error: {
        code: 'UPDATE_FAILED',
        message: error.message || 'Failed to update primary wallet',
      },
    });
  }
});

export { router as walletRoutes };

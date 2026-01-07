import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { MarketsService } from './service';
import { MarketStatus } from '../../types';

export const marketRoutes: Router = Router();
const marketsService = new MarketsService();

// Validation schemas
const upsertMarketSchema = z.object({
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  currentPrice: z.string(),
  priceChangePercent24h: z.number(),
  volume24h: z.string(),
  trades24h: z.number().int().nonnegative(),
  holderCount: z.number().int().nonnegative(),
  status: z.enum(['green', 'red', 'neutral']),
});

const recordTradeSchema = z.object({
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  buyer: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  seller: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  type: z.enum(['buy', 'sell']),
  amount: z.string(),
  price: z.string(),
  totalValue: z.string(),
  protocolFee: z.string(),
  transactionHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  blockNumber: z.string().transform(BigInt),
});

// GET /api/v1/markets/trending - Get trending tokens
marketRoutes.get('/trending', async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;

    const trending = await marketsService.getTrending(
      limit ? parseInt(limit as string) : undefined
    );

    res.json({
      success: true,
      data: trending,
      count: trending.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/v1/markets/gainers - Get top gainers
marketRoutes.get('/gainers', async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;

    const gainers = await marketsService.getTopGainers(
      limit ? parseInt(limit as string) : undefined
    );

    res.json({
      success: true,
      data: gainers,
      count: gainers.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/v1/markets/losers - Get top losers
marketRoutes.get('/losers', async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;

    const losers = await marketsService.getTopLosers(
      limit ? parseInt(limit as string) : undefined
    );

    res.json({
      success: true,
      data: losers,
      count: losers.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/v1/markets/recent-trades - Get recent trades
marketRoutes.get('/recent-trades', async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;

    const trades = await marketsService.getRecentTrades(
      limit ? parseInt(limit as string) : undefined
    );

    res.json({
      success: true,
      data: trades,
      count: trades.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/v1/markets/:tokenAddress - Get market signal for token
marketRoutes.get('/:tokenAddress', async (req: Request, res: Response) => {
  try {
    const { tokenAddress } = req.params;

    const signal = await marketsService.getMarketSignal(tokenAddress);

    if (!signal) {
      return res.status(404).json({
        success: false,
        error: 'Market data not found',
      });
    }

    res.json({
      success: true,
      data: signal,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/v1/markets/:tokenAddress/price-history - Get price history
marketRoutes.get('/:tokenAddress/price-history', async (req: Request, res: Response) => {
  try {
    const { tokenAddress } = req.params;
    const { startTime, endTime, limit } = req.query;

    const history = await marketsService.getPriceHistory(
      tokenAddress,
      startTime ? new Date(startTime as string) : undefined,
      endTime ? new Date(endTime as string) : undefined,
      limit ? parseInt(limit as string) : undefined
    );

    res.json({
      success: true,
      data: history,
      count: history.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/v1/markets/:tokenAddress/trades - Get trade history
marketRoutes.get('/:tokenAddress/trades', async (req: Request, res: Response) => {
  try {
    const { tokenAddress } = req.params;
    const { limit, offset } = req.query;

    const trades = await marketsService.getTradeHistory(
      tokenAddress,
      limit ? parseInt(limit as string) : undefined,
      offset ? parseInt(offset as string) : undefined
    );

    res.json({
      success: true,
      data: trades,
      count: trades.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/v1/markets/:tokenAddress/stats - Get trade statistics
marketRoutes.get('/:tokenAddress/stats', async (req: Request, res: Response) => {
  try {
    const { tokenAddress } = req.params;

    const stats = await marketsService.getTradeStats(tokenAddress);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/v1/markets/sync - Sync market data (admin/worker)
marketRoutes.post('/sync', async (req: Request, res: Response) => {
  try {
    const validated = upsertMarketSchema.parse(req.body);

    const signal = await marketsService.upsertMarketSignal({
      ...validated,
      status: validated.status as MarketStatus,
    });

    res.json({
      success: true,
      data: signal,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/v1/markets/trades - Record trade (admin/worker)
marketRoutes.post('/trades', async (req: Request, res: Response) => {
  try {
    const validated = recordTradeSchema.parse(req.body);

    const trade = await marketsService.recordTrade(validated);

    res.status(201).json({
      success: true,
      data: trade,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

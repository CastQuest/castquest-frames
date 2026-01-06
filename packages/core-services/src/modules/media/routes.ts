import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { MediaService } from './service';
import { MediaType, TokenStatus } from '../../types';

export const mediaRoutes: Router = Router();
const mediaService = new MediaService();

// Validation schemas
const createMediaSchema = z.object({
  mediaId: z.string(),
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  ownerAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  ticker: z.string().min(1).max(20),
  name: z.string().min(1).max(200),
  description: z.string().max(2000),
  mediaType: z.enum(['image', 'video', 'audio', 'text']),
  mediaUrl: z.string().url(),
  metadataUri: z.string().url(),
  blockNumber: z.string().transform(BigInt),
  transactionHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
});

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'active', 'flagged', 'banned']),
  riskFlags: z.array(z.string()).optional(),
});

// GET /api/v1/media - List all media tokens
mediaRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const { status, mediaType, limit, offset } = req.query;

    const media = await mediaService.list({
      status: status as any,
      mediaType: mediaType as any,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });

    res.json({
      success: true,
      data: media,
      count: media.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/v1/media/search - Search media tokens
mediaRoutes.get('/search', async (req: Request, res: Response) => {
  try {
    const { q, limit, offset } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required',
      });
    }

    const results = await mediaService.search(
      q as string,
      limit ? parseInt(limit as string) : undefined,
      offset ? parseInt(offset as string) : undefined
    );

    res.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/v1/media/flagged - Get flagged media
mediaRoutes.get('/flagged', async (req: Request, res: Response) => {
  try {
    const { limit, offset } = req.query;

    const flagged = await mediaService.getFlagged(
      limit ? parseInt(limit as string) : undefined,
      offset ? parseInt(offset as string) : undefined
    );

    res.json({
      success: true,
      data: flagged,
      count: flagged.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/v1/media/stats - Get media statistics
mediaRoutes.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await mediaService.getCountByStatus();

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

// GET /api/v1/media/:tokenAddress - Get media token details
mediaRoutes.get('/:tokenAddress', async (req: Request, res: Response) => {
  try {
    const { tokenAddress } = req.params;

    const media = await mediaService.getByTokenAddress(tokenAddress);

    if (!media) {
      return res.status(404).json({
        success: false,
        error: 'Media not found',
      });
    }

    res.json({
      success: true,
      data: media,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/v1/media - Create media metadata (admin)
mediaRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const validated = createMediaSchema.parse(req.body);

    const media = await mediaService.createMedia({
      ...validated,
      mediaType: validated.mediaType as MediaType,
    });

    res.status(201).json({
      success: true,
      data: media,
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

// PUT /api/v1/media/:tokenAddress/status - Update media status (admin)
mediaRoutes.put('/:tokenAddress/status', async (req: Request, res: Response) => {
  try {
    const { tokenAddress } = req.params;
    const validated = updateStatusSchema.parse(req.body);

    const media = await mediaService.updateStatus(
      tokenAddress,
      validated.status as TokenStatus,
      validated.riskFlags
    );

    if (!media) {
      return res.status(404).json({
        success: false,
        error: 'Media not found',
      });
    }

    res.json({
      success: true,
      data: media,
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

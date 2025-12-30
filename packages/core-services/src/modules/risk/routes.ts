import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { RiskService } from './service';

export const riskRoutes = Router();
const riskService = new RiskService();

// Validation schemas
const assessRiskSchema = z.object({
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  riskScore: z.number().min(0).max(100),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
  factors: z.record(z.any()),
  recommendations: z.array(z.string()),
  assessedBy: z.string(),
});

const calculateRiskSchema = z.object({
  hasRugPullIndicators: z.boolean().optional(),
  hasHighConcentration: z.boolean().optional(),
  hasLowLiquidity: z.boolean().optional(),
  hasUnverifiedContract: z.boolean().optional(),
  hasSuspiciousActivity: z.boolean().optional(),
  holderConcentration: z.number().min(0).max(100).optional(),
  liquidityRatio: z.number().min(0).max(100).optional(),
  contractAge: z.number().nonnegative().optional(),
  tradingVolume24h: z.number().nonnegative().optional(),
});

// GET /api/v1/risk/stats - Get risk statistics
riskRoutes.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await riskService.getRiskStats();

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

// GET /api/v1/risk/flagged - Get flagged tokens
riskRoutes.get('/flagged', async (req: Request, res: Response) => {
  try {
    const { limit, offset } = req.query;

    const flagged = await riskService.getFlaggedTokens(
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

// GET /api/v1/risk/banned - Get banned tokens
riskRoutes.get('/banned', async (req: Request, res: Response) => {
  try {
    const { limit, offset } = req.query;

    const banned = await riskService.getBannedTokens(
      limit ? parseInt(limit as string) : undefined,
      offset ? parseInt(offset as string) : undefined
    );

    res.json({
      success: true,
      data: banned,
      count: banned.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/v1/risk/high-risk - Get high-risk tokens
riskRoutes.get('/high-risk', async (req: Request, res: Response) => {
  try {
    const { limit, offset } = req.query;

    const highRisk = await riskService.getHighRiskTokens(
      limit ? parseInt(limit as string) : undefined,
      offset ? parseInt(offset as string) : undefined
    );

    res.json({
      success: true,
      data: highRisk,
      count: highRisk.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/v1/risk/level/:level - Get tokens by risk level
riskRoutes.get('/level/:level', async (req: Request, res: Response) => {
  try {
    const { level } = req.params;
    const { limit, offset } = req.query;

    if (!['low', 'medium', 'high', 'critical'].includes(level)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid risk level. Must be: low, medium, high, or critical',
      });
    }

    const tokens = await riskService.getByRiskLevel(
      level as any,
      limit ? parseInt(limit as string) : undefined,
      offset ? parseInt(offset as string) : undefined
    );

    res.json({
      success: true,
      data: tokens,
      count: tokens.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/v1/risk/:tokenAddress - Get risk assessment
riskRoutes.get('/:tokenAddress', async (req: Request, res: Response) => {
  try {
    const { tokenAddress } = req.params;

    const assessment = await riskService.getLatestAssessment(tokenAddress);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Risk assessment not found',
      });
    }

    res.json({
      success: true,
      data: assessment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/v1/risk/:tokenAddress/history - Get assessment history
riskRoutes.get('/:tokenAddress/history', async (req: Request, res: Response) => {
  try {
    const { tokenAddress } = req.params;
    const { limit, offset } = req.query;

    const history = await riskService.getAssessmentHistory(
      tokenAddress,
      limit ? parseInt(limit as string) : undefined,
      offset ? parseInt(offset as string) : undefined
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

// POST /api/v1/risk/assess - Create risk assessment (admin)
riskRoutes.post('/assess', async (req: Request, res: Response) => {
  try {
    const validated = assessRiskSchema.parse(req.body);

    const assessment = await riskService.assessRisk(validated);

    res.status(201).json({
      success: true,
      data: assessment,
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

// POST /api/v1/risk/calculate - Calculate automated risk score
riskRoutes.post('/calculate', async (req: Request, res: Response) => {
  try {
    const validated = calculateRiskSchema.parse(req.body);

    const result = riskService.calculateRiskScore(validated);

    res.json({
      success: true,
      data: result,
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

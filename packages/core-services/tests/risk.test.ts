import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '../src/lib/db';
import { RiskService } from '../src/modules/risk/service';

// Mock database
vi.mock('../src/lib/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('../src/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('RiskService', () => {
  let riskService: RiskService;

  beforeEach(() => {
    riskService = new RiskService();
    vi.clearAllMocks();
  });

  describe('assessRisk', () => {
    it('should create a risk assessment with all required fields', async () => {
      const mockAssessment = {
        id: 'risk-123',
        tokenAddress: '0x1234567890123456789012345678901234567890',
        riskScore: 75,
        riskLevel: 'high',
        confidence: 85,
        flags: ['SUSPICIOUS_VOLUME', 'LOW_LIQUIDITY'],
        reasons: ['SUSPICIOUS_VOLUME', 'LOW_LIQUIDITY'],
        assessedBy: 'ai',
        assessedAt: new Date(),
      };

      // Mock insert
      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockAssessment]),
        }),
      } as any);

      // Mock update
      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      } as any);

      const result = await riskService.assessRisk({
        tokenAddress: '0x1234567890123456789012345678901234567890',
        riskScore: 75,
        riskLevel: 'high',
        factors: { hasLowLiquidity: true },
        recommendations: ['SUSPICIOUS_VOLUME', 'LOW_LIQUIDITY'],
        assessedBy: 'ai',
      });

      expect(result).toBeDefined();
      expect(result.tokenAddress).toBe('0x1234567890123456789012345678901234567890');
      expect(result.riskScore).toBe(75);
      expect(result.riskLevel).toBe('high');
      expect(result.confidence).toBe(85);
      expect(result.flags).toEqual(['SUSPICIOUS_VOLUME', 'LOW_LIQUIDITY']);
    });
  });

  describe('calculateRiskScore', () => {
    it('should calculate risk score correctly', () => {
      const result = riskService.calculateRiskScore({
        hasRugPullIndicators: true,
        hasHighConcentration: true,
        hasLowLiquidity: true,
      });

      expect(result.score).toBeGreaterThan(0);
      expect(result.level).toBeDefined();
      expect(['low', 'medium', 'high', 'critical']).toContain(result.level);
      expect(result.reasons).toBeInstanceOf(Array);
    });

    it('should return critical level for high-risk tokens', () => {
      const result = riskService.calculateRiskScore({
        hasRugPullIndicators: true,
        hasHighConcentration: true,
        hasLowLiquidity: true,
        hasSuspiciousActivity: true,
      });

      expect(result.score).toBeGreaterThanOrEqual(80);
      expect(result.level).toBe('critical');
    });

    it('should return low level for low-risk tokens', () => {
      const result = riskService.calculateRiskScore({
        contractAge: 365,
        tradingVolume24h: 50000,
      });

      expect(result.score).toBeLessThan(30);
      expect(result.level).toBe('low');
    });
  });

  describe('getLatestAssessment', () => {
    it('should return latest assessment for token', async () => {
      const mockAssessment = {
        id: 'risk-123',
        tokenAddress: '0x1234567890123456789012345678901234567890',
        riskScore: 50,
        riskLevel: 'medium',
        confidence: 80,
        flags: ['LOW_LIQUIDITY'],
        reasons: ['LOW_LIQUIDITY'],
        assessedBy: 'ai',
        assessedAt: new Date(),
      };

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([mockAssessment]),
            }),
          }),
        }),
      } as any);

      const result = await riskService.getLatestAssessment(
        '0x1234567890123456789012345678901234567890'
      );

      expect(result).toBeDefined();
      expect(result?.tokenAddress).toBe('0x1234567890123456789012345678901234567890');
      expect(result?.riskLevel).toBe('medium');
    });

    it('should return null if no assessment exists', async () => {
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([]),
            }),
          }),
        }),
      } as any);

      const result = await riskService.getLatestAssessment(
        '0x9999999999999999999999999999999999999999'
      );

      expect(result).toBeNull();
    });
  });
});

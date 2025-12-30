import { desc, eq, gte, sql } from 'drizzle-orm';
import { db } from '../../lib/db';
import { mediaMetadata, riskAssessments } from '../../lib/db/schema';
import { RiskAssessment } from '../../types';

export class RiskService {
  /**
   * Create or update risk assessment
   */
  async assessRisk(data: {
    tokenAddress: string;
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    factors: Record<string, any>;
    recommendations: string[];
    assessedBy: string;
  }): Promise<RiskAssessment> {
    const [assessment] = await db
      .insert(riskAssessments)
      .values({
        ...data,
        tokenAddress: data.tokenAddress.toLowerCase(),
        assessedAt: new Date(),
      })
      .returning();

    // Update media metadata risk score
    await db
      .update(mediaMetadata)
      .set({
        riskScore: data.riskScore,
        riskFlags: data.recommendations,
      })
      .where(eq(mediaMetadata.tokenAddress, data.tokenAddress.toLowerCase()));

    return assessment;
  }

  /**
   * Get latest risk assessment for token
   */
  async getLatestAssessment(tokenAddress: string): Promise<RiskAssessment | null> {
    const [assessment] = await db
      .select()
      .from(riskAssessments)
      .where(eq(riskAssessments.tokenAddress, tokenAddress.toLowerCase()))
      .orderBy(desc(riskAssessments.assessedAt))
      .limit(1);

    return assessment || null;
  }

  /**
   * Get all assessments for token
   */
  async getAssessmentHistory(
    tokenAddress: string,
    limit = 50,
    offset = 0
  ): Promise<RiskAssessment[]> {
    return db
      .select()
      .from(riskAssessments)
      .where(eq(riskAssessments.tokenAddress, tokenAddress.toLowerCase()))
      .orderBy(desc(riskAssessments.assessedAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Get high-risk tokens (risk score >= 70)
   */
  async getHighRiskTokens(limit = 50, offset = 0): Promise<RiskAssessment[]> {
    return db
      .select()
      .from(riskAssessments)
      .where(gte(riskAssessments.riskScore, 70))
      .orderBy(desc(riskAssessments.riskScore), desc(riskAssessments.assessedAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Get tokens by risk level
   */
  async getByRiskLevel(
    riskLevel: 'low' | 'medium' | 'high' | 'critical',
    limit = 50,
    offset = 0
  ): Promise<RiskAssessment[]> {
    return db
      .select()
      .from(riskAssessments)
      .where(eq(riskAssessments.riskLevel, riskLevel))
      .orderBy(desc(riskAssessments.assessedAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Get flagged tokens (from media metadata)
   */
  async getFlaggedTokens(limit = 50, offset = 0) {
    return db
      .select()
      .from(mediaMetadata)
      .where(eq(mediaMetadata.status, 'flagged'))
      .orderBy(desc(mediaMetadata.createdAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Get banned tokens (from media metadata)
   */
  async getBannedTokens(limit = 50, offset = 0) {
    return db
      .select()
      .from(mediaMetadata)
      .where(eq(mediaMetadata.status, 'banned'))
      .orderBy(desc(mediaMetadata.createdAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Calculate automated risk score based on factors
   */
  calculateRiskScore(factors: {
    hasRugPullIndicators?: boolean;
    hasHighConcentration?: boolean;
    hasLowLiquidity?: boolean;
    hasUnverifiedContract?: boolean;
    hasSuspiciousActivity?: boolean;
    holderConcentration?: number; // 0-100
    liquidityRatio?: number; // 0-100
    contractAge?: number; // days
    tradingVolume24h?: number;
  }): {
    score: number;
    level: 'low' | 'medium' | 'high' | 'critical';
    reasons: string[];
  } {
    let score = 0;
    const reasons: string[] = [];

    // Rug pull indicators (+40 points)
    if (factors.hasRugPullIndicators) {
      score += 40;
      reasons.push('Rug pull indicators detected');
    }

    // High holder concentration (+25 points)
    if (factors.hasHighConcentration || (factors.holderConcentration && factors.holderConcentration > 80)) {
      score += 25;
      reasons.push('High holder concentration');
    }

    // Low liquidity (+20 points)
    if (factors.hasLowLiquidity || (factors.liquidityRatio && factors.liquidityRatio < 20)) {
      score += 20;
      reasons.push('Low liquidity');
    }

    // Unverified contract (+15 points)
    if (factors.hasUnverifiedContract) {
      score += 15;
      reasons.push('Contract not verified');
    }

    // Suspicious activity (+30 points)
    if (factors.hasSuspiciousActivity) {
      score += 30;
      reasons.push('Suspicious trading patterns detected');
    }

    // New contract (+10 points if < 7 days old)
    if (factors.contractAge !== undefined && factors.contractAge < 7) {
      score += 10;
      reasons.push('Very new contract');
    }

    // Low trading volume (+15 points)
    if (factors.tradingVolume24h !== undefined && factors.tradingVolume24h < 1000) {
      score += 15;
      reasons.push('Low trading volume');
    }

    // Cap at 100
    score = Math.min(score, 100);

    // Determine level
    let level: 'low' | 'medium' | 'high' | 'critical';
    if (score >= 80) {
      level = 'critical';
    } else if (score >= 60) {
      level = 'high';
    } else if (score >= 30) {
      level = 'medium';
    } else {
      level = 'low';
    }

    return { score, level, reasons };
  }

  /**
   * Get risk statistics
   */
  async getRiskStats(): Promise<{
    totalAssessments: number;
    byLevel: Record<'low' | 'medium' | 'high' | 'critical', number>;
    averageRiskScore: number;
    flaggedCount: number;
    bannedCount: number;
  }> {
    // Get counts by risk level
    const levelCounts = await db
      .select({
        level: riskAssessments.riskLevel,
        count: sql<number>`count(*)::int`,
      })
      .from(riskAssessments)
      .groupBy(riskAssessments.riskLevel);

    const byLevel: any = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    levelCounts.forEach((row) => {
      byLevel[row.level] = row.count;
    });

    // Get average risk score
    const [avgScore] = await db
      .select({
        avg: sql<number>`avg(${riskAssessments.riskScore})::numeric(10,2)`,
      })
      .from(riskAssessments);

    // Get flagged/banned counts
    const [statusCounts] = await db
      .select({
        flagged: sql<number>`count(case when ${mediaMetadata.status} = 'flagged' then 1 end)::int`,
        banned: sql<number>`count(case when ${mediaMetadata.status} = 'banned' then 1 end)::int`,
      })
      .from(mediaMetadata);

    return {
      totalAssessments: Object.values(byLevel).reduce((a: number, b: number) => a + b, 0),
      byLevel,
      averageRiskScore: parseFloat(avgScore?.avg?.toString() || '0'),
      flaggedCount: statusCounts?.flagged || 0,
      bannedCount: statusCounts?.banned || 0,
    };
  }
}

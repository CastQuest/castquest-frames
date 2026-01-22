import { db } from '@/lib/db';
import { leaderboardEntries } from '@/lib/db/schema';
import { logger } from '@/lib/logger';
import { eq, and, desc, sql, count } from 'drizzle-orm';

export class LeaderboardService {
  /**
   * Update or create leaderboard entry for a user
   */
  async updateUserScore(
    userId: string,
    leaderboardType: string,
    period: string,
    scoreIncrement: number,
    stats?: string
  ) {
    // Try to find existing entry
    const existing = await db.query.leaderboardEntries.findFirst({
      where: and(
        eq(leaderboardEntries.userId, userId),
        eq(leaderboardEntries.leaderboardType, leaderboardType),
        eq(leaderboardEntries.period, period)
      ),
    });

    if (existing) {
      // Update existing entry
      const [updated] = await db.update(leaderboardEntries)
        .set({
          score: sql`${leaderboardEntries.score} + ${scoreIncrement}`,
          previousRank: existing.rank,
          stats,
          updatedAt: new Date(),
        })
        .where(eq(leaderboardEntries.id, existing.id))
        .returning();

      logger.info(`Leaderboard score updated for user: ${userId}, type: ${leaderboardType}`);
      
      // Recalculate ranks for this leaderboard
      await this.recalculateRanks(leaderboardType, period);
      
      return updated;
    } else {
      // Create new entry
      const [entry] = await db.insert(leaderboardEntries).values({
        userId,
        leaderboardType,
        period,
        score: scoreIncrement,
        stats,
      }).returning();

      logger.info(`New leaderboard entry created for user: ${userId}, type: ${leaderboardType}`);
      
      // Recalculate ranks
      await this.recalculateRanks(leaderboardType, period);
      
      return entry;
    }
  }

  /**
   * Recalculate ranks for a specific leaderboard
   */
  async recalculateRanks(leaderboardType: string, period: string) {
    // Get all entries for this leaderboard, ordered by score
    const entries = await db.query.leaderboardEntries.findMany({
      where: and(
        eq(leaderboardEntries.leaderboardType, leaderboardType),
        eq(leaderboardEntries.period, period)
      ),
      orderBy: [desc(leaderboardEntries.score)],
    });

    // Update ranks
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      await db.update(leaderboardEntries)
        .set({
          rank: i + 1,
          updatedAt: new Date(),
        })
        .where(eq(leaderboardEntries.id, entry.id));
    }

    logger.info(`Ranks recalculated for leaderboard: ${leaderboardType}, period: ${period}`);
  }

  /**
   * Get leaderboard with pagination
   */
  async getLeaderboard(
    leaderboardType: string,
    period: string,
    limit: number = 100,
    offset: number = 0
  ) {
    const entries = await db.query.leaderboardEntries.findMany({
      where: and(
        eq(leaderboardEntries.leaderboardType, leaderboardType),
        eq(leaderboardEntries.period, period)
      ),
      orderBy: [leaderboardEntries.rank], // Ascending order: rank 1 first
      limit,
      offset,
    });

    return entries;
  }

  /**
   * Get user's rank and position
   */
  async getUserRank(userId: string, leaderboardType: string, period: string) {
    const entry = await db.query.leaderboardEntries.findFirst({
      where: and(
        eq(leaderboardEntries.userId, userId),
        eq(leaderboardEntries.leaderboardType, leaderboardType),
        eq(leaderboardEntries.period, period)
      ),
    });

    if (!entry) {
      return null;
    }

    // Get total entries to calculate percentile
    const totalResult = await db
      .select({ count: count() })
      .from(leaderboardEntries)
      .where(
        and(
          eq(leaderboardEntries.leaderboardType, leaderboardType),
          eq(leaderboardEntries.period, period)
        )
      );
    const total = totalResult[0]?.count || 0;

    return {
      ...entry,
      totalParticipants: total,
      percentile: entry.rank && total ? ((total - entry.rank) / total) * 100 : 0,
    };
  }

  /**
   * Get top N users
   */
  async getTopUsers(leaderboardType: string, period: string, limit: number = 10) {
    return await this.getLeaderboard(leaderboardType, period, limit, 0);
  }

  /**
   * Get users around a specific rank
   */
  async getUsersAroundRank(
    leaderboardType: string,
    period: string,
    targetRank: number,
    range: number = 5
  ) {
    const entries = await db.query.leaderboardEntries.findMany({
      where: and(
        eq(leaderboardEntries.leaderboardType, leaderboardType),
        eq(leaderboardEntries.period, period),
        sql`${leaderboardEntries.rank} >= ${targetRank - range}`,
        sql`${leaderboardEntries.rank} <= ${targetRank + range}`
      ),
      orderBy: [leaderboardEntries.rank], // Ascending order for proper leaderboard display
    });

    return entries;
  }

  /**
   * Get global leaderboard (all-time)
   */
  async getGlobalLeaderboard(limit: number = 100, offset: number = 0) {
    return await this.getLeaderboard('global', 'all-time', limit, offset);
  }

  /**
   * Get weekly leaderboard
   */
  async getWeeklyLeaderboard(week: string, limit: number = 100, offset: number = 0) {
    // week format: 2024-W01
    return await this.getLeaderboard('global', week, limit, offset);
  }

  /**
   * Get monthly leaderboard
   */
  async getMonthlyLeaderboard(month: string, limit: number = 100, offset: number = 0) {
    // month format: 2024-01
    return await this.getLeaderboard('global', month, limit, offset);
  }

  /**
   * Get quest-specific leaderboard
   */
  async getQuestLeaderboard(questId: string, limit: number = 100, offset: number = 0) {
    return await this.getLeaderboard('quest', questId, limit, offset);
  }

  /**
   * Reset leaderboard for a period
   */
  async resetLeaderboard(leaderboardType: string, period: string) {
    await db.delete(leaderboardEntries)
      .where(
        and(
          eq(leaderboardEntries.leaderboardType, leaderboardType),
          eq(leaderboardEntries.period, period)
        )
      );

    logger.info(`Leaderboard reset: ${leaderboardType}, period: ${period}`);
  }

  /**
   * Get current week identifier
   */
  getCurrentWeek(): string {
    const now = new Date();
    const year = now.getFullYear();
    const weekNumber = this.getWeekNumber(now);
    return `${year}-W${String(weekNumber).padStart(2, '0')}`;
  }

  /**
   * Get current month identifier
   */
  getCurrentMonth(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return `${year}-${String(month).padStart(2, '0')}`;
  }

  /**
   * Helper: Get ISO week number
   */
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }
}

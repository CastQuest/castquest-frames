import { and, desc, eq, gte, lte, sql } from 'drizzle-orm';
import { db } from '../../lib/db';
import { marketSignals, pricePoints, trades } from '../../lib/db/schema';
import { MarketSignal, MarketStatus, PricePoint, Trade } from '../../types';

export class MarketsService {
  /**
   * Upsert market signal (create or update)
   */
  async upsertMarketSignal(data: {
    tokenAddress: string;
    currentPrice: string;
    priceChangePercent24h: number;
    volume24h: string;
    trades24h: number;
    holderCount: number;
    status: MarketStatus;
  }): Promise<MarketSignal> {
    const [signal] = await db
      .insert(marketSignals)
      .values({
        ...data,
        tokenAddress: data.tokenAddress.toLowerCase(),
        lastUpdated: new Date(),
      })
      .onConflictDoUpdate({
        target: marketSignals.tokenAddress,
        set: {
          ...data,
          lastUpdated: new Date(),
        },
      })
      .returning();

    return signal;
  }

  /**
   * Get market signal for token
   */
  async getMarketSignal(tokenAddress: string): Promise<MarketSignal | null> {
    const [signal] = await db
      .select()
      .from(marketSignals)
      .where(eq(marketSignals.tokenAddress, tokenAddress.toLowerCase()));

    return signal || null;
  }

  /**
   * Get trending tokens (top by volume)
   */
  async getTrending(limit = 20): Promise<MarketSignal[]> {
    return db
      .select()
      .from(marketSignals)
      .orderBy(desc(sql`CAST(${marketSignals.volume24h} AS NUMERIC)`))
      .limit(limit);
  }

  /**
   * Get top gainers (24h price change)
   */
  async getTopGainers(limit = 20): Promise<MarketSignal[]> {
    return db
      .select()
      .from(marketSignals)
      .where(sql`${marketSignals.priceChangePercent24h} > 0`)
      .orderBy(desc(marketSignals.priceChangePercent24h))
      .limit(limit);
  }

  /**
   * Get top losers (24h price change)
   */
  async getTopLosers(limit = 20): Promise<MarketSignal[]> {
    return db
      .select()
      .from(marketSignals)
      .where(sql`${marketSignals.priceChangePercent24h} < 0`)
      .orderBy(marketSignals.priceChangePercent24h)
      .limit(limit);
  }

  /**
   * Record price point
   */
  async recordPricePoint(data: {
    tokenAddress: string;
    price: string;
    volume: string;
    marketCap: string;
    holders: number;
  }): Promise<PricePoint> {
    const [point] = await db
      .insert(pricePoints)
      .values({
        ...data,
        tokenAddress: data.tokenAddress.toLowerCase(),
        timestamp: new Date(),
      })
      .returning();

    return point;
  }

  /**
   * Get price history for token
   */
  async getPriceHistory(
    tokenAddress: string,
    startTime?: Date,
    endTime?: Date,
    limit = 1000
  ): Promise<PricePoint[]> {
    let query = db
      .select()
      .from(pricePoints)
      .where(eq(pricePoints.tokenAddress, tokenAddress.toLowerCase()));

    if (startTime) {
      query = query.where(gte(pricePoints.timestamp, startTime)) as any;
    }

    if (endTime) {
      query = query.where(lte(pricePoints.timestamp, endTime)) as any;
    }

    return query
      .orderBy(desc(pricePoints.timestamp))
      .limit(limit);
  }

  /**
   * Record trade
   */
  async recordTrade(data: {
    tokenAddress: string;
    traderAddress: string;
    tradeType: 'buy' | 'sell';
    amount: string;
    price: string;
    totalValue: string;
    transactionHash: string;
    blockNumber: bigint;
  }): Promise<Trade> {
    const [trade] = await db
      .insert(trades)
      .values({
        ...data,
        tokenAddress: data.tokenAddress.toLowerCase(),
        traderAddress: data.traderAddress.toLowerCase(),
        timestamp: new Date(),
      })
      .returning();

    return trade;
  }

  /**
   * Get trades for token
   */
  async getTradeHistory(
    tokenAddress: string,
    limit = 100,
    offset = 0
  ): Promise<Trade[]> {
    return db
      .select()
      .from(trades)
      .where(eq(trades.tokenAddress, tokenAddress.toLowerCase()))
      .orderBy(desc(trades.timestamp))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Get trades by trader
   */
  async getTradesByTrader(
    traderAddress: string,
    limit = 100,
    offset = 0
  ): Promise<Trade[]> {
    return db
      .select()
      .from(trades)
      .where(eq(trades.traderAddress, traderAddress.toLowerCase()))
      .orderBy(desc(trades.timestamp))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Get recent trades across all tokens
   */
  async getRecentTrades(limit = 50): Promise<Trade[]> {
    return db
      .select()
      .from(trades)
      .orderBy(desc(trades.timestamp))
      .limit(limit);
  }

  /**
   * Get trade statistics for token
   */
  async getTradeStats(tokenAddress: string): Promise<{
    totalTrades: number;
    totalBuys: number;
    totalSells: number;
    totalVolume: string;
    uniqueTraders: number;
  }> {
    const [stats] = await db
      .select({
        totalTrades: sql<number>`count(*)::int`,
        totalBuys: sql<number>`count(case when ${trades.tradeType} = 'buy' then 1 end)::int`,
        totalSells: sql<number>`count(case when ${trades.tradeType} = 'sell' then 1 end)::int`,
        totalVolume: sql<string>`sum(CAST(${trades.totalValue} AS NUMERIC))::text`,
        uniqueTraders: sql<number>`count(distinct ${trades.traderAddress})::int`,
      })
      .from(trades)
      .where(eq(trades.tokenAddress, tokenAddress.toLowerCase()));

    return stats || {
      totalTrades: 0,
      totalBuys: 0,
      totalSells: 0,
      totalVolume: '0',
      uniqueTraders: 0,
    };
  }

  /**
   * Calculate 24h metrics for a token
   */
  async calculate24hMetrics(tokenAddress: string): Promise<{
    volume24h: string;
    trades24h: number;
    priceChange24h: number;
  }> {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Get 24h trades
    const [tradeStats] = await db
      .select({
        volume: sql<string>`sum(CAST(${trades.totalValue} AS NUMERIC))::text`,
        count: sql<number>`count(*)::int`,
      })
      .from(trades)
      .where(
        and(
          eq(trades.tokenAddress, tokenAddress.toLowerCase()),
          gte(trades.timestamp, yesterday)
        )
      );

    // Get price change
    const priceHistory = await this.getPriceHistory(tokenAddress, yesterday, undefined, 2);
    
    let priceChange24h = 0;
    if (priceHistory.length >= 2) {
      const currentPrice = parseFloat(priceHistory[0].price);
      const oldPrice = parseFloat(priceHistory[priceHistory.length - 1].price);
      
      if (oldPrice > 0) {
        priceChange24h = ((currentPrice - oldPrice) / oldPrice) * 100;
      }
    }

    return {
      volume24h: tradeStats?.volume || '0',
      trades24h: tradeStats?.count || 0,
      priceChange24h,
    };
  }
}

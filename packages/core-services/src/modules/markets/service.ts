import { and, desc, eq, gte, lte, or, sql } from 'drizzle-orm';
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
    const now = new Date();
    const [signal] = await db
      .insert(marketSignals)
      .values({
        tokenAddress: data.tokenAddress.toLowerCase(),
        currentPrice: data.currentPrice,
        previousPrice: '0',
        priceChange24h: '0',
        priceChangePercent24h: data.priceChangePercent24h.toString(),
        volume24h: data.volume24h,
        volumeChange24h: '0',
        trades24h: data.trades24h,
        uniqueBuyers24h: 0,
        uniqueSellers24h: 0,
        holderCount: data.holderCount,
        holderChange24h: 0,
        status: data.status,
        lastUpdated: now,
        dataWindowStart: now,
        dataWindowEnd: now,
      })
      .onConflictDoUpdate({
        target: marketSignals.tokenAddress,
        set: {
          currentPrice: data.currentPrice,
          priceChangePercent24h: data.priceChangePercent24h.toString(),
          volume24h: data.volume24h,
          trades24h: data.trades24h,
          holderCount: data.holderCount,
          status: data.status,
          lastUpdated: now,
        },
      })
      .returning();

    return {
      ...signal,
      status: signal.status as MarketStatus,
      priceChangePercent24h: parseFloat(signal.priceChangePercent24h),
      volumeChange24h: parseFloat(signal.volumeChange24h),
    } as MarketSignal;
  }

  /**
   * Get market signal for token
   */
  async getMarketSignal(tokenAddress: string): Promise<MarketSignal | null> {
    const [signal] = await db
      .select()
      .from(marketSignals)
      .where(eq(marketSignals.tokenAddress, tokenAddress.toLowerCase()));

    if (!signal) return null;

    return {
      ...signal,
      status: signal.status as MarketStatus,
      priceChangePercent24h: parseFloat(signal.priceChangePercent24h),
      volumeChange24h: parseFloat(signal.volumeChange24h),
    } as MarketSignal;
  }

  /**
   * Get trending tokens (top by volume)
   */
  async getTrending(limit = 20): Promise<MarketSignal[]> {
    const rows = await db
      .select()
      .from(marketSignals)
      .orderBy(desc(sql`CAST(${marketSignals.volume24h} AS NUMERIC)`))
      .limit(limit);
    
    return rows.map(signal => ({
      ...signal,
      status: signal.status as MarketStatus,
      priceChangePercent24h: parseFloat(signal.priceChangePercent24h),
      volumeChange24h: parseFloat(signal.volumeChange24h),
    } as MarketSignal));
  }

  /**
   * Get top gainers (24h price change)
   */
  async getTopGainers(limit = 20): Promise<MarketSignal[]> {
    const rows = await db
      .select()
      .from(marketSignals)
      .where(sql`${marketSignals.priceChangePercent24h} > 0`)
      .orderBy(desc(marketSignals.priceChangePercent24h))
      .limit(limit);
    
    return rows.map(signal => ({
      ...signal,
      status: signal.status as MarketStatus,
      priceChangePercent24h: parseFloat(signal.priceChangePercent24h),
      volumeChange24h: parseFloat(signal.volumeChange24h),
    } as MarketSignal));
  }

  /**
   * Get top losers (24h price change)
   */
  async getTopLosers(limit = 20): Promise<MarketSignal[]> {
    const rows = await db
      .select()
      .from(marketSignals)
      .where(sql`${marketSignals.priceChangePercent24h} < 0`)
      .orderBy(marketSignals.priceChangePercent24h)
      .limit(limit);
    
    return rows.map(signal => ({
      ...signal,
      status: signal.status as MarketStatus,
      priceChangePercent24h: parseFloat(signal.priceChangePercent24h),
      volumeChange24h: parseFloat(signal.volumeChange24h),
    } as MarketSignal));
  }

  /**
   * Record price point
   */
  async recordPricePoint(data: {
    tokenAddress: string;
    price: string;
    volume: string;
    blockNumber: bigint;
  }): Promise<PricePoint> {
    const [point] = await db
      .insert(pricePoints)
      .values({
        tokenAddress: data.tokenAddress.toLowerCase(),
        price: data.price,
        volume: data.volume,
        blockNumber: data.blockNumber,
        timestamp: new Date(),
      })
      .returning();

    return point as PricePoint;
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
    const conditions = [eq(pricePoints.tokenAddress, tokenAddress.toLowerCase())];
    
    if (startTime) {
      conditions.push(gte(pricePoints.timestamp, startTime));
    }

    if (endTime) {
      conditions.push(lte(pricePoints.timestamp, endTime));
    }

    return db
      .select()
      .from(pricePoints)
      .where(and(...conditions))
      .orderBy(desc(pricePoints.timestamp))
      .limit(limit);
  }

  /**
   * Record trade
   */
  async recordTrade(data: {
    tokenAddress: string;
    buyer: string;
    seller: string;
    type: 'buy' | 'sell';
    amount: string;
    price: string;
    totalValue: string;
    protocolFee: string;
    transactionHash: string;
    blockNumber: bigint;
  }): Promise<Trade> {
    const [trade] = await db
      .insert(trades)
      .values({
        ...data,
        tokenAddress: data.tokenAddress.toLowerCase(),
        buyer: data.buyer.toLowerCase(),
        seller: data.seller.toLowerCase(),
        timestamp: new Date(),
      })
      .returning();

    return {
      ...trade,
      type: trade.type as 'buy' | 'sell',
    };
  }

  /**
   * Get trades for token
   */
  async getTradeHistory(
    tokenAddress: string,
    limit = 100,
    offset = 0
  ): Promise<Trade[]> {
    const rows = await db
      .select()
      .from(trades)
      .where(eq(trades.tokenAddress, tokenAddress.toLowerCase()))
      .orderBy(desc(trades.timestamp))
      .limit(limit)
      .offset(offset);
    
    return rows.map(row => ({
      ...row,
      type: row.type as 'buy' | 'sell',
    }));
  }

  /**
   * Get trades by trader
   */
  async getTradesByTrader(
    traderAddress: string,
    limit = 100,
    offset = 0
  ): Promise<Trade[]> {
    const address = traderAddress.toLowerCase();
    const rows = await db
      .select()
      .from(trades)
      .where(
        or(
          eq(trades.buyer, address),
          eq(trades.seller, address)
        )
      )
      .orderBy(desc(trades.timestamp))
      .limit(limit)
      .offset(offset);
    
    return rows.map(row => ({
      ...row,
      type: row.type as 'buy' | 'sell',
    }));
  }

  /**
   * Get recent trades across all tokens
   */
  async getRecentTrades(limit = 50): Promise<Trade[]> {
    const rows = await db
      .select()
      .from(trades)
      .orderBy(desc(trades.timestamp))
      .limit(limit);
    
    return rows.map(row => ({
      ...row,
      type: row.type as 'buy' | 'sell',
    }));
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
        totalBuys: sql<number>`count(case when ${trades.type} = 'buy' then 1 end)::int`,
        totalSells: sql<number>`count(case when ${trades.type} = 'sell' then 1 end)::int`,
        totalVolume: sql<string>`sum(CAST(${trades.totalValue} AS NUMERIC))::text`,
        uniqueTraders: sql<number>`(
          select count(distinct addr)::int
          from (
            select "buyer" as addr
            from "trades"
            where "tokenAddress" = ${tokenAddress.toLowerCase()}
            union
            select "seller" as addr
            from "trades"
            where "tokenAddress" = ${tokenAddress.toLowerCase()}
          ) as t
        )`,
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

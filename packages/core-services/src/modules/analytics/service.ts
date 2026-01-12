import { db } from '@/lib/db';
import { analyticsEvents, users, frameTemplates } from '@/lib/db/schema';
import { logger } from '@/lib/logger';
import { eq, and, desc, sql, gte, count } from 'drizzle-orm';

export class AnalyticsService {
  /**
   * Track an analytics event
   */
  async trackEvent(data: {
    userId?: string;
    eventType: string;
    eventCategory: string;
    resourceType?: string;
    resourceId?: string;
    metadata?: string;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  }) {
    const [event] = await db.insert(analyticsEvents).values(data).returning();

    logger.info(`Analytics event tracked: ${data.eventType}`);
    return event;
  }

  /**
   * Get user-specific analytics
   */
  async getUserAnalytics(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = await db.query.analyticsEvents.findMany({
      where: and(
        eq(analyticsEvents.userId, userId),
        gte(analyticsEvents.timestamp, startDate)
      ),
      orderBy: [desc(analyticsEvents.timestamp)],
    });

    // Aggregate metrics
    const metrics = {
      totalEvents: events.length,
      eventsByType: {} as Record<string, number>,
      eventsByCategory: {} as Record<string, number>,
      dailyActivity: {} as Record<string, number>,
    };

    events.forEach(event => {
      // Count by type
      metrics.eventsByType[event.eventType] = (metrics.eventsByType[event.eventType] || 0) + 1;
      
      // Count by category
      metrics.eventsByCategory[event.eventCategory] = (metrics.eventsByCategory[event.eventCategory] || 0) + 1;
      
      // Count by day
      const day = event.timestamp.toISOString().split('T')[0];
      metrics.dailyActivity[day] = (metrics.dailyActivity[day] || 0) + 1;
    });

    return metrics;
  }

  /**
   * Get frame analytics
   */
  async getFrameAnalytics(frameId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = await db.query.analyticsEvents.findMany({
      where: and(
        eq(analyticsEvents.resourceType, 'frame'),
        eq(analyticsEvents.resourceId, frameId),
        gte(analyticsEvents.timestamp, startDate)
      ),
      orderBy: [desc(analyticsEvents.timestamp)],
    });

    const metrics = {
      totalViews: 0,
      uniqueUsers: new Set<string>(),
      eventsByType: {} as Record<string, number>,
      dailyViews: {} as Record<string, number>,
    };

    events.forEach(event => {
      if (event.eventType === 'frame_view') {
        metrics.totalViews++;
      }
      
      if (event.userId) {
        metrics.uniqueUsers.add(event.userId);
      }
      
      metrics.eventsByType[event.eventType] = (metrics.eventsByType[event.eventType] || 0) + 1;
      
      const day = event.timestamp.toISOString().split('T')[0];
      if (event.eventType === 'frame_view') {
        metrics.dailyViews[day] = (metrics.dailyViews[day] || 0) + 1;
      }
    });

    return {
      ...metrics,
      uniqueUsers: metrics.uniqueUsers.size,
    };
  }

  /**
   * Get protocol-level metrics
   */
  async getProtocolMetrics(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get total users
    const totalUsersResult = await db.select({ count: count() }).from(users);
    const totalUsers = totalUsersResult[0]?.count || 0;

    // Get active users (users who performed any action in the period)
    const activeUsersResult = await db
      .selectDistinct({ userId: analyticsEvents.userId })
      .from(analyticsEvents)
      .where(
        and(
          gte(analyticsEvents.timestamp, startDate),
          sql`${analyticsEvents.userId} IS NOT NULL`
        )
      );
    
    const activeUsers = activeUsersResult.length;

    // Get total frames created
    const totalFramesResult = await db.select({ count: count() }).from(frameTemplates);
    const totalFrames = totalFramesResult[0]?.count || 0;

    // Get frames created in period
    const recentFramesResult = await db
      .select({ count: count() })
      .from(frameTemplates)
      .where(gte(frameTemplates.createdAt, startDate));
    const recentFrames = recentFramesResult[0]?.count || 0;

    // Get total events
    const totalEventsResult = await db
      .select({ count: count() })
      .from(analyticsEvents)
      .where(gte(analyticsEvents.timestamp, startDate));
    const totalEvents = totalEventsResult[0]?.count || 0;

    // Get top event types
    const eventTypesResult = await db
      .select({
        eventType: analyticsEvents.eventType,
        count: count()
      })
      .from(analyticsEvents)
      .where(gte(analyticsEvents.timestamp, startDate))
      .groupBy(analyticsEvents.eventType)
      .orderBy(desc(count()))
      .limit(10);

    return {
      period: {
        days,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        activeRate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0,
      },
      frames: {
        total: totalFrames,
        createdInPeriod: recentFrames,
      },
      events: {
        total: totalEvents,
        byType: eventTypesResult,
      },
    };
  }

  /**
   * Get daily active users
   */
  async getDailyActiveUsers(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await db
      .select({
        date: sql`DATE(${analyticsEvents.timestamp})`,
        users: sql`COUNT(DISTINCT ${analyticsEvents.userId})`
      })
      .from(analyticsEvents)
      .where(
        and(
          gte(analyticsEvents.timestamp, startDate),
          sql`${analyticsEvents.userId} IS NOT NULL`
        )
      )
      .groupBy(sql`DATE(${analyticsEvents.timestamp})`)
      .orderBy(sql`DATE(${analyticsEvents.timestamp})`);

    return result;
  }

  /**
   * Get top frames by views
   */
  async getTopFramesByViews(limit: number = 10, days?: number) {
    const whereConditions = [eq(analyticsEvents.resourceType, 'frame')];
    
    if (days) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      whereConditions.push(gte(analyticsEvents.timestamp, startDate));
    }

    const result = await db
      .select({
        frameId: analyticsEvents.resourceId,
        views: count()
      })
      .from(analyticsEvents)
      .where(and(...whereConditions))
      .groupBy(analyticsEvents.resourceId)
      .orderBy(desc(count()))
      .limit(limit);

    return result;
  }

  /**
   * Get engagement metrics for a resource
   */
  async getEngagementMetrics(resourceType: string, resourceId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = await db.query.analyticsEvents.findMany({
      where: and(
        eq(analyticsEvents.resourceType, resourceType),
        eq(analyticsEvents.resourceId, resourceId),
        gte(analyticsEvents.timestamp, startDate)
      ),
    });

    const metrics = {
      views: 0,
      interactions: 0,
      shares: 0,
      uniqueUsers: new Set<string>(),
      averageTimeOnPage: 0, // Would need session tracking
    };

    events.forEach(event => {
      if (event.userId) {
        metrics.uniqueUsers.add(event.userId);
      }

      switch (event.eventType) {
        case 'view':
        case 'frame_view':
        case 'page_view':
          metrics.views++;
          break;
        case 'click':
        case 'interaction':
          metrics.interactions++;
          break;
        case 'share':
          metrics.shares++;
          break;
      }
    });

    return {
      ...metrics,
      uniqueUsers: metrics.uniqueUsers.size,
      engagementRate: metrics.views > 0 ? (metrics.interactions / metrics.views) * 100 : 0,
    };
  }

  /**
   * Get real-time activity (last N minutes)
   */
  async getRealtimeActivity(minutes: number = 5) {
    const startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() - minutes);

    const events = await db.query.analyticsEvents.findMany({
      where: gte(analyticsEvents.timestamp, startDate),
      orderBy: [desc(analyticsEvents.timestamp)],
      limit: 100,
    });

    const uniqueUsers = new Set(events.map(e => e.userId).filter(Boolean));

    return {
      recentEvents: events.length,
      activeUsers: uniqueUsers.size,
      events: events.slice(0, 20), // Return last 20 events
    };
  }

  /**
   * Track page view
   */
  async trackPageView(data: {
    userId?: string;
    page: string;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  }) {
    return await this.trackEvent({
      userId: data.userId,
      eventType: 'page_view',
      eventCategory: 'user_action',
      resourceType: 'page',
      resourceId: data.page,
      sessionId: data.sessionId,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      referrer: data.referrer,
    });
  }

  /**
   * Track frame view
   */
  async trackFrameView(frameId: string, userId?: string) {
    return await this.trackEvent({
      userId,
      eventType: 'frame_view',
      eventCategory: 'user_action',
      resourceType: 'frame',
      resourceId: frameId,
    });
  }
}

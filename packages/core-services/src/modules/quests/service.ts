import { db } from '@/lib/db';
import { quests, questProgress } from '@/lib/db/schema';
import { logger } from '@/lib/logger';
import { eq, and, desc, sql } from 'drizzle-orm';

export class QuestsService {
  /**
   * Create a new quest
   */
  async createQuest(data: {
    title: string;
    description?: string;
    difficulty: string;
    category: string;
    rewardType: string;
    rewardAmount?: string;
    rewardData?: string;
    requirementType: string;
    requirementData: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const [quest] = await db.insert(quests).values({
      ...data,
      participantCount: 0,
      completionCount: 0,
      status: 'active',
    }).returning();

    logger.info(`Quest created: ${quest.id}`);
    return quest;
  }

  /**
   * Get quest by ID
   */
  async getQuestById(id: string) {
    const quest = await db.query.quests.findFirst({
      where: eq(quests.id, id),
    });

    return quest;
  }

  /**
   * List quests with filters
   */
  async listQuests(filters?: {
    difficulty?: string;
    category?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    const conditions = [];
    
    if (filters?.difficulty) {
      conditions.push(eq(quests.difficulty, filters.difficulty));
    }
    
    if (filters?.category) {
      conditions.push(eq(quests.category, filters.category));
    }
    
    if (filters?.status) {
      conditions.push(eq(quests.status, filters.status));
    }

    return await db.query.quests.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: [desc(quests.createdAt)],
      limit: filters?.limit || 50,
      offset: filters?.offset || 0,
    });
  }

  /**
   * Update quest
   */
  async updateQuest(id: string, data: {
    title?: string;
    description?: string;
    difficulty?: string;
    category?: string;
    rewardType?: string;
    rewardAmount?: string;
    rewardData?: string;
    requirementType?: string;
    requirementData?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const [updated] = await db.update(quests)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(quests.id, id))
      .returning();

    logger.info(`Quest updated: ${id}`);
    return updated;
  }

  /**
   * Start a quest for a user
   */
  async startQuest(questId: string, userId: string) {
    // Check if quest exists and is active
    const quest = await this.getQuestById(questId);
    if (!quest) {
      throw new Error('Quest not found');
    }

    if (quest.status !== 'active') {
      throw new Error('Quest is not active');
    }

    // Check if user has already started this quest
    const existing = await db.query.questProgress.findFirst({
      where: and(
        eq(questProgress.questId, questId),
        eq(questProgress.userId, userId)
      ),
    });

    if (existing) {
      return existing; // Already started
    }

    // Create progress entry
    const [progress] = await db.insert(questProgress).values({
      questId,
      userId,
      progress: 0,
      status: 'in_progress',
    }).returning();

    // Increment participant count
    await db.update(quests)
      .set({
        participantCount: sql`${quests.participantCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(quests.id, questId));

    logger.info(`Quest started: ${questId} by user: ${userId}`);
    return progress;
  }

  /**
   * Update quest progress for a user
   */
  async updateProgress(questId: string, userId: string, progressValue: number, progressData?: string) {
    // Validate progress value is within valid range
    if (typeof progressValue !== 'number' || isNaN(progressValue)) {
      throw new Error('Progress value must be a valid number');
    }
    
    if (progressValue < 0 || progressValue > 100) {
      throw new Error('Progress value must be between 0 and 100');
    }
    
    const [updated] = await db.update(questProgress)
      .set({
        progress: progressValue,
        progressData,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(questProgress.questId, questId),
          eq(questProgress.userId, userId)
        )
      )
      .returning();

    logger.info(`Quest progress updated: ${questId} for user: ${userId} - ${progressValue}%`);
    return updated;
  }

  /**
   * Complete a quest for a user
   */
  async completeQuest(questId: string, userId: string) {
    // Update progress status
    const [progress] = await db.update(questProgress)
      .set({
        progress: 100,
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(questProgress.questId, questId),
          eq(questProgress.userId, userId)
        )
      )
      .returning();

    // Increment completion count
    await db.update(quests)
      .set({
        completionCount: sql`${quests.completionCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(quests.id, questId));

    // Get quest details for reward
    const quest = await this.getQuestById(questId);

    logger.info(`Quest completed: ${questId} by user: ${userId}`);
    
    return {
      progress,
      reward: {
        type: quest?.rewardType,
        amount: quest?.rewardAmount,
        data: quest?.rewardData,
      },
    };
  }

  /**
   * Get user's quest progress
   */
  async getUserProgress(userId: string, questId?: string) {
    if (questId) {
      return await db.query.questProgress.findFirst({
        where: and(
          eq(questProgress.questId, questId),
          eq(questProgress.userId, userId)
        ),
      });
    }

    return await db.query.questProgress.findMany({
      where: eq(questProgress.userId, userId),
      orderBy: [desc(questProgress.updatedAt)],
    });
  }

  /**
   * Get active quests for a user (not started or in progress)
   */
  async getActiveQuestsForUser(userId: string) {
    // Get all active quests
    const allQuests = await this.listQuests({ status: 'active' });

    // Get user's progress - returns array
    const userProgressData = await this.getUserProgress(userId);
    const userProgress = Array.isArray(userProgressData) ? userProgressData : [];

    // Filter out completed quests
    return allQuests.filter(quest => {
      const progress = userProgress.find((p: any) => p.questId === quest.id);
      return !progress || progress.status !== 'completed';
    });
  }

  /**
   * Get quest statistics
   */
  async getQuestStats(id: string) {
    const quest = await this.getQuestById(id);
    if (!quest) {
      throw new Error('Quest not found');
    }

    const completionRate = quest.participantCount > 0
      ? (quest.completionCount / quest.participantCount) * 100
      : 0;

    return {
      id: quest.id,
      participantCount: quest.participantCount,
      completionCount: quest.completionCount,
      completionRate: completionRate.toFixed(2),
      status: quest.status,
    };
  }

  /**
   * Get daily/weekly quests
   */
  async getDailyQuests() {
    return await this.listQuests({ category: 'daily', status: 'active' });
  }

  async getWeeklyQuests() {
    return await this.listQuests({ category: 'weekly', status: 'active' });
  }
}

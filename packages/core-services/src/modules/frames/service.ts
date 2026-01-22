import { db } from '@/lib/db';
import { frameTemplates } from '@/lib/db/schema';
import { logger } from '@/lib/logger';
import { eq, and, desc, sql } from 'drizzle-orm';

export class FramesService {
  /**
   * Create a new frame template
   */
  async createTemplate(data: {
    name: string;
    description?: string;
    category: string;
    thumbnailUrl?: string;
    price?: string;
    creatorId: string;
    tenantId?: string;
    templateData: string;
    version?: string;
  }) {
    const [template] = await db.insert(frameTemplates).values({
      ...data,
      status: 'draft',
      downloadCount: 0,
      rating: '0',
      ratingCount: 0,
      featured: false,
    }).returning();

    logger.info(`Frame template created: ${template.id}`);
    return template;
  }

  /**
   * Get frame template by ID
   */
  async getTemplateById(id: string) {
    const template = await db.query.frameTemplates.findFirst({
      where: eq(frameTemplates.id, id),
    });

    return template;
  }

  /**
   * List frame templates with filters
   */
  async listTemplates(filters?: {
    category?: string;
    status?: string;
    featured?: boolean;
    creatorId?: string;
    limit?: number;
    offset?: number;
  }) {
    const conditions = [];
    
    if (filters?.category) {
      conditions.push(eq(frameTemplates.category, filters.category));
    }
    
    if (filters?.status) {
      conditions.push(eq(frameTemplates.status, filters.status));
    }
    
    if (filters?.featured !== undefined) {
      conditions.push(eq(frameTemplates.featured, filters.featured));
    }
    
    if (filters?.creatorId) {
      conditions.push(eq(frameTemplates.creatorId, filters.creatorId));
    }

    const query = db.query.frameTemplates.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: [desc(frameTemplates.createdAt)],
      limit: filters?.limit || 50,
      offset: filters?.offset || 0,
    });

    return await query;
  }

  /**
   * Update frame template
   */
  async updateTemplate(id: string, data: {
    name?: string;
    description?: string;
    category?: string;
    thumbnailUrl?: string;
    price?: string;
    templateData?: string;
    version?: string;
    status?: string;
    featured?: boolean;
  }) {
    const [updated] = await db.update(frameTemplates)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(frameTemplates.id, id))
      .returning();

    logger.info(`Frame template updated: ${id}`);
    return updated;
  }

  /**
   * Delete frame template
   */
  async deleteTemplate(id: string) {
    await db.delete(frameTemplates)
      .where(eq(frameTemplates.id, id));

    logger.info(`Frame template deleted: ${id}`);
  }

  /**
   * Publish a frame template
   */
  async publishTemplate(id: string) {
    return await this.updateTemplate(id, { status: 'published' });
  }

  /**
   * Increment download count
   */
  async incrementDownloads(id: string) {
    await db.update(frameTemplates)
      .set({
        downloadCount: sql`${frameTemplates.downloadCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(frameTemplates.id, id));

    logger.info(`Download count incremented for template: ${id}`);
  }

  /**
   * Rate a template
   */
  async rateTemplate(id: string, rating: number) {
    // Validate rating is a valid number
    if (typeof rating !== 'number' || isNaN(rating)) {
      throw new Error('Rating must be a valid number');
    }
    
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const template = await this.getTemplateById(id);
    if (!template) {
      throw new Error('Template not found');
    }

    const currentRating = parseFloat(template.rating || '0');
    const currentCount = template.ratingCount || 0;
    
    // Calculate new average rating
    const newCount = currentCount + 1;
    const newRating = ((currentRating * currentCount) + rating) / newCount;

    await db.update(frameTemplates)
      .set({
        rating: newRating.toFixed(2),
        ratingCount: newCount,
        updatedAt: new Date(),
      })
      .where(eq(frameTemplates.id, id));

    logger.info(`Template rated: ${id} - ${rating} stars`);
  }

  /**
   * Get featured templates
   */
  async getFeaturedTemplates(limit: number = 10) {
    return await db.query.frameTemplates.findMany({
      where: and(
        eq(frameTemplates.featured, true),
        eq(frameTemplates.status, 'published')
      ),
      orderBy: [desc(frameTemplates.rating), desc(frameTemplates.downloadCount)],
      limit,
    });
  }

  /**
   * Get popular templates
   */
  async getPopularTemplates(limit: number = 10) {
    return await db.query.frameTemplates.findMany({
      where: eq(frameTemplates.status, 'published'),
      orderBy: [desc(frameTemplates.downloadCount)],
      limit,
    });
  }

  /**
   * Search templates
   */
  async searchTemplates(query: string, limit: number = 20) {
    return await db.query.frameTemplates.findMany({
      where: and(
        eq(frameTemplates.status, 'published'),
        sql`${frameTemplates.name} ILIKE ${'%' + query + '%'} OR ${frameTemplates.description} ILIKE ${'%' + query + '%'}`
      ),
      limit,
    });
  }

  /**
   * Get template statistics
   */
  async getTemplateStats(id: string) {
    const template = await this.getTemplateById(id);
    if (!template) {
      throw new Error('Template not found');
    }

    return {
      id: template.id,
      downloadCount: template.downloadCount,
      rating: parseFloat(template.rating || '0'),
      ratingCount: template.ratingCount,
      featured: template.featured,
    };
  }
}

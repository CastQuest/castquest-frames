import { desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '../../lib/db';
import { mediaMetadata } from '../../lib/db/schema';
import { MediaMetadata, MediaType, TokenStatus } from '../../types';

export class MediaService {
  /**
   * Create new media metadata entry
   */
  async createMedia(data: {
    mediaId: string;
    tokenAddress: string;
    ownerAddress: string;
    ticker: string;
    name: string;
    description: string;
    mediaType: MediaType;
    mediaUrl: string;
    blockNumber: bigint;
    transactionHash: string;
  }): Promise<MediaMetadata> {
    const [media] = await db.insert(mediaMetadata).values({
      ...data,
      status: 'active',
      riskScore: 0,
      riskFlags: [],
      createdAt: new Date(),
    }).returning();

    return media;
  }

  /**
   * Get media by token address
   */
  async getByTokenAddress(tokenAddress: string): Promise<MediaMetadata | null> {
    const [media] = await db
      .select()
      .from(mediaMetadata)
      .where(eq(mediaMetadata.tokenAddress, tokenAddress.toLowerCase()));

    return media || null;
  }

  /**
   * Get media by ID
   */
  async getById(mediaId: string): Promise<MediaMetadata | null> {
    const [media] = await db
      .select()
      .from(mediaMetadata)
      .where(eq(mediaMetadata.mediaId, mediaId));

    return media || null;
  }

  /**
   * Get media by owner
   */
  async getByOwner(ownerAddress: string, limit = 50, offset = 0): Promise<MediaMetadata[]> {
    return db
      .select()
      .from(mediaMetadata)
      .where(eq(mediaMetadata.ownerAddress, ownerAddress.toLowerCase()))
      .orderBy(desc(mediaMetadata.createdAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Search media by ticker or name
   */
  async search(query: string, limit = 50, offset = 0): Promise<MediaMetadata[]> {
    const searchPattern = `%${query}%`;
    
    return db
      .select()
      .from(mediaMetadata)
      .where(
        or(
          ilike(mediaMetadata.ticker, searchPattern),
          ilike(mediaMetadata.name, searchPattern)
        )
      )
      .orderBy(desc(mediaMetadata.createdAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * List all media with filters
   */
  async list(filters: {
    status?: TokenStatus;
    mediaType?: MediaType;
    limit?: number;
    offset?: number;
  } = {}): Promise<MediaMetadata[]> {
    const { status, mediaType, limit = 50, offset = 0 } = filters;

    let query = db.select().from(mediaMetadata);

    if (status) {
      query = query.where(eq(mediaMetadata.status, status)) as any;
    }

    if (mediaType) {
      query = query.where(eq(mediaMetadata.mediaType, mediaType)) as any;
    }

    return query
      .orderBy(desc(mediaMetadata.createdAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Update media status
   */
  async updateStatus(
    tokenAddress: string,
    status: TokenStatus,
    riskFlags?: string[]
  ): Promise<MediaMetadata | null> {
    const updates: any = { status };
    
    if (riskFlags) {
      updates.riskFlags = riskFlags;
    }

    const [updated] = await db
      .update(mediaMetadata)
      .set(updates)
      .where(eq(mediaMetadata.tokenAddress, tokenAddress.toLowerCase()))
      .returning();

    return updated || null;
  }

  /**
   * Update risk score
   */
  async updateRiskScore(
    tokenAddress: string,
    riskScore: number,
    riskFlags: string[]
  ): Promise<MediaMetadata | null> {
    const [updated] = await db
      .update(mediaMetadata)
      .set({ riskScore, riskFlags })
      .where(eq(mediaMetadata.tokenAddress, tokenAddress.toLowerCase()))
      .returning();

    return updated || null;
  }

  /**
   * Get flagged media
   */
  async getFlagged(limit = 50, offset = 0): Promise<MediaMetadata[]> {
    return db
      .select()
      .from(mediaMetadata)
      .where(eq(mediaMetadata.status, 'flagged'))
      .orderBy(desc(mediaMetadata.createdAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Get high-risk media (risk score > 70)
   */
  async getHighRisk(limit = 50, offset = 0): Promise<MediaMetadata[]> {
    return db
      .select()
      .from(mediaMetadata)
      .where(sql`${mediaMetadata.riskScore} > 70`)
      .orderBy(desc(mediaMetadata.riskScore))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Get media count by status
   */
  async getCountByStatus(): Promise<Record<TokenStatus, number>> {
    const results = await db
      .select({
        status: mediaMetadata.status,
        count: sql<number>`count(*)::int`,
      })
      .from(mediaMetadata)
      .groupBy(mediaMetadata.status);

    const counts: any = {
      pending: 0,
      active: 0,
      flagged: 0,
      banned: 0,
    };

    results.forEach((row) => {
      counts[row.status] = row.count;
    });

    return counts;
  }
}

// Import sql from drizzle-orm
import { sql } from 'drizzle-orm';

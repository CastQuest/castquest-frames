import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '../src/lib/db';
import { MediaService } from '../src/modules/media/service';

vi.mock('../src/lib/db', () => ({
  db: {
    query: {
      mediaMetadata: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
    },
    select: vi.fn(),
  },
}));

vi.mock('../src/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('MediaService', () => {
  let mediaService: MediaService;

  beforeEach(() => {
    mediaService = new MediaService();
    vi.clearAllMocks();
  });

  describe('searchMedia', () => {
    it('should return media matching search query', async () => {
      const mockMedia = [
        {
          id: 'media-1',
          mediaId: 'media_001',
          tokenAddress: '0x1111111111111111111111111111111111111111',
          ticker: 'PIC',
          name: 'Epic Sunset',
          mediaType: 'image',
          status: 'active',
        },
      ];

      vi.mocked(db.query.mediaMetadata.findMany).mockResolvedValue(mockMedia as any);

      const result = await mediaService.searchMedia({
        search: 'sunset',
        limit: 20,
        offset: 0,
      });

      expect(result.media).toHaveLength(1);
      expect(result.media[0].name).toBe('Epic Sunset');
    });

    it('should filter by media type', async () => {
      const mockMedia = [
        {
          id: 'media-1',
          ticker: 'VID',
          name: 'Cool Video',
          mediaType: 'video',
        },
      ];

      vi.mocked(db.query.mediaMetadata.findMany).mockResolvedValue(mockMedia as any);

      const result = await mediaService.searchMedia({
        mediaType: 'video',
        limit: 20,
        offset: 0,
      });

      expect(result.media).toHaveLength(1);
      expect(result.media[0].mediaType).toBe('video');
    });
  });

  describe('getMediaById', () => {
    it('should return media by ID', async () => {
      const mockMedia = {
        id: 'media-1',
        mediaId: 'media_001',
        tokenAddress: '0x1111111111111111111111111111111111111111',
        ticker: 'PIC',
        name: 'Epic Sunset',
        status: 'active',
      };

      vi.mocked(db.query.mediaMetadata.findFirst).mockResolvedValue(mockMedia as any);

      const result = await mediaService.getMediaById('media_001');

      expect(result).toBeDefined();
      expect(result?.name).toBe('Epic Sunset');
    });

    it('should return null for non-existent media', async () => {
      vi.mocked(db.query.mediaMetadata.findFirst).mockResolvedValue(null);

      const result = await mediaService.getMediaById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('getMediaByOwner', () => {
    it('should return all media owned by address', async () => {
      const mockMedia = [
        {
          id: 'media-1',
          ownerAddress: '0x1234567890123456789012345678901234567890',
          ticker: 'PIC1',
        },
        {
          id: 'media-2',
          ownerAddress: '0x1234567890123456789012345678901234567890',
          ticker: 'PIC2',
        },
      ];

      vi.mocked(db.query.mediaMetadata.findMany).mockResolvedValue(mockMedia as any);

      const result = await mediaService.getMediaByOwner('0x1234567890123456789012345678901234567890');

      expect(result).toHaveLength(2);
    });
  });
});

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

  describe('search', () => {
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
          creatorUserId: null,
        },
      ];

      vi.mocked(db.query.mediaMetadata.findMany).mockResolvedValue(mockMedia as any);

      const result = await mediaService.search('sunset', 20, 0);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Epic Sunset');
    });

    it('should return empty array when no results', async () => {
      vi.mocked(db.query.mediaMetadata.findMany).mockResolvedValue([] as any);

      const result = await mediaService.search('nonexistent', 20, 0);

      expect(result).toHaveLength(0);
    });
  });

  describe('getById', () => {
    it('should return media by ID', async () => {
      const mockMedia = {
        id: 'media-1',
        mediaId: 'media_001',
        tokenAddress: '0x1111111111111111111111111111111111111111',
        ticker: 'PIC',
        name: 'Epic Sunset',
        status: 'active',
        creatorUserId: null,
      };

      // getById uses db.query.mediaMetadata.findFirst
      vi.mocked(db.query.mediaMetadata.findFirst).mockResolvedValue(mockMedia as any);

      const result = await mediaService.getById('media_001');

      expect(result).toBeDefined();
      expect(result?.name).toBe('Epic Sunset');
    });

    it('should return null for non-existent media', async () => {
      vi.mocked(db.query.mediaMetadata.findFirst).mockResolvedValue(undefined as any);

      const result = await mediaService.getById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('getByOwner', () => {
    it('should return all media owned by address', async () => {
      const mockMedia = [
        {
          id: 'media-1',
          ownerAddress: '0x1234567890123456789012345678901234567890',
          ticker: 'PIC1',
          creatorUserId: null,
        },
        {
          id: 'media-2',
          ownerAddress: '0x1234567890123456789012345678901234567890',
          ticker: 'PIC2',
          creatorUserId: null,
        },
      ];

      vi.mocked(db.query.mediaMetadata.findMany).mockResolvedValue(mockMedia as any);

      const result = await mediaService.getByOwner('0x1234567890123456789012345678901234567890');

      expect(result).toHaveLength(2);
    });
  });
});


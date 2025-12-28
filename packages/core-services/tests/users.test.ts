import bcrypt from 'bcrypt';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '../src/lib/db';
import { UserService } from '../src/modules/users/service';

// Mock database
vi.mock('../src/lib/db', () => ({
  db: {
    query: {
      users: {
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('../src/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should create a new user with hashed password', async () => {
      // Mock no existing user
      vi.mocked(db.query.users.findFirst).mockResolvedValue(null);
      
      // Mock user creation
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        emailVerified: false,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockUser]),
        }),
      } as any);

      const result = await userService.register('test@example.com', 'password123');

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      expect(result.verificationToken).toBeDefined();
    });

    it('should throw error if email already exists', async () => {
      // Mock existing user
      vi.mocked(db.query.users.findFirst).mockResolvedValue({
        id: 'existing-user',
        email: 'test@example.com',
      } as any);

      await expect(
        userService.register('test@example.com', 'password123')
      ).rejects.toThrow('Email already registered');
    });
  });

  describe('login', () => {
    it('should return user and JWT token for valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        passwordHash: hashedPassword,
        status: 'active',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.query.users.findFirst).mockResolvedValue(mockUser as any);
      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      } as any);

      const result = await userService.login('test@example.com', 'password123');

      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw error for invalid credentials', async () => {
      vi.mocked(db.query.users.findFirst).mockResolvedValue(null);

      await expect(
        userService.login('wrong@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for banned user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        status: 'banned',
      };

      vi.mocked(db.query.users.findFirst).mockResolvedValue(mockUser as any);

      await expect(
        userService.login('test@example.com', 'password123')
      ).rejects.toThrow('Account is banned');
    });
  });
});

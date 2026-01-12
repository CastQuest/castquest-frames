import { db } from '@/lib/db';
import { users, wallets } from '@/lib/db/schema';
import { logger } from '@/lib/logger';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN = '7d';

  constructor() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET environment variable must be set in production');
      }

      logger.warn('Using insecure default JWT secret in non-production environment');
      this.JWT_SECRET = 'castquest-dev-secret';
    } else {
      this.JWT_SECRET = secret;
    }
  }

  /**
   * Authenticate user with wallet address
   */
  async authenticateWallet(address: string) {
    const normalizedAddress = address.toLowerCase();
    
    // Check if wallet exists
    const wallet = await db.query.wallets.findFirst({
      where: eq(wallets.address, normalizedAddress),
    });

    let user;
    
    if (!wallet) {
      // Create new user and wallet
      const [newUser] = await db.insert(users).values({
        email: `${normalizedAddress}@wallet.castquest.xyz`, // Generate email for wallet users
        emailVerified: true,
        status: 'active',
      }).returning();
      
      user = newUser;
      
      // Create wallet entry
      await db.insert(wallets).values({
        userId: user.id,
        address: normalizedAddress,
        type: 'eoa',
        label: 'Primary Wallet',
        isPrimary: true,
      });
      
      logger.info(`New wallet user created: ${address}`);
    } else {
      // Get existing user
      user = await db.query.users.findFirst({
        where: eq(users.id, wallet.userId),
      });
      
      if (!user) {
        throw new Error('User not found for wallet');
      }
    }

    // Update last login and wallet last used
    await db.update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));
      
    await db.update(wallets)
      .set({ lastUsedAt: new Date() })
      .where(eq(wallets.address, normalizedAddress));

    // Generate JWT
    const token = this.generateToken(user.id, user.email);

    return {
      user: this.sanitizeUser(user),
      token,
      walletAddress: normalizedAddress,
    };
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): { userId: string; email: string } | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string; email: string };
      return {
        userId: decoded.userId,
        email: decoded.email,
      };
    } catch (error) {
      logger.error('Token verification failed', error);
      return null;
    }
  }

  /**
   * Get user from token
   */
  async getUserFromToken(token: string) {
    const decoded = this.verifyToken(token);
    if (!decoded) {
      return null;
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.userId),
    });

    return user ? this.sanitizeUser(user) : null;
  }

  /**
   * Generate JWT token
   */
  generateToken(userId: string, email: string): string {
    return jwt.sign(
      { userId, email },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }

  /**
   * Refresh token
   */
  async refreshToken(oldToken: string) {
    const decoded = this.verifyToken(oldToken);
    if (!decoded) {
      throw new Error('Invalid token');
    }

    // Generate new token
    const newToken = this.generateToken(decoded.userId, decoded.email);

    return {
      token: newToken,
    };
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: {
    email?: string;
  }) {
    const [updated] = await db.update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    logger.info(`User profile updated: ${userId}`);
    return this.sanitizeUser(updated);
  }

  /**
   * Remove sensitive data from user object
   */
  private sanitizeUser(user: { passwordHash?: string; [key: string]: unknown }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }

  /**
   * Logout (client-side token invalidation)
   */
  async logout(userId: string) {
    // In a production system, you might want to:
    // 1. Add token to a blacklist
    // 2. Update last logout time
    // 3. Clear sessions
    
    logger.info(`User logged out: ${userId}`);
    return { success: true };
  }
}

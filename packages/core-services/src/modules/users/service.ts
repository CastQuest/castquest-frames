import { config } from '@/lib/config';
import { db } from '@/lib/db';
import { users, verificationTokens } from '@/lib/db/schema';
import { logger } from '@/lib/logger';
import type { UserStatus } from '@/types';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export class UserService {
  /**
   * Register a new user
   */
  async register(email: string, password: string) {
    // Check if user already exists
    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    
    if (existing) {
      throw new Error('Email already registered');
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const [user] = await db.insert(users).values({
      email,
      passwordHash,
      status: 'pending',
      emailVerified: false,
    }).returning();
    
    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    await db.insert(verificationTokens).values({
      token,
      userId: user.id,
      type: 'email_verification',
      expiresAt,
    });
    
    // Send verification email (implement email service)
    await this.sendVerificationEmail(email, token);
    
    logger.info(`User registered: ${user.id}`);
    
    return {
      user: this.sanitizeUser(user),
      verificationToken: token, // In production, only send via email
    };
  }
  
  /**
   * Login user
   */
  async login(email: string, password: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    
    if (!user || !user.passwordHash) {
      throw new Error('Invalid credentials');
    }
    
    const valid = await bcrypt.compare(password, user.passwordHash);
    
    if (!valid) {
      throw new Error('Invalid credentials');
    }
    
    if (user.status === 'banned') {
      throw new Error('Account is banned');
    }
    
    if (user.status === 'suspended') {
      throw new Error('Account is suspended');
    }
    
    // Update last login
    await db.update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));
    
    // Generate JWT
    const jwtSecret = config.auth.jwtSecret as string;
    const jwtExpiresIn = config.auth.jwtExpiresIn as string;
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: jwtExpiresIn } as jwt.SignOptions
    );
    
    logger.info(`User logged in: ${user.id}`);
    
    return {
      user: this.sanitizeUser(user),
      token,
    };
  }
  
  /**
   * Verify email address
   */
  async verifyEmail(token: string) {
    const verification = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.token, token),
    });
    
    if (!verification) {
      throw new Error('Invalid verification token');
    }
    
    if (verification.expiresAt < new Date()) {
      throw new Error('Verification token expired');
    }
    
    // Update user
    await db.update(users)
      .set({
        emailVerified: true,
        status: 'active',
        updatedAt: new Date(),
      })
      .where(eq(users.id, verification.userId));
    
    // Delete verification token
    await db.delete(verificationTokens)
      .where(eq(verificationTokens.id, verification.id));
    
    logger.info(`Email verified for user: ${verification.userId}`);
  }
  
  /**
   * Get user by ID
   */
  async getUserById(id: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    
    return user ? this.sanitizeUser(user) : null;
  }
  
  /**
   * Get user by email
   */
  async getUserByEmail(email: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    
    return user ? this.sanitizeUser(user) : null;
  }
  
  /**
   * Update user status
   */
  async updateUserStatus(userId: string, status: UserStatus) {
    await db.update(users)
      .set({ status, updatedAt: new Date() })
      .where(eq(users.id, userId));
    
    logger.info(`User status updated: ${userId} -> ${status}`);
  }
  
  /**
   * Remove sensitive data from user object
   */
  private sanitizeUser(user: any) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
  
  /**
   * Send verification email
   */
  private async sendVerificationEmail(email: string, token: string) {
    // Implement email sending logic
    // For now, just log
    logger.info(`Verification email would be sent to: ${email}`);
    logger.info(`Verification link: http://localhost:3000/verify?token=${token}`);
  }
}

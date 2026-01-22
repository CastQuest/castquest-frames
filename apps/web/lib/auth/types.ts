/**
 * Authentication types for Web App
 * Compatible with @castquest/core-services
 */

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface Session {
  userId: string;
  email: string;
  token: string;
  expiresAt?: Date;
}

export interface AuthContext {
  user: User;
  session: Session;
}

export interface DecodedToken {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

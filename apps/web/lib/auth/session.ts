import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { AuthService } from '@castquest/core-services';
import { Session } from './types';

// Lazy initialization to avoid build-time errors
let authService: AuthService | null = null;

function getAuthService(): AuthService {
  if (!authService) {
    authService = new AuthService();
  }
  return authService;
}

/**
 * Extract token from request headers or cookies
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Try cookie
  const cookie = request.cookies.get('auth_token');
  if (cookie) {
    return cookie.value;
  }

  return null;
}

/**
 * Extract token from server component context (cookies)
 */
export function getTokenFromCookies(): string | null {
  try {
    const cookieStore = cookies();
    const authCookie = cookieStore.get('auth_token');
    return authCookie?.value || null;
  } catch (error) {
    console.error('Error reading cookies:', error);
    return null;
  }
}

/**
 * Parse and validate session from token
 */
export function parseSession(token: string): Session | null {
  try {
    const decoded = getAuthService().verifyToken(token);
    if (!decoded) {
      return null;
    }

    // Extract expiration from JWT if available
    let expiresAt: Date | undefined;
    if ('exp' in decoded && typeof (decoded as any).exp === 'number') {
      // JWT exp is in seconds since epoch
      expiresAt = new Date((decoded as any).exp * 1000);
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      token,
      expiresAt,
    };
  } catch (error) {
    console.error('Error parsing session:', error);
    return null;
  }
}

/**
 * Validate session from request
 */
export function validateSession(request: NextRequest): Session | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }

  return parseSession(token);
}

/**
 * Check if session is valid (not expired)
 */
export function isSessionValid(session: Session): boolean {
  if (!session.expiresAt) {
    return true; // No expiration set
  }

  return session.expiresAt > new Date();
}

/**
 * Refresh session token
 */
export async function refreshSession(oldToken: string): Promise<string | null> {
  try {
    const result = await getAuthService().refreshToken(oldToken);
    return result.token;
  } catch (error) {
    console.error('Error refreshing session:', error);
    return null;
  }
}

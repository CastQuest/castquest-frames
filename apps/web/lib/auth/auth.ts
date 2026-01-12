import { NextRequest } from 'next/server';
import { AuthService } from '@castquest/core-services';
import { User, AuthContext } from './types';
import { getTokenFromCookies, validateSession, parseSession } from './session';
import { AuthenticationError } from './errors';

// Lazy initialization to avoid build-time errors
let authService: AuthService | null = null;

function getAuthService(): AuthService {
  if (!authService) {
    authService = new AuthService();
  }
  return authService;
}

/**
 * Require authentication for API routes
 * Returns authenticated user or throws AuthenticationError
 * 
 * Usage in API routes:
 * ```typescript
 * const user = await requireUser(request);
 * // user is guaranteed to be authenticated here
 * ```
 */
export async function requireUser(request: NextRequest): Promise<User> {
  const session = validateSession(request);
  
  if (!session) {
    throw new AuthenticationError('Unauthorized: Authentication required');
  }

  // Get full user profile from database
  const user = await getAuthService().getProfile(session.userId);
  
  if (!user) {
    throw new AuthenticationError('Unauthorized: User not found');
  }

  return user as User;
}

/**
 * Get authenticated user if available (optional authentication)
 * Returns user or null if not authenticated
 * 
 * Usage in API routes:
 * ```typescript
 * const user = await getUser(request);
 * if (user) {
 *   // User is authenticated
 * } else {
 *   // User is not authenticated
 * }
 * ```
 */
export async function getUser(request: NextRequest): Promise<User | null> {
  try {
    const session = validateSession(request);
    
    if (!session) {
      return null;
    }

    const user = await getAuthService().getProfile(session.userId);
    return user as User | null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

/**
 * Get user from server components (using cookies)
 * For use in server components where NextRequest is not available
 */
export async function getUserFromCookies(): Promise<User | null> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return null;
    }

    const session = parseSession(token);
    if (!session) {
      return null;
    }

    const user = await getAuthService().getProfile(session.userId);
    return user as User | null;
  } catch (error) {
    console.error('Error getting user from cookies:', error);
    return null;
  }
}

/**
 * Require user with full auth context
 * Returns both user and session information
 */
export async function requireAuthContext(request: NextRequest): Promise<AuthContext> {
  const session = validateSession(request);
  
  if (!session) {
    throw new AuthenticationError('Unauthorized: Authentication required');
  }

  const user = await getAuthService().getProfile(session.userId);
  
  if (!user) {
    throw new AuthenticationError('Unauthorized: User not found');
  }

  return {
    user: user as User,
    session,
  };
}

/**
 * Get user ID from request (lightweight alternative to full user fetch)
 * Returns user ID string or null
 * 
 * Note: This function is synchronous despite returning a Promise for API consistency
 */
export function getUserId(request: NextRequest): string | null {
  try {
    const session = validateSession(request);
    return session?.userId || null;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
}

/**
 * Require user ID (throws AuthenticationError if not authenticated)
 * Returns user ID string
 * 
 * Note: This function is synchronous despite returning a Promise for API consistency
 */
export function requireUserId(request: NextRequest): string {
  const session = validateSession(request);
  
  if (!session) {
    throw new AuthenticationError('Unauthorized: Authentication required');
  }

  return session.userId;
}

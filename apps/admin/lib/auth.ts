import { NextRequest } from 'next/server';

/**
 * Check if the request has admin authorization
 */
export function requireAdmin(request: NextRequest): { authorized: boolean; error?: any; userId?: string } {
  const adminToken = process.env.ADMIN_API_TOKEN;
  const providedToken = request.headers.get('x-admin-token');

  if (!adminToken || !providedToken || providedToken !== adminToken) {
    return {
      authorized: false,
      error: {
        success: false,
        error: 'Unauthorized: Admin access required',
      },
    };
  }

  // Extract admin user ID from header or use system default
  const userId = request.headers.get('x-admin-user-id') || 'system-admin';

  return { authorized: true, userId };
}

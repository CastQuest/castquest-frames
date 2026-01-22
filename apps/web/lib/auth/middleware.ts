/**
 * Shared error handling utilities for API routes
 */

import { NextResponse } from 'next/server';
import { AuthenticationError, AuthorizationError, SessionExpiredError } from './errors';

/**
 * Handle authentication errors consistently across all API routes
 * 
 * @param error - The error to handle
 * @returns NextResponse with appropriate status code and error message
 */
export function handleAuthError(error: unknown): NextResponse {
  if (error instanceof AuthenticationError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 401 }
    );
  }

  if (error instanceof AuthorizationError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 403 }
    );
  }

  if (error instanceof SessionExpiredError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 401 }
    );
  }

  return null as any; // Let caller handle non-auth errors
}

/**
 * Handle API errors with detailed information
 * 
 * @param error - The error to handle
 * @param defaultMessage - Default message if error details unavailable
 * @returns Error details object
 */
export function getErrorDetails(error: unknown, defaultMessage: string = 'An error occurred'): {
  message: string;
  details?: string;
} {
  if (error instanceof Error) {
    return {
      message: error.message,
      details: error.stack,
    };
  }

  if (typeof error === 'string') {
    return {
      message: error,
    };
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return {
      message: String((error as any).message),
    };
  }

  return {
    message: defaultMessage,
    details: error ? String(error) : undefined,
  };
}

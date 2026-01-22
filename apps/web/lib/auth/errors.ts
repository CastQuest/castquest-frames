/**
 * Custom error classes for authentication
 */

/**
 * Thrown when authentication is required but not provided or invalid
 */
export class AuthenticationError extends Error {
  constructor(message: string = 'Unauthorized: Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthenticationError);
    }
  }
}

/**
 * Thrown when user is authenticated but lacks required permissions
 */
export class AuthorizationError extends Error {
  constructor(message: string = 'Forbidden: Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthorizationError);
    }
  }
}

/**
 * Thrown when session has expired
 */
export class SessionExpiredError extends Error {
  constructor(message: string = 'Session expired') {
    super(message);
    this.name = 'SessionExpiredError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SessionExpiredError);
    }
  }
}

/**
 * @packageDocumentation
 * Auth compatibility module for the web app.
 *
 * This file serves as a backward compatibility layer around the newer, more
 * modular `./auth/` implementation. It preserves existing import paths so that
 * legacy code can continue to import from `apps/web/lib/auth` without change,
 * while internally delegating all behavior to the modules in the `auth/`
 * directory.
 *
 * - Re-exports all public auth utilities from the `./auth/` barrel module.
 * - Explicitly re-exports {@link requireUserId} for historical named imports.
 * - Provides {@link getUserIdFromRequest} as a deprecated alias for backward compatibility.
 */

// Re-export everything from the new auth module
export * from './auth/';

// Import specific functions for re-export and aliasing
import { requireUserId, getUserId } from './auth/auth';

// Specifically re-export requireUserId for direct import
export { requireUserId, getUserId };

/**
 * @deprecated Use `getUserId` instead.
 * This wrapper is kept for backward compatibility and forwards to `getUserId`.
 * The old function returned `Promise<string | null>` but was synchronous.
 * New code should use `getUserId` directly which has the correct signature.
 */
export const getUserIdFromRequest = getUserId;


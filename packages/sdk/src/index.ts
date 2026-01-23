/**
 * CastQuest SDK
 * 
 * Official TypeScript SDK for interacting with the CastQuest Protocol.
 * 
 * ## Installation
 * 
 * ```bash
 * pnpm add @castquest/sdk
 * ```
 * 
 * ## Quick Start
 * 
 * ```typescript
 * import { FramesClient } from '@castquest/sdk';
 * 
 * const client = new FramesClient({
 *   chainId: 8453 // BASE
 * });
 * 
 * // Validate a frame
 * const isValid = client.validateFrame(myFrame);
 * ```
 * 
 * @packageDocumentation
 * @module @castquest/sdk
 */

export { FramesClient } from './client/FramesClient';
export * from './types/frames';
export * from './schema/validator';
export * from './permissions/PermissionsService';
export * from './brain/SmartBrainEngine';
export * from './oracle/OracleDBService';
export * from './workers/AutonomousWorkerSystem';
export * from './contracts';

// Note: ABIs are exported from './abis' after running extract-abis.sh
// Re-export them if the directory exists (generated during build)
try {
  // @ts-ignore - abis directory is generated
  export * from './abis';
} catch (e) {
  // ABIs not yet generated - run extract-abis.sh after contract compilation
}

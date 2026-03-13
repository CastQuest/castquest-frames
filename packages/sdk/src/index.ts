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

// ABI exports: populated by running `bash packages/contracts/scripts/extract-abis.sh`
// after compiling the Solidity contracts. The stub always exists; generated content
// replaces the empty export {} with actual contract ABI exports.
export * from './abis';

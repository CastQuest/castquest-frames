import { z } from "zod"

// ============================================================================
// AUTH SCHEMAS
// ============================================================================

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

// ============================================================================
// USER SCHEMAS
// ============================================================================

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  image: z.string().url().optional(),
  roleId: z.string().cuid().optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

// ============================================================================
// FEATURE FLAG SCHEMAS
// ============================================================================

export const featureFlagKeySchema = z.string()
  .min(1, "Key is required")
  .max(100, "Key too long")
  .regex(/^[A-Z][A-Z0-9_]*$/, "Key must be UPPER_SNAKE_CASE (e.g., MY_FEATURE)")

export const createFeatureFlagSchema = z.object({
  key: featureFlagKeySchema,
  description: z.string().max(500).optional(),
  enabled: z.boolean().default(false),
})

export const toggleFeatureFlagSchema = z.object({
  key: featureFlagKeySchema,
  enabled: z.boolean(),
})

export type CreateFeatureFlagInput = z.infer<typeof createFeatureFlagSchema>
export type ToggleFeatureFlagInput = z.infer<typeof toggleFeatureFlagSchema>

// ============================================================================
// AGENT SCHEMAS
// ============================================================================

// Cron expression validation pattern
// Matches: minute hour day-of-month month day-of-week
// Each field can be: *, number, */number, or number-number
const CRON_PATTERN = /^(\*|[0-5]?\d|\*\/[0-5]?\d) (\*|[01]?\d|2[0-3]|\*\/[01]?\d|\*\/2[0-3]) (\*|[1-9]|[12]\d|3[01]|\*\/[1-9]|\*\/[12]\d|\*\/3[01]) (\*|[1-9]|1[0-2]|\*\/[1-9]|\*\/1[0-2]) (\*|[0-6]|\*\/[0-6])$/

export const agentConfigSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  enabled: z.boolean().default(false),
  config: z.record(z.unknown()).optional(),
  schedule: z.string().regex(CRON_PATTERN, "Invalid cron expression (e.g., '0 */6 * * *')").optional().nullable(),
})

export const runAgentSchema = z.object({
  agentId: z.string().cuid(),
  input: z.record(z.unknown()).optional(),
})

export type AgentConfigInput = z.infer<typeof agentConfigSchema>
export type RunAgentInput = z.infer<typeof runAgentSchema>

// ============================================================================
// CONTRACT DEPLOYMENT SCHEMAS
// ============================================================================

export const supportedChainIds = [1, 8453, 10, 42161, 137, 84532, 11155111] as const

export const deployContractSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  chainId: z.number().refine((val) => supportedChainIds.includes(val as any), {
    message: "Unsupported chain",
  }),
  bytecode: z.string().regex(/^0x[a-fA-F0-9]+$/, "Invalid bytecode").optional(),
  abi: z.array(z.record(z.unknown())).optional(),
  sourceCode: z.string().max(100000).optional(),
  constructorArgs: z.array(z.unknown()).optional(),
  compilerVersion: z.string().optional(),
})

export const verifyContractSchema = z.object({
  chainId: z.number(),
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid address"),
  sourceCode: z.string().min(1),
  compilerVersion: z.string().min(1),
  constructorArgs: z.string().optional(),
})

export type DeployContractInput = z.infer<typeof deployContractSchema>
export type VerifyContractInput = z.infer<typeof verifyContractSchema>

// ============================================================================
// ROLE & PERMISSION SCHEMAS
// ============================================================================

export const createRoleSchema = z.object({
  name: z.string().min(1).max(50).regex(/^[A-Z][A-Z_]*$/, "Role name must be UPPER_CASE"),
  description: z.string().max(500).optional(),
  permissions: z.array(z.string().cuid()).optional(),
})

export const createPermissionSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  action: z.enum(["create", "read", "update", "delete", "execute", "manage"]),
  resource: z.string().min(1).max(100),
})

export type CreateRoleInput = z.infer<typeof createRoleSchema>
export type CreatePermissionInput = z.infer<typeof createPermissionSchema>

// ============================================================================
// COMMON UTILITIES
// ============================================================================

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  orderBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
})

export type PaginationInput = z.infer<typeof paginationSchema>

export const idSchema = z.object({
  id: z.string().cuid(),
})

export const ethereumAddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")

export const transactionHashSchema = z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Invalid transaction hash")

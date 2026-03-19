"use server"

import { revalidatePath } from "next/cache"

// Types
interface AgentConfig {
  id: string
  name: string
  description: string | null
  enabled: boolean
  config: Record<string, unknown>
  schedule: string | null
  lastRun: Date | null
  lastResult: Record<string, unknown> | null
}

interface AgentExecution {
  id: string
  agentId: string
  status: "pending" | "running" | "completed" | "failed"
  input: Record<string, unknown> | null
  output: Record<string, unknown> | null
  error: string | null
  duration: number | null
  triggeredBy: "manual" | "schedule" | "webhook"
  userId: string | null
  startedAt: Date
  completedAt: Date | null
}

// In-memory store for demo (replace with Prisma in production)
const agentStore = new Map<string, AgentConfig>([
  ["frame-pricing", {
    id: "frame-pricing",
    name: "FramePricingAgent",
    description: "AI agent that analyzes market data and suggests optimal pricing for frame mints",
    enabled: true,
    config: { model: "gpt-4-turbo", maxTokens: 2000, analysisDepth: "full" },
    schedule: "0 */6 * * *",
    lastRun: new Date("2024-03-15T18:00:00Z"),
    lastResult: { status: "success", framesAnalyzed: 150, recommendationsUpdated: 23 },
  }],
  ["content-moderation", {
    id: "content-moderation",
    name: "ContentModerationAgent",
    description: "Scans uploaded media for policy violations and inappropriate content",
    enabled: true,
    config: { model: "gpt-4-vision", confidenceThreshold: 0.85, categories: ["nsfw", "violence", "spam"] },
    schedule: "*/15 * * * *",
    lastRun: new Date("2024-03-15T20:15:00Z"),
    lastResult: { status: "success", reviewed: 45, flagged: 2 },
  }],
  ["quest-completion", {
    id: "quest-completion",
    name: "QuestCompletionAgent",
    description: "Validates quest completion criteria and triggers rewards distribution",
    enabled: true,
    config: { batchSize: 100, retryAttempts: 3, rewardMultiplier: 1.0 },
    schedule: "*/5 * * * *",
    lastRun: new Date("2024-03-15T20:20:00Z"),
    lastResult: { status: "success", processed: 89, rewardsDistributed: "2.5 ETH" },
  }],
])

const executionStore: AgentExecution[] = []

// ============================================================================
// AGENT CONFIGURATION
// ============================================================================

export async function getAgents(): Promise<{ agents: AgentConfig[] }> {
  return { agents: Array.from(agentStore.values()) }
}

export async function getAgent(id: string): Promise<{ agent: AgentConfig | null }> {
  return { agent: agentStore.get(id) || null }
}

export async function createAgent(
  name: string,
  description: string,
  config: Record<string, unknown>,
  schedule?: string
): Promise<{ success: boolean; agent?: AgentConfig; error?: string }> {
  const id = name.toLowerCase().replace(/[^a-z0-9]/g, "-")
  
  if (agentStore.has(id)) {
    return { success: false, error: "Agent with this name already exists" }
  }

  const agent: AgentConfig = {
    id,
    name,
    description,
    enabled: false,
    config,
    schedule: schedule || null,
    lastRun: null,
    lastResult: null,
  }

  agentStore.set(id, agent)
  revalidatePath("/admin/agents")
  
  return { success: true, agent }
}

export async function updateAgent(
  id: string,
  updates: Partial<Pick<AgentConfig, "name" | "description" | "config" | "schedule" | "enabled">>
): Promise<{ success: boolean; error?: string }> {
  const agent = agentStore.get(id)
  if (!agent) {
    return { success: false, error: "Agent not found" }
  }

  agentStore.set(id, { ...agent, ...updates })
  revalidatePath("/admin/agents")
  
  return { success: true }
}

export async function toggleAgent(id: string, enabled: boolean): Promise<{ success: boolean; error?: string }> {
  const agent = agentStore.get(id)
  if (!agent) {
    return { success: false, error: "Agent not found" }
  }

  agent.enabled = enabled
  agentStore.set(id, agent)
  revalidatePath("/admin/agents")
  
  return { success: true }
}

export async function deleteAgent(id: string): Promise<{ success: boolean; error?: string }> {
  if (!agentStore.has(id)) {
    return { success: false, error: "Agent not found" }
  }

  agentStore.delete(id)
  revalidatePath("/admin/agents")
  
  return { success: true }
}

// ============================================================================
// AGENT EXECUTION
// ============================================================================

export async function runAgent(
  agentId: string,
  input?: Record<string, unknown>,
  triggeredBy: "manual" | "schedule" | "webhook" = "manual",
  userId?: string
): Promise<{ success: boolean; executionId?: string; error?: string }> {
  const agent = agentStore.get(agentId)
  if (!agent) {
    return { success: false, error: "Agent not found" }
  }

  if (!agent.enabled) {
    return { success: false, error: "Agent is disabled" }
  }

  const execution: AgentExecution = {
    id: `exec-${Date.now()}`,
    agentId,
    status: "running",
    input: input || null,
    output: null,
    error: null,
    duration: null,
    triggeredBy,
    userId: userId || null,
    startedAt: new Date(),
    completedAt: null,
  }

  executionStore.unshift(execution)

  // Simulate async execution
  setTimeout(async () => {
    try {
      // Simulate agent logic based on type
      const startTime = Date.now()
      const result = await executeAgentLogic(agent, input)
      const duration = Date.now() - startTime

      execution.status = "completed"
      execution.output = result
      execution.duration = duration
      execution.completedAt = new Date()

      agent.lastRun = new Date()
      agent.lastResult = { status: "success", ...result }
      agentStore.set(agentId, agent)
    } catch (error) {
      execution.status = "failed"
      execution.error = error instanceof Error ? error.message : "Unknown error"
      execution.completedAt = new Date()

      agent.lastRun = new Date()
      agent.lastResult = { status: "failed", error: execution.error }
      agentStore.set(agentId, agent)
    }
  }, 1000 + Math.random() * 3000)

  return { success: true, executionId: execution.id }
}

async function executeAgentLogic(
  agent: AgentConfig,
  input?: Record<string, unknown>
): Promise<Record<string, unknown>> {
  // Simulate different agent behaviors
  switch (agent.name) {
    case "FramePricingAgent":
      return {
        framesAnalyzed: Math.floor(Math.random() * 100) + 50,
        recommendationsUpdated: Math.floor(Math.random() * 30),
        averagePriceChange: `${(Math.random() * 10 - 5).toFixed(2)}%`,
      }
    
    case "ContentModerationAgent":
      return {
        reviewed: Math.floor(Math.random() * 50) + 20,
        flagged: Math.floor(Math.random() * 5),
        categories: { nsfw: 0, violence: 1, spam: 2 },
      }
    
    case "QuestCompletionAgent":
      return {
        processed: Math.floor(Math.random() * 100) + 50,
        rewardsDistributed: `${(Math.random() * 5).toFixed(2)} ETH`,
        failedValidations: Math.floor(Math.random() * 5),
      }
    
    default:
      return { 
        executed: true, 
        timestamp: new Date().toISOString(),
        input: input || {},
      }
  }
}

export async function getExecutions(
  agentId?: string,
  limit: number = 50
): Promise<{ executions: AgentExecution[] }> {
  let executions = executionStore

  if (agentId) {
    executions = executions.filter(e => e.agentId === agentId)
  }

  return { executions: executions.slice(0, limit) }
}

export async function getExecution(id: string): Promise<{ execution: AgentExecution | null }> {
  return { execution: executionStore.find(e => e.id === id) || null }
}

// ============================================================================
// AGENT ANALYTICS
// ============================================================================

export async function getAgentStats(): Promise<{
  totalAgents: number
  activeAgents: number
  totalExecutions: number
  successRate: number
  averageDuration: number
}> {
  const agents = Array.from(agentStore.values())
  const completedExecutions = executionStore.filter(e => e.status === "completed")
  const failedExecutions = executionStore.filter(e => e.status === "failed")
  
  const totalExecutions = completedExecutions.length + failedExecutions.length
  const successRate = totalExecutions > 0 
    ? (completedExecutions.length / totalExecutions) * 100 
    : 100

  const durations = completedExecutions
    .filter(e => e.duration !== null)
    .map(e => e.duration as number)
  const averageDuration = durations.length > 0
    ? durations.reduce((a, b) => a + b, 0) / durations.length
    : 0

  return {
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.enabled).length,
    totalExecutions,
    successRate: Math.round(successRate * 100) / 100,
    averageDuration: Math.round(averageDuration),
  }
}

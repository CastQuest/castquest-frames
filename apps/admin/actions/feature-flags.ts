"use server"

// In-memory store for demo (replace with Prisma in production)
// Shared with the API route — both are on the same server process.
export const flagStore = new Map<string, { id: string; key: string; enabled: boolean; description: string }>([
  ["WEB3_ENABLED", { id: "1", key: "WEB3_ENABLED", enabled: true, description: "Enable Web3 wallet features" }],
  ["AGENTS_ENABLED", { id: "2", key: "AGENTS_ENABLED", enabled: true, description: "Enable AI agent workflows" }],
  ["CONTRACT_DEPLOY_ENABLED", { id: "3", key: "CONTRACT_DEPLOY_ENABLED", enabled: true, description: "Enable contract deployment" }],
  ["QUESTS_ENABLED", { id: "4", key: "QUESTS_ENABLED", enabled: true, description: "Enable quest system" }],
  ["FRAMES_V2_ENABLED", { id: "5", key: "FRAMES_V2_ENABLED", enabled: false, description: "Enable Frames v2 features" }],
  ["ANALYTICS_ENABLED", { id: "6", key: "ANALYTICS_ENABLED", enabled: true, description: "Enable analytics" }],
])

export type FeatureFlag = { id: string; key: string; enabled: boolean; description: string }

export async function getFeatureFlags(): Promise<{ flags: FeatureFlag[] }> {
  return { flags: Array.from(flagStore.values()) }
}

export async function toggleFeatureFlag(key: string, enabled: boolean): Promise<{ flag?: FeatureFlag; error?: string }> {
  const flag = flagStore.get(key)
  if (!flag) return { error: "Flag not found" }
  flag.enabled = enabled
  flagStore.set(key, flag)
  return { flag }
}

export async function createFeatureFlag(data: { key: string; description: string; enabled: boolean }): Promise<{ flag?: FeatureFlag; error?: string }> {
  if (!data.key || !/^[A-Z][A-Z0-9_]*$/.test(data.key)) {
    return { error: "Invalid key format" }
  }
  if (flagStore.has(data.key)) {
    return { error: "Flag already exists" }
  }
  const flag: FeatureFlag = { id: `${Date.now()}`, key: data.key, description: data.description || "", enabled: data.enabled || false }
  flagStore.set(data.key, flag)
  return { flag }
}

export async function deleteFeatureFlag(key: string): Promise<{ success?: boolean; error?: string }> {
  if (!flagStore.has(key)) return { error: "Flag not found" }
  flagStore.delete(key)
  return { success: true }
}

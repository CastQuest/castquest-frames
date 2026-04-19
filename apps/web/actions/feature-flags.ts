"use server"

import { prisma } from "../lib/prisma"
import { auth } from "../auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export interface FeatureFlag {
  id: string
  key: string
  enabled: boolean
  description: string | null
  updatedAt?: Date
}

const defaultFlags: FeatureFlag[] = [
  { id: "1", key: "WEB3_ENABLED", enabled: true, description: "Enable Web3 wallet features and blockchain interactions" },
  { id: "2", key: "AGENTS_ENABLED", enabled: true, description: "Enable AI agent workflows and automation" },
  { id: "3", key: "CONTRACT_DEPLOY_ENABLED", enabled: true, description: "Enable smart contract deployment features" },
  { id: "4", key: "QUESTS_ENABLED", enabled: true, description: "Enable quest system and rewards" },
  { id: "5", key: "FRAMES_V2_ENABLED", enabled: false, description: "Enable experimental Frames v2 features" },
  { id: "6", key: "ANALYTICS_ENABLED", enabled: true, description: "Enable analytics and usage tracking" },
]

export async function getFeatureFlags(): Promise<{ flags: FeatureFlag[] }> {
  try {
    const flags = await prisma.featureFlag.findMany({
      orderBy: { key: "asc" },
      select: {
        id: true,
        key: true,
        enabled: true,
        description: true,
        updatedAt: true,
      },
    })
    
    if (flags.length === 0) {
      return { flags: defaultFlags }
    }
    
    return { flags }
  } catch (error) {
    // If DB is not connected, return defaults
    console.warn("Feature flags DB not available, using defaults:", error)
    return { flags: defaultFlags }
  }
}

export async function getFeatureFlag(key: string): Promise<boolean> {
  try {
    const flag = await prisma.featureFlag.findUnique({
      where: { key },
      select: { enabled: true },
    })
    
    if (!flag) {
      const defaultFlag = defaultFlags.find(f => f.key === key)
      return defaultFlag?.enabled ?? false
    }
    
    return flag.enabled
  } catch {
    const defaultFlag = defaultFlags.find(f => f.key === key)
    return defaultFlag?.enabled ?? false
  }
}

const toggleFlagSchema = z.object({
  key: z.string().min(1).max(100),
  enabled: z.boolean(),
})

export async function toggleFeatureFlag(key: string, enabled: boolean): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  
  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }
  
  const userRole = (session.user as { role?: string }).role
  if (userRole !== "ADMIN") {
    return { success: false, error: "Admin access required" }
  }

  const parsed = toggleFlagSchema.safeParse({ key, enabled })
  if (!parsed.success) {
    return { success: false, error: "Invalid input" }
  }

  try {
    await prisma.featureFlag.upsert({
      where: { key },
      update: { 
        enabled,
        updatedAt: new Date(),
      },
      create: { 
        key, 
        enabled, 
        description: defaultFlags.find(f => f.key === key)?.description ?? "",
      },
    })

    revalidatePath("/admin")
    revalidatePath("/admin/feature-flags")
    revalidatePath("/")
    
    return { success: true }
  } catch (error) {
    console.error("Toggle feature flag error:", error)
    return { success: false, error: "Database error" }
  }
}

const createFlagSchema = z.object({
  key: z.string().min(1).max(100).regex(/^[A-Z][A-Z0-9_]*$/, "Key must be UPPER_SNAKE_CASE"),
  description: z.string().max(500).optional(),
  enabled: z.boolean().default(false),
})

export async function createFeatureFlag(
  key: string, 
  description?: string, 
  enabled: boolean = false
): Promise<{ success: boolean; error?: string; flag?: FeatureFlag }> {
  const session = await auth()
  
  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }
  
  const userRole = (session.user as { role?: string }).role
  if (userRole !== "ADMIN") {
    return { success: false, error: "Admin access required" }
  }

  const parsed = createFlagSchema.safeParse({ key, description, enabled })
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" }
  }

  try {
    const existing = await prisma.featureFlag.findUnique({
      where: { key },
    })
    
    if (existing) {
      return { success: false, error: "Flag already exists" }
    }

    const flag = await prisma.featureFlag.create({
      data: {
        key: parsed.data.key,
        description: parsed.data.description ?? "",
        enabled: parsed.data.enabled,
      },
    })

    revalidatePath("/admin/feature-flags")
    
    return { success: true, flag }
  } catch (error) {
    console.error("Create feature flag error:", error)
    return { success: false, error: "Database error" }
  }
}

export async function deleteFeatureFlag(key: string): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  
  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }
  
  const userRole = (session.user as { role?: string }).role
  if (userRole !== "ADMIN") {
    return { success: false, error: "Admin access required" }
  }

  try {
    await prisma.featureFlag.delete({
      where: { key },
    })

    revalidatePath("/admin/feature-flags")
    
    return { success: true }
  } catch (error) {
    console.error("Delete feature flag error:", error)
    return { success: false, error: "Flag not found or database error" }
  }
}

import { NextRequest, NextResponse } from "next/server"

// In-memory store for demo (replace with Prisma in production)
const flagStore = new Map<string, { id: string; key: string; enabled: boolean; description: string }>([
  ["WEB3_ENABLED", { id: "1", key: "WEB3_ENABLED", enabled: true, description: "Enable Web3 wallet features" }],
  ["AGENTS_ENABLED", { id: "2", key: "AGENTS_ENABLED", enabled: true, description: "Enable AI agent workflows" }],
  ["CONTRACT_DEPLOY_ENABLED", { id: "3", key: "CONTRACT_DEPLOY_ENABLED", enabled: true, description: "Enable contract deployment" }],
  ["QUESTS_ENABLED", { id: "4", key: "QUESTS_ENABLED", enabled: true, description: "Enable quest system" }],
  ["FRAMES_V2_ENABLED", { id: "5", key: "FRAMES_V2_ENABLED", enabled: false, description: "Enable Frames v2 features" }],
  ["ANALYTICS_ENABLED", { id: "6", key: "ANALYTICS_ENABLED", enabled: true, description: "Enable analytics" }],
])

function requireAdminKey(request: NextRequest): NextResponse | null {
  const adminKey = process.env.ADMIN_API_KEY
  if (!adminKey) {
    return NextResponse.json({ error: "Admin API not configured" }, { status: 503 })
  }
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${adminKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return null
}

export async function GET(request: NextRequest) {
  const authError = requireAdminKey(request)
  if (authError) return authError
  try {
    const flags = Array.from(flagStore.values())
    return NextResponse.json({ flags })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch flags" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdminKey(request)
  if (authError) return authError
  try {
    const body = await request.json()
    const { key, description, enabled } = body

    if (!key || !/^[A-Z][A-Z0-9_]*$/.test(key)) {
      return NextResponse.json({ error: "Invalid key format" }, { status: 400 })
    }

    if (flagStore.has(key)) {
      return NextResponse.json({ error: "Flag already exists" }, { status: 409 })
    }

    const flag = { id: `${Date.now()}`, key, description: description || "", enabled: enabled || false }
    flagStore.set(key, flag)
    return NextResponse.json({ flag })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create flag" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const authError = requireAdminKey(request)
  if (authError) return authError
  try {
    const body = await request.json()
    const { key, enabled } = body

    if (!key) return NextResponse.json({ error: "Key is required" }, { status: 400 })

    const flag = flagStore.get(key)
    if (!flag) return NextResponse.json({ error: "Flag not found" }, { status: 404 })

    flag.enabled = enabled
    flagStore.set(key, flag)
    return NextResponse.json({ flag })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update flag" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const authError = requireAdminKey(request)
  if (authError) return authError
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")

    if (!key) return NextResponse.json({ error: "Key is required" }, { status: 400 })
    if (!flagStore.has(key)) return NextResponse.json({ error: "Flag not found" }, { status: 404 })

    flagStore.delete(key)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete flag" }, { status: 500 })
  }
}

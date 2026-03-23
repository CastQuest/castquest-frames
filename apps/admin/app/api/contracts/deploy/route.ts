import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { deployContract } from "../../../../actions/deploy-contract"

function isAdminSession(session: ReturnType<typeof getServerSession> extends Promise<infer T> ? T : never): boolean {
  return !!(session && (session as any)?.user?.role === "ADMIN")
}

export async function POST(request: NextRequest) {
  // Auth guard: admin only
  const session = await getServerSession()
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, chainId, sourceCode, bytecode, constructorArgs } = body

    if (!chainId) {
      return NextResponse.json({ error: "Chain ID is required" }, { status: 400 })
    }

    const result = await deployContract({
      name: name || "Untitled Contract",
      chainId,
      sourceCode,
      bytecode,
      constructorArgs,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ deployment: result.deployment })
  } catch (error) {
    console.error("Contract deployment API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Deployment failed" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession()
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return NextResponse.json({ deployments: [] })
}

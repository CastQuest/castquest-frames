import { NextRequest, NextResponse } from "next/server"
import { deployContract } from "../../../../actions/deploy-contract"

const ALLOWED_CHAIN_IDS = new Set([1, 8453, 10, 42161, 137, 84532, 11155111])

function requireAdminKey(request: NextRequest): NextResponse | null {
  const adminKey = process.env.ADMIN_API_KEY
  if (!adminKey) {
    // ADMIN_API_KEY not configured — block all requests
    return NextResponse.json({ error: "Admin API not configured" }, { status: 503 })
  }
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${adminKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return null
}

export async function POST(request: NextRequest) {
  const authError = requireAdminKey(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { name, chainId, bytecode, constructorArgs } = body

    // Validate chainId
    const parsedChainId = Number(chainId)
    if (!Number.isInteger(parsedChainId) || !ALLOWED_CHAIN_IDS.has(parsedChainId)) {
      return NextResponse.json(
        { error: `Unsupported chain ID. Allowed: ${[...ALLOWED_CHAIN_IDS].join(", ")}` },
        { status: 400 }
      )
    }

    // Validate bytecode if provided
    if (bytecode !== undefined && (typeof bytecode !== "string" || !/^0x[0-9a-fA-F]+$/.test(bytecode))) {
      return NextResponse.json({ error: "bytecode must be 0x-prefixed hex" }, { status: 400 })
    }

    // Validate constructorArgs if provided
    if (constructorArgs !== undefined && !Array.isArray(constructorArgs)) {
      return NextResponse.json({ error: "constructorArgs must be an array" }, { status: 400 })
    }

    const result = await deployContract({
      name: typeof name === "string" ? name : "Untitled Contract",
      chainId: parsedChainId,
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
  const authError = requireAdminKey(request)
  if (authError) return authError
  return NextResponse.json({ deployments: [] })
}

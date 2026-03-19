import { NextRequest, NextResponse } from "next/server"
import { deployContract } from "../../../../actions/deploy-contract"

export async function POST(request: NextRequest) {
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

export async function GET() {
  // Return list of recent deployments (from memory/DB)
  // For demo, return empty list
  return NextResponse.json({ deployments: [] })
}

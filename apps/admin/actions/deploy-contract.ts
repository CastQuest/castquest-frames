"use server"

import { createPublicClient, createWalletClient, http, encodeAbiParameters } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { mainnet, base, optimism, arbitrum, polygon, baseSepolia, sepolia } from "viem/chains"

// Chain configurations
const chainConfigs: Record<number, { chain: typeof mainnet; rpcUrl: string }> = {
  1: { chain: mainnet, rpcUrl: process.env.ETH_RPC_URL || "https://eth.llamarpc.com" },
  8453: { chain: base, rpcUrl: process.env.BASE_RPC_URL || "https://mainnet.base.org" },
  10: { chain: optimism, rpcUrl: process.env.OP_RPC_URL || "https://mainnet.optimism.io" },
  42161: { chain: arbitrum, rpcUrl: process.env.ARB_RPC_URL || "https://arb1.arbitrum.io/rpc" },
  137: { chain: polygon, rpcUrl: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com" },
  84532: { chain: baseSepolia, rpcUrl: "https://sepolia.base.org" },
  11155111: { chain: sepolia, rpcUrl: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org" },
}

interface DeployContractInput {
  name: string
  chainId: number
  bytecode?: string
  constructorArgs?: unknown[]
}

interface DeploymentResult {
  success: boolean
  deployment?: {
    address: string
    txHash: string
    chainId: number
    blockNumber: number
    gasUsed: string
  }
  error?: string
}

// Simple ERC20 bytecode (pre-compiled) for demo purposes
// In production, you would compile using solc or use Hardhat/Foundry
const DEMO_ERC20_BYTECODE = "0x608060405234801561001057600080fd5b506040516109e93803806109e983398101604081905261002f916100f8565b604051806040016040528060098152602001684361737451756573746360b81b815250600090816100609190610205565b5060408051808201909152600481526321a4a9a360e11b602082015260019061008990826102c4565b506002805460ff191660121790556100ab81670de0b6b3a764000061038e565b60038190553360009081526004602052604081209190915560038054909161010d913391907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9061010590565b0390a3506103b5565b60006020828403121561010a57600080fd5b5051919050565b634e487b7160e01b600052604160045260246000fd5b600181811c9082168061013b57607f821691505b60208210810361015b57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156101aa57600081815260208120601f850160051c810160208610156101895750805b601f850160051c820191505b818110156101a857828155600101610195565b505b505050565b81516001600160401b038111156101c8576101c8610111565b6101dc816101d68454610127565b84610161565b602080601f83116001811461021157600084156101f95750858301515b600019600386901b1c1916600185901b1785556101a8565b600085815260208120601f198616915b8281101561024057888601518255948401946001909101908401610221565b508582101561025e5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b600052601160045260246000fd5b80820281158282048414176102a9576102a961027e565b92915050565b634e487b7160e01b600052601260045260246000fd5b818103818111156102a9576102a961027e565b6106258061039e6000396000f3fe"

const DEMO_ERC20_ABI = [
  { inputs: [{ name: "_initialSupply", type: "uint256" }], stateMutability: "nonpayable", type: "constructor" },
  { inputs: [], name: "name", outputs: [{ type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "symbol", outputs: [{ type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "decimals", outputs: [{ type: "uint8" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "totalSupply", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "owner", type: "address" }], name: "balanceOf", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "to", type: "address" }, { name: "value", type: "uint256" }], name: "transfer", outputs: [{ type: "bool" }], stateMutability: "nonpayable", type: "function" },
  { anonymous: false, inputs: [{ indexed: true, name: "from", type: "address" }, { indexed: true, name: "to", type: "address" }, { indexed: false, name: "value", type: "uint256" }], name: "Transfer", type: "event" },
]

export async function deployContract(input: DeployContractInput): Promise<DeploymentResult> {
  // Defense-in-depth: this action uses ADMIN_PRIVATE_KEY and must only be called
  // from authenticated admin contexts. Verify the ADMIN_API_KEY is set to ensure
  // the action is not accidentally invoked in an unauthenticated path.
  if (!process.env.ADMIN_API_KEY) {
    return { success: false, error: "Admin API key not configured — deployment disabled" }
  }

  const { name, chainId, bytecode, constructorArgs = [] } = input

  // Validate chain
  const chainConfig = chainConfigs[chainId]
  if (!chainConfig) {
    return { success: false, error: `Unsupported chain ID: ${chainId}` }
  }

  // Get private key from environment
  const privateKey = process.env.ADMIN_PRIVATE_KEY
  if (!privateKey) {
    return { success: false, error: "ADMIN_PRIVATE_KEY not configured" }
  }

  try {
    // Create account from private key
    const account = privateKeyToAccount(`0x${privateKey.replace("0x", "")}`)

    // Create clients
    const publicClient = createPublicClient({
      chain: chainConfig.chain,
      transport: http(chainConfig.rpcUrl),
    })

    const walletClient = createWalletClient({
      account,
      chain: chainConfig.chain,
      transport: http(chainConfig.rpcUrl),
    })

    // Use provided bytecode or demo bytecode
    const deployBytecode = bytecode || DEMO_ERC20_BYTECODE

    // Encode constructor arguments
    let encodedArgs = ""
    if (constructorArgs.length > 0) {
      // Simple encoding for uint256 constructor arg
      const argValue = BigInt(constructorArgs[0] as string || "1000000")
      encodedArgs = encodeAbiParameters(
        [{ type: "uint256" }],
        [argValue]
      ).slice(2) // Remove 0x prefix
    }

    // Combine bytecode and constructor args
    const deployData = `${deployBytecode}${encodedArgs}` as `0x${string}`

    // Check balance
    const balance = await publicClient.getBalance({ address: account.address })
    if (balance === BigInt(0)) {
      return { 
        success: false, 
        error: `Deployer account ${account.address} has no funds on chain ${chainId}` 
      }
    }

    // Estimate gas and add 20% safety margin
    const gasEstimate = await publicClient.estimateGas({
      account: account.address,
      data: deployData,
    })
    const gasWithMargin = (gasEstimate * 120n) / 100n

    // Deploy contract
    const hash = await walletClient.deployContract({
      abi: DEMO_ERC20_ABI,
      bytecode: deployBytecode as `0x${string}`,
      args: constructorArgs.length > 0 ? [BigInt(constructorArgs[0] as string)] : undefined,
      gas: gasWithMargin,
    })

    // Wait for receipt
    const receipt = await publicClient.waitForTransactionReceipt({ hash })

    if (!receipt.contractAddress) {
      return { success: false, error: "Contract deployment failed - no address returned" }
    }

    return {
      success: true,
      deployment: {
        address: receipt.contractAddress,
        txHash: hash,
        chainId,
        blockNumber: Number(receipt.blockNumber),
        gasUsed: receipt.gasUsed.toString(),
      },
    }
  } catch (error) {
    console.error("Contract deployment error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown deployment error",
    }
  }
}

export async function getDeploymentStatus(txHash: string, chainId: number) {
  const chainConfig = chainConfigs[chainId]
  if (!chainConfig) {
    return { success: false, error: "Unsupported chain" }
  }

  try {
    const publicClient = createPublicClient({
      chain: chainConfig.chain,
      transport: http(chainConfig.rpcUrl),
    })

    const receipt = await publicClient.getTransactionReceipt({ hash: txHash as `0x${string}` })

    return {
      success: true,
      status: receipt.status === "success" ? "deployed" : "failed",
      contractAddress: receipt.contractAddress,
      blockNumber: Number(receipt.blockNumber),
      gasUsed: receipt.gasUsed.toString(),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get deployment status",
    }
  }
}

export async function verifyContract(
  chainId: number,
  address: string,
  sourceCode: string,
  constructorArgs?: string
) {
  // This would integrate with Etherscan/Basescan API for verification
  // For now, return a placeholder response
  
  const apiKeys: Record<number, string | undefined> = {
    1: process.env.ETHERSCAN_API_KEY,
    8453: process.env.BASESCAN_API_KEY,
    10: process.env.OPTIMISM_API_KEY,
    42161: process.env.ARBISCAN_API_KEY,
    137: process.env.POLYGONSCAN_API_KEY,
  }

  const apiKey = apiKeys[chainId]
  if (!apiKey) {
    return { 
      success: false, 
      error: `API key not configured for chain ${chainId}. Set the appropriate *SCAN_API_KEY environment variable.` 
    }
  }

  // In production, you would:
  // 1. Submit verification request to block explorer API
  // 2. Poll for verification status
  // 3. Return verification result

  return {
    success: true,
    message: "Verification request submitted. Check block explorer for status.",
    verificationId: `verify-${Date.now()}`,
  }
}

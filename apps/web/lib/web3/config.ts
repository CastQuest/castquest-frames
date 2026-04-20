"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import {
  mainnet,
  base,
  optimism,
  arbitrum,
  polygon,
  baseSepolia,
  sepolia,
} from "wagmi/chains"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId && process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  console.error(
    "[CastQuest] NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. " +
    "Web3 features will not work. Get a project ID from https://cloud.walletconnect.com/"
  )
}

/** True only when a valid WalletConnect project ID is configured */
export const web3Enabled = !!projectId

/** RainbowKit config — null when projectId is missing so Web3Provider can skip rendering */
export const web3Config = projectId
  ? getDefaultConfig({
      appName: "CastQuest Platform",
      projectId,
      chains: [mainnet, base, optimism, arbitrum, polygon, baseSepolia, sepolia],
      ssr: true,
    })
  : null

// Chain metadata for UI display
export const chainMetadata: Record<number, { name: string; icon: string; color: string }> = {
  1: { name: "Ethereum", icon: "Ξ", color: "#627EEA" },
  8453: { name: "Base", icon: "B", color: "#0052FF" },
  10: { name: "Optimism", icon: "OP", color: "#FF0420" },
  42161: { name: "Arbitrum", icon: "A", color: "#28A0F0" },
  137: { name: "Polygon", icon: "P", color: "#8247E5" },
  84532: { name: "Base Sepolia", icon: "BS", color: "#0052FF" },
  11155111: { name: "Sepolia", icon: "S", color: "#CFB5F0" },
}

export function getRpcUrl(chainId: number): string {
  const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID

  const rpcUrls: Record<number, string> = {
    1: alchemyId ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyId}` : "https://eth.llamarpc.com",
    8453: alchemyId ? `https://base-mainnet.g.alchemy.com/v2/${alchemyId}` : "https://mainnet.base.org",
    10: alchemyId ? `https://opt-mainnet.g.alchemy.com/v2/${alchemyId}` : "https://mainnet.optimism.io",
    42161: alchemyId ? `https://arb-mainnet.g.alchemy.com/v2/${alchemyId}` : "https://arb1.arbitrum.io/rpc",
    137: alchemyId ? `https://polygon-mainnet.g.alchemy.com/v2/${alchemyId}` : "https://polygon-rpc.com",
    84532: "https://sepolia.base.org",
    11155111: alchemyId ? `https://eth-sepolia.g.alchemy.com/v2/${alchemyId}` : "https://rpc.sepolia.org",
  }

  return rpcUrls[chainId] || ""
}

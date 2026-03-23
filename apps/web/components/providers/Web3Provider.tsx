"use client"

import { useState, useEffect } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit"
import { web3Config, web3Enabled } from "../../lib/web3/config"
import "@rainbow-me/rainbowkit/styles.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 2,
    },
  },
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Skip Web3 if no valid WalletConnect project ID is configured
  if (!web3Enabled || !web3Config) {
    return <>{children}</>
  }

  // Prevent SSR hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <WagmiProvider config={web3Config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#10b981",
            accentColorForeground: "white",
            borderRadius: "medium",
            fontStack: "system",
            overlayBlur: "small",
          })}
          modalSize="compact"
          appInfo={{ appName: "CastQuest Platform", learnMoreUrl: "https://castquest.xyz/docs" }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

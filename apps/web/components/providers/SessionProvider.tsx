"use client"

import { SessionProvider } from "next-auth/react"
import { type ReactNode } from "react"

interface AuthSessionProviderProps {
  children: ReactNode
}

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  )
}

'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Create QueryClient outside component to maintain single instance
const queryClient = new QueryClient();

export function AppPrivyProvider({ children }: { children: ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  // If no Privy App ID is configured, skip Privy authentication entirely
  // This allows the app to run in development without authentication
  if (!appId) {
    console.warn(
      'Privy App ID (NEXT_PUBLIC_PRIVY_APP_ID) is not set. Running without authentication.'
    );
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ['email', 'wallet', 'google', 'farcaster'],
        appearance: {
          theme: 'dark',
          accentColor: '#9333ea', // purple-600
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </PrivyProvider>
  );
}

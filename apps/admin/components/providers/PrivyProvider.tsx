'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

// Create QueryClient outside component to maintain single instance
const queryClient = new QueryClient();

export function AppPrivyProvider({ children }: { children: ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'Privy App ID (NEXT_PUBLIC_PRIVY_APP_ID) is not set. Privy will not be initialized correctly.'
      );
    } else {
      throw new Error(
        'Privy App ID (NEXT_PUBLIC_PRIVY_APP_ID) is required but was not provided.'
      );
    }
  }

  return (
    <PrivyProvider
      appId={appId as string}
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

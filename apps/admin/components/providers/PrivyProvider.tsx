'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

/**
 * App provider wrapper — previously used Privy auth, now uses Auth.js.
 * Kept as AppPrivyProvider for backwards compatibility with the admin layout.
 */
export function AppPrivyProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

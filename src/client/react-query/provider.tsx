import React from 'react';
import { QueryClient, QueryClientProvider, QueryClientProviderProps } from '@tanstack/react-query';

/**
 * Configuration for React Query provider
 */
export interface ReactQueryProviderConfig {
  queryClient?: QueryClient;
  children: React.ReactNode;
}

/**
 * Default Query Client with optimized settings
 */
export const createDefaultQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
  });
};

/**
 * Provider component for React Query
 */
export const ApiQueryProvider: React.FC<ReactQueryProviderConfig> = ({
  queryClient,
  children,
}) => {
  const client = queryClient || createDefaultQueryClient();

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
};

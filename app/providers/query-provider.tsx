'use client';

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';
import { toast } from 'sonner';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error: any, query) => {
            // Global error handling for queries
            console.error('Query Error:', error, 'Query Key:', query.queryKey);
            
            // Only show toast for queries that are actively being watched
            if (query.state.dataUpdateCount === 0) {
              toast.error('Failed to load data. Please try again.');
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error: any, variables, context, mutation) => {
            // Global error handling for mutations
            console.error('Mutation Error:', error);
            toast.error('Something went wrong. Please try again.');
          },
          onSuccess: (data, variables, context, mutation) => {
            // Global success handling for mutations (optional)
            // You can add success toasts here if needed
          },
        }),
        defaultOptions: {
          queries: {
            // Time before data is considered stale
            staleTime: 5 * 60 * 1000, // 5 minutes
            // Time before unused data is garbage collected
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            // Retry failed requests
            retry: (failureCount, error: any) => {
              // Don't retry on client errors (4xx) except timeout
              if (error?.status >= 400 && error?.status < 500 && error?.status !== 408) {
                return false;
              }
              return failureCount < 3;
            },
            // Retry delay with exponential backoff
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Don't refetch on window focus in development
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
            // Don't refetch on reconnect unless data is stale
            refetchOnReconnect: 'always',
            // Background refetch interval (optional)
            refetchInterval: false,
            // Network mode configuration
            networkMode: 'online',
          },
          mutations: {
            // Retry failed mutations
            retry: (failureCount, error: any) => {
              if (error?.status >= 400 && error?.status < 500) {
                return false;
              }
              return failureCount < 2;
            },
            // Mutation retry delay
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
            networkMode: 'online',
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only show devtools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom-right"
          buttonPosition="bottom-right"
          toggleButtonProps={{
            style: {
              marginBottom: '80px', // Adjust if you have a fixed footer
              marginRight: '20px',
            },
          }}
        />
      )}
    </QueryClientProvider>
  );
}
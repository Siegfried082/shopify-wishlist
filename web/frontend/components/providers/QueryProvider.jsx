import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Sets up the QueryClientProvider from react-query.
 */
export function QueryProvider({ children }) {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        // Disable retry for development
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
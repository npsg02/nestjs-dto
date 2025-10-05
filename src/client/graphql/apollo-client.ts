import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, NormalizedCacheObject, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

/**
 * Configuration for Apollo Client
 */
export interface ApolloClientConfig {
  uri: string;
  cache?: InMemoryCache;
  headers?: Record<string, string>;
  authToken?: string;
  onErrorCallback?: (error: any) => void;
}

/**
 * Create Apollo Client instance with common configuration
 */
export function createApolloClient(config: ApolloClientConfig): ApolloClient<NormalizedCacheObject> {
  const httpLink = new HttpLink({
    uri: config.uri,
    headers: config.headers || {},
  });

  // Auth middleware
  const authLink = new ApolloLink((operation, forward) => {
    if (config.authToken) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${config.authToken}`,
        },
      });
    }
    return forward(operation);
  });

  // Error handling link
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
    if (config.onErrorCallback) {
      config.onErrorCallback({ graphQLErrors, networkError });
    }
  });

  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: config.cache || new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
}

/**
 * Set authorization token for Apollo Client
 */
export function setApolloAuthToken(
  client: ApolloClient<NormalizedCacheObject>,
  token: string
): void {
  // This will be used with the authLink middleware
  (client as any).__authToken = token;
}

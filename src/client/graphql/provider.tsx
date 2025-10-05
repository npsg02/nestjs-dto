import React from 'react';
import { ApolloProvider, ApolloClient, NormalizedCacheObject } from '@apollo/client';

/**
 * Configuration for Apollo Provider
 */
export interface ApolloProviderConfig {
  client: ApolloClient<NormalizedCacheObject>;
  children: React.ReactNode;
}

/**
 * Provider component for Apollo Client
 */
export const GraphQLProvider: React.FC<ApolloProviderConfig> = ({
  client,
  children,
}) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
};

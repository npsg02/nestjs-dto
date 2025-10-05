import { useQuery, useMutation, useSubscription, QueryHookOptions, MutationHookOptions, SubscriptionHookOptions, DocumentNode } from '@apollo/client';

/**
 * Type-safe wrapper for useQuery
 */
export function useGraphQLQuery<TData = any, TVariables = any>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>
) {
  return useQuery<TData, TVariables>(query, options);
}

/**
 * Type-safe wrapper for useMutation
 */
export function useGraphQLMutation<TData = any, TVariables = any>(
  mutation: DocumentNode,
  options?: MutationHookOptions<TData, TVariables>
) {
  return useMutation<TData, TVariables>(mutation, options);
}

/**
 * Type-safe wrapper for useSubscription
 */
export function useGraphQLSubscription<TData = any, TVariables = any>(
  subscription: DocumentNode,
  options?: SubscriptionHookOptions<TData, TVariables>
) {
  return useSubscription<TData, TVariables>(subscription, options);
}

// Re-export Apollo Client hooks for convenience
export { useQuery, useMutation, useSubscription, useLazyQuery } from '@apollo/client';

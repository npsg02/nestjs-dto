import { useQuery, useMutation, UseQueryOptions, UseMutationOptions, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { ApiClient, ApiClientResponse } from '../api-client';
import { QueryBuilder } from '../query-builder';

/**
 * Hook for GET requests with React Query
 */
export function useApiQuery<T = any>(
  queryKey: any[],
  client: ApiClient,
  url: string,
  params?: any,
  options?: Omit<UseQueryOptions<ApiClientResponse<T>, Error>, 'queryKey' | 'queryFn'>
): UseQueryResult<ApiClientResponse<T>, Error> {
  return useQuery<ApiClientResponse<T>, Error>({
    queryKey,
    queryFn: () => client.get<T>(url, params),
    ...options,
  });
}

/**
 * Hook for GET requests with query builder
 */
export function useApiQueryBuilder<T = any>(
  queryKey: any[],
  client: ApiClient,
  url: string,
  queryBuilder: QueryBuilder<T>,
  options?: Omit<UseQueryOptions<ApiClientResponse<T>, Error>, 'queryKey' | 'queryFn'>
): UseQueryResult<ApiClientResponse<T>, Error> {
  return useQuery<ApiClientResponse<T>, Error>({
    queryKey,
    queryFn: () => client.query_get<T>(url, queryBuilder),
    ...options,
  });
}

/**
 * Hook for POST requests with React Query
 */
export function useApiPost<TData = any, TVariables = any>(
  client: ApiClient,
  url: string,
  options?: Omit<UseMutationOptions<ApiClientResponse<TData>, Error, TVariables>, 'mutationFn'>
): UseMutationResult<ApiClientResponse<TData>, Error, TVariables> {
  return useMutation<ApiClientResponse<TData>, Error, TVariables>({
    mutationFn: (variables) => client.post<TData>(url, variables),
    ...options,
  });
}

/**
 * Hook for PUT requests with React Query
 */
export function useApiPut<TData = any, TVariables = any>(
  client: ApiClient,
  url: string,
  options?: Omit<UseMutationOptions<ApiClientResponse<TData>, Error, TVariables>, 'mutationFn'>
): UseMutationResult<ApiClientResponse<TData>, Error, TVariables> {
  return useMutation<ApiClientResponse<TData>, Error, TVariables>({
    mutationFn: (variables) => client.put<TData>(url, variables),
    ...options,
  });
}

/**
 * Hook for PATCH requests with React Query
 */
export function useApiPatch<TData = any, TVariables = any>(
  client: ApiClient,
  url: string,
  options?: Omit<UseMutationOptions<ApiClientResponse<TData>, Error, TVariables>, 'mutationFn'>
): UseMutationResult<ApiClientResponse<TData>, Error, TVariables> {
  return useMutation<ApiClientResponse<TData>, Error, TVariables>({
    mutationFn: (variables) => client.patch<TData>(url, variables),
    ...options,
  });
}

/**
 * Hook for DELETE requests with React Query
 */
export function useApiDelete<TData = any>(
  client: ApiClient,
  url: string,
  options?: Omit<UseMutationOptions<ApiClientResponse<TData>, Error, void>, 'mutationFn'>
): UseMutationResult<ApiClientResponse<TData>, Error, void> {
  return useMutation<ApiClientResponse<TData>, Error, void>({
    mutationFn: () => client.delete<TData>(url),
    ...options,
  });
}

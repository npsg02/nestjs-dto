/**
 * Generic type for class constructor
 */
export type Type<T = any> = new (...args: any[]) => T;

/**
 * Query options for building queries
 */
export interface QueryOptions {
  page?: number;
  limit?: number;
  skip?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  search?: string;
  filters?: Array<{
    field: string;
    operator: string;
    value?: any;
  }>;
  logicalOperator?: 'AND' | 'OR';
}

/**
 * Pagination result type
 */
export interface PaginationResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

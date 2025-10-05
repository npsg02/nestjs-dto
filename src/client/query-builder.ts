import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { PaginationDto } from '../dto/pagination.dto';
import { SortDto, SortDirection } from '../dto/sort.dto';
import { FilterDto, FilterCondition } from '../dto/filter.dto';

/**
 * Query builder for constructing API requests
 */
export class QueryBuilder<T = any> {
  private params: any = {};

  constructor(private baseParams: any = {}) {
    this.params = { ...baseParams };
  }

  /**
   * Set pagination parameters
   */
  paginate(page: number, limit: number): this {
    this.params.page = page;
    this.params.limit = limit;
    return this;
  }

  /**
   * Set skip and limit parameters
   */
  skip(skip: number, limit: number): this {
    this.params.skip = skip;
    this.params.limit = limit;
    return this;
  }

  /**
   * Set cursor-based pagination
   */
  cursor(cursor: string, limit?: number): this {
    this.params.cursor = cursor;
    if (limit !== undefined) {
      this.params.limit = limit;
    }
    return this;
  }

  /**
   * Set sorting parameters
   */
  sort(sortBy: string, sortDirection: SortDirection = SortDirection.ASC): this {
    this.params.sortBy = sortBy;
    this.params.sortDirection = sortDirection;
    return this;
  }

  /**
   * Set search query
   */
  search(search: string): this {
    this.params.search = search;
    return this;
  }

  /**
   * Add a filter condition
   */
  filter(field: string, operator: string, value?: any): this {
    if (!this.params.filters) {
      this.params.filters = [];
    }
    this.params.filters.push({ field, operator, value });
    return this;
  }

  /**
   * Add multiple filter conditions
   */
  filters(filters: FilterCondition[]): this {
    this.params.filters = filters;
    return this;
  }

  /**
   * Set logical operator for filters
   */
  logicalOperator(operator: 'AND' | 'OR'): this {
    this.params.logicalOperator = operator;
    return this;
  }

  /**
   * Add custom parameter
   */
  param(key: string, value: any): this {
    this.params[key] = value;
    return this;
  }

  /**
   * Get the built query parameters
   */
  build(): any {
    return this.params;
  }

  /**
   * Clone the query builder
   */
  clone(): QueryBuilder<T> {
    return new QueryBuilder<T>({ ...this.params });
  }
}

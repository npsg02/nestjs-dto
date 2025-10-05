import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { QueryBuilder } from './query-builder';

/**
 * Configuration for API client
 */
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  auth?: {
    username?: string;
    password?: string;
    token?: string;
  };
}

/**
 * Response wrapper
 */
export interface ApiClientResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
}

/**
 * Paginated response from API
 */
export interface PaginatedApiResponse<T> {
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

/**
 * Generic API client for making requests to NestJS backend
 */
export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(config: ApiClientConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    // Add auth interceptor if token is provided
    if (config.auth?.token) {
      this.setAuthToken(config.auth.token);
    } else if (config.auth?.username && config.auth?.password) {
      this.setBasicAuth(config.auth.username, config.auth.password);
    }

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Set authorization token
   */
  setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Set basic authentication
   */
  setBasicAuth(username: string, password: string): void {
    const encoded = Buffer.from(`${username}:${password}`).toString('base64');
    this.axiosInstance.defaults.headers.common['Authorization'] = `Basic ${encoded}`;
  }

  /**
   * Create a query builder
   */
  query<T = any>(): QueryBuilder<T> {
    return new QueryBuilder<T>();
  }

  /**
   * GET request
   */
  async get<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiClientResponse<T>> {
    const response = await this.axiosInstance.get<T>(url, {
      ...config,
      params,
    });
    return this.wrapResponse(response);
  }

  /**
   * GET request with query builder
   */
  async query_get<T = any>(
    url: string,
    queryBuilder: QueryBuilder<T>,
    config?: AxiosRequestConfig
  ): Promise<ApiClientResponse<T>> {
    return this.get<T>(url, queryBuilder.build(), config);
  }

  /**
   * POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiClientResponse<T>> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return this.wrapResponse(response);
  }

  /**
   * PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiClientResponse<T>> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return this.wrapResponse(response);
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiClientResponse<T>> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return this.wrapResponse(response);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiClientResponse<T>> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return this.wrapResponse(response);
  }

  /**
   * Get paginated data
   */
  async getPaginated<T = any>(
    url: string,
    page: number = 1,
    limit: number = 10,
    additionalParams?: any
  ): Promise<ApiClientResponse<PaginatedApiResponse<T>>> {
    return this.get<PaginatedApiResponse<T>>(url, {
      page,
      limit,
      ...additionalParams,
    });
  }

  /**
   * Wrap axios response
   */
  private wrapResponse<T>(response: AxiosResponse<T>): ApiClientResponse<T> {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  }

  /**
   * Handle error
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText;
      const err = new Error(message);
      (err as any).status = error.response.status;
      (err as any).data = error.response.data;
      return err;
    } else if (error.request) {
      // Request made but no response
      return new Error('No response received from server');
    } else {
      // Error in request setup
      return error;
    }
  }

  /**
   * Get the underlying axios instance
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

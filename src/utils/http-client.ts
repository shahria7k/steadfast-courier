/**
 * HTTP client wrapper for API requests
 *
 * This module provides an HTTP client for making authenticated requests to the
 * Steadfast Courier API. Handles authentication, timeouts, and error handling.
 *
 * @module utils/http-client
 */

import { BASE_URL } from '../constants';
import { SteadfastApiError } from './errors';

/**
 * Configuration for HttpClient
 *
 * @example
 * ```typescript
 * const config: HttpClientConfig = {
 *   apiKey: 'your-api-key',
 *   secretKey: 'your-secret-key',
 *   baseUrl: 'https://portal.packzy.com/api/v1',
 *   timeout: 30000,
 * };
 * ```
 */
export interface HttpClientConfig {
  /** API key for authentication */
  apiKey: string;
  /** Secret key for authentication */
  secretKey: string;
  /** Optional base URL (defaults to production API) */
  baseUrl?: string;
  /** Optional request timeout in milliseconds (default: 30000) */
  timeout?: number;
}

/**
 * Request options for HTTP client
 *
 * @example
 * ```typescript
 * const options: RequestOptions = {
 *   method: 'POST',
 *   path: '/create_order',
 *   body: { invoice: 'INV-123' },
 * };
 * ```
 */
export interface RequestOptions {
  /** HTTP method to use */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** API endpoint path (relative to base URL) */
  path: string;
  /** Optional request body (will be JSON stringified) */
  body?: unknown;
  /** Optional additional headers */
  headers?: Record<string, string> | undefined;
}

/**
 * HTTP client for making API requests
 *
 * Handles all HTTP communication with the Steadfast Courier API.
 * Automatically adds authentication headers and handles timeouts.
 *
 * @example
 * ```typescript
 * import { HttpClient } from './utils/http-client';
 *
 * const client = new HttpClient({
 *   apiKey: 'your-api-key',
 *   secretKey: 'your-secret-key',
 * });
 *
 * // Make a GET request
 * const data = await client.get('/get_balance');
 *
 * // Make a POST request
 * const result = await client.post('/create_order', { invoice: 'INV-123' });
 * ```
 *
 * @see {@link HttpClientConfig} For configuration options
 * @see {@link RequestOptions} For request options
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly secretKey: string;
  private readonly timeout: number;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl || BASE_URL;
    this.apiKey = config.apiKey;
    this.secretKey = config.secretKey;
    this.timeout = config.timeout || 30000;
  }

  /**
   * Make an HTTP request
   *
   * Generic method for making HTTP requests to the Steadfast Courier API.
   * Handles authentication, timeouts, error handling, and response parsing.
   *
   * @param options - Request options including method, path, body, and headers
   * @returns Promise resolving to the response data typed as T
   * @throws {SteadfastApiError} If the request fails or returns an error status
   *
   * @example
   * ```typescript
   * const response = await httpClient.request<CreateOrderResponse>({
   *   method: 'POST',
   *   path: '/create_order',
   *   body: { invoice: 'INV-123', ... },
   * });
   * ```
   *
   * @see {@link RequestOptions} For request options structure
   */
  async request<T>(options: RequestOptions): Promise<T> {
    const url = `${this.baseUrl}${options.path}`;
    const headers: Record<string, string> = {
      'Api-Key': this.apiKey,
      'Secret-Key': this.secretKey,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const controller = new AbortController();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const timeoutId = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      controller.abort();
    }, this.timeout);

    try {
      const fetchOptions: {
        method: string;
        headers: Record<string, string>;
        body?: string;
        signal: AbortSignal;
      } = {
        method: options.method,
        headers,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        signal: controller.signal,
      };

      if (options.body) {
        fetchOptions.body = JSON.stringify(options.body);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const response = await fetch(url, fetchOptions);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      clearTimeout(timeoutId);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const contentType = response.headers.get('content-type');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const isJson = contentType?.includes('application/json') ?? false;

      let data: unknown;
      if (isJson) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        data = await response.json();
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const text = await response.text();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data = text ? { message: text } : {};
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!response.ok) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
        throw new SteadfastApiError(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (data as { message?: string })?.message ?? `HTTP ${response.status}`,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
          response.status,
          data
        );
      }

      return data as T;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      clearTimeout(timeoutId);

      if (error instanceof SteadfastApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new SteadfastApiError('Request timeout', 408);
        }
        throw new SteadfastApiError(`Request failed: ${error.message}`, 0);
      }

      throw new SteadfastApiError('Unknown error occurred', 0);
    }
  }

  /**
   * Make a GET request
   *
   * Convenience method for making GET requests to the API.
   *
   * @param path - API endpoint path (relative to base URL)
   * @param headers - Optional additional headers
   * @returns Promise resolving to the response data typed as T
   * @throws {SteadfastApiError} If the request fails
   *
   * @example
   * ```typescript
   * const balance = await httpClient.get<BalanceResponse>('/get_balance');
   * const status = await httpClient.get<DeliveryStatusResponse>('/status_by_cid/1424107');
   * ```
   */
  async get<T>(path: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ method: 'GET', path, headers });
  }

  /**
   * Make a POST request
   *
   * Convenience method for making POST requests to the API.
   * The body will be automatically JSON stringified.
   *
   * @param path - API endpoint path (relative to base URL)
   * @param body - Optional request body (will be JSON stringified)
   * @param headers - Optional additional headers
   * @returns Promise resolving to the response data typed as T
   * @throws {SteadfastApiError} If the request fails
   *
   * @example
   * ```typescript
   * const order = await httpClient.post<CreateOrderResponse>('/create_order', {
   *   invoice: 'INV-123',
   *   recipient_name: 'John Doe',
   *   // ... other fields
   * });
   * ```
   */
  async post<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ method: 'POST', path, body, headers });
  }

  /**
   * Make a DELETE request
   *
   * Convenience method for making DELETE requests to the API.
   *
   * @param path - API endpoint path (relative to base URL)
   * @param headers - Optional additional headers
   * @returns Promise resolving to the response data typed as T
   * @throws {SteadfastApiError} If the request fails
   *
   * @example
   * ```typescript
   * await httpClient.delete('/some-endpoint/123');
   * ```
   */
  async delete<T>(path: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ method: 'DELETE', path, headers });
  }
}

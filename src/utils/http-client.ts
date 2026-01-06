/**
 * HTTP client wrapper for API requests
 */

import { BASE_URL } from '../constants';
import { SteadfastApiError } from './errors';

export interface HttpClientConfig {
  apiKey: string;
  secretKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  body?: unknown;
  headers?: Record<string, string> | undefined;
}

/**
 * HTTP client for making API requests
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
   * GET request
   */
  async get<T>(path: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ method: 'GET', path, headers });
  }

  /**
   * POST request
   */
  async post<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ method: 'POST', path, body, headers });
  }

  /**
   * DELETE request
   */
  async delete<T>(path: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ method: 'DELETE', path, headers });
  }
}

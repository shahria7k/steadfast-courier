/**
 * Base service class with shared HTTP client logic
 *
 * This module provides the base service class that all other services extend.
 * It provides access to the shared HTTP client for making API requests.
 *
 * @module services/base
 */

import { HttpClient } from '../utils/http-client';

/**
 * Base service that all other services extend
 *
 * Provides a common base class for all service classes in the SDK.
 * Contains the shared HTTP client instance used for making API requests.
 *
 * @abstract
 *
 * @example
 * ```typescript
 * // This is an abstract class, not meant to be instantiated directly
 * // All service classes extend this base class
 * class MyService extends BaseService {
 *   async myMethod() {
 *     return this.httpClient.get('/my-endpoint');
 *   }
 * }
 * ```
 *
 * @see {@link HttpClient} For the HTTP client implementation
 */
export abstract class BaseService {
  /** Protected HTTP client instance for making API requests */
  protected readonly httpClient: HttpClient;

  /**
   * Creates a new BaseService instance
   *
   * @param httpClient - The HTTP client instance to use for API requests
   */
  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }
}

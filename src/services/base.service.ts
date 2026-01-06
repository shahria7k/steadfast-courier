/**
 * Base service class with shared HTTP client logic
 */

import { HttpClient } from '../utils/http-client';

/**
 * Base service that all other services extend
 */
export abstract class BaseService {
  protected readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }
}

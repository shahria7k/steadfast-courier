/**
 * Balance service for checking current balance
 *
 * This module provides functionality for checking your Steadfast Courier account balance.
 *
 * @module services/balance
 */

import { BaseService } from './base.service';

/**
 * Response for balance check
 *
 * Contains the current account balance in BDT (Bangladeshi Taka).
 *
 * @example
 * ```typescript
 * const balance = await client.balance.getBalance();
 * console.log(`Current balance: ${balance.current_balance} BDT`);
 * ```
 */
export interface BalanceResponse {
  /** HTTP status code from the API */
  status: number;
  /** Current account balance in BDT (Bangladeshi Taka) */
  current_balance: number;
}

/**
 * Service for balance operations
 *
 * Provides methods to check your Steadfast Courier account balance.
 *
 * @example
 * ```typescript
 * import { SteadfastClient } from 'steadfast-courier';
 *
 * const client = new SteadfastClient({
 *   apiKey: 'your-api-key',
 *   secretKey: 'your-secret-key',
 * });
 *
 * const balance = await client.balance.getBalance();
 * console.log(`Current balance: ${balance.current_balance} BDT`);
 * ```
 *
 * @see {@link BalanceResponse} For response structure
 */
export class BalanceService extends BaseService {
  /**
   * Get current account balance
   *
   * Retrieves the current balance of your Steadfast Courier account.
   * The balance is returned in BDT (Bangladeshi Taka).
   *
   * @returns Promise resolving to the balance response
   * @throws {SteadfastApiError} If the API request fails
   *
   * @example
   * ```typescript
   * const balance = await client.balance.getBalance();
   * console.log(`Current balance: ${balance.current_balance} BDT`);
   *
   * if (balance.current_balance < 1000) {
   *   console.warn('Low balance! Please top up your account.');
   * }
   * ```
   *
   * @see {@link BalanceResponse} For response structure
   */
  async getBalance(): Promise<BalanceResponse> {
    return this.httpClient.get<BalanceResponse>('/get_balance');
  }
}

/**
 * Balance service for checking current balance
 */

import { BaseService } from './base.service';

/**
 * Response for balance check
 */
export interface BalanceResponse {
  status: number;
  current_balance: number;
}

/**
 * Service for balance operations
 */
export class BalanceService extends BaseService {
  /**
   * Get current balance
   */
  async getBalance(): Promise<BalanceResponse> {
    return this.httpClient.get<BalanceResponse>('/get_balance');
  }
}

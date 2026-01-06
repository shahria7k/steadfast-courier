/**
 * Payment service for managing payments
 */

import { BaseService } from './base.service';
import { GetPaymentsResponse, GetPaymentResponse } from '../types/payment';

/**
 * Service for payment operations
 */
export class PaymentService extends BaseService {
  /**
   * Get all payments
   */
  async getPayments(): Promise<GetPaymentsResponse> {
    return this.httpClient.get<GetPaymentsResponse>('/payments');
  }

  /**
   * Get a single payment with consignments by payment ID
   */
  async getPayment(paymentId: number): Promise<GetPaymentResponse> {
    if (!Number.isInteger(paymentId) || paymentId <= 0) {
      throw new Error('paymentId must be a positive integer');
    }

    return this.httpClient.get<GetPaymentResponse>(`/payments/${paymentId}`);
  }
}

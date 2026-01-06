/**
 * Payment service for managing payments
 *
 * This module provides functionality for viewing payment information
 * and consignment payments from Steadfast Courier.
 *
 * @module services/payment
 */

import { BaseService } from './base.service';
import { GetPaymentsResponse, GetPaymentResponse } from '../types/payment';

/**
 * Service for payment operations
 *
 * Provides methods to retrieve payment information and view consignments
 * associated with payments.
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
 * // Get all payments
 * const payments = await client.payments.getPayments();
 *
 * // Get a single payment with consignments
 * const payment = await client.payments.getPayment(1);
 * ```
 *
 * @see {@link GetPaymentsResponse} For all payments response structure
 * @see {@link GetPaymentResponse} For single payment response structure
 */
export class PaymentService extends BaseService {
  /**
   * Get all payments
   *
   * Retrieves all payments associated with your account.
   * Payments are created when orders are delivered and COD is collected.
   *
   * @returns Promise resolving to an array of payment responses
   * @throws {SteadfastApiError} If the API request fails
   *
   * @example
   * ```typescript
   * const payments = await client.payments.getPayments();
   *
   * // Calculate total payments
   * const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
   * console.log(`Total payments: ${totalAmount} BDT`);
   *
   * // Filter by status
   * const completed = payments.filter(p => p.status === 'completed');
   * console.log(`Completed payments: ${completed.length}`);
   * ```
   *
   * @see {@link GetPaymentsResponse} For response structure
   */
  async getPayments(): Promise<GetPaymentsResponse> {
    return this.httpClient.get<GetPaymentsResponse>('/payments');
  }

  /**
   * Get a single payment with consignments by payment ID
   *
   * Retrieves detailed information about a specific payment, including
   * all consignments associated with that payment.
   *
   * @param paymentId - The payment ID (positive integer)
   * @returns Promise resolving to the payment response with consignments
   * @throws {Error} If paymentId is not a positive integer
   * @throws {SteadfastApiError} If the API request fails or payment is not found
   *
   * @example
   * ```typescript
   * const payment = await client.payments.getPayment(1);
   *
   * console.log(`Payment ID: ${payment.id}`);
   * console.log(`Amount: ${payment.amount} BDT`);
   * console.log(`Status: ${payment.status}`);
   * console.log(`Consignments: ${payment.consignments.length}`);
   *
   * // View consignment details
   * payment.consignments.forEach((consignment) => {
   *   console.log(`  - Invoice: ${consignment.invoice}`);
   *   console.log(`    COD Amount: ${consignment.cod_amount} BDT`);
   *   console.log(`    Delivery Charge: ${consignment.delivery_charge} BDT`);
   * });
   * ```
   *
   * @see {@link GetPaymentResponse} For response structure
   */
  async getPayment(paymentId: number): Promise<GetPaymentResponse> {
    if (!Number.isInteger(paymentId) || paymentId <= 0) {
      throw new Error('paymentId must be a positive integer');
    }

    return this.httpClient.get<GetPaymentResponse>(`/payments/${paymentId}`);
  }
}

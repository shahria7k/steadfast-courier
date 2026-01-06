/**
 * Status service for checking delivery status
 *
 * This module provides functionality for checking the delivery status of orders
 * using various identifiers (consignment ID, invoice, or tracking code).
 *
 * @module services/status
 */

import { BaseService } from './base.service';
import { DeliveryStatusResponse } from '../types/status';

/**
 * Service for checking delivery status
 *
 * Provides methods to check the current delivery status of orders using
 * consignment ID, invoice number, or tracking code.
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
 * // Check status by tracking code
 * const status = await client.status.getStatusByTrackingCode('15BAEB8A');
 * console.log(`Status: ${status.delivery_status}`);
 * ```
 *
 * @see {@link DeliveryStatusResponse} For response structure
 * @see {@link DeliveryStatus} For possible status values
 */
export class StatusService extends BaseService {
  /**
   * Get delivery status by consignment ID
   *
   * Retrieves the current delivery status of an order using its consignment ID.
   * The consignment ID is assigned by Steadfast when an order is created.
   *
   * @param consignmentId - The consignment ID assigned by Steadfast (positive integer)
   * @returns Promise resolving to the delivery status response
   * @throws {Error} If consignmentId is not a positive integer
   * @throws {SteadfastApiError} If the API request fails or consignment is not found
   *
   * @example
   * ```typescript
   * const status = await client.status.getStatusByConsignmentId(1424107);
   * console.log(`Status: ${status.delivery_status}`);
   * ```
   *
   * @see {@link DeliveryStatusResponse} For response structure
   */
  async getStatusByConsignmentId(consignmentId: number): Promise<DeliveryStatusResponse> {
    if (!Number.isInteger(consignmentId) || consignmentId <= 0) {
      throw new Error('consignmentId must be a positive integer');
    }

    return this.httpClient.get<DeliveryStatusResponse>(`/status_by_cid/${consignmentId}`);
  }

  /**
   * Get delivery status by invoice number
   *
   * Retrieves the current delivery status of an order using its invoice number.
   * The invoice number is the unique identifier you provided when creating the order.
   *
   * @param invoice - The invoice number used when creating the order
   * @returns Promise resolving to the delivery status response
   * @throws {Error} If invoice is not a non-empty string
   * @throws {SteadfastApiError} If the API request fails or invoice is not found
   *
   * @example
   * ```typescript
   * const status = await client.status.getStatusByInvoice('INV-12345');
   * console.log(`Status: ${status.delivery_status}`);
   * ```
   *
   * @see {@link DeliveryStatusResponse} For response structure
   */
  async getStatusByInvoice(invoice: string): Promise<DeliveryStatusResponse> {
    if (!invoice || typeof invoice !== 'string') {
      throw new Error('invoice must be a non-empty string');
    }

    return this.httpClient.get<DeliveryStatusResponse>(`/status_by_invoice/${invoice}`);
  }

  /**
   * Get delivery status by tracking code
   *
   * Retrieves the current delivery status of an order using its tracking code.
   * The tracking code is assigned by Steadfast when an order is created and
   * can be used by recipients to track their orders.
   *
   * @param trackingCode - The tracking code assigned by Steadfast (e.g., '15BAEB8A')
   * @returns Promise resolving to the delivery status response
   * @throws {Error} If trackingCode is not a non-empty string
   * @throws {SteadfastApiError} If the API request fails or tracking code is not found
   *
   * @example
   * ```typescript
   * const status = await client.status.getStatusByTrackingCode('15BAEB8A');
   * console.log(`Status: ${status.delivery_status}`);
   * ```
   *
   * @see {@link DeliveryStatusResponse} For response structure
   */
  async getStatusByTrackingCode(trackingCode: string): Promise<DeliveryStatusResponse> {
    if (!trackingCode || typeof trackingCode !== 'string') {
      throw new Error('trackingCode must be a non-empty string');
    }

    return this.httpClient.get<DeliveryStatusResponse>(`/status_by_trackingcode/${trackingCode}`);
  }
}

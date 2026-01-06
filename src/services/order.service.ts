/**
 * Order service for creating and managing orders
 *
 * This module provides functionality for creating single and bulk orders
 * with the Steadfast Courier API.
 *
 * @module services/order
 */

import { BaseService } from './base.service';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  BulkOrderItem,
  BulkOrderResponse,
} from '../types/order';
import {
  validateInvoice,
  validateRecipientName,
  validateRecipientAddress,
  validatePhoneNumber,
  validateCodAmount,
  validateEmail,
} from '../utils/validation';

/**
 * Service for order operations
 *
 * Provides methods to create single orders and bulk orders (up to 500 at once).
 * All orders are validated before submission to ensure data integrity.
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
 * // Create a single order
 * const order = await client.orders.createOrder({
 *   invoice: 'INV-12345',
 *   recipient_name: 'John Doe',
 *   recipient_phone: '01234567890',
 *   recipient_address: '123 Main St, Dhaka-1209',
 *   cod_amount: 1000,
 * });
 *
 * console.log(`Order created: ${order.consignment.tracking_code}`);
 * ```
 *
 * @see {@link CreateOrderRequest} For order creation request structure
 * @see {@link CreateOrderResponse} For order creation response structure
 * @see {@link BulkOrderItem} For bulk order item structure
 */
export class OrderService extends BaseService {
  /**
   * Create a single order
   *
   * Creates a new delivery order with the provided details.
   * All required fields are validated before submission.
   *
   * @param request - Order creation request containing recipient and order details
   * @returns Promise resolving to the created order response with consignment information
   * @throws {SteadfastValidationError} If any validation fails (invalid invoice, phone, etc.)
   * @throws {SteadfastApiError} If the API request fails
   *
   * @example
   * ```typescript
   * const order = await client.orders.createOrder({
   *   invoice: 'INV-12345',
   *   recipient_name: 'John Doe',
   *   recipient_phone: '01234567890',
   *   recipient_address: '123 Main St, Dhaka-1209',
   *   cod_amount: 1000,
   *   note: 'Handle with care',
   *   alternative_phone: '01987654321',
   *   recipient_email: 'john@example.com',
   * });
   *
   * console.log(`Tracking Code: ${order.consignment.tracking_code}`);
   * console.log(`Consignment ID: ${order.consignment.consignment_id}`);
   * ```
   *
   * @see {@link CreateOrderRequest} For request structure and field descriptions
   * @see {@link CreateOrderResponse} For response structure
   */
  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    // Validate input
    validateInvoice(request.invoice);
    validateRecipientName(request.recipient_name);
    validateRecipientAddress(request.recipient_address);
    validatePhoneNumber(request.recipient_phone, 'recipient_phone');
    validateCodAmount(request.cod_amount);

    if (request.alternative_phone) {
      validatePhoneNumber(request.alternative_phone, 'alternative_phone');
    }

    if (request.recipient_email) {
      validateEmail(request.recipient_email);
    }

    return this.httpClient.post<CreateOrderResponse>('/create_order', request);
  }

  /**
   * Create bulk orders (maximum 500 items)
   *
   * Creates multiple orders in a single API request. This is more efficient than
   * creating orders individually. Each order in the array is validated before submission.
   *
   * @param orders - Array of order items to create (maximum 500 items)
   * @returns Promise resolving to an array of responses, one for each order
   * @throws {Error} If orders is not an array, is empty, or exceeds 500 items
   * @throws {SteadfastValidationError} If any order validation fails
   * @throws {SteadfastApiError} If the API request fails
   *
   * @example
   * ```typescript
   * const bulkOrders = [
   *   {
   *     invoice: 'INV-001',
   *     recipient_name: 'John Doe',
   *     recipient_phone: '01234567890',
   *     recipient_address: '123 Main St',
   *     cod_amount: 1000,
   *   },
   *   {
   *     invoice: 'INV-002',
   *     recipient_name: 'Jane Smith',
   *     recipient_phone: '01987654321',
   *     recipient_address: '456 Oak Ave',
   *     cod_amount: 2000,
   *   },
   * ];
   *
   * const results = await client.orders.createBulkOrders(bulkOrders);
   *
   * // Check results
   * results.forEach((result) => {
   *   if (result.status === 'success') {
   *     console.log(`Order ${result.invoice} created: ${result.tracking_code}`);
   *   } else {
   *     console.error(`Order ${result.invoice} failed`);
   *   }
   * });
   * ```
   *
   * @see {@link BulkOrderItem} For order item structure
   * @see {@link BulkOrderResponse} For response structure
   */
  async createBulkOrders(orders: BulkOrderItem[]): Promise<BulkOrderResponse> {
    if (!Array.isArray(orders)) {
      throw new Error('orders must be an array');
    }

    if (orders.length === 0) {
      throw new Error('orders array cannot be empty');
    }

    if (orders.length > 500) {
      throw new Error('Maximum 500 orders allowed per bulk request');
    }

    // Validate each order
    for (const order of orders) {
      validateInvoice(order.invoice);
      validateRecipientName(order.recipient_name);
      validateRecipientAddress(order.recipient_address);
      validatePhoneNumber(order.recipient_phone, 'recipient_phone');
      validateCodAmount(order.cod_amount);

      if (order.alternative_phone) {
        validatePhoneNumber(order.alternative_phone, 'alternative_phone');
      }

      if (order.recipient_email) {
        validateEmail(order.recipient_email);
      }
    }

    return this.httpClient.post<BulkOrderResponse>('/create_order/bulk-order', {
      data: JSON.stringify(orders),
    });
  }
}

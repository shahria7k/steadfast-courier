/**
 * Order service for creating and managing orders
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
 */
export class OrderService extends BaseService {
  /**
   * Create a single order
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

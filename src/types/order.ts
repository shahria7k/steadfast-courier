/**
 * Order-related type definitions
 *
 * This module contains all TypeScript types and interfaces related to order creation and management.
 *
 * @module types/order
 */

/**
 * Request payload for creating a single order
 *
 * All fields except optional ones are required for successful order creation.
 * The invoice must be unique across all orders.
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
 * const order = await client.orders.createOrder({
 *   invoice: 'INV-12345',
 *   recipient_name: 'John Doe',
 *   recipient_phone: '01234567890',
 *   recipient_address: '123 Main St, Dhaka-1209',
 *   cod_amount: 1000,
 *   note: 'Handle with care',
 * });
 * ```
 *
 * @see {@link OrderService.createOrder} For creating an order
 * @see {@link CreateOrderResponse} For the response type
 */
export interface CreateOrderRequest {
  /**
   * Unique invoice identifier. Must be unique across all orders.
   * Can contain alphanumeric characters, hyphens, and underscores.
   *
   * @example `'INV-12345'`, `'ORDER_2024_001'`
   */
  invoice: string;
  /**
   * Recipient's full name. Maximum 100 characters.
   *
   * @example `'John Doe'`
   */
  recipient_name: string;
  /**
   * Recipient's primary phone number. Must be exactly 11 digits.
   *
   * @example `'01234567890'`
   */
  recipient_phone: string;
  /**
   * Optional alternative phone number. Must be exactly 11 digits if provided.
   *
   * @example `'01987654321'`
   */
  alternative_phone?: string;
  /**
   * Optional recipient email address.
   *
   * @example `'john@example.com'`
   */
  recipient_email?: string;
  /**
   * Recipient's delivery address. Maximum 250 characters.
   * Should include area, city, and postal code if applicable.
   *
   * @example `'123 Main St, Dhaka-1209'`
   */
  recipient_address: string;
  /**
   * Cash on delivery amount in BDT (Bangladeshi Taka).
   * Includes all charges. Must be greater than or equal to 0.
   *
   * @example `1000`
   */
  cod_amount: number;
  /**
   * Optional delivery instructions or notes for the courier.
   *
   * @example `'Handle with care'`, `'Call before delivery'`
   */
  note?: string;
  /**
   * Optional description of items being delivered.
   *
   * @example `'Electronics'`, `'Clothing'`
   */
  item_description?: string;
  /**
   * Optional total number of lots/items in the order.
   *
   * @example `1`, `5`
   */
  total_lot?: number;
  /**
   * Optional delivery type.
   * - `0` = Home delivery (default)
   * - `1` = Point delivery / Steadfast Hub pickup
   *
   * @see {@link DeliveryType} For enum values
   * @default `0` (Home delivery)
   */
  delivery_type?: number;
}

/**
 * Response for a successfully created order
 *
 * Returned by {@link OrderService.createOrder} when an order is successfully created.
 * Contains the order details and a consignment object with tracking information.
 *
 * @example
 * ```typescript
 * const response = await client.orders.createOrder(orderData);
 * console.log(`Order created: ${response.consignment.tracking_code}`);
 * console.log(`Consignment ID: ${response.consignment.consignment_id}`);
 * ```
 *
 * @see {@link OrderService.createOrder} For creating an order
 * @see {@link Consignment} For consignment details
 */
export interface CreateOrderResponse {
  /** HTTP status code (typically 200 for success) */
  status: number;
  /** Success message from the API */
  message: string;
  /** Consignment information including tracking code */
  consignment: Consignment;
}

/**
 * Consignment information
 *
 * Represents a delivery consignment created by Steadfast Courier.
 * Contains all details about the order and its current status.
 *
 * @example
 * ```typescript
 * const order = await client.orders.createOrder(orderData);
 * const consignment = order.consignment;
 *
 * console.log(`Tracking Code: ${consignment.tracking_code}`);
 * console.log(`Status: ${consignment.status}`);
 * console.log(`Created: ${consignment.created_at}`);
 * ```
 */
export interface Consignment {
  /** Unique consignment identifier assigned by Steadfast */
  consignment_id: number;
  /** Invoice number provided when creating the order */
  invoice: string;
  /** Unique tracking code for tracking the order */
  tracking_code: string;
  /** Recipient's name */
  recipient_name: string;
  /** Recipient's phone number */
  recipient_phone: string;
  /** Recipient's delivery address */
  recipient_address: string;
  /** Cash on delivery amount in BDT */
  cod_amount: number;
  /** Current delivery status */
  status: string;
  /** Optional delivery notes */
  note?: string;
  /** ISO 8601 timestamp of when the consignment was created */
  created_at: string;
  /** ISO 8601 timestamp of when the consignment was last updated */
  updated_at: string;
}

/**
 * Bulk order item for bulk order creation
 *
 * Represents a single order within a bulk order request.
 * Maximum 500 orders can be created in a single bulk request.
 *
 * @example
 * ```typescript
 * const bulkOrders: BulkOrderItem[] = [
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
 * ```
 *
 * @see {@link OrderService.createBulkOrders} For creating bulk orders
 * @see {@link BulkOrderResponse} For the response type
 */
export interface BulkOrderItem {
  /** Unique invoice identifier for this order */
  invoice: string;
  /** Recipient's full name (max 100 characters) */
  recipient_name: string;
  /** Recipient's phone number (11 digits) */
  recipient_phone: string;
  /** Recipient's delivery address (max 250 characters) */
  recipient_address: string;
  /** Cash on delivery amount in BDT (>= 0) */
  cod_amount: number;
  /** Optional delivery notes */
  note?: string;
  /** Optional alternative phone number (11 digits) */
  alternative_phone?: string;
  /** Optional recipient email */
  recipient_email?: string;
  /** Optional item description */
  item_description?: string;
  /** Optional total number of lots */
  total_lot?: number;
  /** Optional delivery type (0 = home, 1 = point) */
  delivery_type?: number;
}

/**
 * Response for a bulk order item
 *
 * Represents the result of creating a single order within a bulk order request.
 * Each item in the bulk request will have a corresponding response indicating success or failure.
 *
 * @example
 * ```typescript
 * const results = await client.orders.createBulkOrders(bulkOrders);
 *
 * results.forEach((result) => {
 *   if (result.status === 'success') {
 *     console.log(`Order ${result.invoice} created: ${result.tracking_code}`);
 *   } else {
 *     console.error(`Order ${result.invoice} failed`);
 *   }
 * });
 * ```
 */
export interface BulkOrderItemResponse {
  /** Invoice number for this order */
  invoice: string;
  /** Recipient's name */
  recipient_name: string;
  /** Recipient's address */
  recipient_address: string;
  /** Recipient's phone number */
  recipient_phone: string;
  /** COD amount as a string */
  cod_amount: string;
  /** Delivery notes (null if not provided) */
  note: string | null;
  /** Consignment ID if order was created successfully, null otherwise */
  consignment_id: number | null;
  /** Tracking code if order was created successfully, null otherwise */
  tracking_code: string | null;
  /** Status of the order creation: 'success' or 'error' */
  status: 'success' | 'error';
}

/**
 * Response for bulk order creation
 *
 * Array of responses, one for each order in the bulk request.
 * Each response indicates whether that specific order was created successfully.
 *
 * @example
 * ```typescript
 * const results = await client.orders.createBulkOrders(bulkOrders);
 *
 * const successful = results.filter(r => r.status === 'success');
 * const failed = results.filter(r => r.status === 'error');
 *
 * console.log(`Created ${successful.length} orders, ${failed.length} failed`);
 * ```
 *
 * @see {@link OrderService.createBulkOrders} For creating bulk orders
 * @see {@link BulkOrderItemResponse} For individual item response structure
 */
export type BulkOrderResponse = BulkOrderItemResponse[];

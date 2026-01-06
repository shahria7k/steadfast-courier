/**
 * Status-related type definitions
 *
 * This module contains TypeScript types and interfaces related to delivery status checking.
 *
 * @module types/status
 */

import { DeliveryStatus } from '../constants';

/**
 * Response for delivery status check
 *
 * Returned by status service methods when checking the delivery status of an order.
 *
 * @example
 * ```typescript
 * // By consignment ID
 * const status = await client.status.getStatusByConsignmentId(1424107);
 * console.log(`Status: ${status.delivery_status}`);
 *
 * // By invoice
 * const status2 = await client.status.getStatusByInvoice('INV-12345');
 * console.log(`Status: ${status2.delivery_status}`);
 *
 * // By tracking code
 * const status3 = await client.status.getStatusByTrackingCode('15BAEB8A');
 * console.log(`Status: ${status3.delivery_status}`);
 * ```
 *
 * @see {@link StatusService.getStatusByConsignmentId} For getting status by consignment ID
 * @see {@link StatusService.getStatusByInvoice} For getting status by invoice
 * @see {@link StatusService.getStatusByTrackingCode} For getting status by tracking code
 * @see {@link DeliveryStatus} For possible status enum values
 */
export interface DeliveryStatusResponse {
  /** HTTP status code from the API */
  status: number;
  /**
   * Current delivery status of the order.
   * Can be a {@link DeliveryStatus} enum value or a string if the status is not in the enum.
   */
  delivery_status: DeliveryStatus | string;
}

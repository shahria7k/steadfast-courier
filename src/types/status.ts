/**
 * Status-related type definitions
 */

import { DeliveryStatus } from '../constants';

/**
 * Response for delivery status check
 */
export interface DeliveryStatusResponse {
  status: number;
  delivery_status: DeliveryStatus | string;
}

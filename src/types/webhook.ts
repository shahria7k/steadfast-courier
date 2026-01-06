/**
 * Steadfast Courier webhook-related type definitions
 */

import { SteadfastWebhookNotificationType, SteadfastWebhookDeliveryStatus } from '../constants';

/**
 * Base Steadfast webhook payload structure
 */
export interface BaseSteadfastWebhookPayload {
  notification_type: SteadfastWebhookNotificationType;
  consignment_id: number;
  invoice: string;
  updated_at: string;
}

/**
 * Steadfast delivery status webhook payload
 */
export interface DeliveryStatusWebhook extends BaseSteadfastWebhookPayload {
  notification_type: SteadfastWebhookNotificationType.DELIVERY_STATUS;
  cod_amount: number;
  status: SteadfastWebhookDeliveryStatus;
  delivery_charge: number;
  tracking_message: string;
}

/**
 * Steadfast tracking update webhook payload
 */
export interface TrackingUpdateWebhook extends BaseSteadfastWebhookPayload {
  notification_type: SteadfastWebhookNotificationType.TRACKING_UPDATE;
  tracking_message: string;
}

/**
 * Union type for all webhook payloads
 */
export type WebhookPayload = DeliveryStatusWebhook | TrackingUpdateWebhook;

/**
 * Type guard to check if payload is a Steadfast delivery status webhook
 */
export function isDeliveryStatusWebhook(payload: WebhookPayload): payload is DeliveryStatusWebhook {
  return payload.notification_type === SteadfastWebhookNotificationType.DELIVERY_STATUS;
}

/**
 * Type guard to check if payload is a Steadfast tracking update webhook
 */
export function isTrackingUpdateWebhook(payload: WebhookPayload): payload is TrackingUpdateWebhook {
  return payload.notification_type === SteadfastWebhookNotificationType.TRACKING_UPDATE;
}

/**
 * Standard webhook success response
 */
export interface WebhookSuccessResponse {
  status: 'success';
  message: string;
}

/**
 * Standard webhook error response
 */
export interface WebhookErrorResponse {
  status: 'error';
  message: string;
}

/**
 * Union type for webhook responses
 */
export type WebhookResponse = WebhookSuccessResponse | WebhookErrorResponse;

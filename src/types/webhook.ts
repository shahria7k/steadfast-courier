/**
 * Steadfast Courier webhook-related type definitions
 *
 * This module contains all TypeScript types and interfaces related to Steadfast webhook handling,
 * including payload structures, response types, and type guards.
 *
 * @module types/webhook
 */

import { SteadfastWebhookNotificationType, SteadfastWebhookDeliveryStatus } from '../constants';

/**
 * Base Steadfast webhook payload structure
 *
 * All webhook payloads from Steadfast Courier extend this base interface.
 * Contains common fields present in all webhook notifications.
 *
 * @see {@link DeliveryStatusWebhook} For delivery status webhook payload
 * @see {@link TrackingUpdateWebhook} For tracking update webhook payload
 */
export interface BaseSteadfastWebhookPayload {
  /** The type of webhook notification received */
  notification_type: SteadfastWebhookNotificationType;
  /** Unique consignment identifier assigned by Steadfast */
  consignment_id: number;
  /** Invoice number provided when creating the order */
  invoice: string;
  /** ISO 8601 timestamp of when the webhook was generated */
  updated_at: string;
}

/**
 * Steadfast delivery status webhook payload
 *
 * Received when the delivery status of an order changes (e.g., pending → delivered).
 * Contains detailed information about the order status, COD amount, and delivery charges.
 *
 * @example
 * ```typescript
 * import { SteadfastWebhookHandler, SteadfastWebhookDeliveryStatus } from 'steadfast-courier/webhooks';
 *
 * const handler = new SteadfastWebhookHandler({ apiKey: 'your-api-key' });
 *
 * handler.onDeliveryStatus((payload) => {
 *   console.log(`Order ${payload.invoice} status: ${payload.status}`);
 *   console.log(`COD Amount: ${payload.cod_amount} BDT`);
 *
 *   if (payload.status === SteadfastWebhookDeliveryStatus.DELIVERED) {
 *     // Handle successful delivery
 *   }
 * });
 * ```
 *
 * @see {@link SteadfastWebhookNotificationType.DELIVERY_STATUS} For the notification type
 * @see {@link SteadfastWebhookDeliveryStatus} For possible status values
 */
export interface DeliveryStatusWebhook extends BaseSteadfastWebhookPayload {
  /** Always {@link SteadfastWebhookNotificationType.DELIVERY_STATUS} for this payload type */
  notification_type: SteadfastWebhookNotificationType.DELIVERY_STATUS;
  /** Cash on delivery amount in BDT (Bangladeshi Taka) */
  cod_amount: number;
  /** Current delivery status of the order */
  status: SteadfastWebhookDeliveryStatus;
  /** Delivery charge in BDT */
  delivery_charge: number;
  /** Human-readable tracking message describing the current status */
  tracking_message: string;
}

/**
 * Steadfast tracking update webhook payload
 *
 * Received when there's a tracking update for an order (e.g., location change, status update).
 * Contains a tracking message with details about the update.
 *
 * @example
 * ```typescript
 * import { SteadfastWebhookHandler } from 'steadfast-courier/webhooks';
 *
 * const handler = new SteadfastWebhookHandler({ apiKey: 'your-api-key' });
 *
 * handler.onTrackingUpdate((payload) => {
 *   console.log(`Tracking update for order ${payload.invoice}:`);
 *   console.log(payload.tracking_message);
 * });
 * ```
 *
 * @see {@link SteadfastWebhookNotificationType.TRACKING_UPDATE} For the notification type
 */
export interface TrackingUpdateWebhook extends BaseSteadfastWebhookPayload {
  /** Always {@link SteadfastWebhookNotificationType.TRACKING_UPDATE} for this payload type */
  notification_type: SteadfastWebhookNotificationType.TRACKING_UPDATE;
  /** Human-readable tracking message describing the update */
  tracking_message: string;
}

/**
 * Union type for all webhook payloads
 *
 * Represents any valid webhook payload that can be received from Steadfast Courier.
 * Use type guards to narrow down the specific payload type.
 *
 * @example
 * ```typescript
 * import { WebhookPayload, isDeliveryStatusWebhook } from 'steadfast-courier';
 *
 * function handleWebhook(payload: WebhookPayload) {
 *   if (isDeliveryStatusWebhook(payload)) {
 *     // payload is now typed as DeliveryStatusWebhook
 *     console.log(payload.status);
 *   }
 * }
 * ```
 *
 * @see {@link DeliveryStatusWebhook} For delivery status payloads
 * @see {@link TrackingUpdateWebhook} For tracking update payloads
 * @see {@link isDeliveryStatusWebhook} For type guard function
 * @see {@link isTrackingUpdateWebhook} For type guard function
 */
export type WebhookPayload = DeliveryStatusWebhook | TrackingUpdateWebhook;

/**
 * Type guard to check if payload is a Steadfast delivery status webhook
 *
 * Use this function to narrow down a {@link WebhookPayload} to a specific {@link DeliveryStatusWebhook}.
 *
 * @param payload - The webhook payload to check
 * @returns `true` if the payload is a delivery status webhook, `false` otherwise
 *
 * @example
 * ```typescript
 * import { WebhookPayload, isDeliveryStatusWebhook } from 'steadfast-courier';
 *
 * function handleWebhook(payload: WebhookPayload) {
 *   if (isDeliveryStatusWebhook(payload)) {
 *     // TypeScript now knows payload is DeliveryStatusWebhook
 *     console.log(payload.status); // ✅ Type-safe access
 *     console.log(payload.cod_amount); // ✅ Type-safe access
 *   }
 * }
 * ```
 *
 * @see {@link DeliveryStatusWebhook} For the delivery status webhook type
 * @see {@link isTrackingUpdateWebhook} For checking tracking update webhooks
 */
export function isDeliveryStatusWebhook(payload: WebhookPayload): payload is DeliveryStatusWebhook {
  return payload.notification_type === SteadfastWebhookNotificationType.DELIVERY_STATUS;
}

/**
 * Type guard to check if payload is a Steadfast tracking update webhook
 *
 * Use this function to narrow down a {@link WebhookPayload} to a specific {@link TrackingUpdateWebhook}.
 *
 * @param payload - The webhook payload to check
 * @returns `true` if the payload is a tracking update webhook, `false` otherwise
 *
 * @example
 * ```typescript
 * import { WebhookPayload, isTrackingUpdateWebhook } from 'steadfast-courier';
 *
 * function handleWebhook(payload: WebhookPayload) {
 *   if (isTrackingUpdateWebhook(payload)) {
 *     // TypeScript now knows payload is TrackingUpdateWebhook
 *     console.log(payload.tracking_message); // ✅ Type-safe access
 *   }
 * }
 * ```
 *
 * @see {@link TrackingUpdateWebhook} For the tracking update webhook type
 * @see {@link isDeliveryStatusWebhook} For checking delivery status webhooks
 */
export function isTrackingUpdateWebhook(payload: WebhookPayload): payload is TrackingUpdateWebhook {
  return payload.notification_type === SteadfastWebhookNotificationType.TRACKING_UPDATE;
}

/**
 * Standard webhook success response
 *
 * Returned by webhook handlers when a webhook is successfully processed.
 *
 * @see {@link createSuccessResponse} For creating this response
 */
export interface WebhookSuccessResponse {
  /** Always `'success'` for successful responses */
  status: 'success';
  /** Success message */
  message: string;
}

/**
 * Standard webhook error response
 *
 * Returned by webhook handlers when a webhook processing fails.
 *
 * @see {@link createErrorResponse} For creating this response
 */
export interface WebhookErrorResponse {
  /** Always `'error'` for error responses */
  status: 'error';
  /** Error message describing what went wrong */
  message: string;
}

/**
 * Union type for webhook responses
 *
 * Represents the response returned by webhook handlers after processing a webhook.
 *
 * @example
 * ```typescript
 * import { WebhookResponse } from 'steadfast-courier';
 *
 * function handleWebhookResponse(response: WebhookResponse) {
 *   if (response.status === 'success') {
 *     console.log('Webhook processed successfully');
 *   } else {
 *     console.error('Webhook processing failed:', response.message);
 *   }
 * }
 * ```
 *
 * @see {@link WebhookSuccessResponse} For success responses
 * @see {@link WebhookErrorResponse} For error responses
 */
export type WebhookResponse = WebhookSuccessResponse | WebhookErrorResponse;

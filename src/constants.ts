/**
 * API Constants for Steadfast Courier
 */

export const BASE_URL = 'https://portal.packzy.com/api/v1';

/**
 * Delivery status values
 */
export enum DeliveryStatus {
  PENDING = 'pending',
  DELIVERED_APPROVAL_PENDING = 'delivered_approval_pending',
  PARTIAL_DELIVERED_APPROVAL_PENDING = 'partial_delivered_approval_pending',
  CANCELLED_APPROVAL_PENDING = 'cancelled_approval_pending',
  UNKNOWN_APPROVAL_PENDING = 'unknown_approval_pending',
  DELIVERED = 'delivered',
  PARTIAL_DELIVERED = 'partial_delivered',
  CANCELLED = 'cancelled',
  HOLD = 'hold',
  IN_REVIEW = 'in_review',
  UNKNOWN = 'unknown',
}

/**
 * Return request status values
 */
export enum ReturnStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Delivery type values
 */
export enum DeliveryType {
  HOME_DELIVERY = 0,
  POINT_DELIVERY = 1,
}

/**
 * Delivery status values for webhooks
 * These are the status values that can appear in delivery status webhooks
 */
export enum SteadfastWebhookDeliveryStatus {
  PENDING = 'pending',
  DELIVERED = 'delivered',
  PARTIAL_DELIVERED = 'partial_delivered',
  CANCELLED = 'cancelled',
  UNKNOWN = 'unknown',
}

/**
 * Steadfast Courier webhook notification types
 */
export enum SteadfastWebhookNotificationType {
  DELIVERY_STATUS = 'delivery_status',
  TRACKING_UPDATE = 'tracking_update',
}

/**
 * Steadfast Courier webhook event names emitted by SteadfastWebhookHandler
 *
 * @example
 * ```typescript
 * import { SteadfastWebhookHandler, SteadfastWebhookEvent } from 'steadfast-courier/webhooks';
 *
 * const handler = new SteadfastWebhookHandler({ apiKey: 'your-key' });
 *
 * // Listen to all webhooks
 * handler.on(SteadfastWebhookEvent.WEBHOOK, (payload) => {
 *   console.log('Received webhook:', payload);
 * });
 *
 * // Listen to delivery status updates
 * handler.on(SteadfastWebhookEvent.DELIVERY_STATUS, (payload) => {
 *   console.log('Delivery status updated:', payload);
 * });
 *
 * // Listen to tracking updates
 * handler.on(SteadfastWebhookEvent.TRACKING_UPDATE, (payload) => {
 *   console.log('Tracking updated:', payload);
 * });
 *
 * // Listen to errors
 * handler.on(SteadfastWebhookEvent.ERROR, (error) => {
 *   console.error('Webhook error:', error);
 * });
 * ```
 */
export enum SteadfastWebhookEvent {
  /**
   * Emitted for any Steadfast webhook payload after successful parsing and authentication.
   * This is a generic event that fires for all webhook types.
   *
   * @event SteadfastWebhookEvent.WEBHOOK
   * @type {WebhookPayload}
   */
  WEBHOOK = 'steadfast_webhook',

  /**
   * Emitted when a delivery status update webhook is received from Steadfast.
   * This event is emitted after the delivery_status handler is called (if set).
   *
   * @event SteadfastWebhookEvent.DELIVERY_STATUS
   * @type {DeliveryStatusWebhook}
   */
  DELIVERY_STATUS = 'steadfast_delivery_status',

  /**
   * Emitted when a tracking update webhook is received from Steadfast.
   * This event is emitted after the tracking_update handler is called (if set).
   *
   * @event SteadfastWebhookEvent.TRACKING_UPDATE
   * @type {TrackingUpdateWebhook}
   */
  TRACKING_UPDATE = 'steadfast_tracking_update',

  /**
   * Emitted when an error occurs during Steadfast webhook processing.
   * This includes authentication failures, parsing errors, and handler errors.
   *
   * @event SteadfastWebhookEvent.ERROR
   * @type {Error}
   */
  ERROR = 'steadfast_webhook_error',
}

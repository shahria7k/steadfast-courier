/**
 * API Constants for Steadfast Courier
 */

export const BASE_URL = 'https://portal.packzy.com/api/v1';

/**
 * Delivery status values returned by the Steadfast Courier API
 *
 * These statuses represent the current state of a delivery order.
 *
 * @see {@link SteadfastWebhookDeliveryStatus} For webhook-specific delivery status values
 */
export enum DeliveryStatus {
  /** Order is pending and awaiting processing */
  PENDING = 'pending',
  /** Order has been delivered and is awaiting approval confirmation */
  DELIVERED_APPROVAL_PENDING = 'delivered_approval_pending',
  /** Order has been partially delivered and is awaiting approval confirmation */
  PARTIAL_DELIVERED_APPROVAL_PENDING = 'partial_delivered_approval_pending',
  /** Order has been cancelled and is awaiting approval confirmation */
  CANCELLED_APPROVAL_PENDING = 'cancelled_approval_pending',
  /** Order status is unknown and awaiting approval confirmation */
  UNKNOWN_APPROVAL_PENDING = 'unknown_approval_pending',
  /** Order has been successfully delivered to the recipient */
  DELIVERED = 'delivered',
  /** Order has been partially delivered (some items delivered, some pending) */
  PARTIAL_DELIVERED = 'partial_delivered',
  /** Order has been cancelled and will not be delivered */
  CANCELLED = 'cancelled',
  /** Order is on hold and delivery is temporarily suspended */
  HOLD = 'hold',
  /** Order is currently under review */
  IN_REVIEW = 'in_review',
  /** Order status is unknown or could not be determined */
  UNKNOWN = 'unknown',
}

/**
 * Return request status values
 *
 * These statuses represent the current state of a return request for a delivered order.
 */
export enum ReturnStatus {
  /** Return request has been submitted and is pending approval */
  PENDING = 'pending',
  /** Return request has been approved and is ready for processing */
  APPROVED = 'approved',
  /** Return request is currently being processed */
  PROCESSING = 'processing',
  /** Return request has been completed successfully */
  COMPLETED = 'completed',
  /** Return request has been cancelled and will not be processed */
  CANCELLED = 'cancelled',
}

/**
 * Delivery type values
 *
 * Specifies how the order should be delivered to the recipient.
 */
export enum DeliveryType {
  /** Order will be delivered to the recipient's home address */
  HOME_DELIVERY = 0,
  /** Order will be delivered to a Steadfast Hub/Point for recipient pickup */
  POINT_DELIVERY = 1,
}

/**
 * Delivery status values for webhooks
 *
 * These are the status values that can appear in delivery status webhooks.
 * This enum is specifically for webhook payloads and contains a subset of the
 * full {@link DeliveryStatus} enum values.
 *
 * @see {@link DeliveryStatus} For the complete list of delivery status values
 * @see {@link DeliveryStatusWebhook} For the webhook payload type that uses this enum
 */
export enum SteadfastWebhookDeliveryStatus {
  /** Order is pending and awaiting processing */
  PENDING = 'pending',
  /** Order has been successfully delivered to the recipient */
  DELIVERED = 'delivered',
  /** Order has been partially delivered (some items delivered, some pending) */
  PARTIAL_DELIVERED = 'partial_delivered',
  /** Order has been cancelled and will not be delivered */
  CANCELLED = 'cancelled',
  /** Order status is unknown or could not be determined */
  UNKNOWN = 'unknown',
}

/**
 * Steadfast Courier webhook notification types
 *
 * These values identify the type of webhook notification received from Steadfast.
 * Used to determine which webhook handler should process the payload.
 *
 * @see {@link WebhookPayload} For the union type that uses this enum
 * @see {@link SteadfastWebhookHandler} For webhook handling functionality
 */
export enum SteadfastWebhookNotificationType {
  /**
   * Delivery status update notification
   *
   * Sent when the delivery status of an order changes.
   * Contains information about the order status, COD amount, and delivery details.
   *
   * @see {@link DeliveryStatusWebhook} For the payload structure
   */
  DELIVERY_STATUS = 'delivery_status',
  /**
   * Tracking update notification
   *
   * Sent when there's a tracking update for an order (e.g., location update, status change).
   * Contains tracking message and order information.
   *
   * @see {@link TrackingUpdateWebhook} For the payload structure
   */
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

/**
 * Webhook payload parsing and validation
 */

import { WebhookPayload, DeliveryStatusWebhook, TrackingUpdateWebhook } from '../types/webhook';
import { SteadfastWebhookNotificationType } from '../constants';
import { SteadfastValidationError } from '../utils/errors';

/**
 * Parse and validate webhook payload
 */
export function parseWebhookPayload(data: unknown): WebhookPayload {
  if (!data || typeof data !== 'object') {
    throw new SteadfastValidationError('Invalid webhook payload: must be an object');
  }

  const payload = data as Record<string, unknown>;

  if (!payload.notification_type || typeof payload.notification_type !== 'string') {
    throw new SteadfastValidationError('Invalid webhook payload: notification_type is required');
  }

  // Validate common fields
  if (!payload.consignment_id || typeof payload.consignment_id !== 'number') {
    throw new SteadfastValidationError('Invalid webhook payload: consignment_id is required and must be a number');
  }

  if (!payload.invoice || typeof payload.invoice !== 'string') {
    throw new SteadfastValidationError('Invalid webhook payload: invoice is required and must be a string');
  }

  if (!payload.updated_at || typeof payload.updated_at !== 'string') {
    throw new SteadfastValidationError('Invalid webhook payload: updated_at is required and must be a string');
  }

  // Parse based on notification type
  if (payload.notification_type === SteadfastWebhookNotificationType.DELIVERY_STATUS) {
    return parseDeliveryStatusWebhook(payload);
  } else if (payload.notification_type === SteadfastWebhookNotificationType.TRACKING_UPDATE) {
    return parseTrackingUpdateWebhook(payload);
  } else {
    throw new SteadfastValidationError(
      `Unknown notification_type: ${payload.notification_type}`
    );
  }
}

/**
 * Parse delivery status webhook payload
 */
function parseDeliveryStatusWebhook(payload: Record<string, unknown>): DeliveryStatusWebhook {
  if (typeof payload.cod_amount !== 'number') {
    throw new SteadfastValidationError('Invalid delivery_status webhook: cod_amount is required and must be a number');
  }

  if (!payload.status || typeof payload.status !== 'string') {
    throw new SteadfastValidationError('Invalid delivery_status webhook: status is required and must be a string');
  }

  const validStatuses = ['pending', 'delivered', 'partial_delivered', 'cancelled', 'unknown'];
  if (!validStatuses.includes(payload.status)) {
    throw new SteadfastValidationError(
      `Invalid delivery_status webhook: status must be one of ${validStatuses.join(', ')}`
    );
  }

  if (typeof payload.delivery_charge !== 'number') {
    throw new SteadfastValidationError(
      'Invalid delivery_status webhook: delivery_charge is required and must be a number'
    );
  }

  if (!payload.tracking_message || typeof payload.tracking_message !== 'string') {
    throw new SteadfastValidationError(
      'Invalid delivery_status webhook: tracking_message is required and must be a string'
    );
  }

  return {
    notification_type: SteadfastWebhookNotificationType.DELIVERY_STATUS,
    consignment_id: payload.consignment_id as number,
    invoice: payload.invoice as string,
    cod_amount: payload.cod_amount,
    status: payload.status as DeliveryStatusWebhook['status'],
    delivery_charge: payload.delivery_charge,
    tracking_message: payload.tracking_message,
    updated_at: payload.updated_at as string,
  };
}

/**
 * Parse tracking update webhook payload
 */
function parseTrackingUpdateWebhook(payload: Record<string, unknown>): TrackingUpdateWebhook {
  if (!payload.tracking_message || typeof payload.tracking_message !== 'string') {
    throw new SteadfastValidationError(
      'Invalid tracking_update webhook: tracking_message is required and must be a string'
    );
  }

  return {
    notification_type: SteadfastWebhookNotificationType.TRACKING_UPDATE,
    consignment_id: payload.consignment_id as number,
    invoice: payload.invoice as string,
    tracking_message: payload.tracking_message,
    updated_at: payload.updated_at as string,
  };
}

/**
 * Webhook response helpers
 */

import { WebhookSuccessResponse, WebhookErrorResponse } from '../types/webhook';

/**
 * Create a standard success response for webhooks
 */
export function createSuccessResponse(message: string = 'Webhook received successfully.'): WebhookSuccessResponse {
  return {
    status: 'success',
    message,
  };
}

/**
 * Create a standard error response for webhooks
 */
export function createErrorResponse(message: string): WebhookErrorResponse {
  return {
    status: 'error',
    message,
  };
}

/**
 * Webhook response helpers
 *
 * This module provides helper functions for creating standardized webhook responses.
 *
 * @module webhooks/responses
 */

import { WebhookSuccessResponse, WebhookErrorResponse } from '../types/webhook';

/**
 * Create a standard success response for webhooks
 *
 * Creates a standardized success response that should be returned when a webhook
 * is successfully processed.
 *
 * @param message - Optional success message (defaults to "Webhook received successfully.")
 * @returns Webhook success response object
 *
 * @example
 * ```typescript
 * import { createSuccessResponse } from 'steadfast-courier/webhooks';
 *
 * const result = await processWebhook(payload);
 * const response = createSuccessResponse('Webhook processed successfully');
 * // Returns: { status: 'success', message: 'Webhook processed successfully' }
 * ```
 *
 * @see {@link WebhookSuccessResponse} For response structure
 * @see {@link createErrorResponse} For creating error responses
 */
export function createSuccessResponse(
  message: string = 'Webhook received successfully.'
): WebhookSuccessResponse {
  return {
    status: 'success',
    message,
  };
}

/**
 * Create a standard error response for webhooks
 *
 * Creates a standardized error response that should be returned when a webhook
 * processing fails (e.g., validation error, authentication failure).
 *
 * @param message - Error message describing what went wrong
 * @returns Webhook error response object
 *
 * @example
 * ```typescript
 * import { createErrorResponse } from 'steadfast-courier/webhooks';
 *
 * try {
 *   await processWebhook(payload);
 * } catch (error) {
 *   const response = createErrorResponse(error.message);
 *   // Returns: { status: 'error', message: 'Error message here' }
 *   return response;
 * }
 * ```
 *
 * @see {@link WebhookErrorResponse} For response structure
 * @see {@link createSuccessResponse} For creating success responses
 */
export function createErrorResponse(message: string): WebhookErrorResponse {
  return {
    status: 'error',
    message,
  };
}

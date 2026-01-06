/**
 * Express.js adapter for webhook handling
 *
 * This module provides Express.js-specific adapter functions for handling
 * Steadfast Courier webhooks in Express.js applications.
 *
 * @module webhooks/adapters/express
 */

import { Request, Response, NextFunction } from 'express';
import { SteadfastWebhookHandler, SteadfastWebhookHandlerConfig } from '../handler';

/**
 * Create an Express.js middleware function for handling Steadfast webhooks
 *
 * Returns an Express.js middleware function that can be used as a route handler.
 * The middleware handles authentication, payload parsing, and response formatting.
 *
 * @param config - Configuration for the webhook handler (API key, etc.)
 * @param handlerInstance - Optional existing handler instance with callbacks already set up
 * @returns Express.js middleware function `(req, res, next) => Promise<void>`
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { createSteadfastExpressWebhookHandler } from 'steadfast-courier/webhooks';
 *
 * const app = express();
 * app.use(express.json());
 *
 * // Simple usage without callbacks
 * const webhookHandler = createSteadfastExpressWebhookHandler({
 *   apiKey: 'your-api-key',
 * });
 *
 * app.post('/steadfast-webhook', webhookHandler);
 * ```
 *
 * @example
 * ```typescript
 * // Usage with callbacks
 * import { SteadfastWebhookHandler, createSteadfastExpressWebhookHandler } from 'steadfast-courier/webhooks';
 *
 * const handler = new SteadfastWebhookHandler({ apiKey: 'your-api-key' });
 * handler.onDeliveryStatus(async (payload) => {
 *   console.log('Delivery status:', payload.status);
 * });
 *
 * const webhookHandler = createSteadfastExpressWebhookHandler(
 *   { apiKey: 'your-api-key' },
 *   handler // Pass handler instance with callbacks
 * );
 *
 * app.post('/steadfast-webhook', webhookHandler);
 * ```
 *
 * @see {@link SteadfastWebhookHandler.express} For using handler instance directly
 * @see {@link SteadfastWebhookHandlerConfig} For configuration options
 */
export function createSteadfastExpressWebhookHandler(
  config: SteadfastWebhookHandlerConfig,
  handlerInstance?: SteadfastWebhookHandler
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  const handler = handlerInstance ?? new SteadfastWebhookHandler(config);

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const authHeader = req.headers.authorization;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      const result = await handler.handle(req.body, authHeader);

      const statusCode = result.status === 'success' ? 200 : 400;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      res.status(statusCode);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      res.json(result);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      next(error);
    }
  };
}

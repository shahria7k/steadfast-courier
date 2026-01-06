/**
 * Fastify adapter for webhook handling
 *
 * This module provides Fastify-specific adapter functions for handling
 * Steadfast Courier webhooks in Fastify applications.
 *
 * @module webhooks/adapters/fastify
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { SteadfastWebhookHandler, SteadfastWebhookHandlerConfig } from '../handler';

/**
 * Create a Fastify route handler function for handling Steadfast webhooks
 *
 * Returns a Fastify route handler function that can be used in routes.
 * The handler processes authentication, payload parsing, and response formatting.
 *
 * @param config - Configuration for the webhook handler (API key, etc.)
 * @param handlerInstance - Optional existing handler instance with callbacks already set up
 * @returns Fastify route handler function `(req, reply) => Promise<void>`
 *
 * @example
 * ```typescript
 * import Fastify from 'fastify';
 * import { createSteadfastFastifyWebhookHandler } from 'steadfast-courier/webhooks';
 *
 * const fastify = Fastify();
 *
 * // Simple usage without callbacks
 * const webhookHandler = createSteadfastFastifyWebhookHandler({
 *   apiKey: 'your-api-key',
 * });
 *
 * fastify.post('/steadfast-webhook', webhookHandler);
 * ```
 *
 * @example
 * ```typescript
 * // Usage with callbacks
 * import { SteadfastWebhookHandler, createSteadfastFastifyWebhookHandler } from 'steadfast-courier/webhooks';
 *
 * const handler = new SteadfastWebhookHandler({ apiKey: 'your-api-key' });
 * handler.onDeliveryStatus(async (payload) => {
 *   console.log('Delivery status:', payload.status);
 * });
 *
 * const webhookHandler = createSteadfastFastifyWebhookHandler(
 *   { apiKey: 'your-api-key' },
 *   handler // Pass handler instance with callbacks
 * );
 *
 * fastify.post('/steadfast-webhook', webhookHandler);
 * ```
 *
 * @see {@link SteadfastWebhookHandler.fastify} For using handler instance directly
 * @see {@link SteadfastWebhookHandlerConfig} For configuration options
 */
export function createSteadfastFastifyWebhookHandler(
  config: SteadfastWebhookHandlerConfig,
  handlerInstance?: SteadfastWebhookHandler
): (req: FastifyRequest, reply: FastifyReply) => Promise<void> {
  const handler = handlerInstance ?? new SteadfastWebhookHandler(config);

  return async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const authHeader = req.headers.authorization;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    const result = await handler.handle(req.body, authHeader);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await reply.status(result.status === 'success' ? 200 : 400).send(result);
  };
}

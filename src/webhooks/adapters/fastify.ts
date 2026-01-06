/**
 * Fastify adapter for webhook handling
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { SteadfastWebhookHandler, SteadfastWebhookHandlerConfig } from '../handler';

/**
 * Fastify route handler for Steadfast webhooks
 * @param config - Configuration for the webhook handler
 * @param handlerInstance - Optional existing handler instance (if you want to use callbacks)
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

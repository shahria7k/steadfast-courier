/**
 * Fastify adapter for webhook handling
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { SteadfastWebhookHandler, SteadfastWebhookHandlerConfig } from '../handler';
import { WebhookResponse } from '../../types/webhook';

/**
 * Fastify route handler for Steadfast webhooks
 */
export function createSteadfastFastifyWebhookHandler(
  config: SteadfastWebhookHandlerConfig
): (req: FastifyRequest, reply: FastifyReply) => Promise<void> {
  const handler = new SteadfastWebhookHandler(config);

  return async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const authHeader = req.headers.authorization as string | undefined;
    const result = await handler.handle(req.body, authHeader);

    await reply.status(result.status === 'success' ? 200 : 400).send(result);
  };
}

/**
 * Express.js adapter for webhook handling
 */

import { Request, Response, NextFunction } from 'express';
import { SteadfastWebhookHandler, SteadfastWebhookHandlerConfig } from '../handler';
import { WebhookResponse } from '../../types/webhook';

/**
 * Express middleware function for handling Steadfast webhooks
 */
export function createSteadfastExpressWebhookHandler(
  config: SteadfastWebhookHandlerConfig
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  const handler = new SteadfastWebhookHandler(config);

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const result = await handler.handle(req.body, authHeader);

      res.status(result.status === 'success' ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  };
}

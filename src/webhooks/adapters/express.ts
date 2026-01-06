/**
 * Express.js adapter for webhook handling
 */

import { Request, Response, NextFunction } from 'express';
import { SteadfastWebhookHandler, SteadfastWebhookHandlerConfig } from '../handler';

/**
 * Express middleware function for handling Steadfast webhooks
 */
export function createSteadfastExpressWebhookHandler(
  config: SteadfastWebhookHandlerConfig
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  const handler = new SteadfastWebhookHandler(config);

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

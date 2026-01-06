/**
 * Generic framework-agnostic webhook handler
 */

import { SteadfastWebhookHandler, SteadfastWebhookHandlerConfig } from '../handler';

/**
 * Generic request interface for framework-agnostic handling
 */
export interface GenericRequest {
  body: unknown;
  headers: Record<string, string | string[] | undefined>;
}

/**
 * Generic response interface for framework-agnostic handling
 */
export interface GenericResponse {
  status(code: number): GenericResponse;
  json(data: unknown): void;
  send(data: unknown): void;
}

/**
 * Create a generic Steadfast webhook handler function
 */
export function createSteadfastGenericWebhookHandler(
  config: SteadfastWebhookHandlerConfig
): (req: GenericRequest, res: GenericResponse) => Promise<void> {
  const handler = new SteadfastWebhookHandler(config);

  return async (req: GenericRequest, res: GenericResponse): Promise<void> => {
    const authHeader = Array.isArray(req.headers.authorization)
      ? req.headers.authorization[0]
      : req.headers.authorization;

    const result = await handler.handle(req.body, authHeader);

    res.status(result.status === 'success' ? 200 : 400);
    res.json(result);
  };
}

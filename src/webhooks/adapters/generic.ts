/**
 * Generic framework-agnostic webhook handler
 *
 * This module provides a generic adapter function that works with any HTTP framework
 * or server implementation. Use this when you need to integrate with a framework
 * that doesn't have a specific adapter (Express, Fastify, etc.).
 *
 * @module webhooks/adapters/generic
 */

import { SteadfastWebhookHandler, SteadfastWebhookHandlerConfig } from '../handler';

/**
 * Generic request interface for framework-agnostic handling
 *
 * Defines the minimum interface required for a request object to work with
 * the generic webhook handler. Your framework's request object should match this interface.
 *
 * @example
 * ```typescript
 * // Your framework's request object should have these properties:
 * const req: GenericRequest = {
 *   body: parsedJsonBody,
 *   headers: { authorization: 'Bearer token' },
 * };
 * ```
 */
export interface GenericRequest {
  /** The parsed request body (typically JSON) */
  body: unknown;
  /** Request headers as a record of string keys to string or string array values */
  headers: Record<string, string | string[] | undefined>;
}

/**
 * Generic response interface for framework-agnostic handling
 *
 * Defines the minimum interface required for a response object to work with
 * the generic webhook handler. Your framework's response object should match this interface.
 *
 * @example
 * ```typescript
 * // Your framework's response object should have these methods:
 * const res: GenericResponse = {
 *   status: (code) => res,
 *   json: (data) => { // send JSON response },
 *   send: (data) => { // send response },
 * };
 * ```
 */
export interface GenericResponse {
  /**
   * Set the HTTP status code and return the response object for chaining
   * @param code - HTTP status code (e.g., 200, 400)
   * @returns The response object for method chaining
   */
  status(code: number): GenericResponse;
  /** Send a JSON response */
  json(data: unknown): void;
  /** Send a response (can be used instead of json) */
  send(data: unknown): void;
}

/**
 * Create a generic Steadfast webhook handler function
 *
 * Returns a generic handler function that works with any HTTP framework.
 * Use this when integrating with frameworks that don't have specific adapters.
 *
 * @param config - Configuration for the webhook handler (API key, etc.)
 * @param handlerInstance - Optional existing handler instance with callbacks already set up
 * @returns Generic handler function `(req, res) => Promise<void>`
 *
 * @example
 * ```typescript
 * import { createSteadfastGenericWebhookHandler } from 'steadfast-courier/webhooks';
 * import http from 'http';
 *
 * const handler = createSteadfastGenericWebhookHandler({
 *   apiKey: 'your-api-key',
 * });
 *
 * const server = http.createServer(async (req, res) => {
 *   if (req.method === 'POST' && req.url === '/webhook') {
 *     let body = '';
 *     req.on('data', chunk => { body += chunk; });
 *     req.on('end', async () => {
 *       const parsedBody = JSON.parse(body);
 *       await handler(
 *         { body: parsedBody, headers: req.headers },
 *         {
 *           status: (code) => {
 *             res.statusCode = code;
 *             return { json: (data) => res.end(JSON.stringify(data)) };
 *           },
 *           json: (data) => res.end(JSON.stringify(data)),
 *           send: (data) => res.end(JSON.stringify(data)),
 *         }
 *       );
 *     });
 *   }
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Usage with Koa.js
 * import Koa from 'koa';
 * import { createSteadfastGenericWebhookHandler } from 'steadfast-courier/webhooks';
 *
 * const app = new Koa();
 * const handler = createSteadfastGenericWebhookHandler({
 *   apiKey: 'your-api-key',
 * });
 *
 * app.use(async (ctx) => {
 *   if (ctx.path === '/webhook' && ctx.method === 'POST') {
 *     await handler(
 *       { body: ctx.request.body, headers: ctx.headers },
 *       {
 *         status: (code) => {
 *           ctx.status = code;
 *           return { json: (data) => { ctx.body = data; } };
 *         },
 *         json: (data) => { ctx.body = data; },
 *         send: (data) => { ctx.body = data; },
 *       }
 *     );
 *   }
 * });
 * ```
 *
 * @see {@link SteadfastWebhookHandler.generic} For using handler instance directly
 * @see {@link SteadfastWebhookHandlerConfig} For configuration options
 * @see {@link GenericRequest} For request interface requirements
 * @see {@link GenericResponse} For response interface requirements
 */
export function createSteadfastGenericWebhookHandler(
  config: SteadfastWebhookHandlerConfig,
  handlerInstance?: SteadfastWebhookHandler
): (req: GenericRequest, res: GenericResponse) => Promise<void> {
  const handler = handlerInstance ?? new SteadfastWebhookHandler(config);

  return async (req: GenericRequest, res: GenericResponse): Promise<void> => {
    const authHeader = Array.isArray(req.headers.authorization)
      ? req.headers.authorization[0]
      : req.headers.authorization;

    const result = await handler.handle(req.body, authHeader);

    res.status(result.status === 'success' ? 200 : 400);
    res.json(result);
  };
}

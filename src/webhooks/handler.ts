/**
 * Core webhook handler class
 *
 * This module contains the main webhook handler class for processing incoming
 * webhooks from Steadfast Courier. It provides authentication, parsing, and
 * event emission capabilities.
 *
 * @module webhooks/handler
 */

import { EventEmitter } from 'events';
import { DeliveryStatusWebhook, TrackingUpdateWebhook } from '../types/webhook';
import { SteadfastWebhookNotificationType, SteadfastWebhookEvent } from '../constants';
import { parseWebhookPayload } from './parser';
import { extractBearerToken, verifyBearerToken } from './verifier';
import { createSuccessResponse, createErrorResponse } from './responses';
import { WebhookResponse } from '../types/webhook';
import type { Request, Response, NextFunction } from 'express';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { GenericRequest, GenericResponse } from './adapters/generic';

/**
 * Handler function type for delivery status webhooks
 *
 * Callback function that is invoked when a delivery status webhook is received.
 * Can be either synchronous or asynchronous.
 *
 * @param payload - The delivery status webhook payload
 * @returns Promise that resolves when handling is complete, or void for synchronous handlers
 *
 * @example
 * ```typescript
 * const handler: SteadfastDeliveryStatusHandler = async (payload) => {
 *   console.log(`Order ${payload.invoice} status: ${payload.status}`);
 *   await updateDatabase(payload);
 * };
 * ```
 *
 * @see {@link DeliveryStatusWebhook} For the payload structure
 */
export type SteadfastDeliveryStatusHandler = (
  payload: DeliveryStatusWebhook
) => Promise<void> | void;

/**
 * Handler function type for tracking update webhooks
 *
 * Callback function that is invoked when a tracking update webhook is received.
 * Can be either synchronous or asynchronous.
 *
 * @param payload - The tracking update webhook payload
 * @returns Promise that resolves when handling is complete, or void for synchronous handlers
 *
 * @example
 * ```typescript
 * const handler: SteadfastTrackingUpdateHandler = async (payload) => {
 *   console.log(`Tracking update for ${payload.invoice}: ${payload.tracking_message}`);
 *   await sendNotification(payload);
 * };
 * ```
 *
 * @see {@link TrackingUpdateWebhook} For the payload structure
 */
export type SteadfastTrackingUpdateHandler = (
  payload: TrackingUpdateWebhook
) => Promise<void> | void;

/**
 * Configuration for SteadfastWebhookHandler
 *
 * Configuration options for initializing a webhook handler instance.
 *
 * @example
 * ```typescript
 * const config: SteadfastWebhookHandlerConfig = {
 *   apiKey: 'your-api-key',
 *   skipAuth: false, // Set to true only for testing
 * };
 * ```
 */
export interface SteadfastWebhookHandlerConfig {
  /**
   * API key to verify Bearer token against.
   * This should match the API key configured in your Steadfast account.
   *
   * @example `'your-api-key'`
   */
  apiKey: string;
  /**
   * Optional: Whether to skip authentication verification.
   * **Not recommended for production use.** Only use for testing/development.
   *
   * @default `false`
   */
  skipAuth?: boolean;
}

/**
 * Steadfast Courier webhook handler class for processing incoming webhooks
 *
 * This class handles incoming webhooks from Steadfast Courier, including:
 * - Authentication verification (Bearer token)
 * - Payload parsing and validation
 * - Handler invocation for specific webhook types
 * - Event emission for integration with EventEmitter
 *
 * @example
 * ```typescript
 * import { SteadfastWebhookHandler, SteadfastWebhookEvent } from 'steadfast-courier/webhooks';
 *
 * const handler = new SteadfastWebhookHandler({
 *   apiKey: 'your-api-key',
 * });
 *
 * // Set up callbacks
 * handler.onDeliveryStatus(async (payload) => {
 *   console.log(`Order ${payload.invoice} status: ${payload.status}`);
 * });
 *
 * handler.onTrackingUpdate(async (payload) => {
 *   console.log(`Tracking update: ${payload.tracking_message}`);
 * });
 *
 * // Listen to events
 * handler.on(SteadfastWebhookEvent.ERROR, (error) => {
 *   console.error('Webhook error:', error);
 * });
 *
 * // Process webhook
 * const result = await handler.handle(request.body, request.headers.authorization);
 * ```
 *
 * @extends EventEmitter
 *
 * @see {@link SteadfastWebhookHandlerConfig} For configuration options
 * @see {@link SteadfastWebhookEvent} For available events
 */
export class SteadfastWebhookHandler extends EventEmitter {
  private readonly apiKey: string;
  private readonly skipAuth: boolean;
  private deliveryStatusHandler?: SteadfastDeliveryStatusHandler;
  private trackingUpdateHandler?: SteadfastTrackingUpdateHandler;

  /**
   * Creates a new SteadfastWebhookHandler instance
   *
   * @param config - Configuration object containing API key and optional settings
   * @throws {Error} If apiKey is missing and skipAuth is false
   *
   * @example
   * ```typescript
   * const handler = new SteadfastWebhookHandler({
   *   apiKey: 'your-api-key',
   * });
   * ```
   *
   * @see {@link SteadfastWebhookHandlerConfig} For configuration details
   */
  constructor(config: SteadfastWebhookHandlerConfig) {
    super();
    if (!config.apiKey && !config.skipAuth) {
      throw new Error('apiKey is required when skipAuth is false');
    }
    this.apiKey = config.apiKey;
    this.skipAuth = config.skipAuth ?? false;
  }

  /**
   * Set handler for delivery status webhooks
   *
   * Registers a callback function that will be invoked when a delivery status
   * webhook is received. The handler will be called after authentication and
   * payload validation succeed.
   *
   * @param handler - Callback function to handle delivery status webhooks
   *
   * @example
   * ```typescript
   * handler.onDeliveryStatus(async (payload) => {
   *   console.log(`Order ${payload.invoice} status: ${payload.status}`);
   *   console.log(`COD Amount: ${payload.cod_amount} BDT`);
   *
   *   // Update database
   *   await updateOrderStatus(payload.consignment_id, payload.status);
   *
   *   // Send notification
   *   if (payload.status === SteadfastWebhookDeliveryStatus.DELIVERED) {
   *     await sendDeliveryNotification(payload);
   *   }
   * });
   * ```
   *
   * @see {@link SteadfastDeliveryStatusHandler} For handler function signature
   * @see {@link DeliveryStatusWebhook} For payload structure
   */
  onDeliveryStatus(handler: SteadfastDeliveryStatusHandler): void {
    this.deliveryStatusHandler = handler;
  }

  /**
   * Set handler for tracking update webhooks
   *
   * Registers a callback function that will be invoked when a tracking update
   * webhook is received. The handler will be called after authentication and
   * payload validation succeed.
   *
   * @param handler - Callback function to handle tracking update webhooks
   *
   * @example
   * ```typescript
   * handler.onTrackingUpdate(async (payload) => {
   *   console.log(`Tracking update for ${payload.invoice}:`);
   *   console.log(payload.tracking_message);
   *
   *   // Log tracking update
   *   await logTrackingUpdate(payload);
   *
   *   // Notify recipient
   *   await sendTrackingNotification(payload);
   * });
   * ```
   *
   * @see {@link SteadfastTrackingUpdateHandler} For handler function signature
   * @see {@link TrackingUpdateWebhook} For payload structure
   */
  onTrackingUpdate(handler: SteadfastTrackingUpdateHandler): void {
    this.trackingUpdateHandler = handler;
  }

  /**
   * Process a webhook request
   *
   * Main method for processing incoming webhook requests. This method:
   * 1. Verifies authentication (if not skipped)
   * 2. Parses and validates the webhook payload
   * 3. Emits events for the webhook type
   * 4. Invokes registered handlers (if any)
   * 5. Returns a success or error response
   *
   * @param body - The webhook request body (parsed JSON)
   * @param authHeader - Optional Authorization header value (e.g., "Bearer token")
   * @returns Promise resolving to a webhook response indicating success or failure
   *
   * @example
   * ```typescript
   * // In Express.js
   * app.post('/webhook', async (req, res) => {
   *   const result = await handler.handle(
   *     req.body,
   *     req.headers.authorization
   *   );
   *
   *   res.status(result.status === 'success' ? 200 : 400).json(result);
   * });
   * ```
   *
   * @see {@link WebhookResponse} For response structure
   * @see {@link SteadfastWebhookEvent} For emitted events
   */
  async handle(body: unknown, authHeader?: string | null): Promise<WebhookResponse> {
    try {
      // Verify authentication
      if (!this.skipAuth) {
        const token = extractBearerToken(authHeader);
        if (!verifyBearerToken(token, this.apiKey)) {
          return createErrorResponse('Invalid authentication token');
        }
      }

      // Parse and validate payload
      const payload = parseWebhookPayload(body);

      // Emit event for the notification type
      this.emit(SteadfastWebhookEvent.WEBHOOK, payload);
      this.emit(payload.notification_type, payload);

      // Call appropriate handler
      if (payload.notification_type === SteadfastWebhookNotificationType.DELIVERY_STATUS) {
        if (this.deliveryStatusHandler) {
          await this.deliveryStatusHandler(payload);
        }
        this.emit(SteadfastWebhookEvent.DELIVERY_STATUS, payload);
      } else if (payload.notification_type === SteadfastWebhookNotificationType.TRACKING_UPDATE) {
        if (this.trackingUpdateHandler) {
          await this.trackingUpdateHandler(payload);
        }
        this.emit(SteadfastWebhookEvent.TRACKING_UPDATE, payload);
      }

      return createSuccessResponse();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      this.emit(SteadfastWebhookEvent.ERROR, error);
      return createErrorResponse(message);
    }
  }

  /**
   * Get Express.js middleware function
   *
   * Returns an Express.js middleware function that can be used directly as a route handler.
   * This is the recommended way to use the handler with Express.js.
   *
   * @returns Express middleware function that handles webhook requests
   *
   * @example
   * ```typescript
   * import express from 'express';
   * import { SteadfastWebhookHandler } from 'steadfast-courier/webhooks';
   *
   * const app = express();
   * app.use(express.json());
   *
   * const handler = new SteadfastWebhookHandler({
   *   apiKey: 'your-api-key',
   * });
   *
   * handler.onDeliveryStatus(async (payload) => {
   *   console.log('Delivery status:', payload.status);
   * });
   *
   * // Use directly as Express middleware
   * app.post('/steadfast-webhook', handler.express());
   * ```
   *
   * @see {@link createSteadfastExpressWebhookHandler} For alternative adapter function
   */
  express(): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const authHeader = req.headers.authorization;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
        const result = await this.handle(req.body, authHeader);

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

  /**
   * Get Fastify route handler function
   *
   * Returns a Fastify route handler function that can be used directly in routes.
   * This is the recommended way to use the handler with Fastify.
   *
   * @returns Fastify route handler function that handles webhook requests
   *
   * @example
   * ```typescript
   * import Fastify from 'fastify';
   * import { SteadfastWebhookHandler } from 'steadfast-courier/webhooks';
   *
   * const fastify = Fastify();
   *
   * const handler = new SteadfastWebhookHandler({
   *   apiKey: 'your-api-key',
   * });
   *
   * handler.onDeliveryStatus(async (payload) => {
   *   console.log('Delivery status:', payload.status);
   * });
   *
   * // Use directly as Fastify route handler
   * fastify.post('/steadfast-webhook', handler.fastify());
   * ```
   *
   * @see {@link createSteadfastFastifyWebhookHandler} For alternative adapter function
   */
  fastify(): (req: FastifyRequest, reply: FastifyReply) => Promise<void> {
    return async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      const authHeader = req.headers.authorization;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      const result = await this.handle(req.body, authHeader);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await reply.status(result.status === 'success' ? 200 : 400).send(result);
    };
  }

  /**
   * Get generic framework-agnostic handler function
   *
   * Returns a generic handler function that works with any framework or HTTP server.
   * Use this when you need to integrate with a framework that doesn't have a specific adapter.
   *
   * @returns Generic handler function that handles webhook requests
   *
   * @example
   * ```typescript
   * import { SteadfastWebhookHandler } from 'steadfast-courier/webhooks';
   * import http from 'http';
   *
   * const handler = new SteadfastWebhookHandler({
   *   apiKey: 'your-api-key',
   * });
   *
   * handler.onDeliveryStatus(async (payload) => {
   *   console.log('Delivery status:', payload.status);
   * });
   *
   * // Use with Node.js http module
   * const server = http.createServer(async (req, res) => {
   *   if (req.method === 'POST' && req.url === '/webhook') {
   *     let body = '';
   *     req.on('data', chunk => { body += chunk; });
   *     req.on('end', async () => {
   *       const parsedBody = JSON.parse(body);
   *       await handler.generic()(
   *         { body: parsedBody, headers: req.headers },
   *         { status: (code) => ({ json: (data) => { res.statusCode = code; res.end(JSON.stringify(data)); } }) }
   *       );
   *     });
   *   }
   * });
   * ```
   *
   * @see {@link createSteadfastGenericWebhookHandler} For alternative adapter function
   */
  generic(): (req: GenericRequest, res: GenericResponse) => Promise<void> {
    return async (req: GenericRequest, res: GenericResponse): Promise<void> => {
      const authHeader = Array.isArray(req.headers.authorization)
        ? req.headers.authorization[0]
        : req.headers.authorization;

      const result = await this.handle(req.body, authHeader);

      res.status(result.status === 'success' ? 200 : 400);
      res.json(result);
    };
  }
}

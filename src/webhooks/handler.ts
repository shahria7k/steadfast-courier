/**
 * Core webhook handler class
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
 */
export type SteadfastDeliveryStatusHandler = (
  payload: DeliveryStatusWebhook
) => Promise<void> | void;

/**
 * Handler function type for tracking update webhooks
 */
export type SteadfastTrackingUpdateHandler = (
  payload: TrackingUpdateWebhook
) => Promise<void> | void;

/**
 * Configuration for SteadfastWebhookHandler
 */
export interface SteadfastWebhookHandlerConfig {
  /** API key to verify Bearer token against */
  apiKey: string;
  /** Optional: Whether to skip authentication (not recommended for production) */
  skipAuth?: boolean;
}

/**
 * Steadfast Courier webhook handler class for processing incoming webhooks
 */
export class SteadfastWebhookHandler extends EventEmitter {
  private readonly apiKey: string;
  private readonly skipAuth: boolean;
  private deliveryStatusHandler?: SteadfastDeliveryStatusHandler;
  private trackingUpdateHandler?: SteadfastTrackingUpdateHandler;

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
   */
  onDeliveryStatus(handler: SteadfastDeliveryStatusHandler): void {
    this.deliveryStatusHandler = handler;
  }

  /**
   * Set handler for tracking update webhooks
   */
  onTrackingUpdate(handler: SteadfastTrackingUpdateHandler): void {
    this.trackingUpdateHandler = handler;
  }

  /**
   * Process a webhook request
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
   * @returns Express middleware function
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
   * @returns Fastify route handler function
   */
  fastify(): (req: FastifyRequest, reply: FastifyReply) => Promise<void> {
    return async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const authHeader = req.headers.authorization;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      const result = await this.handle(req.body, authHeader);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await reply.status(result.status === 'success' ? 200 : 400).send(result);
    };
  }

  /**
   * Get generic framework-agnostic handler function
   * @returns Generic handler function
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

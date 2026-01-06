import { describe, it, expect, vi } from 'vitest';
import { SteadfastWebhookHandler } from '../../../src/webhooks/handler';
import { SteadfastWebhookNotificationType, SteadfastWebhookEvent } from '../../../src/constants';

describe('SteadfastWebhookHandler', () => {
  const apiKey = 'test-api-key';

  describe('constructor', () => {
    it('should create handler with valid config', () => {
      const handler = new SteadfastWebhookHandler({ apiKey });
      expect(handler).toBeInstanceOf(SteadfastWebhookHandler);
    });

    it('should allow skipAuth option', () => {
      const handler = new SteadfastWebhookHandler({ apiKey: '', skipAuth: true });
      expect(handler).toBeInstanceOf(SteadfastWebhookHandler);
    });
  });

  describe('handle', () => {
    it('should process delivery status webhook', async () => {
      const handler = new SteadfastWebhookHandler({ apiKey });
      const deliveryStatusHandler = vi.fn();
      handler.onDeliveryStatus(deliveryStatusHandler);

      const payload = {
        notification_type: 'delivery_status',
        consignment_id: 12345,
        invoice: 'INV-67890',
        cod_amount: 1500.0,
        status: 'delivered',
        delivery_charge: 100.0,
        tracking_message: 'Delivered',
        updated_at: '2025-03-02 12:45:30',
      };

      const result = await handler.handle(payload, `Bearer ${apiKey}`);

      expect(result.status).toBe('success');
      expect(deliveryStatusHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          notification_type: SteadfastWebhookNotificationType.DELIVERY_STATUS,
          consignment_id: 12345,
        })
      );
    });

    it('should process tracking update webhook', async () => {
      const handler = new SteadfastWebhookHandler({ apiKey });
      const trackingUpdateHandler = vi.fn();
      handler.onTrackingUpdate(trackingUpdateHandler);

      const payload = {
        notification_type: 'tracking_update',
        consignment_id: 12345,
        invoice: 'INV-67890',
        tracking_message: 'Package arrived',
        updated_at: '2025-03-02 13:15:00',
      };

      const result = await handler.handle(payload, `Bearer ${apiKey}`);

      expect(result.status).toBe('success');
      expect(trackingUpdateHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          notification_type: SteadfastWebhookNotificationType.TRACKING_UPDATE,
        })
      );
    });

    it('should reject invalid token', async () => {
      const handler = new SteadfastWebhookHandler({ apiKey });
      const payload = {
        notification_type: 'delivery_status',
        consignment_id: 12345,
        invoice: 'INV-67890',
        cod_amount: 1500.0,
        status: 'delivered',
        delivery_charge: 100.0,
        tracking_message: 'Delivered',
        updated_at: '2025-03-02 12:45:30',
      };

      const result = await handler.handle(payload, 'Bearer wrong-token');

      expect(result.status).toBe('error');
      expect(result.message).toContain('Invalid authentication token');
    });

    it('should handle errors gracefully', async () => {
      const handler = new SteadfastWebhookHandler({ apiKey, skipAuth: true });
      const invalidPayload = { invalid: 'data' };

      const result = await handler.handle(invalidPayload);

      expect(result.status).toBe('error');
    });
  });

  describe('event emission', () => {
    it('should emit webhook events', async () => {
      const handler = new SteadfastWebhookHandler({ apiKey, skipAuth: true });
      const webhookListener = vi.fn();
      const deliveryStatusListener = vi.fn();

      handler.on(SteadfastWebhookEvent.WEBHOOK, webhookListener);
      handler.on(SteadfastWebhookEvent.DELIVERY_STATUS, deliveryStatusListener);

      const payload = {
        notification_type: 'delivery_status',
        consignment_id: 12345,
        invoice: 'INV-67890',
        cod_amount: 1500.0,
        status: 'delivered',
        delivery_charge: 100.0,
        tracking_message: 'Delivered',
        updated_at: '2025-03-02 12:45:30',
      };

      await handler.handle(payload);

      expect(webhookListener).toHaveBeenCalled();
      expect(deliveryStatusListener).toHaveBeenCalled();
    });
  });
});

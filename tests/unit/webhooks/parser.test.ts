import { describe, it, expect } from 'vitest';
import { parseWebhookPayload } from '../../../src/webhooks/parser';
import { SteadfastWebhookNotificationType } from '../../../src/constants';
import { SteadfastValidationError } from '../../../src/utils/errors';

describe('Webhook Parser', () => {
  describe('parseWebhookPayload', () => {
    it('should parse delivery status webhook', () => {
      const payload = {
        notification_type: 'delivery_status',
        consignment_id: 12345,
        invoice: 'INV-67890',
        cod_amount: 1500.0,
        status: 'delivered',
        delivery_charge: 100.0,
        tracking_message: 'Your package has been delivered successfully.',
        updated_at: '2025-03-02 12:45:30',
      };

      const result = parseWebhookPayload(payload);
      expect(result.notification_type).toBe(SteadfastWebhookNotificationType.DELIVERY_STATUS);
      expect(result.consignment_id).toBe(12345);
      expect(result.invoice).toBe('INV-67890');
    });

    it('should parse tracking update webhook', () => {
      const payload = {
        notification_type: 'tracking_update',
        consignment_id: 12345,
        invoice: 'INV-67890',
        tracking_message: 'Package arrived at the sorting center.',
        updated_at: '2025-03-02 13:15:00',
      };

      const result = parseWebhookPayload(payload);
      expect(result.notification_type).toBe(SteadfastWebhookNotificationType.TRACKING_UPDATE);
      expect(result.consignment_id).toBe(12345);
      expect(result.tracking_message).toBe('Package arrived at the sorting center.');
    });

    it('should throw error for invalid payload type', () => {
      expect(() => parseWebhookPayload(null)).toThrow(SteadfastValidationError);
      expect(() => parseWebhookPayload('string')).toThrow(SteadfastValidationError);
    });

    it('should throw error for missing notification_type', () => {
      const payload = {
        consignment_id: 12345,
        invoice: 'INV-67890',
      };

      expect(() => parseWebhookPayload(payload)).toThrow(SteadfastValidationError);
    });

    it('should throw error for unknown notification_type', () => {
      const payload = {
        notification_type: 'unknown_type',
        consignment_id: 12345,
        invoice: 'INV-67890',
        updated_at: '2025-03-02 12:45:30',
      };

      expect(() => parseWebhookPayload(payload)).toThrow(SteadfastValidationError);
    });

    it('should throw error for invalid delivery_status fields', () => {
      const payload = {
        notification_type: 'delivery_status',
        consignment_id: 12345,
        invoice: 'INV-67890',
        updated_at: '2025-03-02 12:45:30',
        // Missing required fields
      };

      expect(() => parseWebhookPayload(payload)).toThrow(SteadfastValidationError);
    });

    it('should throw error for invalid status value', () => {
      const payload = {
        notification_type: 'delivery_status',
        consignment_id: 12345,
        invoice: 'INV-67890',
        cod_amount: 1500.0,
        status: 'invalid_status',
        delivery_charge: 100.0,
        tracking_message: 'Message',
        updated_at: '2025-03-02 12:45:30',
      };

      expect(() => parseWebhookPayload(payload)).toThrow(SteadfastValidationError);
    });
  });
});

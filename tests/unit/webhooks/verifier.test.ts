import { describe, it, expect } from 'vitest';
import { extractBearerToken, verifyBearerToken } from '../../../src/webhooks/verifier';
import { SteadfastWebhookError } from '../../../src/utils/errors';

describe('Webhook Verifier', () => {
  describe('extractBearerToken', () => {
    it('should extract token from valid Bearer header', () => {
      const token = extractBearerToken('Bearer test-token-123');
      expect(token).toBe('test-token-123');
    });

    it('should handle token with spaces', () => {
      const token = extractBearerToken('Bearer  token-with-spaces  ');
      expect(token).toBe('token-with-spaces');
    });

    it('should throw error for missing header', () => {
      expect(() => extractBearerToken(undefined)).toThrow(SteadfastWebhookError);
      expect(() => extractBearerToken(null as unknown as string)).toThrow(SteadfastWebhookError);
    });

    it('should throw error for non-Bearer scheme', () => {
      expect(() => extractBearerToken('Basic token')).toThrow(SteadfastWebhookError);
    });

    it('should throw error for empty token', () => {
      expect(() => extractBearerToken('Bearer ')).toThrow(SteadfastWebhookError);
    });
  });

  describe('verifyBearerToken', () => {
    it('should verify matching tokens', () => {
      expect(verifyBearerToken('test-token', 'test-token')).toBe(true);
    });

    it('should reject non-matching tokens', () => {
      expect(verifyBearerToken('test-token', 'different-token')).toBe(false);
    });

    it('should reject empty tokens', () => {
      expect(verifyBearerToken('', 'test-token')).toBe(false);
      expect(verifyBearerToken('test-token', '')).toBe(false);
    });

    it('should reject tokens of different lengths', () => {
      expect(verifyBearerToken('short', 'longer-token')).toBe(false);
    });
  });
});

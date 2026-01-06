import { describe, it, expect } from 'vitest';
import { createSuccessResponse, createErrorResponse } from '../../../src/webhooks/responses';

describe('Webhook Responses', () => {
  describe('createSuccessResponse', () => {
    it('should create success response with default message', () => {
      const response = createSuccessResponse();
      expect(response.status).toBe('success');
      expect(response.message).toBe('Webhook received successfully.');
    });

    it('should create success response with custom message', () => {
      const response = createSuccessResponse('Custom success message');
      expect(response.status).toBe('success');
      expect(response.message).toBe('Custom success message');
    });
  });

  describe('createErrorResponse', () => {
    it('should create error response', () => {
      const response = createErrorResponse('Error occurred');
      expect(response.status).toBe('error');
      expect(response.message).toBe('Error occurred');
    });
  });
});

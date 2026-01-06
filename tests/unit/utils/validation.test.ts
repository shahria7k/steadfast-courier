import { describe, it, expect } from 'vitest';
import {
  validatePhoneNumber,
  validateInvoice,
  validateRecipientName,
  validateRecipientAddress,
  validateCodAmount,
  validateEmail,
} from '../../../src/utils/validation';
import { SteadfastValidationError } from '../../../src/utils/errors';

describe('Validation utilities', () => {
  describe('validatePhoneNumber', () => {
    it('should validate correct 11-digit phone number', () => {
      expect(() => validatePhoneNumber('01234567890')).not.toThrow();
    });

    it('should throw error for non-string input', () => {
      expect(() => validatePhoneNumber(1234567890 as unknown as string)).toThrow(
        SteadfastValidationError
      );
    });

    it('should throw error for phone number with wrong length', () => {
      expect(() => validatePhoneNumber('123456789')).toThrow(SteadfastValidationError);
      expect(() => validatePhoneNumber('123456789012')).toThrow(SteadfastValidationError);
    });

    it('should throw error for phone number with non-digits', () => {
      expect(() => validatePhoneNumber('0123456789a')).toThrow(SteadfastValidationError);
    });
  });

  describe('validateInvoice', () => {
    it('should validate correct invoice format', () => {
      expect(() => validateInvoice('INV-123')).not.toThrow();
      expect(() => validateInvoice('abc_123')).not.toThrow();
      expect(() => validateInvoice('Aa12-das4')).not.toThrow();
    });

    it('should throw error for invalid characters', () => {
      expect(() => validateInvoice('INV@123')).toThrow(SteadfastValidationError);
      expect(() => validateInvoice('INV 123')).toThrow(SteadfastValidationError);
    });
  });

  describe('validateRecipientName', () => {
    it('should validate name within 100 characters', () => {
      expect(() => validateRecipientName('John Doe')).not.toThrow();
      expect(() => validateRecipientName('A'.repeat(100))).not.toThrow();
    });

    it('should throw error for name exceeding 100 characters', () => {
      expect(() => validateRecipientName('A'.repeat(101))).toThrow(SteadfastValidationError);
    });
  });

  describe('validateRecipientAddress', () => {
    it('should validate address within 250 characters', () => {
      expect(() => validateRecipientAddress('123 Main St')).not.toThrow();
      expect(() => validateRecipientAddress('A'.repeat(250))).not.toThrow();
    });

    it('should throw error for address exceeding 250 characters', () => {
      expect(() => validateRecipientAddress('A'.repeat(251))).toThrow(SteadfastValidationError);
    });
  });

  describe('validateCodAmount', () => {
    it('should validate non-negative amount', () => {
      expect(() => validateCodAmount(0)).not.toThrow();
      expect(() => validateCodAmount(100)).not.toThrow();
    });

    it('should throw error for negative amount', () => {
      expect(() => validateCodAmount(-1)).toThrow(SteadfastValidationError);
    });

    it('should throw error for NaN', () => {
      expect(() => validateCodAmount(NaN)).toThrow(SteadfastValidationError);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email format', () => {
      expect(() => validateEmail('test@example.com')).not.toThrow();
    });

    it('should allow undefined or empty string', () => {
      expect(() => validateEmail(undefined)).not.toThrow();
      expect(() => validateEmail('')).not.toThrow();
    });

    it('should throw error for invalid email format', () => {
      expect(() => validateEmail('invalid-email')).toThrow(SteadfastValidationError);
      expect(() => validateEmail('test@')).toThrow(SteadfastValidationError);
    });
  });
});

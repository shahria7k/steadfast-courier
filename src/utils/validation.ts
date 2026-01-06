/**
 * Input validation utilities
 */

import { SteadfastValidationError } from './errors';

/**
 * Validates phone number format (11 digits)
 */
export function validatePhoneNumber(phone: string, fieldName: string = 'phone'): void {
  if (!phone || typeof phone !== 'string') {
    throw new SteadfastValidationError(`${fieldName} is required and must be a string`);
  }

  const phoneRegex = /^\d{11}$/;
  if (!phoneRegex.test(phone)) {
    throw new SteadfastValidationError(
      `${fieldName} must be exactly 11 digits, got: ${phone}`
    );
  }
}

/**
 * Validates invoice format (alpha-numeric with hyphens and underscores)
 */
export function validateInvoice(invoice: string): void {
  if (!invoice || typeof invoice !== 'string') {
    throw new SteadfastValidationError('invoice is required and must be a string');
  }

  const invoiceRegex = /^[a-zA-Z0-9_-]+$/;
  if (!invoiceRegex.test(invoice)) {
    throw new SteadfastValidationError(
      `invoice must be alpha-numeric and can include hyphens and underscores, got: ${invoice}`
    );
  }
}

/**
 * Validates recipient name (max 100 characters)
 */
export function validateRecipientName(name: string): void {
  if (!name || typeof name !== 'string') {
    throw new SteadfastValidationError('recipient_name is required and must be a string');
  }

  if (name.length > 100) {
    throw new SteadfastValidationError(
      `recipient_name must be within 100 characters, got ${name.length} characters`
    );
  }
}

/**
 * Validates recipient address (max 250 characters)
 */
export function validateRecipientAddress(address: string): void {
  if (!address || typeof address !== 'string') {
    throw new SteadfastValidationError('recipient_address is required and must be a string');
  }

  if (address.length > 250) {
    throw new SteadfastValidationError(
      `recipient_address must be within 250 characters, got ${address.length} characters`
    );
  }
}

/**
 * Validates COD amount (must be >= 0)
 */
export function validateCodAmount(amount: number): void {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new SteadfastValidationError('cod_amount must be a valid number');
  }

  if (amount < 0) {
    throw new SteadfastValidationError(`cod_amount cannot be less than 0, got: ${amount}`);
  }
}

/**
 * Validates email format (optional)
 */
export function validateEmail(email: string | undefined): void {
  if (email === undefined || email === '') {
    return; // Email is optional
  }

  if (typeof email !== 'string') {
    throw new SteadfastValidationError('recipient_email must be a string if provided');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new SteadfastValidationError(`Invalid email format: ${email}`);
  }
}

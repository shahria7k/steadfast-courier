/**
 * Input validation utilities
 *
 * This module provides validation functions for order creation and other API inputs.
 * All validation functions throw {@link SteadfastValidationError} if validation fails.
 *
 * @module utils/validation
 */

import { SteadfastValidationError } from './errors';

/**
 * Validates phone number format (11 digits)
 *
 * Ensures the phone number is exactly 11 digits as required by the Steadfast API.
 *
 * @param phone - Phone number to validate
 * @param fieldName - Optional field name for error messages (default: 'phone')
 * @throws {SteadfastValidationError} If phone number is invalid
 *
 * @example
 * ```typescript
 * import { validatePhoneNumber } from 'steadfast-courier';
 *
 * validatePhoneNumber('01234567890'); // ✅ Valid
 * validatePhoneNumber('12345', 'recipient_phone'); // ❌ Throws error
 * ```
 *
 * @see {@link SteadfastValidationError} For error details
 */
export function validatePhoneNumber(phone: string, fieldName: string = 'phone'): void {
  if (!phone || typeof phone !== 'string') {
    throw new SteadfastValidationError(`${fieldName} is required and must be a string`);
  }

  const phoneRegex = /^\d{11}$/;
  if (!phoneRegex.test(phone)) {
    throw new SteadfastValidationError(`${fieldName} must be exactly 11 digits, got: ${phone}`);
  }
}

/**
 * Validates invoice format (alpha-numeric with hyphens and underscores)
 *
 * Ensures the invoice identifier matches the required format for Steadfast API.
 * Must be alphanumeric and can include hyphens and underscores.
 *
 * @param invoice - Invoice identifier to validate
 * @throws {SteadfastValidationError} If invoice format is invalid
 *
 * @example
 * ```typescript
 * import { validateInvoice } from 'steadfast-courier';
 *
 * validateInvoice('INV-12345'); // ✅ Valid
 * validateInvoice('ORDER_2024_001'); // ✅ Valid
 * validateInvoice('INV 123'); // ❌ Throws error (contains space)
 * ```
 *
 * @see {@link SteadfastValidationError} For error details
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
 *
 * Ensures the recipient name is a non-empty string within the maximum length.
 *
 * @param name - Recipient name to validate
 * @throws {SteadfastValidationError} If name is invalid or too long
 *
 * @example
 * ```typescript
 * import { validateRecipientName } from 'steadfast-courier';
 *
 * validateRecipientName('John Doe'); // ✅ Valid
 * validateRecipientName('A'.repeat(101)); // ❌ Throws error (too long)
 * ```
 *
 * @see {@link SteadfastValidationError} For error details
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
 *
 * Ensures the recipient address is a non-empty string within the maximum length.
 *
 * @param address - Recipient address to validate
 * @throws {SteadfastValidationError} If address is invalid or too long
 *
 * @example
 * ```typescript
 * import { validateRecipientAddress } from 'steadfast-courier';
 *
 * validateRecipientAddress('123 Main St, Dhaka-1209'); // ✅ Valid
 * validateRecipientAddress('A'.repeat(251)); // ❌ Throws error (too long)
 * ```
 *
 * @see {@link SteadfastValidationError} For error details
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
 *
 * Ensures the cash on delivery amount is a valid number that is not negative.
 *
 * @param amount - COD amount to validate
 * @throws {SteadfastValidationError} If amount is invalid or negative
 *
 * @example
 * ```typescript
 * import { validateCodAmount } from 'steadfast-courier';
 *
 * validateCodAmount(1000); // ✅ Valid
 * validateCodAmount(0); // ✅ Valid
 * validateCodAmount(-100); // ❌ Throws error (negative)
 * validateCodAmount(NaN); // ❌ Throws error (not a number)
 * ```
 *
 * @see {@link SteadfastValidationError} For error details
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
 *
 * Validates email format if provided. Email is optional, so undefined or empty
 * strings are considered valid. If an email is provided, it must match a valid
 * email format.
 *
 * @param email - Email address to validate (optional)
 * @throws {SteadfastValidationError} If email is provided but format is invalid
 *
 * @example
 * ```typescript
 * import { validateEmail } from 'steadfast-courier';
 *
 * validateEmail(undefined); // ✅ Valid (optional)
 * validateEmail(''); // ✅ Valid (optional)
 * validateEmail('john@example.com'); // ✅ Valid
 * validateEmail('invalid-email'); // ❌ Throws error (invalid format)
 * ```
 *
 * @see {@link SteadfastValidationError} For error details
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

/**
 * Custom error classes for Steadfast Courier SDK
 *
 * This module provides custom error classes for different types of errors
 * that can occur when using the Steadfast Courier SDK.
 *
 * @module utils/errors
 */

/**
 * Base error class for all Steadfast errors
 *
 * All SDK-specific errors extend this base class. Provides common properties
 * for error messages, status codes, and error codes.
 *
 * @example
 * ```typescript
 * import { SteadfastError } from 'steadfast-courier';
 *
 * try {
 *   await client.orders.createOrder(orderData);
 * } catch (error) {
 *   if (error instanceof SteadfastError) {
 *     console.error('Steadfast error:', error.message);
 *     console.error('Status code:', error.statusCode);
 *     console.error('Error code:', error.code);
 *   }
 * }
 * ```
 */
export class SteadfastError extends Error {
  /**
   * Creates a new SteadfastError instance
   *
   * @param message - Error message
   * @param statusCode - Optional HTTP status code
   * @param code - Optional error code
   */
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'SteadfastError';
    Object.setPrototypeOf(this, SteadfastError.prototype);
  }
}

/**
 * Error thrown when API request fails
 *
 * This error is thrown when an HTTP request to the Steadfast API fails,
 * returns an error status code, or times out.
 *
 * @example
 * ```typescript
 * import { SteadfastApiError } from 'steadfast-courier';
 *
 * try {
 *   await client.orders.createOrder(orderData);
 * } catch (error) {
 *   if (error instanceof SteadfastApiError) {
 *     console.error('API Error:', error.message);
 *     console.error('Status:', error.statusCode);
 *     console.error('Response:', error.response);
 *   }
 * }
 * ```
 *
 * @extends SteadfastError
 */
export class SteadfastApiError extends SteadfastError {
  /**
   * Creates a new SteadfastApiError instance
   *
   * @param message - Error message
   * @param statusCode - HTTP status code from the API response
   * @param response - Optional raw API response data
   */
  constructor(
    message: string,
    statusCode: number,
    public readonly response?: unknown
  ) {
    super(message, statusCode, 'API_ERROR');
    this.name = 'SteadfastApiError';
    Object.setPrototypeOf(this, SteadfastApiError.prototype);
  }
}

/**
 * Error thrown when validation fails
 *
 * This error is thrown when input validation fails (e.g., invalid phone number,
 * invoice format, or missing required fields).
 *
 * @example
 * ```typescript
 * import { SteadfastValidationError } from 'steadfast-courier';
 *
 * try {
 *   await client.orders.createOrder({
 *     invoice: 'INV-123',
 *     recipient_phone: '123', // Invalid: must be 11 digits
 *     // ... other fields
 *   });
 * } catch (error) {
 *   if (error instanceof SteadfastValidationError) {
 *     console.error('Validation error:', error.message);
 *     console.error('Field:', error.field);
 *   }
 * }
 * ```
 *
 * @extends SteadfastError
 */
export class SteadfastValidationError extends SteadfastError {
  /**
   * Creates a new SteadfastValidationError instance
   *
   * @param message - Validation error message
   * @param field - Optional field name that failed validation
   */
  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'SteadfastValidationError';
    Object.setPrototypeOf(this, SteadfastValidationError.prototype);
  }
}

/**
 * Error thrown when authentication fails
 *
 * This error is thrown when API authentication fails (e.g., invalid API key
 * or secret key).
 *
 * @example
 * ```typescript
 * import { SteadfastAuthenticationError } from 'steadfast-courier';
 *
 * try {
 *   const client = new SteadfastClient({
 *     apiKey: 'invalid-key',
 *     secretKey: 'invalid-secret',
 *   });
 *   await client.balance.getBalance();
 * } catch (error) {
 *   if (error instanceof SteadfastAuthenticationError) {
 *     console.error('Authentication failed:', error.message);
 *   }
 * }
 * ```
 *
 * @extends SteadfastError
 */
export class SteadfastAuthenticationError extends SteadfastError {
  /**
   * Creates a new SteadfastAuthenticationError instance
   *
   * @param message - Authentication error message (default: "Authentication failed")
   */
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'SteadfastAuthenticationError';
    Object.setPrototypeOf(this, SteadfastAuthenticationError.prototype);
  }
}

/**
 * Error thrown when webhook verification fails
 *
 * This error is thrown when webhook authentication or verification fails
 * (e.g., missing or invalid Bearer token).
 *
 * @example
 * ```typescript
 * import { SteadfastWebhookError } from 'steadfast-courier';
 * import { extractBearerToken } from 'steadfast-courier/webhooks';
 *
 * try {
 *   const token = extractBearerToken(req.headers.authorization);
 * } catch (error) {
 *   if (error instanceof SteadfastWebhookError) {
 *     console.error('Webhook verification failed:', error.message);
 *   }
 * }
 * ```
 *
 * @extends SteadfastError
 */
export class SteadfastWebhookError extends SteadfastError {
  /**
   * Creates a new SteadfastWebhookError instance
   *
   * @param message - Webhook error message
   */
  constructor(message: string) {
    super(message, 401, 'WEBHOOK_ERROR');
    this.name = 'SteadfastWebhookError';
    Object.setPrototypeOf(this, SteadfastWebhookError.prototype);
  }
}

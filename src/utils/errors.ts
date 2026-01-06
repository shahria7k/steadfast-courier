/**
 * Custom error classes for Steadfast Courier SDK
 */

/**
 * Base error class for all Steadfast errors
 */
export class SteadfastError extends Error {
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
 */
export class SteadfastApiError extends SteadfastError {
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
 */
export class SteadfastValidationError extends SteadfastError {
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
 */
export class SteadfastAuthenticationError extends SteadfastError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'SteadfastAuthenticationError';
    Object.setPrototypeOf(this, SteadfastAuthenticationError.prototype);
  }
}

/**
 * Error thrown when webhook verification fails
 */
export class SteadfastWebhookError extends SteadfastError {
  constructor(message: string) {
    super(message, 401, 'WEBHOOK_ERROR');
    this.name = 'SteadfastWebhookError';
    Object.setPrototypeOf(this, SteadfastWebhookError.prototype);
  }
}

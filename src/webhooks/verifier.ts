/**
 * Webhook verification utilities
 *
 * This module provides functions for verifying webhook authentication.
 * Uses timing-safe comparison to prevent timing attacks.
 *
 * @module webhooks/verifier
 */

import { SteadfastWebhookError } from '../utils/errors';
import { timingSafeEqual } from 'crypto';

/**
 * Extract Bearer token from Authorization header
 *
 * Extracts the Bearer token from an Authorization header string.
 * Validates that the header uses the Bearer scheme and contains a token.
 *
 * @param authHeader - The Authorization header value (e.g., "Bearer token123")
 * @returns The extracted Bearer token
 * @throws {SteadfastWebhookError} If the header is missing, invalid, or empty
 *
 * @example
 * ```typescript
 * import { extractBearerToken } from 'steadfast-courier/webhooks';
 *
 * const token = extractBearerToken(req.headers.authorization);
 * // token = "your-api-key" (from "Bearer your-api-key")
 * ```
 *
 * @see {@link verifyBearerToken} For token verification
 */
export function extractBearerToken(authHeader: string | undefined | null): string {
  if (!authHeader) {
    throw new SteadfastWebhookError('Missing Authorization header');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new SteadfastWebhookError('Authorization header must use Bearer scheme');
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    throw new SteadfastWebhookError('Bearer token is empty');
  }

  return token;
}

/**
 * Verify Bearer token using timing-safe comparison
 *
 * Verifies that the received Bearer token matches the expected token.
 * Uses timing-safe comparison to prevent timing attacks that could reveal
 * information about the expected token.
 *
 * @param receivedToken - The Bearer token received in the webhook request
 * @param expectedToken - The expected API key to verify against
 * @returns `true` if tokens match, `false` otherwise
 *
 * @example
 * ```typescript
 * import { extractBearerToken, verifyBearerToken } from 'steadfast-courier/webhooks';
 *
 * const token = extractBearerToken(req.headers.authorization);
 * const isValid = verifyBearerToken(token, 'your-api-key');
 *
 * if (!isValid) {
 *   return res.status(401).json({ error: 'Invalid token' });
 * }
 * ```
 *
 * @see {@link extractBearerToken} For extracting the token from headers
 */
export function verifyBearerToken(receivedToken: string, expectedToken: string): boolean {
  if (!receivedToken || !expectedToken) {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  if (receivedToken.length !== expectedToken.length) {
    return false;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const receivedBuffer = Buffer.from(receivedToken, 'utf8');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const expectedBuffer = Buffer.from(expectedToken, 'utf8');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return timingSafeEqual(receivedBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

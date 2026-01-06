/**
 * Webhook verification utilities
 */

import { SteadfastWebhookError } from '../utils/errors';
import { timingSafeEqual } from 'crypto';

/**
 * Extract Bearer token from Authorization header
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
 */
export function verifyBearerToken(
  receivedToken: string,
  expectedToken: string
): boolean {
  if (!receivedToken || !expectedToken) {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  if (receivedToken.length !== expectedToken.length) {
    return false;
  }

  try {
    const receivedBuffer = Buffer.from(receivedToken, 'utf8');
    const expectedBuffer = Buffer.from(expectedToken, 'utf8');
    return timingSafeEqual(receivedBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

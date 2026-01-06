/**
 * Type declarations for Node.js globals
 */

import { Buffer } from 'node:buffer';

declare global {
  // Node.js 18+ has fetch, AbortController, etc. as globals
  const fetch: typeof globalThis.fetch;
  const AbortController: typeof globalThis.AbortController;
  const setTimeout: typeof globalThis.setTimeout;
  const clearTimeout: typeof globalThis.clearTimeout;
  const Buffer: typeof Buffer;
}

export {};

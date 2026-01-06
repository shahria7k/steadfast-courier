/**
 * Type declaration for crypto module
 */

declare module 'crypto' {
  export function timingSafeEqual(a: Buffer, b: Buffer): boolean;
}

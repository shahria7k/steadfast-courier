/**
 * Steadfast Courier SDK
 * Main entry point for the package
 */

// Export main client
export { SteadfastClient } from './client';
export type { SteadfastClientConfig } from './client';

// Export all types
export * from './types';

// Export constants
export * from './constants';
export { SteadfastWebhookEvent, SteadfastWebhookNotificationType } from './constants';

// Export services (for advanced usage)
export { OrderService } from './services/order.service';
export { StatusService } from './services/status.service';
export { BalanceService } from './services/balance.service';
export { ReturnService } from './services/return.service';
export { PaymentService } from './services/payment.service';
export { PoliceStationService } from './services/police-station.service';

// Export utilities
export * from './utils/errors';
export * from './utils/validation';

// Export webhook handlers
export * from './webhooks';

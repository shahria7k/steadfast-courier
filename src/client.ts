/**
 * Main SteadfastClient class
 *
 * This module contains the main client class for interacting with the Steadfast Courier API.
 *
 * @module client
 */

import { HttpClient, HttpClientConfig } from './utils/http-client';
import { OrderService } from './services/order.service';
import { StatusService } from './services/status.service';
import { BalanceService } from './services/balance.service';
import { ReturnService } from './services/return.service';
import { PaymentService } from './services/payment.service';
import { PoliceStationService } from './services/police-station.service';

/**
 * Configuration for SteadfastClient
 *
 * Required configuration to initialize the Steadfast Courier API client.
 * You can obtain your API credentials from the Steadfast Courier portal.
 *
 * @example
 * ```typescript
 * import { SteadfastClient } from 'steadfast-courier';
 *
 * const client = new SteadfastClient({
 *   apiKey: 'your-api-key',
 *   secretKey: 'your-secret-key',
 *   // Optional: Custom base URL for testing
 *   baseUrl: 'https://test-api.example.com/api/v1',
 *   // Optional: Custom timeout (default: 30000ms)
 *   timeout: 60000,
 * });
 * ```
 *
 * @see {@link SteadfastClient} For the main client class
 */
export interface SteadfastClientConfig {
  /**
   * API Key provided by Steadfast Courier Ltd.
   * Required for authenticating API requests.
   *
   * @example `'your-api-key-here'`
   */
  apiKey: string;
  /**
   * Secret Key provided by Steadfast Courier Ltd.
   * Required for authenticating API requests.
   *
   * @example `'your-secret-key-here'`
   */
  secretKey: string;
  /**
   * Optional custom base URL for the API.
   * Defaults to production API URL if not provided.
   * Useful for testing or using a custom endpoint.
   *
   * @default `'https://portal.packzy.com/api/v1'`
   * @example `'https://test-api.example.com/api/v1'`
   */
  baseUrl?: string;
  /**
   * Optional request timeout in milliseconds.
   * All API requests will timeout after this duration.
   *
   * @default `30000` (30 seconds)
   * @example `60000` (60 seconds)
   */
  timeout?: number;
}

/**
 * Main client class for interacting with Steadfast Courier API
 *
 * This is the primary entry point for using the Steadfast Courier SDK.
 * It provides access to all API services through convenient properties.
 *
 * @example
 * ```typescript
 * import { SteadfastClient } from 'steadfast-courier';
 *
 * // Initialize the client
 * const client = new SteadfastClient({
 *   apiKey: 'your-api-key',
 *   secretKey: 'your-secret-key',
 * });
 *
 * // Create an order
 * const order = await client.orders.createOrder({
 *   invoice: 'INV-12345',
 *   recipient_name: 'John Doe',
 *   recipient_phone: '01234567890',
 *   recipient_address: '123 Main St, Dhaka-1209',
 *   cod_amount: 1000,
 * });
 *
 * // Check delivery status
 * const status = await client.status.getStatusByTrackingCode(order.consignment.tracking_code);
 *
 * // Get account balance
 * const balance = await client.balance.getBalance();
 * ```
 *
 * @see {@link SteadfastClientConfig} For configuration options
 * @see {@link OrderService} For order management
 * @see {@link StatusService} For status checking
 * @see {@link BalanceService} For balance information
 * @see {@link ReturnService} For return requests
 * @see {@link PaymentService} For payment information
 * @see {@link PoliceStationService} For police station data
 */
export class SteadfastClient {
  private readonly httpClient: HttpClient;

  /** Service for creating and managing orders */
  public readonly orders: OrderService;

  /** Service for checking delivery status */
  public readonly status: StatusService;

  /** Service for checking account balance */
  public readonly balance: BalanceService;

  /** Service for managing return requests */
  public readonly returns: ReturnService;

  /** Service for viewing payment information */
  public readonly payments: PaymentService;

  /** Service for getting police station information */
  public readonly policeStations: PoliceStationService;

  /**
   * Creates a new SteadfastClient instance
   *
   * @param config - Configuration object containing API credentials and optional settings
   * @throws {Error} If apiKey or secretKey is missing
   *
   * @example
   * ```typescript
   * const client = new SteadfastClient({
   *   apiKey: 'your-api-key',
   *   secretKey: 'your-secret-key',
   * });
   * ```
   *
   * @see {@link SteadfastClientConfig} For configuration details
   */
  constructor(config: SteadfastClientConfig) {
    if (!config.apiKey || !config.secretKey) {
      throw new Error('apiKey and secretKey are required');
    }

    const httpConfig: HttpClientConfig = {
      apiKey: config.apiKey,
      secretKey: config.secretKey,
      ...(config.baseUrl && { baseUrl: config.baseUrl }),
      ...(config.timeout && { timeout: config.timeout }),
    };

    this.httpClient = new HttpClient(httpConfig);
    this.orders = new OrderService(this.httpClient);
    this.status = new StatusService(this.httpClient);
    this.balance = new BalanceService(this.httpClient);
    this.returns = new ReturnService(this.httpClient);
    this.payments = new PaymentService(this.httpClient);
    this.policeStations = new PoliceStationService(this.httpClient);
  }
}

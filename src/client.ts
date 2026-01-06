/**
 * Main SteadfastClient class
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
 */
export interface SteadfastClientConfig {
  /** API Key provided by Steadfast Courier Ltd. */
  apiKey: string;
  /** Secret Key provided by Steadfast Courier Ltd. */
  secretKey: string;
  /** Optional: Custom base URL (defaults to production) */
  baseUrl?: string;
  /** Optional: Request timeout in milliseconds (defaults to 30000) */
  timeout?: number;
}

/**
 * Main client class for interacting with Steadfast Courier API
 */
export class SteadfastClient {
  private readonly httpClient: HttpClient;
  public readonly orders: OrderService;
  public readonly status: StatusService;
  public readonly balance: BalanceService;
  public readonly returns: ReturnService;
  public readonly payments: PaymentService;
  public readonly policeStations: PoliceStationService;

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

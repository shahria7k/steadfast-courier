/**
 * Status service for checking delivery status
 */

import { BaseService } from './base.service';
import { DeliveryStatusResponse } from '../types/status';

/**
 * Service for checking delivery status
 */
export class StatusService extends BaseService {
  /**
   * Get delivery status by consignment ID
   */
  async getStatusByConsignmentId(consignmentId: number): Promise<DeliveryStatusResponse> {
    if (!Number.isInteger(consignmentId) || consignmentId <= 0) {
      throw new Error('consignmentId must be a positive integer');
    }

    return this.httpClient.get<DeliveryStatusResponse>(`/status_by_cid/${consignmentId}`);
  }

  /**
   * Get delivery status by invoice ID
   */
  async getStatusByInvoice(invoice: string): Promise<DeliveryStatusResponse> {
    if (!invoice || typeof invoice !== 'string') {
      throw new Error('invoice must be a non-empty string');
    }

    return this.httpClient.get<DeliveryStatusResponse>(`/status_by_invoice/${invoice}`);
  }

  /**
   * Get delivery status by tracking code
   */
  async getStatusByTrackingCode(trackingCode: string): Promise<DeliveryStatusResponse> {
    if (!trackingCode || typeof trackingCode !== 'string') {
      throw new Error('trackingCode must be a non-empty string');
    }

    return this.httpClient.get<DeliveryStatusResponse>(
      `/status_by_trackingcode/${trackingCode}`
    );
  }
}

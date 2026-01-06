/**
 * Return service for managing return requests
 */

import { BaseService } from './base.service';
import {
  CreateReturnRequestRequest,
  CreateReturnRequestResponse,
  GetReturnRequestResponse,
  GetReturnRequestsResponse,
} from '../types/return';

/**
 * Service for return request operations
 */
export class ReturnService extends BaseService {
  /**
   * Create a return request
   */
  async createReturnRequest(
    request: CreateReturnRequestRequest
  ): Promise<CreateReturnRequestResponse> {
    // Validate that at least one identifier is provided
    if (!request.consignment_id && !request.invoice && !request.tracking_code) {
      throw new Error(
        'At least one of consignment_id, invoice, or tracking_code must be provided'
      );
    }

    return this.httpClient.post<CreateReturnRequestResponse>('/create_return_request', request);
  }

  /**
   * Get a single return request by ID
   */
  async getReturnRequest(id: number): Promise<GetReturnRequestResponse> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('id must be a positive integer');
    }

    return this.httpClient.get<GetReturnRequestResponse>(`/get_return_request/${id}`);
  }

  /**
   * Get all return requests
   */
  async getReturnRequests(): Promise<GetReturnRequestsResponse> {
    return this.httpClient.get<GetReturnRequestsResponse>('/get_return_requests');
  }
}

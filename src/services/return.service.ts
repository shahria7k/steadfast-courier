/**
 * Return service for managing return requests
 *
 * This module provides functionality for creating and managing return requests
 * for delivered orders from Steadfast Courier.
 *
 * @module services/return
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
 *
 * Provides methods to create return requests and retrieve return request information.
 *
 * @example
 * ```typescript
 * import { SteadfastClient } from 'steadfast-courier';
 *
 * const client = new SteadfastClient({
 *   apiKey: 'your-api-key',
 *   secretKey: 'your-secret-key',
 * });
 *
 * // Create a return request
 * const returnRequest = await client.returns.createReturnRequest({
 *   consignment_id: 1424107,
 *   reason: 'Customer requested return',
 * });
 * ```
 *
 * @see {@link CreateReturnRequestRequest} For return request creation structure
 * @see {@link CreateReturnRequestResponse} For return request response structure
 * @see {@link ReturnStatus} For possible return status values
 */
export class ReturnService extends BaseService {
  /**
   * Create a return request
   *
   * Creates a new return request for a delivered order. You must provide at least
   * one identifier: consignment_id, invoice, or tracking_code.
   *
   * @param request - Return request details including order identifier and optional reason
   * @returns Promise resolving to the created return request response
   * @throws {Error} If no identifier (consignment_id, invoice, or tracking_code) is provided
   * @throws {SteadfastApiError} If the API request fails or order is not found
   *
   * @example
   * ```typescript
   * // Using consignment ID
   * const returnRequest = await client.returns.createReturnRequest({
   *   consignment_id: 1424107,
   *   reason: 'Customer requested return',
   * });
   *
   * // Using invoice number
   * const returnRequest2 = await client.returns.createReturnRequest({
   *   invoice: 'INV-12345',
   *   reason: 'Wrong item delivered',
   * });
   *
   * // Using tracking code
   * const returnRequest3 = await client.returns.createReturnRequest({
   *   tracking_code: '15BAEB8A',
   *   reason: 'Damaged during delivery',
   * });
   *
   * console.log(`Return request created: ${returnRequest.id}`);
   * console.log(`Status: ${returnRequest.status}`);
   * ```
   *
   * @see {@link CreateReturnRequestRequest} For request structure
   * @see {@link CreateReturnRequestResponse} For response structure
   */
  async createReturnRequest(
    request: CreateReturnRequestRequest
  ): Promise<CreateReturnRequestResponse> {
    // Validate that at least one identifier is provided
    if (!request.consignment_id && !request.invoice && !request.tracking_code) {
      throw new Error('At least one of consignment_id, invoice, or tracking_code must be provided');
    }

    return this.httpClient.post<CreateReturnRequestResponse>('/create_return_request', request);
  }

  /**
   * Get a single return request by ID
   *
   * Retrieves detailed information about a specific return request using its ID.
   *
   * @param id - The return request ID (positive integer)
   * @returns Promise resolving to the return request response
   * @throws {Error} If id is not a positive integer
   * @throws {SteadfastApiError} If the API request fails or return request is not found
   *
   * @example
   * ```typescript
   * const returnRequest = await client.returns.getReturnRequest(1);
   *
   * console.log(`Return Request ID: ${returnRequest.id}`);
   * console.log(`Status: ${returnRequest.status}`);
   * console.log(`Reason: ${returnRequest.reason || 'No reason provided'}`);
   * console.log(`Consignment ID: ${returnRequest.consignment_id}`);
   * ```
   *
   * @see {@link GetReturnRequestResponse} For response structure
   */
  async getReturnRequest(id: number): Promise<GetReturnRequestResponse> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('id must be a positive integer');
    }

    return this.httpClient.get<GetReturnRequestResponse>(`/get_return_request/${id}`);
  }

  /**
   * Get all return requests
   *
   * Retrieves all return requests associated with your account.
   * Returns an array of return requests with their current status.
   *
   * @returns Promise resolving to an array of return request responses
   * @throws {SteadfastApiError} If the API request fails
   *
   * @example
   * ```typescript
   * import { ReturnStatus } from 'steadfast-courier';
   *
   * const returnRequests = await client.returns.getReturnRequests();
   *
   * // Filter by status
   * const pending = returnRequests.filter(r => r.status === ReturnStatus.PENDING);
   * const completed = returnRequests.filter(r => r.status === ReturnStatus.COMPLETED);
   *
   * console.log(`Pending returns: ${pending.length}`);
   * console.log(`Completed returns: ${completed.length}`);
   * ```
   *
   * @see {@link GetReturnRequestsResponse} For response structure
   * @see {@link ReturnStatus} For possible status values
   */
  async getReturnRequests(): Promise<GetReturnRequestsResponse> {
    return this.httpClient.get<GetReturnRequestsResponse>('/get_return_requests');
  }
}

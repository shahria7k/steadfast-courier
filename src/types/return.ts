/**
 * Return request type definitions
 */

import { ReturnStatus } from '../constants';

/**
 * Request payload for creating a return request
 */
export interface CreateReturnRequestRequest {
  /** Consignment id or user defined invoice id or tracking code */
  consignment_id?: number;
  invoice?: string;
  tracking_code?: string;
  /** Optional reason for return */
  reason?: string;
}

/**
 * Return request response
 */
export interface ReturnRequestResponse {
  id: number;
  user_id: number;
  consignment_id: number;
  reason: string | null;
  status: ReturnStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Response for creating a return request
 */
export interface CreateReturnRequestResponse {
  id: number;
  user_id: number;
  consignment_id: number;
  reason: string | null;
  status: ReturnStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Response for getting a single return request
 */
export type GetReturnRequestResponse = ReturnRequestResponse;

/**
 * Response for getting all return requests
 */
export type GetReturnRequestsResponse = ReturnRequestResponse[];

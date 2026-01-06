/**
 * Return request type definitions
 *
 * This module contains all TypeScript types and interfaces related to return requests
 * for delivered orders from Steadfast Courier.
 *
 * @module types/return
 */

import { ReturnStatus } from '../constants';

/**
 * Request payload for creating a return request
 *
 * Used to request a return for a delivered order. You must provide at least one
 * identifier: consignment_id, invoice, or tracking_code.
 *
 * @example
 * ```typescript
 * // Using consignment ID
 * await client.returns.createReturnRequest({
 *   consignment_id: 1424107,
 *   reason: 'Customer requested return',
 * });
 *
 * // Using invoice number
 * await client.returns.createReturnRequest({
 *   invoice: 'INV-12345',
 *   reason: 'Wrong item delivered',
 * });
 *
 * // Using tracking code
 * await client.returns.createReturnRequest({
 *   tracking_code: '15BAEB8A',
 *   reason: 'Damaged during delivery',
 * });
 * ```
 *
 * @see {@link ReturnService.createReturnRequest} For creating a return request
 * @see {@link CreateReturnRequestResponse} For the response type
 */
export interface CreateReturnRequestRequest {
  /**
   * Optional consignment ID. Provide this, invoice, or tracking_code.
   *
   * @example `1424107`
   */
  consignment_id?: number;
  /**
   * Optional invoice number. Provide this, consignment_id, or tracking_code.
   *
   * @example `'INV-12345'`
   */
  invoice?: string;
  /**
   * Optional tracking code. Provide this, consignment_id, or invoice.
   *
   * @example `'15BAEB8A'`
   */
  tracking_code?: string;
  /**
   * Optional reason for the return request.
   *
   * @example `'Customer requested return'`, `'Wrong item delivered'`
   */
  reason?: string;
}

/**
 * Return request response
 *
 * Represents a return request for a delivered order.
 * Contains all details about the return request and its current status.
 *
 * @example
 * ```typescript
 * const returnRequest = await client.returns.getReturnRequest(1);
 *
 * console.log(`Return Request ID: ${returnRequest.id}`);
 * console.log(`Status: ${returnRequest.status}`);
 * console.log(`Reason: ${returnRequest.reason || 'No reason provided'}`);
 * ```
 *
 * @see {@link ReturnStatus} For possible status values
 */
export interface ReturnRequestResponse {
  /** Unique return request identifier */
  id: number;
  /** User ID who created the return request */
  user_id: number;
  /** Consignment ID of the order being returned */
  consignment_id: number;
  /** Reason for the return request (null if not provided) */
  reason: string | null;
  /** Current status of the return request */
  status: ReturnStatus;
  /** ISO 8601 timestamp of when the return request was created */
  created_at: string;
  /** ISO 8601 timestamp of when the return request was last updated */
  updated_at: string;
}

/**
 * Response for creating a return request
 *
 * Returned by {@link ReturnService.createReturnRequest} when a return request is successfully created.
 *
 * @example
 * ```typescript
 * const returnRequest = await client.returns.createReturnRequest({
 *   consignment_id: 1424107,
 *   reason: 'Customer requested return',
 * });
 *
 * console.log(`Return request created: ${returnRequest.id}`);
 * console.log(`Status: ${returnRequest.status}`);
 * ```
 *
 * @see {@link ReturnService.createReturnRequest} For creating a return request
 */
export interface CreateReturnRequestResponse {
  /** Unique return request identifier */
  id: number;
  /** User ID who created the return request */
  user_id: number;
  /** Consignment ID of the order being returned */
  consignment_id: number;
  /** Reason for the return request (null if not provided) */
  reason: string | null;
  /** Current status of the return request (typically PENDING initially) */
  status: ReturnStatus;
  /** ISO 8601 timestamp of when the return request was created */
  created_at: string;
  /** ISO 8601 timestamp of when the return request was last updated */
  updated_at: string;
}

/**
 * Response for getting a single return request
 *
 * @see {@link ReturnService.getReturnRequest} For getting a single return request
 */
export type GetReturnRequestResponse = ReturnRequestResponse;

/**
 * Response for getting all return requests
 *
 * Array of all return requests associated with your account.
 *
 * @example
 * ```typescript
 * const returnRequests = await client.returns.getReturnRequests();
 *
 * const pending = returnRequests.filter(r => r.status === ReturnStatus.PENDING);
 * console.log(`Pending returns: ${pending.length}`);
 * ```
 *
 * @see {@link ReturnService.getReturnRequests} For getting all return requests
 */
export type GetReturnRequestsResponse = ReturnRequestResponse[];

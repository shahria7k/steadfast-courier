/**
 * Order-related type definitions
 */

/**
 * Request payload for creating a single order
 */
export interface CreateOrderRequest {
  /** Must be unique and can be alpha-numeric including hyphens and underscores */
  invoice: string;
  /** Recipient name within 100 characters */
  recipient_name: string;
  /** Must be 11 digits phone number */
  recipient_phone: string;
  /** Optional: Must be 11 digits phone number */
  alternative_phone?: string;
  /** Optional: Recipient email */
  recipient_email?: string;
  /** Recipient's address within 250 characters */
  recipient_address: string;
  /** Cash on delivery amount in BDT including all charges. Can't be less than 0 */
  cod_amount: number;
  /** Optional: Delivery instructions or other notes */
  note?: string;
  /** Optional: Items name and other information */
  item_description?: string;
  /** Optional: Total lot of items */
  total_lot?: number;
  /** Optional: 0 = for home delivery, 1 = for Point Delivery/Steadfast Hub Pick Up */
  delivery_type?: number;
}

/**
 * Response for a successfully created order
 */
export interface CreateOrderResponse {
  status: number;
  message: string;
  consignment: Consignment;
}

/**
 * Consignment information
 */
export interface Consignment {
  consignment_id: number;
  invoice: string;
  tracking_code: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  status: string;
  note?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Bulk order item for bulk order creation
 */
export interface BulkOrderItem {
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  note?: string;
  alternative_phone?: string;
  recipient_email?: string;
  item_description?: string;
  total_lot?: number;
  delivery_type?: number;
}

/**
 * Response for a bulk order item
 */
export interface BulkOrderItemResponse {
  invoice: string;
  recipient_name: string;
  recipient_address: string;
  recipient_phone: string;
  cod_amount: string;
  note: string | null;
  consignment_id: number | null;
  tracking_code: string | null;
  status: 'success' | 'error';
}

/**
 * Response for bulk order creation
 */
export type BulkOrderResponse = BulkOrderItemResponse[];

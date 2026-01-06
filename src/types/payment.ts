/**
 * Payment-related type definitions
 */

/**
 * Consignment information in payment context
 */
export interface PaymentConsignment {
  id: number;
  consignment_id: number;
  invoice: string;
  tracking_code: string;
  cod_amount: number;
  delivery_charge: number;
  status: string;
}

/**
 * Payment information
 */
export interface Payment {
  id: number;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  consignments?: PaymentConsignment[];
}

/**
 * Response for getting payments
 */
export type GetPaymentsResponse = Payment[];

/**
 * Response for getting a single payment with consignments
 */
export interface GetPaymentResponse extends Payment {
  consignments: PaymentConsignment[];
}

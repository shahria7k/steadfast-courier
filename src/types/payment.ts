/**
 * Payment-related type definitions
 *
 * This module contains all TypeScript types and interfaces related to payment information
 * and consignment payments from Steadfast Courier.
 *
 * @module types/payment
 */

/**
 * Consignment information in payment context
 *
 * Represents a consignment that is part of a payment.
 * Contains payment-related details for a specific consignment.
 *
 * @see {@link Payment} For the parent payment object
 */
export interface PaymentConsignment {
  /** Unique payment consignment identifier */
  id: number;
  /** Consignment ID from the original order */
  consignment_id: number;
  /** Invoice number from the original order */
  invoice: string;
  /** Tracking code from the original order */
  tracking_code: string;
  /** Cash on delivery amount in BDT */
  cod_amount: number;
  /** Delivery charge in BDT */
  delivery_charge: number;
  /** Current status of the consignment */
  status: string;
}

/**
 * Payment information
 *
 * Represents a payment record from Steadfast Courier.
 * Payments are created when orders are delivered and COD is collected.
 *
 * @example
 * ```typescript
 * const payments = await client.payments.getPayments();
 *
 * payments.forEach((payment) => {
 *   console.log(`Payment ${payment.id}: ${payment.amount} BDT`);
 *   console.log(`Status: ${payment.status}`);
 * });
 * ```
 *
 * @see {@link PaymentService.getPayments} For getting all payments
 * @see {@link PaymentService.getPayment} For getting a single payment with consignments
 */
export interface Payment {
  /** Unique payment identifier */
  id: number;
  /** Total payment amount in BDT */
  amount: number;
  /** Payment status */
  status: string;
  /** ISO 8601 timestamp of when the payment was created */
  created_at: string;
  /** ISO 8601 timestamp of when the payment was last updated */
  updated_at: string;
  /** Optional array of consignments included in this payment */
  consignments?: PaymentConsignment[];
}

/**
 * Response for getting payments
 *
 * Array of all payments associated with your account.
 *
 * @example
 * ```typescript
 * const payments = await client.payments.getPayments();
 *
 * const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
 * console.log(`Total payments: ${totalAmount} BDT`);
 * ```
 *
 * @see {@link PaymentService.getPayments} For getting all payments
 */
export type GetPaymentsResponse = Payment[];

/**
 * Response for getting a single payment with consignments
 *
 * Contains detailed payment information including all associated consignments.
 *
 * @example
 * ```typescript
 * const payment = await client.payments.getPayment(1);
 *
 * console.log(`Payment ${payment.id}: ${payment.amount} BDT`);
 * console.log(`Consignments: ${payment.consignments.length}`);
 *
 * payment.consignments.forEach((consignment) => {
 *   console.log(`  - ${consignment.invoice}: ${consignment.cod_amount} BDT`);
 * });
 * ```
 *
 * @see {@link PaymentService.getPayment} For getting a single payment
 */
export interface GetPaymentResponse extends Payment {
  /** Array of consignments included in this payment (always present) */
  consignments: PaymentConsignment[];
}

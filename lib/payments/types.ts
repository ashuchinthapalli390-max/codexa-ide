import { PlanTier } from "@/lib/pricing/types";

export type OrderStatus =
  | "CREATED"
  | "AWAITING_PAYMENT"
  | "PAYMENT_CLAIMED"
  | "PENDING_BANK_VERIFICATION"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "REJECTED"
  | "EXPIRED"
  | "REFUND_PENDING"
  | "REFUNDED";

export interface OrderAuditEntry {
  timestamp: string;
  fromStatus?: OrderStatus;
  toStatus: OrderStatus;
  actor: "CUSTOMER" | "GATEWAY_WEBHOOK" | "ADMIN" | "SYSTEM";
  note: string;
  details?: Record<string, any>;
}

export interface PaymentOrder {
  id: string; // e.g. "ord_cxa_173134..."
  accountId: string; // User ID / Email
  userEmail: string;
  planId: PlanTier;
  
  // Amounts calculated in integer paise
  baseAmountPaise: number;
  discountAmountPaise: number;
  gstAmountPaise: number; // 18% GST
  totalAmountPaise: number; // Final payable amount in paise
  
  // Amounts for display in INR
  baseAmountInr: number;
  discountAmountInr: number;
  gstAmountInr: number;
  totalAmountInr: number;
  
  currency: "INR";
  couponCode?: string;
  status: OrderStatus;
  
  // UPI parameters
  upiVpa: string;
  merchantName: string;
  upiPayload: string; // upi://pay?pa=...&pn=...&am=...&tr=...&cu=INR
  gatewaySessionId?: string;
  
  // Customer submission
  customerUtr?: string; // 12-digit UTR
  paymentClaimedAt?: string;
  
  // Admin verification details
  verifiedBy?: string;
  verifiedAt?: string;
  bankReconciliationRef?: string; // Bank statement transaction reference
  adminNotes?: string;
  rejectedReason?: string;
  refundRef?: string;
  
  // Expiration & Timestamps
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  
  // Full audit history
  auditLog: OrderAuditEntry[];
}

export interface CreateCheckoutSessionRequest {
  planId: PlanTier;
  couponCode?: string;
  userEmail: string;
  idempotencyKey?: string;
}

export interface CreateCheckoutSessionResponse {
  success: boolean;
  order?: PaymentOrder;
  error?: string;
}

export interface CustomerClaimPaymentRequest {
  utr: string;
  userEmail?: string;
}

export interface YouPiWebhookPayload {
  event: "payment.received" | "payment.matched" | "payment.failed" | "payment.refunded";
  delivery_id: string;
  timestamp: number;
  merchant_id: string;
  order_id: string;
  payment_id: string;
  amount_paise: number;
  currency: string;
  utr: string;
  sender_vpa?: string;
  raw_message_snippet?: string;
}

export interface AdminReconcileRequest {
  action: "VERIFY" | "REJECT" | "UNDER_REVIEW" | "RECORD_REFUND";
  adminEmail: string;
  bankRef?: string;
  notes?: string;
  rejectionReason?: string;
  refundRef?: string;
}

export interface PaymentStats {
  totalOrders: number;
  verifiedOrders: number;
  pendingVerification: number;
  rejectedOrders: number;
  totalGrossInr: number;
  totalGstCollectedInr: number;
}


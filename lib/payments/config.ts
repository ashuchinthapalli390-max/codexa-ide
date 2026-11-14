/**
 * Authoritative Payment & YouPI-PG Gateway Configuration
 * Note: Feature flags and credentials default to Sandbox mode.
 * DO NOT enable live payments until independent security and bank approvals are completed.
 */

export const PAYMENT_CONFIG = {
  // Feature flags
  PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER || "youpi",
  YOUPI_SANDBOX_MODE: process.env.YOUPI_SANDBOX_MODE !== "false", // default true
  YOUPI_LIVE_PAYMENTS_ENABLED: process.env.YOUPI_LIVE_PAYMENTS_ENABLED === "true", // default false
  YOUPI_MANUAL_VERIFICATION_REQUIRED: process.env.YOUPI_MANUAL_VERIFICATION_REQUIRED !== "false", // default true

  // Merchant details
  YOUPI_MERCHANT_ID: process.env.YOUPI_MERCHANT_ID || "cxa_youpi_sandbox_merchant",
  YOUPI_MERCHANT_NAME: process.env.YOUPI_MERCHANT_NAME || "CodeXa Agency",
  YOUPI_UPI_VPA: process.env.YOUPI_UPI_VPA || process.env.NEXT_PUBLIC_DEFAULT_UPI_ID || "8897901413-3@axl",
  
  // Security secrets
  YOUPI_API_KEY: process.env.YOUPI_API_KEY || "youpi_sk_sandbox_cxa_8849bf01",
  YOUPI_WEBHOOK_SECRET: process.env.YOUPI_WEBHOOK_SECRET || "youpi_whsec_cxa_secret_9921e4",
  
  // Timings & expiration
  ORDER_EXPIRY_MINUTES: 15,
  MAX_WEBHOOK_AGE_SECONDS: 300, // 5 minutes max clock skew
  
  // Taxes & currencies
  GST_RATE_PERCENT: 18, // 18% GST for electronic software service in India
  CURRENCY: "INR" as const,

  // Bank Reconciliation Policies
  RECEIVING_BANK_ACCOUNT: "HDFC Bank (A/C: *******4920 - CodeXa Agency Current)",
  RECONCILIATION_POLICY: "Strict manual verification required against actual bank ledger credits before paid subscription activation.",
};


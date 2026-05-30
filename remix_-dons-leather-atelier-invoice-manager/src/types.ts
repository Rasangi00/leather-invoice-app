/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Invoice {
  id: string; // Unique internal ID
  invoiceNumber: string; // Display/editable invoice number (e.g. DLA-2026-0001)
  date: string; // Date of invoice
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  productDescription: string;
  leatherType: string;
  color: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number; // calculated: quantity * unitPrice
  advancePayment: number;
  balancePayment: number; // calculated: totalAmount - advancePayment
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  specialNotes?: string;
  createdAt: string;
}

export type PaymentStatus = "Paid" | "Partially Paid" | "Not Paid";

export type OrderStatus =
  | "New Order"
  | "Materials Secured"
  | "In Production"
  | "Ready for Delivery"
  | "Delivered"
  | "Completed";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  pendingBalance: number;
}

export interface CompanyDetails {
  name: string;
  email: string;
  address: string;
  defaultNote: string;
}

export const COMPANY_DEFAULTS: CompanyDetails = {
  name: "DONS LEATHER ATELIER",
  email: "team.donsleatheratelier@gmail.com",
  address: "594/2/B Kendaliyadda Paluwa, Ragama",
  defaultNote: "Please note that the advance payment is non-refundable, as it is used to secure materials and begin production.",
};

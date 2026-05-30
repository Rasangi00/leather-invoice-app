/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Invoice, PaymentStatus, OrderStatus } from "../types";
import { Save, XCircle, Calculator, Info } from "lucide-react";

interface InvoiceFormProps {
  invoiceToEdit?: Invoice | null;		// If provided, the form loads in Edit Mode
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
  nextSuggestedNumber: string;			// Pre-calculated automatic invoice number
}

// Famous leather types for handy autocompletion
const PRESET_LEATHER_TYPES = [
  "Saffiano Calfskin",
  "Horween Chromexcel (Cowhide)",
  "Japanese Shinki Shell Cordovan",
  "Full-Grain Pueblo Leather",
  "Vegetable Tanned Bridle Leather",
  "Nappa Goat Skin",
  "Epsom Calfskin",
];

// Popular artisan colors for autocompletion
const PRESET_COLORS = [
  "English Tan",
  "Midnight Blue",
  "Bordeaux Burgundy",
  "Forest Green",
  "Cognac Brown",
  "Matte Charcoal",
  "Royal Blue",
  "Classic Walnut",
];

export default function InvoiceForm({
  invoiceToEdit,
  onSave,
  onCancel,
  nextSuggestedNumber,
}: InvoiceFormProps) {
  
  // --- INGREDIENTS STATE ---
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [leatherType, setLeatherType] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [advancePayment, setAdvancePayment] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("Not Paid");
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("New Order");
  const [specialNotes, setSpecialNotes] = useState("");

  const [validationError, setValidationError] = useState("");
  const [logoAvailable, setLogoAvailable] = useState(true);

  // --- COMPUTE REAL-TIME STATS ---
  const totalAmount = quantity * unitPrice;
  const balancePayment = Math.max(0, totalAmount - advancePayment);

  // --- POPULATE EDIT MODE / AUTO PRESETS ---
  useEffect(() => {
    if (invoiceToEdit) {
      // Load current item into state in edit mode
      setInvoiceNumber(invoiceToEdit.invoiceNumber);
      setDate(invoiceToEdit.date);
      setCustomerName(invoiceToEdit.customerName);
      setCustomerPhone(invoiceToEdit.customerPhone);
      setCustomerAddress(invoiceToEdit.customerAddress || "");
      setProductDescription(invoiceToEdit.productDescription);
      setLeatherType(invoiceToEdit.leatherType);
      setColor(invoiceToEdit.color);
      setQuantity(invoiceToEdit.quantity);
      setUnitPrice(invoiceToEdit.unitPrice);
      setAdvancePayment(invoiceToEdit.advancePayment);
      setPaymentStatus(invoiceToEdit.paymentStatus);
      setOrderStatus(invoiceToEdit.orderStatus);
      setSpecialNotes(invoiceToEdit.specialNotes || "");
    } else {
      // Loading presets for brand new invoices
      setInvoiceNumber(nextSuggestedNumber);
      // Auto filled with today's date (local time YYYY-MM-DD formatted correctly)
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setProductDescription("");
      setLeatherType("");
      setColor("");
      setQuantity(1);
      setUnitPrice(0);
      setAdvancePayment(0);
      setPaymentStatus("Not Paid");
      setOrderStatus("New Order");
      setSpecialNotes("");
    }
  }, [invoiceToEdit, nextSuggestedNumber]);

  // --- AUTOMATIC INTELLIGENT RULE FOR PAYMENT STATUS ---
  // When total index, advance payment, or balance changes, auto-suggest payment status
  useEffect(() => {
    if (totalAmount === 0) {
      setPaymentStatus("Not Paid");
    } else if (advancePayment >= totalAmount) {
      setPaymentStatus("Paid");
    } else if (advancePayment > 0 && advancePayment < totalAmount) {
      setPaymentStatus("Partially Paid");
    } else {
      setPaymentStatus("Not Paid");
    }
  }, [advancePayment, totalAmount]);

  // --- FORM SUBMIT HANDLER ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Validate inputs
    if (!invoiceNumber.trim()) {
      setValidationError("Please enter an Invoice number.");
      return;
    }
    if (!customerName.trim()) {
      setValidationError("Please fill in the Customer Name.");
      return;
    }
    if (!customerPhone.trim()) {
      setValidationError("Please fill in the Customer Phone Number.");
      return;
    }
    if (!productDescription.trim()) {
      setValidationError("Please add a Product Description.");
      return;
    }
    if (quantity <= 0) {
      setValidationError("Quantity must be at least 1.");
      return;
    }
    if (unitPrice < 0) {
      setValidationError("Unit price cannot be negative.");
      return;
    }
    if (advancePayment < 0) {
      setValidationError("Advance payment cannot be negative.");
      return;
    }
    if (advancePayment > totalAmount) {
      setValidationError("Advance payment cannot exceed the total amount.");
      return;
    }

    // Capture everything into unified clean model object
    const finalInvoice: Invoice = {
      id: invoiceToEdit ? invoiceToEdit.id : "dla-" + Date.now(),
      invoiceNumber: invoiceNumber.trim(),
      date,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim() || undefined,
      productDescription: productDescription.trim(),
      leatherType: leatherType.trim() || "Unspecified Leather",
      color: color.trim() || "Natural",
      quantity,
      unitPrice,
      totalAmount,
      advancePayment,
      balancePayment,
      paymentStatus,
      orderStatus,
      specialNotes: specialNotes.trim() || undefined,
      createdAt: invoiceToEdit ? invoiceToEdit.createdAt : new Date().toISOString(),
    };

    onSave(finalInvoice);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 animate-fade-in max-w-4xl mx-auto">
      
      {/* Form Header */}
      <div className="pb-6 border-b border-slate-100 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4 text-left">
          {logoAvailable ? (
            <div className="p-2.5 bg-brand-wine rounded-xl shrink-0 hidden sm:block border border-brand-gold/30 shadow-inner">
              <img 
                src="/logo.png" 
                alt="Logo"
                className="atelier-logo-form"
                onError={() => setLogoAvailable(false)}
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="p-2.5 bg-brand-wine rounded-xl shrink-0 hidden sm:block border border-brand-gold/30 shadow-inner">
              <svg 
                className="w-8 h-8 text-brand-gold transition-transform duration-300" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* The Serif L Column with horizontal serifs */}
                <path 
                  d="M 28,15 H 56 C 50,15 45,19 45,26 V 63 C 45,72 50,81 63,81 H 28 V 74 C 28,74 35,75 35,65 V 26 C 35,19 28,15 28,15 Z" 
                  fill="currentColor"
                />
                {/* The Elegant floating crescent (D-bow) */}
                <path 
                  d="M 54,18 C 69,18 77.5,31 77.5,49.5 C 77.5,68 69,81 60,81 C 66.5,77.5 71,65 71,49.5 C 71,34 66.5,21.5 54,18 Z" 
                  fill="currentColor"
                />
              </svg>
            </div>
          )}
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-800 tracking-wide">
              {invoiceToEdit ? "Revise Invoice Details" : "Record New Order Commission"}
            </h2>
            <p className="text-sm text-slate-500 font-sans mt-0.5">
              {invoiceToEdit 
                ? `Update invoice details for transaction ${invoiceToEdit.invoiceNumber}` 
                : "Auto calculate ledger amounts, balance, and update local storage automatically."}
            </p>
          </div>
        </div>
        <button
          id="btn-cancel-top"
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
        >
          <XCircle className="w-8 h-8 stroke-[1.5]" />
        </button>
      </div>

      {/* Validations container */}
      {validationError && (
        <div id="form-error-alert" className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg mb-6 flex items-center gap-2">
          <Info className="w-5 h-5 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: METADATA */}
        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Invoice Number <span className="text-red-500">*</span>
            </label>
            <input
              id="input-invoice-number"
              type="text"
              required
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="e.g. DLA-2026-0004"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-mono transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Invoice Date <span className="text-red-500">*</span>
            </label>
            <input
              id="input-invoice-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
            />
          </div>
        </div>

        {/* SECTION 2: CLIENT INFORMATION */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-teal-700 font-sans border-b border-teal-50 pb-1.5">
            1. Customer Profile
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Customer Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="input-customer-name"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Alexander Vance"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Customer Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="input-customer-phone"
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+94 77 123 4567"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Billing & Delivery Address <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="input-customer-address"
              rows={2}
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Building No, Street Name, City, Postal Code"
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* SECTION 3: PRODUCT SPECIFICATIONS */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-teal-700 font-sans border-b border-teal-50 pb-1.5">
            2. Product & Leather Details
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Product Description / Name <span className="text-red-500">*</span>
            </label>
            <input
              id="input-product-desc"
              type="text"
              required
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="e.g. Classic Shell Cordovan Bifold Wallet"
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Leather Type
              </label>
              <input
                id="input-leather-type"
                type="text"
                value={leatherType}
                onChange={(e) => setLeatherType(e.target.value)}
                placeholder="e.g. Vegetable Tanned Cowhide"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-teal-500 list-none"
              />
              {/* Premium suggestions row */}
              <div className="mt-1.5 flex flex-wrap gap-1">
                <span className="text-[10px] text-slate-400 self-center">Presets:</span>
                {PRESET_LEATHER_TYPES.slice(0, 3).map((lt) => (
                  <button
                    key={lt}
                    type="button"
                    onClick={() => setLeatherType(lt)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    {lt.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Artisan Dye Color
              </label>
              <input
                id="input-color"
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. English Tan / Mahogany"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-teal-500"
              />
              {/* Color suggestions row */}
              <div className="mt-1.5 flex flex-wrap gap-1">
                <span className="text-[10px] text-slate-400 self-center">Presets:</span>
                {PRESET_COLORS.slice(0, 4).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: LEDGER & CALCULATIONS */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-teal-700 font-sans border-b border-teal-50 pb-1.5 flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-teal-600" />
            <span>3. Ledger, Calculations & Flow</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                id="input-quantity"
                type="number"
                required
                min={1}
                value={quantity === 0 ? "" : quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-medium font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Unit Price (LKR) <span className="text-red-500">*</span>
              </label>
              <input
                id="input-unit-price"
                type="number"
                required
                min={0}
                value={unitPrice === 0 ? "" : unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                placeholder="Rs."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-mono text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Total Amount
              </label>
              <div id="display-total-amount" className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 font-bold font-mono text-right flex items-center justify-end h-[42px]">
                Rs. {totalAmount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Advance Payment Collected (LKR)
              </label>
              <input
                id="input-advance-payment"
                type="number"
                min={0}
                max={totalAmount}
                value={advancePayment === 0 ? "" : advancePayment}
                onChange={(e) => setAdvancePayment(Number(e.target.value))}
                placeholder="Rs. Deposited"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-mono text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Balance Payment Due
              </label>
              <div id="display-balance-due" className={`w-full px-3.5 py-2.5 border rounded-lg text-sm font-bold font-mono text-right flex items-center justify-end h-[42px] ${
                balancePayment > 0 
                  ? "bg-amber-50 border-amber-200 text-amber-700 animate-pulse" 
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}>
                Rs. {balancePayment.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Payment Status
              </label>
              <select
                id="select-payment-status"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-teal-500"
              >
                <option value="Not Paid">Not Paid</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Atelier Order status
              </label>
              <select
                id="select-order-status"
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-teal-500 font-medium"
              >
                <option value="New Order">New Order</option>
                <option value="Materials Secured">Materials Secured</option>
                <option value="In Production">In Production</option>
                <option value="Ready for Delivery">Ready for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 5: COMMENTS / SPECIAL NOTES */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Special Artisan Notes <span className="text-slate-400 font-normal">(Stitching thread color, edge paint finish, monogram, custom sizes card details etc)</span>
          </label>
          <textarea
            id="input-special-notes"
            rows={3}
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            placeholder="e.g. Please bind with whiskey thread, standard brass loop. Laser initials inside 'R.D'."
            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* BOTTOM SUBMIT ROW */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            id="btn-cancel-form"
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-xl transition-colors cursor-pointer text-center"
          >
            Go Back
          </button>
          
          <button
            id="btn-submit-invoice"
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-teal-700 hover:bg-teal-600 text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-teal-950/10 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{invoiceToEdit ? "Update Invoice" : "Secure & Save Invoice"}</span>
          </button>
        </div>

      </form>

    </div>
  );
}

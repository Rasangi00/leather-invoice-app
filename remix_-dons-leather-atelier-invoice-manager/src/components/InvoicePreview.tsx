/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Invoice, COMPANY_DEFAULTS } from "../types";
import { 
  Printer, 
  ArrowLeft, 
  Share2, 
  Download, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";

interface InvoicePreviewProps {
  invoice: Invoice;
  onBack: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function InvoicePreview({ 
  invoice, 
  onBack, 
  onEdit, 
  onDelete 
}: InvoicePreviewProps) {

  const [logoAvailable, setLogoAvailable] = useState(true);

  // Formatter for currency
  const formatCurrency = (value: number) => {
    return "Rs. " + value.toLocaleString("en-US", { minimumFractionDigits: 0 });
  };

  // --- PRINT / DOWNLOAD TRIGGER ---
  // Tells the browser to print the page. CSS (.no-print) will hide top headers/buttons 
  // so ONLY the crisp white invoice sheet prints or downloads as PDF.
  const handlePrint = () => {
    window.print();
  };

  // --- SHARE VIA WHATSAPP ---
  // Creates a highly professional crafted message and launches WhatsApp deep-link
  const getWhatsAppShareLink = () => {
    const message = `✨ *INVOICE FROM DONS LEATHER ATELIER* ✨

Dear *${invoice.customerName}*,

Here are the details of your bespoke leather commission:

*Invoice Number:* ${invoice.invoiceNumber}
*Date:* ${invoice.date}
*Product Details:* ${invoice.productDescription}
*Leather Type:* ${invoice.leatherType}
*Color:* ${invoice.color}
*Quantity:* ${invoice.quantity}

*Financial Summary:*
- Total Amount: *${formatCurrency(invoice.totalAmount)}*
- Advance Paid: *${formatCurrency(invoice.advancePayment)}* (Confirmed)
- Remaining Balance: *${formatCurrency(invoice.balancePayment)}* ${invoice.balancePayment > 0 ? '❌ (Pending)' : '✅ (Paid)'}

*Our Workshop Address:*
594/2/B Kendaliyadda Paluwa, Ragama

Thank you for commissioning our atelier! If you have any customization requests, please reach us here.`;

    return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in print-mx-custom pb-12">
      
      {/* ACTION BAR (Hidden during Print) */}
      <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900 text-white rounded-2xl shadow-md border border-slate-800">
        
        <button
          id="btn-preview-back"
          onClick={onBack}
          className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to List</span>
        </button>

        <div className="w-full sm:w-auto flex flex-wrap items-center justify-center gap-2.5">
          
          {/* Edit Button */}
          <button
            id="btn-preview-edit"
            onClick={() => onEdit(invoice.id)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 text-sm font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>

          {/* Delete Button */}
          <button
            id="btn-preview-delete"
            onClick={() => {
              if (confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
                onDelete(invoice.id);
              }
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-red-950 text-red-400 hover:text-red-300 text-sm font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>

          {/* WhatsApp Share */}
          <a
            id="btn-preview-whatsapp"
            href={getWhatsAppShareLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp Share</span>
          </a>

          {/* Print/Save PDF Button */}
          <button
            id="btn-preview-print"
            onClick={handlePrint}
            className="px-5 py-2.5 bg-brand-wine text-brand-gold hover:bg-brand-wine-light font-bold text-sm rounded-xl flex items-center gap-1.5 transition-all-custom cursor-pointer shadow-md shadow-brand-wine-dark/15 active:scale-95 border border-brand-gold/30 hover:scale-[1.02]"
          >
            <Printer className="w-4 h-4 text-brand-gold" />
            <span>Print / Save PDF</span>
          </button>
          
        </div>
      </div>

      {/* --- PREMIUM ATELIER INVOICE SHEET --- */}
      {/* Styled to resemble high-end print material with Navy, Teal, and Red cues */}
      <div 
        id="invoice-document-sheet"
        className="relative bg-white rounded-2xl border-4 shadow-xl overflow-hidden print-shadow-none print-border-none p-1 sm:p-2"
        style={{ borderColor: 'var(--color-brand-wine, #5c0f22)' }}
      >
        <div className="relative border border-slate-200 rounded-xl overflow-hidden">
          
          {/* Geometric Corner Borders representing premium master craftsmanship */}
          {/* Top-Left */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 z-10 pointer-events-none" style={{ borderColor: 'var(--color-brand-gold, #dfb750)' }}></div>
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l z-10 pointer-events-none opacity-40" style={{ borderColor: 'var(--color-brand-gold, #dfb750)' }}></div>

          {/* Top-Right */}
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 z-10 pointer-events-none" style={{ borderColor: 'var(--color-brand-gold, #dfb750)' }}></div>
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r z-10 pointer-events-none opacity-40" style={{ borderColor: 'var(--color-brand-gold, #dfb750)' }}></div>

          {/* Bottom-Left */}
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 z-10 pointer-events-none" style={{ borderColor: 'var(--color-brand-gold, #dfb750)' }}></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l z-10 pointer-events-none opacity-40" style={{ borderColor: 'var(--color-brand-gold, #dfb750)' }}></div>

          {/* Bottom-Right */}
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 z-10 pointer-events-none" style={{ borderColor: 'var(--color-brand-gold, #dfb750)' }}></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r z-10 pointer-events-none opacity-40" style={{ borderColor: 'var(--color-brand-gold, #dfb750)' }}></div>

          {/* Navy Header Panel */}
          <div className="bg-brand-wine text-white p-8 sm:p-12 border-b-4" style={{ borderBottomColor: 'var(--color-brand-gold, #dfb750)' }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              
              {/* Atelier Identity */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                {logoAvailable ? (
                  <div className="p-2.5 bg-brand-wine-dark border border-brand-gold/40 rounded-2xl shrink-0 flex items-center justify-center shadow-inner">
                    <img 
                      src="/logo.png" 
                      alt="Logo"
                      className="atelier-logo-preview"
                      onError={() => setLogoAvailable(false)}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="p-2.5 bg-brand-wine-dark border border-brand-gold/40 rounded-2xl shrink-0 flex items-center justify-center shadow-inner print:shadow-none">
                    <svg 
                      className="w-10 h-10 text-brand-gold" 
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
                <div className="space-y-1.5">
                  <span className="text-xs uppercase tracking-widest text-brand-gold font-mono font-bold leading-none block">Bespoke Workshop Ledger</span>
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-wider text-slate-100">
                    {COMPANY_DEFAULTS.name}
                  </h1>
                  <p className="text-xs text-brand-gold-light/80 max-w-sm leading-relaxed font-sans mt-1">
                    Fine Handstitched Leather Goods • Master Craftsmanship
                  </p>
                </div>
              </div>

              {/* Dynamic Status / Number Stamp */}
              <div className="text-left md:text-right space-y-1">
                <div className="text-xs text-brand-gold-light/80 uppercase tracking-wider font-mono">Invoice reference</div>
                <div className="text-2xl font-mono font-bold tracking-tight text-brand-gold">{invoice.invoiceNumber}</div>
                <div className="inline-block mt-2">
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded ${
                    invoice.orderStatus === "Completed"
                      ? "bg-brand-gold text-brand-wine-dark border border-brand-gold-dark font-black"
                      : invoice.orderStatus === "Ready for Delivery"
                      ? "bg-purple-950 text-purple-300 border border-purple-800"
                      : "bg-slate-900 text-slate-300 border border-slate-700"
                  }`}>
                    {invoice.orderStatus}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Invoice Metadata Segment */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 p-8 sm:p-12 gap-8 border-b border-slate-100 bg-slate-50/50">
            
            {/* Elegant Crimson Artisan Seal / Stamp component */}
            <div className="absolute right-12 top-6 opacity-85 select-none pointer-events-none hidden md:block">
              <div className="border-2 rounded-full w-24 h-24 flex flex-col items-center justify-center font-serif text-[10px] uppercase font-bold tracking-widest border-dashed rotate-12 bg-rose-50/20 shadow-xs" style={{ borderColor: 'var(--color-artisan-red, #be123c)', color: 'var(--color-artisan-red, #be123c)' }}>
                <span className="text-[8px] font-mono tracking-tight text-rose-500/80">PREMIUM</span>
                <span className="font-bold">HANDMADE</span>
                <span className="text-[7px] font-mono tracking-wider text-rose-500/80">RAGAMA DEPOT</span>
              </div>
            </div>

            {/* Billed To Side */}
            <div className="space-y-2.5">
            <h3 className="text-xs uppercase tracking-widest text-slate-400 font-mono font-bold">Billed To</h3>
            <div className="text-base font-bold text-slate-800 font-sans">{invoice.customerName}</div>
            <div className="text-sm text-slate-600 font-mono font-medium">{invoice.customerPhone}</div>
            {invoice.customerAddress && (
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs whitespace-pre-line mt-1">
                {invoice.customerAddress}
              </p>
            )}
          </div>

          {/* Date / Admin details side */}
          <div className="space-y-4 md:text-right md:flex md:flex-col md:items-end md:justify-start">
            <div className="space-y-1">
              <h3 className="text-xs uppercase tracking-widest text-slate-400 font-mono font-bold">Issue Date</h3>
              <div className="text-sm font-semibold text-slate-700 font-mono">{invoice.date}</div>
            </div>
            
            <div className="space-y-1 pt-2">
              <h3 className="text-xs uppercase tracking-widest text-slate-400 font-mono font-bold">Workshop Registry</h3>
              <div className="text-xs text-slate-500 font-sans leading-relaxed">
                Ragama Depot, Sri Lanka
              </div>
            </div>
          </div>

        </div>

        {/* Description Table */}
        <div className="p-8 sm:p-12 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-4 text-xs uppercase tracking-wider font-mono text-slate-400">Order Particulars</th>
                <th className="pb-4 text-xs uppercase tracking-wider font-mono text-slate-400 text-center">Qty</th>
                <th className="pb-4 text-xs uppercase tracking-wider font-mono text-slate-400 text-right">Unit Price</th>
                <th className="pb-4 text-xs uppercase tracking-wider font-mono text-slate-400 text-right">Sum Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* Product row */}
              <tr>
                <td className="py-6 pr-4">
                  <div className="font-semibold text-slate-800 text-sm sm:text-base font-sans">
                    {invoice.productDescription}
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      Leather: <strong className="font-semibold">{invoice.leatherType}</strong>
                    </span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      Color: <strong className="font-semibold">{invoice.color}</strong>
                    </span>
                  </div>
                </td>
                <td className="py-6 text-center font-semibold text-slate-700 font-mono text-sm">
                  {invoice.quantity}
                </td>
                <td className="py-6 text-right font-medium text-slate-600 font-mono text-sm">
                  {formatCurrency(invoice.unitPrice)}
                </td>
                <td className="py-6 text-right font-bold text-slate-800 font-mono text-sm">
                  {formatCurrency(invoice.totalAmount)}
                </td>
              </tr>

              {/* Special notes block inside table if any */}
              {invoice.specialNotes && (
                <tr className="bg-slate-50/30">
                  <td colSpan={4} className="py-4 px-3 text-xs text-slate-500 italic font-sans leading-relaxed">
                    <strong className="font-semibold text-slate-700 not-italic uppercase tracking-wide text-[10px] block mb-1">
                      Artisan/Monogram Instructions:
                    </strong>
                    "{invoice.specialNotes}"
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* Ledger Summary Calculations Panel */}
        <div className="p-8 sm:p-12 bg-slate-900 text-slate-100 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Notes disclaimer on Left */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-teal-400 font-mono font-bold">Important Clauses</h4>
            <p className="text-xs text-slate-400 leading-relaxed pr-4 font-sans italic">
              {COMPANY_DEFAULTS.defaultNote}
            </p>
          </div>

          {/* Money break down details on Right */}
          <div className="space-y-4">
            
            {/* Rows list */}
            <div className="space-y-2.5 text-sm font-sans">
              
              {/* Gross Total */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Total Sum Value:</span>
                <span className="font-mono text-base text-slate-200 font-semibold">{formatCurrency(invoice.totalAmount)}</span>
              </div>

              {/* Advance Payment with PAID Label */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Deposit Advance Paid:</span>
                  {invoice.advancePayment > 0 && (
                    <span 
                      id="stamp-paid-advance" 
                      className="inline-flex items-center gap-0.5 bg-teal-500/20 text-teal-300 text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded border border-teal-500/30 font-mono"
                    >
                      <CheckCircle className="w-2.5 h-2.5 text-teal-400" /> PAID
                    </span>
                  )}
                </div>
                <span className="font-mono text-base text-teal-400 font-medium">
                  {formatCurrency(invoice.advancePayment)}
                </span>
              </div>

              {/* Balance payment with "Not Paid" label with RED highlights if unpaid */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Outstanding Balance:</span>
                  {invoice.balancePayment > 0 ? (
                    <span 
                      id="stamp-unpaid-balance" 
                      className="inline-flex items-center gap-0.5 bg-rose-500/20 text-rose-300 text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded border border-rose-500/30 font-mono animate-pulse"
                    >
                      <AlertCircle className="w-2.5 h-2.5 text-rose-400" /> NOT PAID
                    </span>
                  ) : (
                    <span className="bg-emerald-500/20 text-emerald-300 text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono">
                      CLEAR
                    </span>
                  )}
                </div>
                <span className={`font-mono text-lg font-bold ${invoice.balancePayment > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                  {formatCurrency(invoice.balancePayment)}
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* Invoice Footer Details */}
        <div className="bg-slate-950 text-slate-500 text-center py-8 px-6 border-t border-slate-900 text-xs font-mono">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <span>📫 {COMPANY_DEFAULTS.address}</span>
            <span className="hidden sm:inline">|</span>
            <span>✉️ {COMPANY_DEFAULTS.email}</span>
          </div>
          <div className="mt-4 text-[10px] text-slate-600">
            © {new Date().getFullYear()} {COMPANY_DEFAULTS.name}. All Rights Reserved. Thank you for your business.
          </div>
        </div>

        </div>

      </div>

    </div>
  );
}

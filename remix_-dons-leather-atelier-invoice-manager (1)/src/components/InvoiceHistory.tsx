/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Invoice, PaymentStatus, OrderStatus } from "../types";
import { Search, Filter, Eye, Edit2, Trash2, SlidersHorizontal, RefreshCcw } from "lucide-react";

interface InvoiceHistoryProps {
  invoices: Invoice[];
  onViewInvoice: (id: string) => void;
  onEditInvoice: (id: string) => void;
  onDeleteInvoice: (id: string) => void;
  initialSearchQuery?: string;
  onClearSearchQuery?: () => void;
}

export default function InvoiceHistory({
  invoices,
  onViewInvoice,
  onEditInvoice,
  onDeleteInvoice,
  initialSearchQuery = "",
  onClearSearchQuery,
}: InvoiceHistoryProps) {
  
  // --- STATE FOR FILTERING & SECTORS ---
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [filterPayment, setFilterPayment] = useState<string>("All");
  const [filterOrder, setFilterOrder] = useState<string>("All");

  // Sync Search state if the user clicks "Inspect Ledger" from Client profiles
  React.useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);


  // Currency utility
  const formatCurrency = (value: number) => {
    return "Rs. " + value.toLocaleString("en-US", { minimumFractionDigits: 0 });
  };

  // --- FILTERING LOGIC ---
  const filteredInvoices = invoices.filter((inv) => {
    // 1. Search Query Match (Checks customer name, phone, or invoice number)
    const normalizedQuery = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      normalizedQuery === "" ||
      inv.customerName.toLowerCase().includes(normalizedQuery) ||
      inv.customerPhone.includes(normalizedQuery) ||
      inv.invoiceNumber.toLowerCase().includes(normalizedQuery);

    // 2. Payment Status Match
    const matchesPayment = 
      filterPayment === "All" || 
      inv.paymentStatus === filterPayment;

    // 3. Order Status Match
    const matchesOrder = 
      filterOrder === "All" || 
      inv.orderStatus === filterOrder;

    return matchesSearch && matchesPayment && matchesOrder;
  });

  // Simple method to reset everything back to baseline
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterPayment("All");
    setFilterOrder("All");
    if (onClearSearchQuery) {
      onClearSearchQuery();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Search and Filters Strip */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        
        {/* Row 1: Search & Reset */}
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Main search field */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              id="input-search-history"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, phone, or invoice number..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
          </div>

          {/* Reset Filters Quick Button */}
          {(searchQuery || filterPayment !== "All" || filterOrder !== "All") && (
            <button
              id="btn-reset-filters"
              onClick={handleResetFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}

        </div>

        {/* Row 2: Select Pickers */}
        <div className="flex flex-wrap items-center gap-4 text-sm font-sans pt-2 border-t border-slate-50">
          
          <div className="flex items-center gap-1.5 text-slate-500">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="font-medium text-xs uppercase tracking-wider">Refine Ledger:</span>
          </div>

          {/* Payment Status Dropdown Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Payment:</span>
            <select
              id="select-filter-payment"
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:border-teal-500"
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Not Paid">Not Paid</option>
            </select>
          </div>

          {/* Order Status Dropdown Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Workforce Status:</span>
            <select
              id="select-filter-order"
              value={filterOrder}
              onChange={(e) => setFilterOrder(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:border-teal-500"
            >
              <option value="All">All Orders</option>
              <option value="New Order">New Order</option>
              <option value="Materials Secured">Materials Secured</option>
              <option value="In Production">In Production</option>
              <option value="Ready for Delivery">Ready for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Filter Status Badge */}
          <div className="ml-auto text-xs text-slate-500">
            Showing <strong className="font-semibold text-slate-800">{filteredInvoices.length}</strong> of {invoices.length} entries
          </div>

        </div>

      </div>

      {/* --- HISTORY CONTENT DISPLAY --- */}
      {filteredInvoices.length === 0 ? (
        
        // Blank search result display
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-xs">
          <Search className="w-12 h-12 text-slate-300 mx-auto stroke-[1.25]" />
          <h3 className="text-slate-700 font-serif font-semibold text-lg mt-4">
            No Records Matched
          </h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
            Try adjusting your spelling, phone digits, or changing payment and order state dropdowns.
          </p>
          <button
            id="btn-no-records-reset"
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>

      ) : (

        // Premium Ledger Invoices Container
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          
          {/* DESKTOP MODE: Elegant Structured Table (Hidden on smaller screens) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Ref. No</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Client</th>
                  <th className="py-4 px-4">Leather Description</th>
                  <th className="py-4 px-4 text-right">Sum Val</th>
                  <th className="py-4 px-4 text-right font-semibold">Bal Outstanding</th>
                  <th className="py-4 px-4 text-center">Payment</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredInvoices.map((inv) => (
                  <tr 
                    key={inv.id} 
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    
                    {/* Invoice Number */}
                    <td className="py-4 px-6 font-mono text-xs font-bold text-slate-700">
                      {inv.invoiceNumber}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                      {inv.date}
                    </td>

                    {/* Client name / details */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800">{inv.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{inv.customerPhone}</div>
                    </td>

                    {/* Leather description */}
                    <td className="py-4 px-4 max-w-xs">
                      <div className="text-xs text-slate-800 truncate" title={inv.productDescription}>
                        {inv.productDescription}
                      </div>
                      <div className="text-[10px] text-slate-400 font-serif mt-0.5">
                        {inv.leatherType} • {inv.color}
                      </div>
                    </td>

                    {/* Cost Amount */}
                    <td className="py-4 px-4 text-right font-bold text-slate-800 font-mono">
                      {formatCurrency(inv.totalAmount)}
                    </td>

                    {/* Remaining unpaid balance */}
                    <td className={`py-4 px-4 text-right font-mono font-bold ${
                      inv.balancePayment > 0 ? "text-amber-600" : "text-emerald-500"
                    }`}>
                      {formatCurrency(inv.balancePayment)}
                    </td>

                    {/* Payment badge status */}
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide ${
                        inv.paymentStatus === "Paid" 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                          : inv.paymentStatus === "Partially Paid" 
                          ? "bg-amber-50 text-amber-700 border border-amber-100" 
                          : "bg-rose-50 text-rose-700 border border-rose-100"
                      }`}>
                        {inv.paymentStatus}
                      </span>
                    </td>

                    {/* Order progress status */}
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        inv.orderStatus === "Completed"
                          ? "bg-purple-100 text-purple-800"
                          : inv.orderStatus === "Ready for Delivery"
                          ? "bg-teal-100 text-teal-800"
                          : inv.orderStatus === "In Production"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {inv.orderStatus}
                      </span>
                    </td>

                    {/* Interactive operations */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Preview */}
                        <button
                          title="Preview"
                          onClick={() => onViewInvoice(inv.id)}
                          className="p-1.5 bg-slate-50 hover:bg-teal-50 text-slate-500 hover:text-teal-700 rounded-md transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* Edit Row Details */}
                        <button
                          title="Edit"
                          onClick={() => onEditInvoice(inv.id)}
                          className="p-1.5 bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-600 rounded-md transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete Entry */}
                        <button
                          title="Delete"
                          onClick={() => {
                            if (confirm(`Are you sure you want to permanently erase invoice ${inv.invoiceNumber}?`)) {
                              onDeleteInvoice(inv.id);
                            }
                          }}
                          className="p-1.5 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE MODE: High-end Compact List (Shown only on mobile viewports) */}
          <div className="block md:hidden divide-y divide-slate-100">
            {filteredInvoices.map((inv) => (
              <div key={inv.id} className="p-4 space-y-3">
                
                {/* Header indicators */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-700">{inv.invoiceNumber}</span>
                  <span className="text-[11px] font-mono text-slate-400">{inv.date}</span>
                </div>

                {/* Customer descriptors */}
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{inv.customerName}</h4>
                  <p className="text-xs text-slate-500">{inv.customerPhone}</p>
                  <p className="text-xs text-slate-600 mt-1.5 font-medium">{inv.productDescription}</p>
                </div>

                {/* Ledger figures cards */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-heading uppercase tracking-wide">Gross Cost</span>
                    <strong className="text-xs text-slate-800 font-mono font-bold">{formatCurrency(inv.totalAmount)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-heading uppercase tracking-wide">Due Outstanding</span>
                    <strong className={`text-xs font-mono font-bold ${inv.balancePayment > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {formatCurrency(inv.balancePayment)}
                    </strong>
                  </div>
                </div>

                {/* Badging and workflow triggers */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-1.5 items-center">
                    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      inv.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {inv.paymentStatus}
                    </span>
                    <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {inv.orderStatus}
                    </span>
                  </div>

                  {/* Operational Triggers */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => onViewInvoice(inv.id)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEditInvoice(inv.id)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-600 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      )}

    </div>
  );
}

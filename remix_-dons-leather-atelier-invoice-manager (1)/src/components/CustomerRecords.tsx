/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Invoice, Customer } from "../types";
import { Users, Search, ShoppingBag, CreditCard, DollarSign, ExternalLink, ShieldAlert } from "lucide-react";

interface CustomerRecordsProps {
  invoices: Invoice[];
  onViewClientOrders: (phone: string) => void; // Filter invoices or show list for this client
}

export default function CustomerRecords({ invoices, onViewClientOrders }: CustomerRecordsProps) {
  
  // --- STATE FOR FILTER SEARCH ---
  const [searchQuery, setSearchQuery] = useState("");

  // Helper to format currency
  const formatCurrency = (value: number) => {
    return "Rs. " + value.toLocaleString("en-US", { minimumFractionDigits: 0 });
  };

  // --- AUTOMATIC RECONCILIATION DRY RUN ---
  // We parse the list of active invoices to construct a highly reliable Customer Database in real-time.
  // Using the customer's phone number as the unique key captures profile mergers correctly!
  const aggregateCustomersFromInvoices = (): Customer[] => {
    const customerMap: Record<string, Customer> = {};

    invoices.forEach((inv) => {
      // Create a unique key from telephone numbers (trimming and ignoring formatting spaces)
      const phoneKey = inv.customerPhone.trim();
      
      if (!customerMap[phoneKey]) {
        // First time seeing this customer! Initialize their card record
        customerMap[phoneKey] = {
          id: "client-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
          name: inv.customerName,
          phone: inv.customerPhone,
          address: inv.customerAddress,
          totalOrders: 1,
          totalSpent: inv.totalAmount,
          pendingBalance: inv.balancePayment,
        };
      } else {
        // Existing customer profile! Increment and accumulate stats
        const profile = customerMap[phoneKey];
        profile.totalOrders += 1;
        profile.totalSpent += inv.totalAmount;
        profile.pendingBalance += inv.balancePayment;
        
        // Accumulate/update address record if the current invoice has a registered billing address
        if (inv.customerAddress && !profile.address) {
          profile.address = inv.customerAddress;
        }
      }
    });

    // Convert aggregated map values back into an array to render to the table
    return Object.values(customerMap);
  };

  const rawCustomersList = aggregateCustomersFromInvoices();

  // --- SEARCH MATCHING LOGIC ---
  const filteredCustomers = rawCustomersList.filter((customer) => {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    if (normalizedQuery === "") return true;

    return (
      customer.name.toLowerCase().includes(normalizedQuery) ||
      customer.phone.includes(normalizedQuery)
    );
  });

  // Calculate high-level summary KPIs
  const totalUniqueClients = rawCustomersList.length;
  const topSpenderThreshold = 100000; // Rs. 100,000 threshold for premium patron status
  const patronClientsCount = rawCustomersList.filter((c) => c.totalSpent >= topSpenderThreshold).length;
  const overallPendingCollectibles = rawCustomersList.reduce((sum, c) => sum + c.pendingBalance, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Client KPI Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm">
        
        <div className="space-y-1">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-mono">Registry Clients</span>
          <div className="text-3xl font-bold font-sans flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-400" />
            <span>{totalUniqueClients} Active</span>
          </div>
          <p className="text-xs text-slate-500">Unique customers in ledger</p>
        </div>

        <div className="space-y-1 border-t sm:border-t-0 sm:border-x border-slate-800 pt-4 sm:pt-0 sm:px-6">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-mono">Atelier Premium Patrons</span>
          <div className="text-3xl font-bold font-sans text-teal-400">
            {patronClientsCount} VIP
          </div>
          <p className="text-xs text-slate-500">Spent above {formatCurrency(topSpenderThreshold)}</p>
        </div>

        <div className="space-y-1 pt-4 sm:pt-0 sm:pl-6">
          <span className="text-xs text-rose-400 uppercase tracking-widest font-mono">Collectibles Ledger</span>
          <div className="text-3xl font-bold font-mono text-rose-400">
            {formatCurrency(overallPendingCollectibles)}
          </div>
          <p className="text-xs text-slate-500">Awaiting clearance</p>
        </div>

      </div>

      {/* Profile Filters Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            id="input-customer-records-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers by name or telephone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-all"
          />
        </div>

        {/* Total badge */}
        <div className="text-xs text-slate-500 font-sans">
          Found <strong className="font-semibold text-slate-800">{filteredCustomers.length}</strong> matching profiles
        </div>

      </div>

      {/* --- RENDER CUSTOMER DIRECTORY --- */}
      {filteredCustomers.length === 0 ? (
        
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-xs">
          <Users className="w-12 h-12 text-slate-300 mx-auto stroke-[1.25]" />
          <h3 className="text-slate-700 font-serif font-semibold text-lg mt-4">
            No Saved Customers Match Your Search
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Build your customer database automatically by adding customer info inside form invoices.
          </p>
        </div>

      ) : (

        // Responsive Cards list representing client files
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCustomers.map((customer) => {
            const isVIP = customer.totalSpent >= topSpenderThreshold;
            
            return (
              <div 
                key={customer.phone} 
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs hover:shadow-md transition-all-custom flex flex-col justify-between space-y-4"
              >
                {/* Visual Metadata Name Card Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    
                    {/* VIP marker */}
                    {isVIP && (
                      <span className="inline-block text-[9px] uppercase tracking-widest font-black bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full mb-1">
                        🔑 Patron Client
                      </span>
                    )}

                    <h4 className="font-serif text-lg font-bold text-slate-800">{customer.name}</h4>
                    <p className="text-xs font-mono text-slate-500">{customer.phone}</p>
                  </div>

                  {/* Letter circular initial */}
                  <div className="w-10 h-10 bg-slate-100 text-slate-600 font-serif font-semibold rounded-full flex items-center justify-center border border-slate-200">
                    {customer.name.charAt(0)}
                  </div>
                </div>

                {/* Lifetime metrics bento display */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-50 text-center">
                  
                  {/* Total spent */}
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Commissions</span>
                    <div className="text-xs font-bold text-slate-700 font-sans flex items-center justify-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                      <span>{customer.totalOrders} {customer.totalOrders === 1 ? 'order' : 'orders'}</span>
                    </div>
                  </div>

                  {/* Revenue created */}
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Total Spent</span>
                    <strong className="text-xs font-bold text-teal-600 font-mono block">
                      {formatCurrency(customer.totalSpent)}
                    </strong>
                  </div>

                  {/* Open balance */}
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Outstanding</span>
                    {customer.pendingBalance > 0 ? (
                      <div className="text-xs font-bold text-rose-500 font-mono flex items-center justify-center gap-0.5">
                        <ShieldAlert className="w-3 h-3 text-rose-400 animate-pulse" />
                        <span>{formatCurrency(customer.pendingBalance)}</span>
                      </div>
                    ) : (
                      <strong className="text-xs text-emerald-600 font-sans block font-semibold">Cleared</strong>
                    )}
                  </div>

                </div>

                {/* Customer bottom address & filter trigger */}
                <div className="flex items-center justify-between text-xs text-slate-500 font-sans pt-1">
                  
                  {/* Address */}
                  <span className="truncate pr-4 max-w-[200px]" title={customer.address || "No address on file"}>
                    📍 {customer.address || "Address unspecified"}
                  </span>

                  {/* View all linked orders trigger */}
                  <button
                    onClick={() => onViewClientOrders(customer.phone)}
                    className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 flex-shrink-0 cursor-pointer text-xs"
                  >
                    <span>Inspect Ledger</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>
            );
          })}
        </div>

      )}

    </div>
  );
}

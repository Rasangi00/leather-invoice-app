/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Invoice } from "../types";
import OrderStatusChart from "./OrderStatusChart";
import { 
  FileText, 
  DollarSign, 
  Clock, 
  AlertCircle, 
  PlusCircle, 
  ArrowUpRight, 
  Coins, 
  Eye, 
  Edit 
} from "lucide-react";

interface DashboardProps {
  invoices: Invoice[];
  onCreateClick: () => void;
  onViewInvoice: (id: string) => void;
  onEditInvoice: (id: string) => void;
}

export default function Dashboard({ 
  invoices, 
  onCreateClick, 
  onViewInvoice, 
  onEditInvoice 
}: DashboardProps) {

  // --- CALCULATE KEY METRICS ---
  
  // Total number of invoices registered
  const totalInvoicesCount = invoices.length;

  // Total sales volume (sum of total invoice amounts)
  const totalSalesAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  // Total advance deposits collected so far
  const totalAdvanceCollected = invoices.reduce((sum, inv) => sum + inv.advancePayment, 0);

  // Remaining balance yet to be collected
  const totalPendingBalance = invoices.reduce((sum, inv) => sum + inv.balancePayment, 0);

  // Format helper for currency (using Sri Lankan Rupees Rs. / LKR matching Ragama workshop defaults)
  const formatCurrency = (value: number) => {
    return "Rs. " + value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // Recent Invoices: sorted by date or creation time, limited to 5
  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Pending Payments: list where we have an outstanding unpaid balance and payment status is not "Paid"
  const pendingPayments = invoices.filter(
    (inv) => inv.paymentStatus !== "Paid" && inv.balancePayment > 0
  );

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 bg-brand-wine text-white rounded-2xl shadow-xl border border-brand-gold/30 gap-6 shadow-brand-wine-dark/15">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-[#5c0f22] rounded-xl border border-brand-gold/40 shadow-inner shrink-0 flex items-center justify-center">
            <img 
              src="/logo.svg" 
              alt="Dons Leather Atelier"
              className="atelier-logo-header rounded-md object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="font-serif text-3xl tracking-wide font-bold text-brand-gold">
              Atelier Overview
            </h2>
            <p className="text-brand-gold-light/85 mt-1 max-w-xl text-sm font-sans leading-relaxed">
              Welcome back to your workspace! Real-time financial calculations, order statuses, and collection statuses are displayed below.
            </p>
          </div>
        </div>
        <button
          id="btn-create-invoice-banner"
          onClick={onCreateClick}
          className="mt-4 md:mt-0 px-6 py-3.5 bg-brand-gold hover:bg-brand-gold-light text-brand-wine-dark font-bold rounded-xl flex items-center justify-center gap-2 transition-all-custom cursor-pointer shadow-lg shadow-brand-wine-dark/20 hover:scale-[1.02] active:scale-95 shrink-0"
        >
          <PlusCircle className="w-5 h-5 text-brand-[#5c0f22]" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* --- FINANCIAL HIGHLIGHT CARDS (Bento Grid Style) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Invoices */}
        <div id="stat-total-invoices" className="p-6 bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all-custom group">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 font-sans">Total Invoices</span>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-800 font-sans">{totalInvoicesCount}</h3>
            <p className="text-xs text-slate-400 mt-1">Generated commissions</p>
          </div>
        </div>

        {/* Card 2: Total Sales */}
        <div id="stat-total-sales" className="p-6 bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all-custom group">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 font-sans">Total Sales</span>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800 font-sans truncate">{formatCurrency(totalSalesAmount)}</h3>
            <p className="text-xs text-slate-400 mt-1">Gross order values</p>
          </div>
        </div>

        {/* Card 3: Deposits Collected */}
        <div id="stat-total-advances" className="p-6 bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all-custom group">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 font-sans">Advances Collected</span>
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:scale-110 transition-transform">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800 font-sans truncate">{formatCurrency(totalAdvanceCollected)}</h3>
            <p className="text-xs text-teal-600 font-medium mt-1">Secure cash in-hand</p>
          </div>
        </div>

        {/* Card 4: Pending Backlogs (Outstanding) */}
        <div id="stat-total-pending" className="p-6 bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all-custom group">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 font-sans">Pending Balance</span>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-amber-600 font-sans truncate">{formatCurrency(totalPendingBalance)}</h3>
            <p className="text-xs text-amber-600 font-semibold mt-1">Accounts receivable</p>
          </div>
        </div>

      </div>

      {/* --- WORKSHOP PRODUCTION STATISTICS CHART --- */}
      <OrderStatusChart invoices={invoices} />

      {/* --- DASHBOARD RECENT WORK & PENDING BALANCE COLUMNS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Invoices Log (Left - 7 Columns) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-serif text-lg font-semibold text-slate-800">
                Recent Invoices
              </h3>
              <p className="text-xs font-sans text-slate-400">Latest active commissions</p>
            </div>

            {recentInvoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-300 mx-auto stroke-[1.25]" />
                <p className="text-slate-500 font-sans text-sm mt-3">No invoices created yet.</p>
                <p className="text-slate-400 text-xs mt-1">Get started by creating your first invoice!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto mt-2 pr-1">
                {recentInvoices.map((inv) => (
                  <div key={inv.id} className="py-4 flex items-center justify-between hover:bg-slate-50/50 rounded-lg px-2 transition-colors">
                    <div className="space-y-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-700">{inv.invoiceNumber}</span>
                        <span className="text-[10px] text-slate-400">{inv.date}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800 truncate">{inv.customerName}</h4>
                      <p className="text-xs text-slate-500 truncate">{inv.productDescription}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-800 block">{formatCurrency(inv.totalAmount)}</span>
                        {/* Order status badges */}
                        <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-medium mt-1 ${
                          inv.orderStatus === "Completed" 
                            ? "bg-purple-100 text-purple-700" 
                            : inv.orderStatus === "Ready for Delivery" 
                            ? "bg-teal-100 text-teal-700" 
                            : "bg-slate-100 text-slate-600"
                        }`}>
                          {inv.orderStatus}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          title="View Invoice"
                          onClick={() => onViewInvoice(inv.id)}
                          className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          title="Edit Invoice"
                          onClick={() => onEditInvoice(inv.id)}
                          className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending Payment List (Right - 5 Columns) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <h3 className="font-serif text-lg font-semibold text-slate-800">
                  Pending Payments
                </h3>
              </div>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {pendingPayments.length} Active
              </span>
            </div>

            {pendingPayments.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-emerald-200 mx-auto stroke-[1.25]" />
                <p className="text-slate-500 font-sans text-sm mt-3">All accounts are fully paid!</p>
                <p className="text-slate-400 text-xs mt-1">Excellent job keeping balances secure.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto mt-2 pr-1">
                {pendingPayments.map((inv) => (
                  <div key={inv.id} className="py-3 flex items-center justify-between hover:bg-amber-50/20 rounded-lg px-2 transition-colors">
                    <div className="space-y-0.5 min-w-0 pr-2">
                      <h4 className="text-xs font-mono text-slate-500">{inv.invoiceNumber}</h4>
                      <h5 className="text-sm font-bold text-slate-800 truncate">{inv.customerName}</h5>
                      <p className="text-xs text-slate-500 truncate">{inv.customerPhone}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-400 block font-sans">Owes bal:</span>
                      <span className="text-sm font-bold text-amber-600 block">{formatCurrency(inv.balancePayment)}</span>
                      <button
                        onClick={() => onViewInvoice(inv.id)}
                        className="text-[10px] text-teal-600 hover:text-teal-700 hover:underline font-medium transition-colors flex items-center justify-end gap-1 ml-auto mt-1 cursor-pointer"
                      >
                        Details <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

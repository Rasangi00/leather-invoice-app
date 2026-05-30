/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Invoice, COMPANY_DEFAULTS } from "./types";
import { INITIAL_INVOICES } from "./data";

// Core views
import Dashboard from "./components/Dashboard";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceHistory from "./components/InvoiceHistory";
import InvoicePreview from "./components/InvoicePreview";
import CustomerRecords from "./components/CustomerRecords";

// Design icons from standard lucide-react library
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Users, 
  Gem, 
  Sliders 
} from "lucide-react";

// The LOCALSTORAGE_KEY we'll use to store invoices so they survive page reloads
const LOCALSTORAGE_KEY = "dons_leather_atelier_invoices_registry";

type ViewTab = "Dashboard" | "Create" | "History" | "Customers" | "Preview";

export default function App() {
  
  // --- CORE STATE DRIVERS ---
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeTab, setActiveTab] = useState<ViewTab>("Dashboard");
  
  // Storing which invoice is currently being inspected in the Preview view
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  
  // Storing which invoice is currently being updated in the Creation/Edit Form (null indicates new create)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Advanced link: state is lifted here so Customer inspect can auto-populate standard History searching
  const [sharedHistorySearch, setSharedHistorySearch] = useState<string>("");

  // Logo availability state (helps gracefully fall back to default icon if logo.png is missing)
  const [logoAvailable, setLogoAvailable] = useState<boolean>(true);

  // --- INITIAL DATA PERSISTENCE LOADER ---
  useEffect(() => {
    // Attempt to load previously saved dataset from standard browser storage
    const stored = localStorage.getItem(LOCALSTORAGE_KEY);
    if (stored) {
      try {
        setInvoices(JSON.parse(stored));
      } catch (err) {
        console.error("Failed loading persistent ledger:", err);
        // Fallback to seeds if something went wrong
        setInvoices(INITIAL_INVOICES);
      }
    } else {
      // First load for a user: populate with our premium seed orders so they see math live!
      setInvoices(INITIAL_INVOICES);
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(INITIAL_INVOICES));
    }
  }, []);

  // Sync state back to local storage whenever invoices state changes anywhere
  const saveAndSyncInvoicesState = (updatedList: Invoice[]) => {
    setInvoices(updatedList);
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updatedList));
  };

  // --- RECONCILIATION TRIGGERS ---
  
  // CREATE / UPDATE callback
  const handleSaveInvoice = (invoice: Invoice) => {
    // Check if the saved item exists (Edit Mode) or is brand new (Create Mode)
    const exists = invoices.some((i) => i.id === invoice.id);
    
    let updatedList: Invoice[] = [];
    if (exists) {
      // Update item in place
      updatedList = invoices.map((i) => (i.id === invoice.id ? invoice : i));
    } else {
      // Prepend brand new items to the very top
      updatedList = [invoice, ...invoices];
    }

    saveAndSyncInvoicesState(updatedList);
    
    // Auto redirect user back to History view to inspect their newly saved item
    setEditingInvoice(null);
    setSelectedInvoiceId(invoice.id);
    setActiveTab("Preview");
  };

  // ERASING callback with local storage synchronization
  const handleDeleteInvoice = (id: string) => {
    const updatedList = invoices.filter((i) => i.id !== id);
    saveAndSyncInvoicesState(updatedList);

    // If they delete an item they were previewing/editing, return them to history log
    if (selectedInvoiceId === id) {
      setSelectedInvoiceId(null);
      setActiveTab("History");
    }
    if (editingInvoice?.id === id) {
      setEditingInvoice(null);
      setActiveTab("History");
    }
  };

  // View Details trigger
  const handleTriggerView = (id: string) => {
    setSelectedInvoiceId(id);
    setActiveTab("Preview");
  };

  // Edit details trigger
  const handleTriggerEdit = (id: string) => {
    const match = invoices.find((i) => i.id === id);
    if (match) {
      setEditingInvoice(match);
      setActiveTab("Create");
    }
  };

  // Inspect Client ledger callback: pre-fills phone query, pivots to History tab
  const handleInspectClientHistory = (phone: string) => {
    // Fill the searching state directly
    setSharedHistorySearch(phone);
    // Switch to history tab
    setActiveTab("History");
  };

  // Trigger New Invoice layout
  const handleSpawnNewInvoice = () => {
    setEditingInvoice(null);
    setActiveTab("Create");
  };

  // --- AUTOMATIC UNIQUE INVOICE SEQUENCE GENERATION ---
  // Calculates and formats next invoice ID safely in format: DLA-YYYY-XXXX
  const getNextAvailableInvoiceNumber = (): string => {
    const defaultPrefix = `DLA-${new Date().getFullYear()}-`;
    
    if (invoices.length === 0) {
      return `${defaultPrefix}0001`;
    }

    // Filter list for standard matching format to prevent math errors on weird inputs
    const matches = invoices.filter((inv) => inv.invoiceNumber.startsWith(defaultPrefix));
    
    if (matches.length === 0) {
      return `${defaultPrefix}0001`;
    }

    // Map matches to extract trailing digits, solve maximum, and add one offset
    const indexList = matches.map((inv) => {
      const serialPart = inv.invoiceNumber.substring(defaultPrefix.length);
      const parsed = parseInt(serialPart, 10);
      return isNaN(parsed) ? 0 : parsed;
    });

    const nextIncrement = Math.max(...indexList) + 1;
    // Pad out sequence with standard 4-digit formatting (e.g. 0004)
    return `${defaultPrefix}${String(nextIncrement).padStart(4, "0")}`;
  };

  // Look up full document object for preview rendering
  const activePreviewInvoice = invoices.find((inv) => inv.id === selectedInvoiceId);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      
      {/* --- WORKSPACE NAVIGATION LAYOUT (Header & Branding Rail) --- */}
      <header className="no-print sticky top-0 z-50 bg-brand-wine-dark text-white border-b border-brand-gold/20 shadow-lg shadow-brand-wine-dark/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo area */}
            <div 
              onClick={() => setActiveTab("Dashboard")}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="p-1.5 bg-brand-wine border border-brand-gold/30 rounded-xl transition-all-custom shrink-0 flex items-center justify-center shadow-inner group-hover:border-brand-gold/60">
                {logoAvailable ? (
                  <img 
                    src="/logo.png" 
                    alt="Logo"
                    className="atelier-logo-header"
                    onError={() => setLogoAvailable(false)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <svg 
                    className="w-5 h-5 sm:w-6 sm:h-6 text-brand-gold group-hover:scale-110 transition-all duration-300 transform-gpu" 
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
                )}
              </div>
              <div className="space-y-0.5">
                <h1 className="font-serif text-base sm:text-lg font-bold tracking-wider text-brand-gold group-hover:text-brand-gold-light transition-colors">
                  DONS LEATHER ATELIER
                </h1>
                <p className="text-[10px] italic font-sans tracking-wide text-brand-gold-light/80 leading-tight">
                  By one and only love of my Life Mr.Gayan Mayadunna
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              
              <button
                id="tab-dashboard"
                onClick={() => setActiveTab("Dashboard")}
                className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all cursor-pointer border ${
                  activeTab === "Dashboard" 
                    ? "bg-brand-wine-light/50 text-brand-gold font-bold border-brand-gold/30 shadow-inner" 
                    : "text-brand-gold-light/85 hover:text-brand-gold hover:bg-brand-wine-light/20 border-transparent"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-brand-gold" />
                <span>Dashboard</span>
              </button>

              <button
                id="tab-history"
                onClick={() => {
                  setSharedHistorySearch(""); // clean slate when clicking menu directly
                  setActiveTab("History");
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all cursor-pointer border ${
                  activeTab === "History" 
                    ? "bg-brand-wine-light/50 text-brand-gold font-bold border-brand-gold/30 shadow-inner" 
                    : "text-brand-gold-light/85 hover:text-brand-gold hover:bg-brand-wine-light/20 border-transparent"
                }`}
              >
                <History className="w-4 h-4 text-brand-gold" />
                <span>Invoice Registry</span>
              </button>

              <button
                id="tab-customers"
                onClick={() => setActiveTab("Customers")}
                className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all cursor-pointer border ${
                  activeTab === "Customers" 
                    ? "bg-brand-wine-light/50 text-brand-gold font-bold border-brand-gold/30 shadow-inner" 
                    : "text-brand-gold-light/85 hover:text-brand-gold hover:bg-brand-wine-light/20 border-transparent"
                }`}
              >
                <Users className="w-4 h-4 text-brand-gold" />
                <span>Client Database</span>
              </button>

              <button
                id="tab-create"
                onClick={handleSpawnNewInvoice}
                className={`px-4.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === "Create" 
                    ? "bg-brand-gold text-brand-wine-dark font-bold shadow-md shadow-brand-gold/10" 
                    : "bg-brand-wine-light text-brand-gold hover:bg-brand-wine hover:text-brand-gold-light border border-brand-gold/20 active:scale-95"
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Invoice</span>
              </button>

            </nav>

            {/* Mobile quick action triggers */}
            <div className="flex lg:hidden items-center gap-1.5">
              <button
                title="Invoice Registry"
                onClick={() => {
                  setSharedHistorySearch("");
                  setActiveTab("History");
                }}
                className={`p-2 rounded-lg text-brand-gold-light hover:text-brand-gold cursor-pointer border ${activeTab === 'History' ? 'bg-brand-wine border-brand-gold/20 text-brand-gold' : 'border-transparent'}`}
              >
                <History className="w-5 h-5" />
              </button>
              <button
                title="Client Database"
                onClick={() => setActiveTab("Customers")}
                className={`p-2 rounded-lg text-brand-gold-light hover:text-brand-gold cursor-pointer border ${activeTab === 'Customers' ? 'bg-brand-wine border-brand-gold/20 text-brand-gold' : 'border-transparent'}`}
              >
                <Users className="w-5 h-5" />
              </button>
              <button
                title="New Invoice"
                onClick={handleSpawnNewInvoice}
                className="p-2 bg-brand-wine text-brand-gold border border-brand-gold/30 bg-brand-wine-light rounded-lg hover:bg-brand-wine ml-1 cursor-pointer"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* --- MOBILE NAVIGATION FIXED RAIL (Bottom panel for small devices, hidden on desktop) --- */}
      <nav className="no-print lg:hidden fixed bottom-0 left-0 right-0 bg-brand-wine-dark border-t border-brand-gold/15 z-50 grid grid-cols-3 text-center py-2 px-1 shadow-lg">
        
        <button
          onClick={() => setActiveTab("Dashboard")}
          className={`py-1 flex flex-col items-center gap-1 cursor-pointer text-[10px] ${
            activeTab === "Dashboard" ? "text-brand-gold font-bold" : "text-brand-gold-light/60 hover:text-brand-gold"
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mx-auto" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => {
            setSharedHistorySearch("");
            setActiveTab("History");
          }}
          className={`py-1 flex flex-col items-center gap-1 cursor-pointer text-[10px] ${
            activeTab === "History" ? "text-brand-gold font-bold" : "text-brand-gold-light/60 hover:text-brand-gold"
          }`}
        >
          <History className="w-5 h-5 mx-auto" />
          <span>Ledgers</span>
        </button>

        <button
          onClick={() => setActiveTab("Customers")}
          className={`py-1 flex flex-col items-center gap-1 cursor-pointer text-[10px] ${
            activeTab === "Customers" ? "text-brand-gold font-bold" : "text-brand-gold-light/60 hover:text-brand-gold"
          }`}
        >
          <Users className="w-5 h-5 mx-auto" />
          <span>Profiles</span>
        </button>

      </nav>

      {/* --- MAIN PAGE GRAPH --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 mb-16 lg:mb-0">
        {(() => {
          switch (activeTab) {
            
            // View 1: Overview Dashboard
            case "Dashboard":
              return (
                <Dashboard
                  invoices={invoices}
                  onCreateClick={handleSpawnNewInvoice}
                  onViewInvoice={handleTriggerView}
                  onEditInvoice={handleTriggerEdit}
                />
              );

            // View 2: Form Creator
            case "Create":
              return (
                <InvoiceForm
                  invoiceToEdit={editingInvoice}
                  onSave={handleSaveInvoice}
                  onCancel={() => {
                    setEditingInvoice(null);
                    // Return user to invoice logging page
                    setActiveTab("History");
                  }}
                  nextSuggestedNumber={getNextAvailableInvoiceNumber()}
                />
              );

            // View 3: Entire list index
            case "History":
              return (
                <InvoiceHistory
                  invoices={invoices}
                  onViewInvoice={handleTriggerView}
                  onEditInvoice={handleTriggerEdit}
                  onDeleteInvoice={handleDeleteInvoice}
                  initialSearchQuery={sharedHistorySearch}
                  onClearSearchQuery={() => setSharedHistorySearch("")}
                />
              );

            // View 4: Aggregated customer records CRM
            case "Customers":
              return (
                <CustomerRecords
                  invoices={invoices}
                  onViewClientOrders={handleInspectClientHistory}
                />
              );

            // View 5: Immersive printable luxury invoice preview
            case "Preview":
              if (activePreviewInvoice) {
                return (
                  <InvoicePreview
                    invoice={activePreviewInvoice}
                    onBack={() => setActiveTab("History")}
                    onEdit={handleTriggerEdit}
                    onDelete={handleDeleteInvoice}
                  />
                );
              }
              // Fallback if invoice was deleted or not found
              return (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-xs max-w-md mx-auto">
                  <p className="text-slate-500 text-sm font-medium">Requested invoice reference could not be located.</p>
                  <button
                    onClick={() => setActiveTab("History")}
                    className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Return to History
                  </button>
                </div>
              );

            default:
              return <div className="text-center">Section under maintenance. Select top navigation link.</div>;
          }
        })()}
      </main>

    </div>
  );
}

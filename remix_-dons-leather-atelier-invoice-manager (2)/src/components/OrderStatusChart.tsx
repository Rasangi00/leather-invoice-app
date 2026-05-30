/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Invoice, OrderStatus } from "../types";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie,
  Legend 
} from "recharts";
import { Activity, BarChart3, PieChart as PieIcon, ListChecks } from "lucide-react";

interface OrderStatusChartProps {
  invoices: Invoice[];
}

interface ChartItem {
  name: OrderStatus;
  count: number;
  percentage: number;
  color: string;
}

export default function OrderStatusChart({ invoices }: OrderStatusChartProps) {
  const [chartType, setChartType] = useState<"donut" | "bar">("donut");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // --- COMPUTE DISTRIBUTION ---
  const allStatuses: OrderStatus[] = [
    "New Order",
    "Materials Secured",
    "In Production",
    "Ready for Delivery",
    "Delivered",
    "Completed"
  ];

  // Specific custom brand/status colors matching the premium workshop setup:
  const statusColors: Record<OrderStatus, string> = {
    "New Order": "#94a3b8",          // slate-400
    "Materials Secured": "#0f766e",   // teal-700
    "In Production": "#d97706",       // amber-650 (bronze/brass style)
    "Ready for Delivery": "#8b5cf6",  // violet-500
    "Delivered": "#10b981",           // emerald-500
    "Completed": "#5c0f22"            // brand-wine (perfect deep bordeaux red)
  };

  const totalInvoices = invoices.length;

  const data: ChartItem[] = allStatuses.map((status) => {
    const count = invoices.filter((inv) => inv.orderStatus === status).length;
    const percentage = totalInvoices > 0 ? Math.round((count / totalInvoices) * 100) : 0;
    return {
      name: status,
      count,
      percentage,
      color: statusColors[status]
    };
  });

  // Calculate active workshop load (orders currently being processed: New, Materials, In Production, Ready)
  const activeWorkshopLoad = invoices.filter((inv) => 
    inv.orderStatus !== "Delivered" && inv.orderStatus !== "Completed"
  ).length;

  // Custom tooltips to present numbers beautifully
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint: ChartItem = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-brand-gold/30 font-sans text-xs space-y-1.5 animate-scale-up">
          <div className="flex items-center gap-2">
            <span 
              className="w-2.5 h-2.5 rounded-full inline-block shrink-0" 
              style={{ backgroundColor: dataPoint.color }}
            />
            <p className="font-serif font-bold text-sm text-brand-gold">{dataPoint.name}</p>
          </div>
          <div className="space-y-0.5 text-slate-300 font-mono">
            <p>Order Count: <span className="font-bold text-white text-sm">{dataPoint.count}</span></p>
            <p>Percentage: <span className="font-bold text-white text-sm">{dataPoint.percentage}%</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs hover:shadow-md transition-all-custom flex flex-col justify-between">
      
      {/* Header containing actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2 text-brand-wine">
            <Activity className="w-5 h-5 text-brand-wine animate-pulse" />
            <h3 className="font-serif text-lg font-bold text-slate-800 tracking-wide">
              Workshop Status Chart
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-sans">
            Distribution and progression of artisan commissions
          </p>
        </div>

        {/* Chart View Toggle Controls */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200/50">
          <button
            onClick={() => setChartType("donut")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              chartType === "donut"
                ? "bg-white text-brand-wine shadow-xs border border-slate-205"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Donut</span>
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              chartType === "bar"
                ? "bg-white text-brand-wine shadow-xs border border-slate-205"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Bar Chart</span>
          </button>
        </div>
      </div>

      {/* Main visualization container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-6 min-h-[310px]">
        
        {/* Dynamic Chart Area */}
        <div className="md:col-span-7 w-full h-[260px] flex items-center justify-center relative">
          
          {totalInvoices === 0 ? (
            <div className="text-center py-6 text-slate-400 font-sans text-sm">
              <ListChecks className="w-12 h-12 text-slate-350 mx-auto stroke-[1]" />
              <p className="mt-2">No commissions on the register.</p>
              <p className="text-xs text-slate-400">Chart will populate on invoice entry.</p>
            </div>
          ) : (
            <>
              {/* Optional centerpiece metrics for Donut View */}
              {chartType === "donut" && (
                <div className="absolute flex flex-col items-center justify-center text-center select-none pointer-events-none">
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-400">In-Queue</span>
                  <span className="text-3xl font-bold text-slate-800 font-serif">{activeWorkshopLoad}</span>
                  <span className="text-[10px] text-teal-600 font-medium">Active Load</span>
                </div>
              )}

              <ResponsiveContainer width="100%" height="100%">
                {chartType === "donut" ? (
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="count"
                      onMouseEnter={(_, idx) => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >
                      {data.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          style={{
                            filter: hoveredIdx === index ? 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.15))' : 'none',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                          }}
                          opacity={hoveredIdx === null || hoveredIdx === index ? 1 : 0.45}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                ) : (
                  <BarChart
                    data={data}
                    margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
                  >
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 550 }} 
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                    />
                    <YAxis 
                      allowDecimals={false}
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(92, 15, 34, 0.05)', radius: 8 }} />
                    <Bar 
                      dataKey="count" 
                      radius={[6, 6, 0, 0]}
                      onMouseEnter={(_, idx) => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >
                      {data.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          opacity={hoveredIdx === null || hoveredIdx === index ? 1 : 0.6}
                          style={{
                            transition: 'all 0.2s ease'
                          }}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </>
          )}
        </div>

        {/* Detailed Breakdown Legend & Action Stats Panel */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-slate-50/75 rounded-xl border border-slate-100 p-4 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-500">
              Distribution Keys
            </h4>
            
            <div className="space-y-2.5">
              {data.map((item, idx) => (
                <div 
                  key={item.name} 
                  className={`flex items-center justify-between py-1 px-2 rounded-lg transition-all ${
                    hoveredIdx === idx ? "bg-slate-100/80 scale-[1.01]" : ""
                  }`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span 
                      className="w-3 h-3 rounded-md shrink-0 block border border-white shadow-xs" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-semibold text-slate-700 truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                    <span className="font-bold text-slate-800">{item.count}</span>
                    <span className="text-slate-400 text-[11px]">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Footer statistics bar */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-450">Active workshop buffer load:</span>
          <span className="font-bold text-slate-800">
            {totalInvoices > 0 ? Math.round((activeWorkshopLoad / totalInvoices) * 100) : 0}% 
          </span>
          <span className="text-slate-400">unfinished</span>
        </div>
        <div className="text-xs font-serif italic text-brand-gold-dark font-medium">
          Dons Leather Atelier • Handstitched Excellence
        </div>
      </div>

    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { DollarSign, ShoppingBag, Package, Percent, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { supportFetch } from "../platform-support/lib/support-api";
import { AnalyticsFilter, filterOrdersByTime, filterTicketsByTime, filterProductsByCategory, getTimeframeLabel } from "./filter-utils";

interface CardData {
  title: string;
  value: string;
  change: string;
  isUp: boolean;
  icon: any;
  color: string;
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-3 w-24 bg-slate-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
          <div className="h-8 w-20 bg-slate-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
          <div className="h-3 w-16 bg-slate-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
        </div>
        <div className="w-12 h-12 bg-slate-200 dark:bg-zinc-700 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

export default function AnalyticsCards({ filter }: { filter: AnalyticsFilter }) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [filter.timeframe, filter.dateRange?.start, filter.dateRange?.end, filter.category]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes, ticketsRes] = await Promise.all([
        supportFetch("/orders"),
        supportFetch("/products"),
        supportFetch("/support-tickets"),
      ]);

      const allOrders = ordersRes?.data || ordersRes || [];
      const allProducts = productsRes?.data || productsRes || [];
      const allTickets = ticketsRes?.data || ticketsRes || [];

      const orders = filterOrdersByTime(allOrders, filter);
      const products = filterProductsByCategory(allProducts, filter.category);
      const tickets = filterTicketsByTime(allTickets, filter);

      const totalPrice = orders.reduce((sum: number, o: any) => sum + (parseFloat(o.totalPrice) || 0), 0);
      const delivered = orders.filter((o: any) => o.statusOrder === "delivered").length;
      const activeProducts = products.filter((p: any) => p.statusProduct === "active").length;
      const solvedTickets = tickets.filter((t: any) => t.status === "solved").length;
      const resolutionRate = tickets.length > 0 ? ((solvedTickets / tickets.length) * 100).toFixed(1) : "0";

      const label = getTimeframeLabel(filter.timeframe);

      setCards([
        {
          title: `Revenue (${label})`,
          value: `$${totalPrice.toLocaleString()}`,
          change: `${orders.length} orders`,
          isUp: true,
          icon: DollarSign,
          color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400",
        },
        {
          title: `Orders (${label})`,
          value: orders.length.toString(),
          change: `${delivered} delivered`,
          isUp: true,
          icon: ShoppingBag,
          color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
        },
        {
          title: "Active Products",
          value: activeProducts.toString(),
          change: `${products.length - activeProducts} draft/out`,
          isUp: activeProducts > 0,
          icon: Package,
          color: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
        },
        {
          title: "Resolution Rate",
          value: `${resolutionRate}%`,
          change: `${solvedTickets} solved of ${tickets.length}`,
          isUp: solvedTickets > 0,
          icon: Percent,
          color: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
        },
      ]);
    } catch (err) {
      console.error("Failed to load analytics cards:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {loading
        ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        : cards.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{item.title}</span>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{item.value}</h3>
                  <div className={`flex items-center gap-1 text-xs font-bold ${item.isUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
                    {item.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{item.change}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            );
          })}
    </div>
  );
}

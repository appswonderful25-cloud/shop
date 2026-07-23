"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { supportFetch } from "../platform-support/lib/support-api";
import { AnalyticsFilter, filterOrdersByTime, filterTicketsByTime, filterProductsByCategory, getTimeframeLabel } from "./filter-utils";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function SkeletonChart({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm ${className}`}>
      <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800 pb-3 mb-4">
        <div className="h-4 w-32 bg-slate-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
        <div className="h-4 w-16 bg-slate-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
      </div>
      <div className="flex items-end gap-2 h-[240px] px-4 pt-4">
        {[40, 65, 55, 80, 45, 70, 90, 50, 75, 60, 85, 45].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end">
            <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-t-lg animate-pulse" style={{ height: `${h}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonDonut() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm flex flex-col">
      <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800 pb-3 mb-4">
        <div className="h-4 w-24 bg-slate-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
        <div className="h-4 w-12 bg-slate-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center space-y-4 py-4">
        <div className="w-32 h-32 rounded-full border-[12px] border-slate-200 dark:border-zinc-700 animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-20 bg-slate-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
              <div className="h-3 w-8 bg-slate-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-zinc-700 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function buildDailyData(orders: any[]): { categories: string[]; data: number[] } {
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
  const buckets = new Array(24).fill(0);
  orders.forEach((o: any) => {
    if (o.dateOrder) {
      const d = new Date(o.dateOrder);
      buckets[d.getHours()] += parseFloat(o.totalPrice) || 0;
    }
  });
  return { categories: hours, data: buckets };
}

function buildMonthlyData(orders: any[]): { categories: string[]; data: number[] } {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const buckets = new Array(12).fill(0);
  orders.forEach((o: any) => {
    if (o.dateOrder) {
      const d = new Date(o.dateOrder);
      buckets[d.getMonth()] += parseFloat(o.totalPrice) || 0;
    }
  });
  return { categories: months, data: buckets };
}

function buildYearlyData(orders: any[]): { categories: string[]; data: number[] } {
  const yearMap: Record<string, number> = {};
  orders.forEach((o: any) => {
    if (o.dateOrder) {
      const year = String(new Date(o.dateOrder).getFullYear());
      yearMap[year] = (yearMap[year] || 0) + (parseFloat(o.totalPrice) || 0);
    }
  });
  const years = Object.keys(yearMap).sort();
  return { categories: years.length > 0 ? years : ["No Data"], data: years.length > 0 ? years.map((y) => yearMap[y]) : [0] };
}

function buildCustomData(orders: any[], start: string, end: string): { categories: string[]; data: number[] } {
  const s = new Date(start);
  const e = new Date(end);
  const diffDays = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 31) {
    const buckets: Record<string, number> = {};
    const days: string[] = [];
    const cur = new Date(s);
    while (cur <= e) {
      const key = `${cur.getMonth() + 1}/${cur.getDate()}`;
      buckets[key] = 0;
      days.push(key);
      cur.setDate(cur.getDate() + 1);
    }
    orders.forEach((o: any) => {
      if (o.dateOrder) {
        const d = new Date(o.dateOrder);
        const key = `${d.getMonth() + 1}/${d.getDate()}`;
        if (key in buckets) buckets[key] += parseFloat(o.totalPrice) || 0;
      }
    });
    return { categories: days, data: days.map((d) => buckets[d]) };
  } else {
    const buckets: Record<string, number> = {};
    const months: string[] = [];
    let cur = new Date(s.getFullYear(), s.getMonth(), 1);
    const endMonth = new Date(e.getFullYear(), e.getMonth(), 1);
    while (cur <= endMonth) {
      const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}`;
      buckets[key] = 0;
      months.push(key);
      cur.setMonth(cur.getMonth() + 1);
    }
    orders.forEach((o: any) => {
      if (o.dateOrder) {
        const d = new Date(o.dateOrder);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (key in buckets) buckets[key] += parseFloat(o.totalPrice) || 0;
      }
    });
    return { categories: months, data: months.map((m) => buckets[m]) };
  }
}

export default function AnalyticsCharts({ filter }: { filter: AnalyticsFilter }) {
  const [revenueData, setRevenueData] = useState<{ categories: string[]; data: number[] }>({ categories: [], data: [] });
  const [orderStatuses, setOrderStatuses] = useState({ delivered: 0, inTransit: 0, failed: 0 });
  const [ticketStatuses, setTicketStatuses] = useState({ pending: 0, solved: 0 });
  const [categoryData, setCategoryData] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [filter.timeframe, filter.dateRange?.start, filter.dateRange?.end, filter.category]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersRes, ticketsRes, productsRes] = await Promise.all([
        supportFetch("/orders"),
        supportFetch("/support-tickets"),
        supportFetch("/products"),
      ]);

      const allOrders = ordersRes?.data || ordersRes || [];
      const allTickets = ticketsRes?.data || ticketsRes || [];
      const allProducts = productsRes?.data || productsRes || [];

      const orders = filterOrdersByTime(allOrders, filter);
      const tickets = filterTicketsByTime(allTickets, filter);
      const products = filterProductsByCategory(allProducts, filter.category);

      let delivered = 0, inTransit = 0, failed = 0;
      orders.forEach((o: any) => {
        if (o.statusOrder === "delivered") delivered++;
        else if (o.statusOrder === "inTransit") inTransit++;
        else if (o.statusOrder === "failed") failed++;
      });

      switch (filter.timeframe) {
        case "daily":
          setRevenueData(buildDailyData(orders));
          break;
        case "monthly":
          setRevenueData(buildMonthlyData(orders));
          break;
        case "yearly":
          setRevenueData(buildYearlyData(orders));
          break;
        case "custom":
          if (filter.dateRange) {
            setRevenueData(buildCustomData(orders, filter.dateRange.start, filter.dateRange.end));
          } else {
            setRevenueData(buildMonthlyData(orders));
          }
          break;
        default:
          setRevenueData(buildMonthlyData(orders));
      }

      setOrderStatuses({ delivered, inTransit, failed });
      setTicketStatuses({
        pending: tickets.filter((t: any) => t.status === "pending" || t.status === "in_progress").length,
        solved: tickets.filter((t: any) => t.status === "solved").length,
      });

      const catCounts: Record<string, number> = {};
      products.forEach((p: any) => {
        const cat = p.productCategory || "Uncategorized";
        catCounts[cat] = (catCounts[cat] || 0) + 1;
      });
      const sortedCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
      setCategoryData({
        labels: sortedCats.map(([k]) => k),
        data: sortedCats.map(([, v]) => v),
      });
    } catch (err) {
      console.error("Failed to load chart data:", err);
    } finally {
      setLoading(false);
    }
  };

  const label = getTimeframeLabel(filter.timeframe);

  const revenueChartOptions: any = {
    chart: { type: "area", toolbar: { show: false }, fontFamily: "inherit", animations: { enabled: true, easing: "easeinout", speed: 600 } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3, colors: ["#465FFF"] },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, colorStops: [{ offset: 0, color: "#465FFF", opacity: 0.4 }, { offset: 100, color: "#465FFF", opacity: 0.02 }] },
    },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4, yaxis: { lines: { show: true } } },
    xaxis: {
      categories: revenueData.categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#94a3b8", fontSize: "11px", fontWeight: 600 },
        rotate: revenueData.categories.length > 15 ? -45 : 0,
        rotateAlways: revenueData.categories.length > 31,
      },
    },
    yaxis: { labels: { style: { colors: "#94a3b8", fontSize: "11px", fontWeight: 600 }, formatter: (val: number) => `$${val}` } },
    tooltip: { theme: "light", y: { formatter: (val: number) => `$${val} USD` } },
  };

  const categoryPieOptions: any = {
    chart: { type: "donut", fontFamily: "inherit", animations: { enabled: true, easing: "easeinout", speed: 600 } },
    labels: categoryData.labels,
    colors: ["#465FFF", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"],
    plotOptions: { pie: { donut: { size: "70%" } } },
    legend: { position: "bottom", labels: { colors: "#94a3b8", useSeriesColors: false } },
    dataLabels: { enabled: false },
  };

  const total = orderStatuses.delivered + orderStatuses.inTransit + orderStatuses.failed;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonChart className="lg:col-span-2" />
          <SkeletonDonut />
        </div>
        <SkeletonChart />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm min-h-[320px]">
          <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Revenue — {label}</h3>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">
              ${revenueData.data.reduce((s, v) => s + v, 0).toLocaleString()}
            </span>
          </div>
          {revenueData.data.length > 0 ? (
            <Chart options={revenueChartOptions} series={[{ name: "Revenue", data: revenueData.data }]} type="area" height={240} width="100%" />
          ) : (
            <div className="flex items-center justify-center h-[240px] text-xs text-slate-400">No data for this period</div>
          )}
        </div>

        <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm flex flex-col">
          <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Order Status</h3>
            <span className="text-xs font-bold text-slate-400">{total} total</span>
          </div>
          {total > 0 ? (
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-emerald-600">Delivered</span>
                  <span className="text-slate-900 dark:text-white">{orderStatuses.delivered}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${(orderStatuses.delivered / total) * 100}%` }} />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-blue-600">In Transit</span>
                  <span className="text-slate-900 dark:text-white">{orderStatuses.inTransit}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${(orderStatuses.inTransit / total) * 100}%` }} />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-red-600">Failed</span>
                  <span className="text-slate-900 dark:text-white">{orderStatuses.failed}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: `${(orderStatuses.failed / total) * 100}%` }} />
                </div>
              </div>
              <div className="border-t border-slate-100 dark:border-zinc-800 pt-3 mt-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Tickets</span>
                  <span className="text-slate-600 dark:text-zinc-300">{ticketStatuses.solved} solved / {ticketStatuses.pending} pending</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">No orders yet</div>
          )}
        </div>
      </div>

      {categoryData.labels.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Products by Category</h3>
            <span className="text-xs font-bold text-slate-400">{categoryData.data.reduce((s, v) => s + v, 0)} products</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex justify-center">
              <Chart options={categoryPieOptions} series={categoryData.data} type="donut" height={220} width={220} />
            </div>
            <div className="space-y-3">
              {categoryData.labels.map((cat, i) => {
                const total = categoryData.data.reduce((s, v) => s + v, 0);
                const pct = total > 0 ? ((categoryData.data[i] / total) * 100).toFixed(1) : "0";
                const colors = ["bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-violet-500", "bg-cyan-500", "bg-pink-500"];
                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-700 dark:text-zinc-300">{cat}</span>
                      <span className="text-slate-900 dark:text-white">{categoryData.data[i]} ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full ${colors[i % colors.length]} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

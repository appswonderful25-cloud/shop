"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { supportFetch } from "../platform-support/lib/support-api";
import { AnalyticsFilter, filterOrdersByTime, filterTicketsByTime, filterReturnsByTime, getTimeframeLabel } from "./filter-utils";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function SkeletonBar() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm min-h-[320px]">
      <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800 pb-3 mb-4">
        <div className="h-4 w-32 bg-slate-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
        <div className="h-4 w-24 bg-slate-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
      </div>
      <div className="flex items-end gap-4 h-[240px] px-6 pt-4">
        {[60, 80, 45, 30, 50].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end">
            <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-t-lg animate-pulse" style={{ height: `${h}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm flex flex-col">
      <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800 pb-3 mb-4">
        <div className="h-4 w-28 bg-slate-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
        <div className="h-4 w-12 bg-slate-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
      </div>
      <div className="space-y-4 flex-1 justify-center flex flex-col py-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-32 bg-slate-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
              <div className="h-3 w-6 bg-slate-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-zinc-700 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100 dark:border-zinc-800 pt-3 mt-3 space-y-2">
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-slate-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
          <div className="h-3 w-8 bg-slate-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-slate-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
          <div className="h-3 w-8 bg-slate-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function VisitorsAnalytics({ filter }: { filter: AnalyticsFilter }) {
  const [data, setData] = useState({ totalOrders: 0, totalRevenue: 0, delivered: 0, inTransit: 0, failed: 0, pendingTickets: 0, solvedTickets: 0, totalReturns: 0 });
  const [returnReasons, setReturnReasons] = useState<{ reason: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [filter.timeframe, filter.dateRange?.start, filter.dateRange?.end, filter.category]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersRes, ticketsRes, returnsRes] = await Promise.all([
        supportFetch("/orders"),
        supportFetch("/support-tickets"),
        supportFetch("/returns"),
      ]);

      const allOrders = ordersRes?.data || ordersRes || [];
      const allTickets = ticketsRes?.data || ticketsRes || [];
      const allReturns = returnsRes?.data || returnsRes || [];

      const orders = filterOrdersByTime(allOrders, filter);
      const tickets = filterTicketsByTime(allTickets, filter);
      const returns = filterReturnsByTime(allReturns, filter);

      const delivered = orders.filter((o: any) => o.statusOrder === "delivered").length;
      const inTransit = orders.filter((o: any) => o.statusOrder === "inTransit").length;
      const failed = orders.filter((o: any) => o.statusOrder === "failed").length;

      setData({
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum: number, o: any) => sum + (parseFloat(o.totalPrice) || 0), 0),
        delivered,
        inTransit,
        failed,
        pendingTickets: tickets.filter((t: any) => t.status === "pending" || t.status === "in_progress").length,
        solvedTickets: tickets.filter((t: any) => t.status === "solved").length,
        totalReturns: returns.length,
      });

      const reasonCounts: Record<string, number> = {};
      returns.forEach((r: any) => {
        const reason = r.reason || "Other";
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
      });
      const sorted = Object.entries(reasonCounts)
        .map(([reason, count]) => ({ reason, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      setReturnReasons(sorted);
    } catch (err) {
      console.error("Failed to load analytics data:", err);
    } finally {
      setLoading(false);
    }
  };

  const label = getTimeframeLabel(filter.timeframe);

  const barChartOptions: any = {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit", animations: { enabled: true, easing: "easeinout", speed: 600 } },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "60%" } },
    colors: ["#465FFF"],
    dataLabels: { enabled: false },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4, yaxis: { lines: { show: true } } },
    xaxis: {
      categories: ["Total Orders", "Delivered", "In Transit", "Failed", "Returns"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#94a3b8", fontSize: "11px", fontWeight: 600 } },
    },
    yaxis: { labels: { style: { colors: "#94a3b8", fontSize: "11px", fontWeight: 600 } } },
  };

  const barSeries = [
    { name: "Count", data: [data.totalOrders, data.delivered, data.inTransit, data.failed, data.totalReturns] },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SkeletonBar />
        <SkeletonList />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm min-h-[320px]">
        <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Activity — {label}</h3>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-lg">
            Revenue: ${data.totalRevenue.toLocaleString()}
          </span>
        </div>
        {data.totalOrders > 0 ? (
          <Chart options={barChartOptions} series={barSeries} type="bar" height={240} width="100%" />
        ) : (
          <div className="flex items-center justify-center h-[240px] text-xs text-slate-400">No data for this period</div>
        )}
      </div>

      <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm flex flex-col">
        <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top Return Reasons</h3>
          <span className="text-xs font-bold text-slate-400">{returnReasons.length} reasons</span>
        </div>

        <div className="space-y-4 flex-1 justify-center flex flex-col">
          {returnReasons.length > 0 ? (
            returnReasons.map((item, i) => {
              const maxCount = returnReasons[0]?.count || 1;
              const colors = ["bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-violet-500"];
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-700 dark:text-zinc-300 truncate max-w-[140px]">{item.reason}</span>
                    <span className="text-slate-900 dark:text-white">{item.count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[i % colors.length]} rounded-full transition-all duration-500`} style={{ width: `${(item.count / maxCount) * 100}%` }} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-xs text-slate-400">No returns for this period</div>
          )}
        </div>

        <div className="border-t border-slate-100 dark:border-zinc-800 pt-3 mt-3 space-y-1">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-400">Tickets Solved</span>
            <span className="text-emerald-600">{data.solvedTickets}</span>
          </div>
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-400">Tickets Pending</span>
            <span className="text-orange-500">{data.pendingTickets}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

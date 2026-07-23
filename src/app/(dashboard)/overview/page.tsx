"use client";

import { useState, useEffect } from "react";
import { BarChart3, ShoppingBag, Users, ArrowUpRight, Package, Ticket, RefreshCw, Wallet, Loader2, AlertTriangle, RotateCw } from "lucide-react";
import dynamic from "next/dynamic";
import { supportFetch } from "../platform-support/lib/support-api";
import { useLanguage } from "@/app/store/LanguageContext";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Stats {
  orders: { total: number; delivered: number; inTransit: number; failed: number; totalPrice: number };
  products: { total: number; active: number; draft: number };
  tickets: { total: number; pending: number; solved: number };
  returns: { total: number; pending: number; returned: number };
  wallet: { balance: number; earnings: number; pending: number };
  users: number;
  monthRevenue: Record<string, number>;
}

export default function Overview() {
  const { t, dir } = useLanguage();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersRes, productsRes, ticketsRes, returnsRes, walletsRes] = await Promise.all([
        supportFetch("/orders"),
        supportFetch("/products"),
        supportFetch("/support-tickets"),
        supportFetch("/returns"),
        supportFetch("/wallets"),
      ]);

      const orderList = ordersRes?.data || ordersRes || [];
      const productList = productsRes?.data || productsRes || [];
      const ticketList = ticketsRes?.data || ticketsRes || [];
      const returnList = returnsRes?.data || returnsRes || [];
      const walletList = walletsRes?.data || walletsRes || [];

      const delivered = orderList.filter((o: any) => o.statusOrder === "delivered").length;
      const inTransit = orderList.filter((o: any) => o.statusOrder === "inTransit").length;
      const failed = orderList.filter((o: any) => o.statusOrder === "failed").length;
      const totalPrice = orderList.reduce((sum: number, o: any) => sum + (parseFloat(o.totalPrice) || 0), 0);

      const activeProducts = productList.filter((p: any) => p.statusProduct === "active").length;
      const draftProducts = productList.filter((p: any) => p.statusProduct === "draft").length;

      const pendingTickets = ticketList.filter((t: any) => t.status === "pending" || t.status === "in_progress").length;
      const solvedTickets = ticketList.filter((t: any) => t.status === "solved").length;

      const pendingReturns = returnList.filter((r: any) => r.statusReturn === "pending").length;
      const completedReturns = returnList.filter((r: any) => r.statusReturn === "returned").length;

      const wallet = walletList[0] || {};

      const activeOrders = orderList.filter((o: any) => o.statusOrder !== "failed");

      const monthCounts: Record<string, number> = {};
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      months.forEach((m) => (monthCounts[m] = 0));
      activeOrders.forEach((o: any) => {
        if (o.dateOrder) {
          const d = new Date(o.dateOrder);
          const m = months[d.getMonth()];
          monthCounts[m] += parseFloat(o.totalPrice) || 0;
        }
      });

      setStats({
        orders: { total: orderList.length, delivered, inTransit, failed, totalPrice },
        products: { total: productList.length, active: activeProducts, draft: draftProducts },
        tickets: { total: ticketList.length, pending: pendingTickets, solved: solvedTickets },
        returns: { total: returnList.length, pending: pendingReturns, returned: completedReturns },
        wallet: {
          balance: parseFloat(wallet.currentBalance) || 0,
          earnings: parseFloat(wallet.totalEarnings) || 0,
          pending: parseFloat(wallet.pendingClearance) || 0,
        },
        users: 1,
        monthRevenue: monthCounts,
      });
    } catch (err: any) {
      console.error("Failed to load stats:", err);
      setError(err?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-20 gap-3">
        <AlertTriangle size={24} className="text-red-500" />
        <span className="text-sm text-red-500">{error}</span>
        <button onClick={loadStats} className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl cursor-pointer">
          <RotateCw size={13} /> Retry
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const chartOptions: any = {
    chart: { type: "area", toolbar: { show: false }, fontFamily: "inherit" },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3, colors: ["#465FFF"] },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, colorStops: [{ offset: 0, color: "#465FFF", opacity: 0.4 }, { offset: 100, color: "#465FFF", opacity: 0.02 }] },
    },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4, yaxis: { lines: { show: true } } },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#94a3b8", fontSize: "12px", fontWeight: 600 } },
    },
    yaxis: { labels: { style: { colors: "#94a3b8", fontSize: "12px", fontWeight: 600 }, formatter: (val: number) => `$${val}` } },
    tooltip: { theme: "light", y: { formatter: (val: number) => `$${val} USD` } },
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const chartSeries = [{ name: "Revenue", data: months.map((m) => stats.monthRevenue[m] || 0) }];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left relative" dir={dir}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t("sidebar.overview")}</h1>
          <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1">{t("overview.earnToday")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title={t("overview.orders")} value={stats.orders.total} subtitle={`${stats.orders.delivered} ${t("dashboardOrders.delivered")}`} icon={ShoppingBag} color="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400" />
        <StatCard title={t("overview.revenue")} value={`$${stats.orders.totalPrice.toLocaleString()}`} subtitle={`${stats.orders.inTransit} ${t("dashboardOrders.inTransit")}`} icon={BarChart3} color="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400" />
        <StatCard title={t("sidebar.products")} value={stats.products.total} subtitle={`${stats.products.active} ${t("dashboardProducts.active")}`} icon={Package} color="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400" />
        <StatCard title={t("sidebar.platformSupport")} value={stats.tickets.total} subtitle={`${stats.tickets.pending} ${t("dashboardOrders.pending")}`} icon={Ticket} color="bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title={t("dashboardWallet.title")} value={`$${stats.wallet.balance.toLocaleString()}`} subtitle={`$${stats.wallet.pending} ${t("dashboardOrders.pending")}`} icon={Wallet} color="bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400" />
        <StatCard title={t("sidebar.returns")} value={stats.returns.total} subtitle={`${stats.returns.pending} ${t("dashboardOrders.pending")}`} icon={RefreshCw} color="bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400" />
        <StatCard title={t("overview.failedOrders")} value={stats.orders.failed} subtitle={t("overview.needsAttention")} icon={AlertTriangle} color="bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400" />
        <StatCard title={t("overview.solvedTickets")} value={stats.tickets.solved} subtitle={t("overview.resolved")} icon={Users} color="bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400" />
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm min-h-[320px]">
        <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t("overview.revenueChart")}</h3>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">{t("overview.live")}</span>
        </div>
        <div className="flex-1 w-full">
          <Chart options={chartOptions} series={chartSeries} type="area" height={240} width="100%" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }: { title: string; value: string | number; subtitle: string; icon: any; color: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{title}</span>
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</h3>
        <span className="text-xs text-slate-400 dark:text-zinc-500">{subtitle}</span>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={22} />
      </div>
    </div>
  );
}

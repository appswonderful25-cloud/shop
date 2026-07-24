"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ShoppingBag, Eye, Search, Loader2, AlertTriangle, RotateCw } from "lucide-react";
import toast from "react-hot-toast";
import { API_CONFIG, API_ENDPOINTS } from "@/lib/api-config";
import { useLanguage } from "@/app/store/LanguageContext";
import { useDBTranslation } from "@/lib/translate-db";

function getToken(): string {
  if (typeof document === 'undefined') return '';
  return document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] || '';
}

export default function OrdersTable() {
  const { t, dir } = useLanguage();
  const { translateOrderStatus } = useDBTranslation();
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);

  const handleInspectOrder = (order: any) => {
    setSelectedOrder(order);
  };

  const fetchData = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    setLoadError(null);

    try {
      const token = getToken();
      const res = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.ORDERS.LIST}?populate=*`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (!data || !Array.isArray(data.data)) {
        throw new Error("Invalid data format");
      }
      setOrdersData(data.data);
    } catch (err: any) {
      console.error("Failed to fetch orders data:", err);
      setLoadError(err?.message || t("orders.loading"));
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredOrders = ordersData.filter((order) => {
    if (!order || !order.id) return false;
    const matchesTab = activeTab === "All" || order.statusOrder === activeTab;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (order.customerName || '').toLowerCase().includes(searchLower) || order.id.toString().includes(searchLower);
    return matchesTab && matchesSearch;
  });

  const getTabLabel = (tab: string) => {
    if (tab === "delivered") return t("orders.delivered");
    if (tab === "inTransit") return t("orders.inTransit");
    if (tab === "failed") return t("orders.failed");
    return t("orders.all");
  };

  const getStatusLabel = (status: string) => {
    return translateOrderStatus(status);
  };

  const getLogMessage = (status: string) => {
    if (status === "failed") return t("orders.shippingFailed");
    if (status === "delivered") return t("orders.successfulDist");
    return t("orders.inTransit");
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-start relative" dir={dir}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="text-indigo-600 dark:text-indigo-400" size={24} />
            {t("orders.tracking")}
          </h1>
          <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1">
            {t("orders.trackDesc")}
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 text-sm text-slate-400 dark:text-zinc-500 py-16">
          <Loader2 size={20} className="animate-spin" />
          <span>{t("orders.loading")}</span>
        </div>
      )}

      {!loading && loadError && (
        <div className="flex flex-col items-center justify-center gap-3 text-sm text-red-500 py-16">
          <AlertTriangle size={20} />
          <span>{loadError}</span>
          <button onClick={fetchData} className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer">
            <RotateCw size={13} /> {t("orders.retry")}
          </button>
        </div>
      )}

      {!loading && !loadError && (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-zinc-900/40 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800/60">
            <div className="flex bg-slate-100/70 dark:bg-zinc-800/60 p-1.5 rounded-2xl border border-slate-200/40 dark:border-zinc-700/30 w-fit">
              {["All", "delivered", "inTransit", "failed"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer select-none ${activeTab === tab ? "bg-white text-slate-900 shadow-sm border border-slate-200/50 dark:bg-zinc-900 dark:text-white dark:border-zinc-800" : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"}`}>
                  {getTabLabel(tab)}
                </button>
              ))}
            </div>
            <div className="relative flex-1 max-w-md">
              <span className={`absolute inset-y-0 ${dir === "rtl" ? "right-0 pr-4" : "left-0 pl-4"} flex items-center pointer-events-none`}>
                <Search size={16} className="text-slate-400 dark:text-zinc-500" />
              </span>
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t("orders.searchPlaceholder")}
                className={`w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs ${dir === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"} py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 transition-colors shadow-sm`} />
            </div>
          </div>

          {filteredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 text-sm text-slate-400 dark:text-zinc-500 py-16">
              <ShoppingBag size={24} />
              <span>{t("orders.noOrders")}</span>
            </div>
          )}

          {filteredOrders.length > 0 && (
            <div className="w-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-start border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/50 text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                      <th className="p-4">{t("orders.orderId")}</th>
                      <th className="p-4">{t("orders.customer")}</th>
                      <th className="p-4">{t("orders.date")}</th>
                      <th className="p-4">{t("orders.items")}</th>
                      <th className="p-4">{t("orders.totalPrice")}</th>
                      <th className="p-4">{t("orders.shippingStatus")}</th>
                      <th className="p-4 w-24">{t("orders.action")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/20 transition-colors text-sm text-slate-700 dark:text-zinc-300">
                        <td className="p-4 font-bold font-mono text-slate-900 dark:text-white">{order.id}</td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 dark:text-white">{order.customerName}</span>
                            <span className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">{order.emailCustomer}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-500 dark:text-zinc-400">{order.dateOrder || '—'}</td>
                        <td className="p-4 font-medium text-slate-600 dark:text-zinc-400">
                          {order.orderItems && order.orderItems.length > 0 ? t("orders.xItems", { count: order.orderItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) }) : '—'}
                        </td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">
                          {order.totalPrice ? `$${order.totalPrice}` : order.orderItems && order.orderItems.length > 0 ? `$${order.orderItems.reduce((sum: number, item: any) => sum + (item.quantity || 0) * (item.price || 0), 0)}` : '—'}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            order.statusOrder === "delivered" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : order.statusOrder === "inTransit" ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
                            : "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${order.statusOrder === "delivered" ? "bg-emerald-500" : order.statusOrder === "inTransit" ? "bg-blue-500" : "bg-rose-500"}`} />
                            {getStatusLabel(order.statusOrder)}
                          </span>
                        </td>
                        <td className="p-4">
                          <button onClick={() => handleInspectOrder(order)}
                            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95">
                            <Eye size={14} /> {t("orders.inspect")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-xl z-50 animate-scale-in text-start relative" dir={dir}>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t("orders.inspectionLogs")}</h3>
                <div className="space-y-4 text-xs font-medium">
                  <div className="bg-slate-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
                    <span className="text-slate-400 block font-bold uppercase tracking-wider">{t("orders.logStatus")}</span>
                    <p className={`mt-1 font-bold text-sm ${selectedOrder.statusOrder === "failed" ? "text-rose-500" : "text-slate-700 dark:text-zinc-300"}`}>
                      {getLogMessage(selectedOrder.statusOrder)}
                    </p>
                  </div>
                  {selectedOrder.notes && (
                    <div className="bg-slate-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
                      <span className="text-slate-400 block font-bold uppercase tracking-wider">{t("orders.notes")}</span>
                      <p className="mt-1 text-slate-700 dark:text-zinc-300 leading-relaxed font-semibold">{selectedOrder.notes}</p>
                    </div>
                  )}
                  {selectedOrder.customerAddress && (
                    <div className="bg-slate-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
                      <span className="text-slate-400 block font-bold uppercase tracking-wider">{t("orders.address")}</span>
                      <p className="mt-1 text-slate-700 dark:text-zinc-300 leading-relaxed font-semibold">{selectedOrder.customerAddress}</p>
                    </div>
                  )}
                  {selectedOrder.customerPhone && (
                    <div className="bg-slate-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
                      <span className="text-slate-400 block font-bold uppercase tracking-wider">{t("orders.phone")}</span>
                      <p className="mt-1 text-slate-700 dark:text-zinc-300 leading-relaxed font-semibold">{selectedOrder.customerPhone}</p>
                    </div>
                  )}
                </div>
                <button onClick={() => setSelectedOrder(null)} className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold p-3 rounded-xl transition-all cursor-pointer active:scale-95">
                  {t("orders.closeLog")}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

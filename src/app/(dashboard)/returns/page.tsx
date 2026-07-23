"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { RefreshCw, Eye, Loader2, AlertTriangle, RotateCw, Package } from "lucide-react";
import ReturnDetailsModal from "./ReturnDetailsModal";
import toast from "react-hot-toast";
import { API_CONFIG, API_ENDPOINTS } from "@/lib/api-config";

function getToken(): string {
  if (typeof document === 'undefined') return '';
  return document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] || '';
}

export default function Returns() {
  const [returnsData, setReturnsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [daysOwned, setDaysOwned] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoadingRef = useRef(false);

  const loadReturns = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    setLoadError(null);

    try {
      const token = getToken();
      const res = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.RETURNS.LIST}?populate=*`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      setReturnsData(data.data || []);
    } catch (err: any) {
      console.error(err);
      setLoadError(err?.message || "Failed to fetch returns data.");
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadReturns();
  }, [loadReturns]);

  const onStatusChange = async (id: string, newStatus: string) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.RETURNS.BY_ID(id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ data: { statusReturn: newStatus } }),
      });
      if (!res.ok) throw new Error(`Failed to update status: ${res.status}`);
      setReturnsData((items: any) =>
        items.map((item: any) =>
          item.documentId === id ? { ...item, statusReturn: newStatus } : item
        )
      );
      toast.success("Status updated successfully!");
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update status. Please try again.");
    }
  };

  const handleOpenDetails = (item: any, days: number) => {
    setSelectedItem(item);
    setDaysOwned(days);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left relative" dir="ltr">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <RefreshCw className="text-indigo-600 dark:text-indigo-400" size={24} />
            Returns & Refunds
          </h1>
          <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1">
            Track customer product returns, review return reasons, check ownership days, and manage refund statuses.
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 text-sm text-slate-400 dark:text-zinc-500 py-16">
          <Loader2 size={20} className="animate-spin" />
          <span>Loading returns data...</span>
        </div>
      )}

      {!loading && loadError && (
        <div className="flex flex-col items-center justify-center gap-3 text-sm text-red-500 py-16">
          <AlertTriangle size={20} />
          <span>{loadError}</span>
          <button
            onClick={loadReturns}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            <RotateCw size={13} /> Retry
          </button>
        </div>
      )}

      {!loading && !loadError && returnsData.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 text-sm text-slate-400 dark:text-zinc-500 py-16">
          <Package size={24} />
          <span>No return requests found.</span>
        </div>
      )}

      {!loading && !loadError && returnsData.length > 0 && (
        <div className="w-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/50 text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                  <th className="p-4">Order Info</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Days Owned</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 w-28">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                {returnsData.map((item: any) => {
                  const timeNow = new Date().getTime();
                  const days = item.order?.dateOrder
                    ? Math.ceil((timeNow - new Date(item.order.dateOrder).getTime()) / (1000 * 3600 * 24))
                    : 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/20 transition-colors text-sm text-slate-700 dark:text-zinc-300">
                      <td className="p-4 font-bold font-mono text-slate-900 dark:text-white">
                        {item.id}
                      </td>
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">
                        {item.order?.customerName || "N/A"}
                      </td>
                      <td className="p-4 max-w-[200px] truncate font-medium">
                        {item.product?.title || "N/A"}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-bold ${days > 14 ? "text-amber-500" : "text-slate-500 dark:text-zinc-400"}`}>
                          {days} Days
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.statusReturn === "returned"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : item.statusReturn === "pending"
                              ? "bg-amber-50 text-amber-500 dark:bg-amber-950/30 dark:text-amber-400"
                              : "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.statusReturn === "returned" ? "bg-emerald-500" : item.statusReturn === "pending" ? "bg-amber-500" : "bg-rose-500"}`} />
                          {item.statusReturn === "returned" ? "Returned" : item.statusReturn === "pending" ? "Pending" : "Rejected"}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleOpenDetails(item, days)}
                          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95"
                        >
                          <Eye size={14} />
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ReturnDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        returnItem={selectedItem}
        daysOwned={daysOwned}
        onStatusChange={onStatusChange}
      />
    </div>
  );
}

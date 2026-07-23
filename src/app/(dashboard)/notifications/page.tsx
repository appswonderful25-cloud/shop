"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Bell, ShoppingBag, RefreshCw, Mail, Hash, DollarSign, Clock, Trash2, CheckCircle2, Loader2, AlertTriangle, RotateCw, AlertCircle } from "lucide-react";
import { API_CONFIG, API_ENDPOINTS } from "@/lib/api-config";

interface NotificationItem {
  id: number;
  documentId?: string;
  title: string;
  content: string;
  type: "returns" | "purchase" | "info" | "alert";
  isRead: boolean;
  createdAt?: string;
}

function getToken(): string {
  return document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] || '';
}

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [notificationsData, setNotificationsData] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    if (notificationsData.length === 0) {
      setLoading(true);
    }
    setLoadError(null);

    try {
      const token = getToken();
      const res = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.NOTIFICATIONS.LIST}?sort=createdAt:desc&populate=*`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setNotificationsData(data.data || []);
    } catch (err: any) {
      console.error("Failed to fetch notifications:", err);
      setLoadError(err?.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMarkAllRead = async () => {
    const unread = notificationsData.filter(n => !n.isRead);
    if (unread.length === 0) return;

    // Optimistic update
    setNotificationsData(prev => prev.map(n => ({ ...n, isRead: true })));

    try {
      const token = getToken();
      await Promise.all(
        unread.map(n =>
          fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.NOTIFICATIONS.BY_ID(n.documentId || String(n.id))}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ data: { isRead: true } }),
          }).then(res => { if (!res.ok) throw new Error(`PUT failed ${res.status}`); })
        )
      );
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      fetchData();
    }
  };

  const handleDeleteNotification = async (id: number, documentId?: string) => {
    // Optimistic update
    setNotificationsData(prev => prev.filter(n => n.id !== id));

    try {
      const token = getToken();
      const res = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.NOTIFICATIONS.BY_ID(documentId || String(id))}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`DELETE failed ${res.status}`);
    } catch (err) {
      console.error("Failed to delete notification:", err);
      fetchData();
    }
  };

  const filteredNotifications = notificationsData.filter(n => {
    if (activeTab === "all") return true;
    if (activeTab === "purchase") return n.type === "purchase";
    if (activeTab === "return") return n.type === "returns";
    if (activeTab === "alert") return n.type === "alert";
    if (activeTab === "info") return n.type === "info";
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "purchase": return <ShoppingBag size={18} />;
      case "returns": return <RefreshCw size={18} />;
      case "alert": return <AlertCircle size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "purchase": return "New Sale";
      case "returns": return "Return Request";
      case "alert": return "Alert";
      default: return "Info";
    }
  };

  const getTypeColors = (type: string) => {
    switch (type) {
      case "purchase":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400";
      case "returns":
        return "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400";
      case "alert":
        return "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400";
      default:
        return "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400";
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left relative" dir="ltr">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Bell className="text-indigo-600 dark:text-indigo-400" size={24} />
            Notification Center
          </h1>
          <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1">
            Live operations log tracker for new store checkout sales and customer item return requests.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-zinc-800 dark:hover:bg-zinc-700/50 px-3 py-2.5 rounded-xl transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <CheckCircle2 size={14} />
          Mark all as read
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 text-sm text-slate-400 dark:text-zinc-500 py-16">
          <Loader2 size={20} className="animate-spin" />
          <span>Loading notifications...</span>
        </div>
      )}

      {!loading && loadError && (
        <div className="flex flex-col items-center justify-center gap-3 text-sm text-red-500 py-16">
          <AlertTriangle size={20} />
          <span>{loadError}</span>
          <button onClick={fetchData} className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer">
            <RotateCw size={13} /> Retry
          </button>
        </div>
      )}

      {!loading && !loadError && (
        <>
          <div className="flex bg-slate-100/70 dark:bg-zinc-800/60 p-1.5 rounded-2xl border border-slate-200/40 dark:border-zinc-700/30 w-fit select-none flex-wrap gap-1">
            {[
              { id: "all", label: "All Logs" },
              { id: "purchase", label: "Purchases" },
              { id: "return", label: "Returns" },
              { id: "alert", label: "Alerts" },
              { id: "info", label: "Info" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer
                  ${activeTab === tab.id
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/50 dark:bg-zinc-900 dark:text-white dark:border-zinc-800"
                    : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-3.5">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start justify-between p-4 rounded-2xl border transition-all duration-200 animate-scale-in gap-4
                    ${notif.isRead
                      ? "bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800/60"
                      : "bg-indigo-50/20 dark:bg-indigo-950/10 border-indigo-100/50 dark:border-indigo-900/20 shadow-xs"
                    }`}
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${getTypeColors(notif.type)}`}>
                      {getTypeIcon(notif.type)}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">{notif.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getTypeColors(notif.type)}`}>
                          {getTypeLabel(notif.type)}
                        </span>
                        {!notif.isRead && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />}
                      </div>

                      <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 pt-1">{notif.content}</p>

                      {notif.createdAt && (
                        <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500 flex items-center gap-1 pt-1">
                          <Clock size={11} /> {new Date(notif.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteNotification(notif.id, notif.documentId)}
                    className="p-1.5 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg text-slate-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 transition-colors cursor-pointer active:scale-90 mt-0.5"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-12 text-center text-sm font-bold text-slate-400">
                No notifications available.
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}

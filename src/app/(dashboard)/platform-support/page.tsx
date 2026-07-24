'use client';
import Card from "./platformSupportCompontents/Card";
import Tickets from "./platformSupportCompontents/Tickets";
import { useState, useCallback, useEffect, useRef } from "react";
import { createContext } from "react";
import { Loader2, AlertTriangle, RotateCw } from "lucide-react";
import { supportFetch } from "./lib/support-api";
import { useLanguage } from "@/app/store/LanguageContext";

export interface SupportUser {
  id: number;
  username?: string;
  email?: string;
  fullName?: string;
  image?: string;
}

export interface SupportMessage {
  id: number;
  documentId?: string;
  content: string;
  image?: string | null;
  isRead: boolean;
  user: SupportUser | null;
  createdAt?: string;
}

export interface SupportTicket {
  id: number;
  documentId?: string;
  subject: string;
  description: string;
  status: "pending" | "in_progress" | "solved";
  dateTicket: string;
  user: SupportUser | null;
  support_messages?: SupportMessage[];
}

export const DataContext = createContext<{
  data: SupportTicket[];
  setData: React.Dispatch<React.SetStateAction<SupportTicket[]>>;
  loadData: () => Promise<void>;
}>({ data: [], setData: () => {}, loadData: async () => {} });

const PlatformSupport = () => {
  const { t, dir } = useLanguage();
  const [data, setData] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const lastRefreshTime = useRef<number>(0);
  const REFRESH_COOLDOWN = 3000;

  const loadData = useCallback(async () => {
    const now = Date.now();
    if (now - lastRefreshTime.current < REFRESH_COOLDOWN) return;
    lastRefreshTime.current = now;

    if (data.length === 0) setLoading(true);
    setLoadError(null);

    try {
      const result = await supportFetch("/support-tickets?populate[user]=true&populate[support_messages][populate][user]=true&sort=dateTicket:desc");
      setData(result?.data || result || []);
    } catch (err: any) {
      console.error("Failed to fetch support tickets:", err);
      setLoadError(err?.message || "Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  }, [data.length]);

  useEffect(() => {
    loadData();
  }, []);

  return (
    <DataContext.Provider value={{ data, setData, loadData }}>
      <div className="w-full max-w-5xl mx-auto space-y-6 text-start relative" dir={dir}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800/80 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Platform Support</h1>
            <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1">
              Manage platform support tickets and customer inquiries.
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400 dark:text-zinc-500 py-16">
            <Loader2 size={16} className="animate-spin" /> Loading tickets...
          </div>
        )}

        {!loading && loadError && (
          <div className="flex flex-col items-center justify-center gap-3 text-sm text-red-500 py-16">
            <AlertTriangle size={20} />
            <span>{loadError}</span>
            <button onClick={loadData} className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-xl cursor-pointer">
              <RotateCw size={13} /> Retry
            </button>
          </div>
        )}

        {!loading && !loadError && (
          <>
            <div className="w-full">
              <Card data={data} />
            </div>
            <div className="w-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
              <Tickets />
            </div>
          </>
        )}
      </div>
    </DataContext.Provider>
  );
};

export default PlatformSupport;

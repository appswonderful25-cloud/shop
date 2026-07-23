"use client";

import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BellIcon, ShoppingBag, RefreshCw, Info, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/app/store/LanguageContext";

interface NotificationItem {
  id: number;
  title: string;
  content: string;
  isRead: boolean;
  type: "returns" | "purchase" | "info" | "alert";
  createdAt: string;
}

export default function DropdownMenuAvatar() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await fetch("/api/proxy/notifications?sort=createdAt:desc&pagination[pageSize]=5", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      const items = json?.data || json || [];
      setNotifications(items);
      setUnreadCount(items.filter((n: NotificationItem) => !n.isRead).length);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "purchase": return <ShoppingBag size={14} />;
      case "returns": return <RefreshCw size={14} />;
      case "alert": return <AlertTriangle size={14} />;
      default: return <Info size={14} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "purchase": return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400";
      case "returns": return "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400";
      case "alert": return "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400";
      default: return "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400";
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t("header.justNow");
    if (mins < 60) return t("header.minutesAgo", { minutes: mins });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t("header.hoursAgo", { hours: hrs });
    const days = Math.floor(hrs / 24);
    return t("header.daysAgo", { days: days });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="ghost" size="icon" className="relative w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 flex items-center justify-center text-slate-700 dark:text-zinc-300 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-zinc-800 active:scale-95">
          <BellIcon size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 flex items-center justify-center bg-indigo-600 text-white text-[9px] font-bold rounded-full border border-white dark:border-zinc-950 px-1">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      } />
      <DropdownMenuContent align="end" className="w-80 p-2 rounded-2xl shadow-xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 animate-scale-in">
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex justify-between items-center px-3 py-2 pointer-events-none border-b border-slate-50 dark:border-zinc-800/60 mb-1">
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">{t("header.notifications")}</span>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md">{unreadCount} {t("header.new")}</span>
            )}
          </DropdownMenuItem>

          {loading ? (
            <div className="flex items-center justify-center py-6 text-xs text-slate-400">{t("header.loading")}</div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-xs text-slate-400 gap-1">
              <BellIcon size={16} />
              <span>{t("header.noNotifications")}</span>
            </div>
          ) : (
            notifications.map((notif) => (
              <DropdownMenuItem key={notif.id} className={`flex items-start gap-3 p-2.5 rounded-xl border border-transparent hover:bg-slate-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-all my-1 ${!notif.isRead ? "bg-indigo-50/30 dark:bg-indigo-950/10" : ""}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 mt-0.5 ${getTypeColor(notif.type)}`}>
                  {getTypeIcon(notif.type)}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 flex-1 min-w-0">
                  <span className="font-extrabold text-slate-900 dark:text-white block text-xs mb-0.5 truncate">{notif.title}</span>
                  <span className="line-clamp-2">{notif.content}</span>
                  <span className="text-[9px] text-slate-300 dark:text-zinc-600 mt-1 block">{timeAgo(notif.createdAt)}</span>
                </div>
                {!notif.isRead && <div className="w-2 h-2 bg-indigo-600 rounded-full shrink-0 mt-1.5" />}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800 my-1.5" />

        <Link href="/notifications" className="block">
          <DropdownMenuItem className="flex items-center justify-center text-center w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black py-2.5 rounded-xl transition-all cursor-pointer active:scale-[0.97]">
            {t("header.viewAllNotifications")}
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

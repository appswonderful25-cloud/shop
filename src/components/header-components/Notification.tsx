"use client";

import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BadgeCheckIcon, Settings2, LogOutIcon } from "lucide-react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useLanguage } from "@/app/store/LanguageContext";

interface UserData {
  id: number;
  username?: string;
  email?: string;
  image?: string;
  avatar?: string;
  role?: { name: string };
}

export function Notification() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/session', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = () => {
    if (user?.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const getUserImage = () => {
    return user?.image || user?.avatar || null;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="ghost" size="icon" className="w-10 h-10 flex items-center justify-center cursor-pointer active:scale-95 shrink-0">
          <Avatar>
            {getUserImage() ? (
              <AvatarImage src={getUserImage()!} alt={user?.username || t("header.user")} className="object-cover" />
            ) : null}
            <AvatarFallback className="bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      } />

      <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 animate-scale-in">
        {user && (
          <div className="px-3 py-2.5 border-b border-slate-100 dark:border-zinc-800 mb-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.username || t("header.user")}</p>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate mt-0.5">{user.email || ""}</p>
          </div>
        )}

        <DropdownMenuGroup>
          <Link href="/settings/account" className="block">
            <DropdownMenuItem className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/40 cursor-pointer">
              <BadgeCheckIcon size={14} className="text-slate-400" /> {t("header.accountProfile")}
            </DropdownMenuItem>
          </Link>
          <Link href="/settings/store" className="block">
            <DropdownMenuItem className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/40 cursor-pointer">
              <Settings2 size={14} className="text-slate-400" /> {t("header.storeSettings")}
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800 my-1.5" />

        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer font-black">
          <LogOutIcon size={14} /> {t("header.signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

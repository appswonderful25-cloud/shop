"use client";

import { Search, Plus, CheckCheck, Loader2 } from "lucide-react";

interface InboxToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  onReadAll?: () => void;
  hasUnread?: boolean;
  isReadingAll?: boolean;
}

export default function InboxToolbar({ searchTerm, onSearchChange, onAddClick, onReadAll, hasUnread, isReadingAll }: InboxToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative max-w-md w-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search size={16} className="text-slate-400 dark:text-zinc-500" />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email subject..."
          className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 transition-colors shadow-sm"
        />
      </div>

      <div className="flex items-center gap-3">
        {onReadAll && hasUnread && (
          <button
            onClick={onReadAll}
            disabled={isReadingAll}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm whitespace-nowrap"
          >
            {isReadingAll ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />}
            {isReadingAll ? "Reading..." : "Read All"}
          </button>
        )}
        <button
          onClick={onAddClick}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm whitespace-nowrap"
        >
          <Plus size={14} /> Add Message
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function StatusTabs({ setSharedData }: { setSharedData: React.Dispatch<React.SetStateAction<string>> }) {
  const tabs = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "in_progress", label: "In Progress" },
    { id: "solved", label: "Solved" },
  ];

  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="flex bg-slate-100/70 dark:bg-zinc-800/60 p-1 rounded-xl border border-slate-200/40 dark:border-zinc-700/30">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSharedData(tab.id); }}
            className={`px-3 py-2 text-xs font-bold rounded-lg cursor-pointer select-none whitespace-nowrap ${
              isActive
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/50 dark:bg-zinc-900 dark:text-white dark:border-zinc-800"
                : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

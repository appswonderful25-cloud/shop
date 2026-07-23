"use client";

import { useState, useMemo } from "react";
import { BarChart3, Calendar, Layers } from "lucide-react";
import AnalyticsCards from "./AnalyticsCards";
import AnalyticsCharts from "./AnalyticsCharts";
import VisitorsAnalytics from "./VisitorsAnalytics";
import DateRangeModal from "./DateRangeModal";
import { AnalyticsFilter } from "./filter-utils";

export default function Analytics() {
  const [timeframe, setTimeframe] = useState("all_time");
  const [dateDisplay, setDateDisplay] = useState("Select Date");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleApplyRange = (start: string, end: string) => {
    setDateDisplay(`${start} → ${end}`);
    setTimeframe("custom");
  };

  const dateRange = useMemo(() => {
    if (timeframe !== "custom") return null;
    const parts = dateDisplay.split(" → ");
    return parts.length === 2 ? { start: parts[0], end: parts[1] } : null;
  }, [timeframe, dateDisplay]);

  const filter: AnalyticsFilter = useMemo(() => ({
    timeframe,
    dateRange,
    category: selectedCategory,
  }), [timeframe, dateRange, selectedCategory]);

  const tabs = [
    { id: "daily", label: "Today" },
    { id: "monthly", label: "Monthly" },
    { id: "yearly", label: "Yearly" },
    { id: "all_time", label: "All Time" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 text-left relative" dir="ltr">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="text-indigo-600 dark:text-indigo-400" size={26} />
            Store Analytics
          </h1>
          <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1">
            Analyze revenue growth, monitor sales, and evaluate conversion rates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100/70 dark:bg-zinc-800/60 p-1.5 rounded-2xl border border-slate-200/40 dark:border-zinc-700/30 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setTimeframe(tab.id); setDateDisplay("Select Date"); }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer select-none
                  ${timeframe === tab.id
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/50 dark:bg-zinc-900 dark:text-white dark:border-zinc-800"
                    : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center bg-white dark:bg-zinc-900 border px-4 py-2 rounded-xl shadow-sm text-xs font-bold gap-2 cursor-pointer h-[46px] transition-all
              ${timeframe === "custom"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300"
              }`}
          >
            <Calendar size={14} className="text-slate-400" />
            <span className="truncate max-w-[140px]">{dateDisplay}</span>
          </button>

          <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-3 py-2 rounded-xl shadow-sm text-xs font-bold text-slate-700 dark:text-zinc-300 gap-2 cursor-pointer min-w-[150px] h-[46px] focus-within:border-indigo-500 dark:focus-within:border-indigo-400">
            <Layers size={14} className="text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer w-full text-slate-900 dark:text-white border-none pr-6 font-bold"
            >
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing & Apparel</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Books">Books & Media</option>
              <option value="Sports">Sports & Outdoors</option>
              <option value="Beauty">Beauty & Personal Care</option>
              <option value="Toys">Toys & Games</option>
              <option value="Automotive">Automotive</option>
              <option value="Garden">Garden & Outdoor</option>
              <option value="Health">Health & Wellness</option>
              <option value="Pet">Pet Supplies</option>
            </select>
          </div>
        </div>
      </div>

      <AnalyticsCards filter={filter} />
      <AnalyticsCharts filter={filter} />
      <VisitorsAnalytics filter={filter} />

      <DateRangeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onApplyRange={handleApplyRange} />
    </div>
  );
}

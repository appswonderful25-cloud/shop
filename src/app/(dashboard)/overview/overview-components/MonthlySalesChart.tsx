"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MoreVertical, Eye, Trash2 } from "lucide-react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function MonthlySalesChart() {
  const [showMenu, setShowMenu] = useState(false);

  const chartOptions: any = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#465FFF"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "30%",
        borderRadius: 6,
        borderRadiusApplication: "around",
      },
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: "#F1F5F9",
      strokeDashArray: 0,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#64748B", fontSize: "13px" } },
    },
    yaxis: {
      min: 0,
      max: 2000,
      tickAmount: 4,
      labels: { style: { colors: "#64748B", fontSize: "13px" } },
    },
  };

  const chartSeries = [
    {
      name: "Sales",
      data: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
    },
  ];

  return (
    <div className="bg-white shadow-md dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm w-full relative transition-all duration-300">
      
      <div className="flex items-center justify-between mb-6 relative">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Monthly Sales
        </h3>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg text-slate-400 dark:text-zinc-500 transition-colors"
          >
            <MoreVertical size={20} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-xl p-2 z-20 animate-in fade-in slide-in-from-top-1 duration-200">
                <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[14px] font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl transition-colors text-left">
                  <Eye size={16} className="text-slate-400" />
                  View More
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[14px] font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors text-left">
                  <Trash2 size={16} className="text-rose-400" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-full h-[200px]">
        <Chart options={chartOptions} series={chartSeries} type="bar" height={200} />
      </div>

    </div>
  );
}

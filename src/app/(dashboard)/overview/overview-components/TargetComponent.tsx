'use client';
import { useState } from "react";
import { MoreVertical, Eye, Trash2, ArrowUp,  ArrowDown } from "lucide-react";
import CricleChart from "./CircleChart";

export default function TargetComponent() {
    const [showMenu, setShowMenu] = useState(false);
    return (
      <div className="bg-gray-100 shadow-md dark:bg-zinc-800 border  border-slate-100 dark:border-zinc-800 rounded-2xl shadow-sm w-full relative transition-all duration-300">
      
      <div className="flex flex-col bg-white dark:bg-zinc-900 rounded-lg w-full p-6">
        <div className="flex items-center justify-between mb-1 relative">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Monthly Target
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
          <p className="text-sm text-slate-500 dark:text-zinc-400 tracking-tight">
          Target you&apos;re working towards.
          </p>
          <CricleChart/>
          <p className="text-sm text-slate-500 dark:text-zinc-400 text-center">
            You earn $3287 today, it's higher than last month. Keep up your good work!
          </p>
      </div>
      
      <div className="flex flex-row items-center justify-around p-10 ">
          <p className="flex flex-col text-gray-500 dark:text-zinc-400">
            Target
            <span className="flex text-black dark:text-white flex-row gap-1 items-center font-extrabold">
              $20K <ArrowDown size={20} className="text-red-600" />
            </span>
          </p>
          <div className="w-[1px] h-10 bg-gray-200 dark:bg-gray-500"></div>
          <p className="flex flex-col text-gray-500 dark:text-zinc-400">
            Revenue
            <span className="flex text-black dark:text-white flex-row gap-1 items-center font-extrabold">
              $20K <ArrowUp size={20} className="text-green-600" />
            </span>
          </p>
          <div className="w-[1px] h-10 bg-gray-200 dark:bg-gray-500"></div>
          <p className="flex flex-col text-gray-500 dark:text-zinc-400">
            Today
            <span className="flex text-black dark:text-white flex-row gap-1 items-center font-extrabold">
              $20K <ArrowUp size={20} className="text-green-600" />
            </span>
          </p>
      </div>
    </div>
    );
}
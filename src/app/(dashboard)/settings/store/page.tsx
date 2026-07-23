"use client";

import { useState,useEffect } from "react";
import { Palette, Share2, ShieldAlert, CheckCircle2, Layout, Sliders, Info, HelpCircle, ShieldCheck, HeartHandshake } from "lucide-react";
import Socials from "./socials/Socails";
import Legal from "./socials/Legal";
import Brand from "./socials/Brand";


export default function StoreSettings() {
  const [activeTab, setActiveTab] = useState("branding");
  const [successMessage, setSuccessMessage] = useState("");

  const [socials, setSocials] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [change,setChange] = useState(false);
  useEffect(() => {
    const fun = async () => {
      setIsLoadingPage(true);
      try {
        const response = await fetch('/api/auth/find-store-settings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const {user : data} = await response.json();
        
        setSocials(data);
        
        
      } catch (e: any) {
        console.error('Failed to fetch store settings:', e);
      } finally {
        setIsLoadingPage(false);
        
      }
    };
    fun();
  }, [change]);

  if (isLoadingPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
        <div className="w-12 h-12 border-4 border-[#4f46e5] border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-xl font-semibold text-[#4f46e5] animate-pulse">
          Loading store settings, please wait... 🚀
        </h2>
      </div>
    );
  }
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left relative" dir="ltr">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Sliders className="text-indigo-600 dark:text-indigo-400" size={26} />
            Storefront Customization
          </h1>
          <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1">Manage global theme styling pallete colors, update public footer socials, and reference store legal parameters.</p>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-xl flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-scale-in">
          <CheckCircle2 size={16} /> {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        <div className="md:col-span-1 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-2.5 shadow-sm space-y-1">
          {[
            { id: "branding", label: "Theme Palette", icon: Palette },
            { id: "socials", label: "Footer Socials", icon: Share2 },
            { id: "legal", label: "Policies & Legal", icon: ShieldAlert }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer
                  ${activeTab === tab.id 
                    ? "bg-indigo-600 text-white shadow-sm" 
                    : "text-slate-500 hover:bg-slate-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                  }`}
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </div>

        <div className="md:col-span-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm min-h-[420px]">
          {activeTab === "branding" && (
            <Brand change={change} setChange={setChange} active={true} setSuccessMessage={setSuccessMessage} data={socials} setIsLoading={setIsLoading} setBrand={setSocials} isLoading={isLoading} />
          )}
          {activeTab === "socials" && (
            <Socials active={true} setSuccessMessage={setSuccessMessage} socials={socials} setIsLoading={setIsLoading} setSocials={setSocials} isLoading={isLoading} />
          )}
          {activeTab === "legal" && (
            <Legal change={change} setChange={setChange} active={true} setSuccessMessage={setSuccessMessage} data={socials} setIsLoading={setIsLoading} setPolicies={setSocials} isLoading={isLoading} />
          )}

        </div>
      </div>

    </div>
  );
}

"use client";

import { useState,useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { Ticket, Plus, Tag, Calendar, MoreHorizontal, Trash2 } from "lucide-react";
import CreateCouponModal from "./CreateCouponModal";
import { API_CONFIG, API_ENDPOINTS } from "@/lib/api-config";

export default function Coupons() {
  const [couponsData, setCouponsData] = useState<any[]>([]);
  const [loading,setLoading] = useState<boolean>(true);
  const isLoadingRef = useRef(false);
  const toastIdRef = useRef<string | null>(null);

  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] || '';
      const res = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.COUPONS.LIST}?populate=*`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();

      setCouponsData(data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch coupons data:", err);
      setLoading(false);
      toast.error("Failed to fetch coupons data. Please try again! ❌");
    } finally {
      isLoadingRef.current = false;
    }
  }, []);
    
    
    
  

  useEffect(() => {
  fetchData();
  }, []);

const handleAddCoupon = async(code: string, discount: string, type: string, expiry: string) => {
  const newCoupon = {
    couponCode: code,
    discount: discount,
    discountType: type,
    dateEndCoupon: expiry,
    statusCoupon: true,
    dateStartCoupon: new Date().toISOString(),
  };
  const newCoupon2 = { data: newCoupon };
  const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] || '';
  
  const loading = toast.loading("Processing and adding coupon... 🚀");
  
  try {
    const res = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.COUPONS.CREATE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(newCoupon2),
    });
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error("Failed to add coupon");
    }
    
    setCouponsData([...couponsData, data.data]);
    toast.success("Coupon added successfully! 🎉", { id: loading });
    await fetchData();
    setIsModalOpen(false);
  } catch (error) {
    console.error("Failed to add coupon:", error);
    toast.error("Failed to add coupon. Please try again! ❌", { id: loading });
  }
}

const handleDeleteCoupon = async(id:string) => {
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] || '';
      
      const loading = toast.loading("Deleting coupon from server... 🗑️");
      
      try {
        const res = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.COUPONS.BY_ID(id)}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        
        if (!res.ok) {
          throw new Error("Failed to delete coupon");
        }
        
        setCouponsData(couponsData.filter(c => c.documentId !== id));
        toast.success("Coupon deleted successfully! 🎉", { id: loading });
      } catch (error) {
        console.error("Failed to delete coupon:", error);
        toast.error("Failed to delete coupon. Please try again! ❌", { id: loading });
      }
}

  if(loading){
    return <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
      <div className="w-12 h-12 border-4 border-[#4f46e5] border-t-transparent rounded-full animate-spin"></div>
      <h2 className="text-xl font-semibold text-[#4f46e5] animate-pulse">
        Loading coupons data, please wait... 🚀
      </h2>
    </div>
    }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left relative" dir="ltr">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Ticket className="text-indigo-600 dark:text-indigo-400" size={26} />
            Coupons & Discounts
          </h1>
          <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1">
            Create, manage, and monitor discount codes to boost your store marketing and sales.
          </p>
        </div>
        
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm active:scale-[0.98] shrink-0 cursor-pointer">
          <Plus size={16} />
          Create Coupon
        </button>
      </div>

      <div className="w-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/50 text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
              {couponsData.map((coupon) => {
                const isDropdownOpen = activeDropdownId === coupon.id;

                return (
                  <tr key={coupon.id} className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/20 transition-colors text-sm text-slate-700 dark:text-zinc-300">
                    
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-zinc-800 flex items-center justify-center text-orange-500 dark:text-orange-400">
                          <Tag size={18} />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white tracking-wider font-mono">{coupon.couponCode}</span>
                      </div>
                    </td>

                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {coupon.discountType === "Percentage" ? `${coupon.discount}%` : `$${coupon.discount}`}
                    </td>

                    <td className="p-4 text-slate-500 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" />
                        {coupon.dateEndCoupon}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
                        ${
                          coupon.statusCoupon
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
                        }
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${coupon.statusCoupon === true ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {coupon.statusCoupon==true ? "Active" : "Expired"}
                      </span>
                    </td>

                    <td className="p-4 relative">
                      <button onClick={() => setActiveDropdownId(activeDropdownId === coupon.id ? null : coupon.id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer">
                        <MoreHorizontal size={18} />
                      </button>
                      {isDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setActiveDropdownId(null)} />
                          <div className="absolute right-4 mt-1 w-36 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-slate-100 dark:border-zinc-700/50 py-1.5 z-50 animate-scale-in text-left">
                            <button onClick={() => { handleDeleteCoupon(coupon.documentId); setActiveDropdownId(null); }} className="w-full text-left px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors flex items-center gap-2 cursor-pointer">
                              <Trash2 size={14} />
                              Delete Code
                            </button>
                          </div>
                        </>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <CreateCouponModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddCoupon={handleAddCoupon} />

    </div>
  );
}

"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface CreateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCoupon: (code: string, discount: string, type: string, expiry: string) => void;
}

export default function CreateCouponModal({ isOpen, onClose, onAddCoupon }: CreateCouponModalProps) {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [type, setType] = useState("percentage");
  const [expiry, setExpiry] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discount || !expiry) return;
    onAddCoupon(code.toUpperCase(), discount, type, expiry);
    setCode("");
    setDiscount("");
    setExpiry("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs" onClick={onClose} />
      
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-xl z-50 animate-scale-in text-left relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Create New Coupon</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Coupon Code</label>
            <input 
              type="text" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g., SUMMER50"
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white uppercase"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Discount Value</label>
            <input 
              type="number" 
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="e.g., 20"
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Discount Type</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Expiry Date</label>
            <input 
              type="date" 
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white cursor-pointer"
              required
            />
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold p-3 rounded-xl transition-all duration-200 shadow-sm mt-2 cursor-pointer active:scale-95">
            Activate Coupon
          </button>
        </form>
      </div>
    </div>
  );
}

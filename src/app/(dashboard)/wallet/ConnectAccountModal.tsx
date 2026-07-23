"use client";

import { useState } from "react";
import { X, CreditCard, Landmark } from "lucide-react";
import { FaPaypal } from "react-icons/fa6";

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (type: string, name: string, number: string) => void;
}

export default function ConnectAccountModal({ isOpen, onClose, onConnect }: ConnectAccountModalProps) {
  const [type, setType] = useState("Visa");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !number) return;
    onConnect(type, name, number);
    setName("");
    setNumber("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs" onClick={onClose} />
      
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-xl z-50 animate-scale-in text-left relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Link Payout Method</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Method Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setType("Visa")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-sm cursor-pointer transition-all ${type === "Visa" ? "border-indigo-600 bg-indigo-50/50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400" : "border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-zinc-400"}`}
              >
                <CreditCard size={16} /> Visa / Card
              </button>
              <button 
                type="button"
                onClick={() => setType("Bank")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-sm cursor-pointer transition-all ${type === "Bank" ? "border-indigo-600 bg-indigo-50/50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400" : "border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-zinc-400"}`}
              >
                <Landmark size={16} /> Bank Account
              </button>
              <button 
                type="button"
                onClick={() => setType("PaypalAccount")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-sm cursor-pointer transition-all ${type === "PaypalAccount" ? "border-indigo-600 bg-indigo-50/50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400" : "border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-zinc-400"}`}
              >
                <FaPaypal size={16} /> Paypal Account
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Account Holder Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., John Doe"
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              {type === "Visa" ? "Card Number" : type === "PaypalAccount" ? "Paypal Email" : "IBAN / Account Number"}
            </label>
            <input 
              type="text" 
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder={type === "Visa" ? "•••• •••• •••• 4242" : type === "PaypalAccount" ? "e.g., john.doe@example.com" : "US60 2000 •••• ••••"}
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
              required
            />
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold p-3 rounded-xl transition-all duration-200 shadow-sm mt-2 cursor-pointer active:scale-95">
            Confirm & Link Account
          </button>
        </form>
      </div>
    </div>
  );
}

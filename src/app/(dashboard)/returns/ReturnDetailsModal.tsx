"use client";

import { X, Clock, AlertCircle } from "lucide-react";

interface ReturnDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnItem: any;
  daysOwned: number;
  onStatusChange?: (id: string, newStatus: "returned" | "rejected") => void;
}

export default function ReturnDetailsModal({ isOpen, onClose, returnItem,daysOwned, onStatusChange }: ReturnDetailsModalProps) {
  if (!isOpen || !returnItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs" onClick={onClose} />
      
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-xl z-50 animate-scale-in text-left relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Return Request Details</h3>
        
        <div className="space-y-4 text-sm">
          <div className="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-slate-100 dark:border-zinc-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Product & Order</span>
            <span className="font-bold text-slate-900 dark:text-white mt-1 block">{returnItem.product?.title || 'N/A'}</span>
            <span className="text-xs font-mono text-slate-500 dark:text-zinc-400 block mt-0.5">{returnItem.order?.id || returnItem.id}</span>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 bg-slate-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Clock size={12} /> Days Owned</span>
              <span className="font-bold text-slate-900 dark:text-white mt-1 block">{daysOwned} Days</span>
            </div>
            <div className="flex-1 bg-slate-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Refund Amount</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">${returnItem.order?.totalPrice || '0'}</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-slate-100 dark:border-zinc-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1.5"><AlertCircle size={12} /> Reason for Return</span>
            <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-xs font-medium">
              {returnItem.reason || 'No reason provided'}
            </p>
          </div>

          {returnItem.statusReturn === "pending" ? (
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => {
                  if (onStatusChange) onStatusChange(returnItem.documentId, "rejected");
                  onClose();
                }}
                className="flex-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-sm font-bold p-3 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 text-center"
              >
                Reject Refund
              </button>
              <button 
                onClick={() => {
                  if (onStatusChange) onStatusChange(returnItem.documentId, "returned");
                  onClose();
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold p-3 rounded-xl transition-all duration-200 shadow-sm cursor-pointer active:scale-95 text-center"
              >
                Accept & Refund
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <button onClick={onClose} className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-white text-sm font-bold p-3 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 text-center">
                Close View
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

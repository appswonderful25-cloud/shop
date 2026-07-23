"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (name: string, email: string, role: "admin" | "manager" | "support_agent" ) => void;
}

export default function InviteModal({ isOpen, onClose, onAddMember }: InviteModalProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<"manager" | "support_agent" | "admin">("support_agent");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    onAddMember(name, email, role);
    setName("");
    setEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs" onClick={onClose} />
      
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-xl z-50 animate-scale-in text-left relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Invite New Team Member</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Omar Khaled"
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., omar@store.com"
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Select Role</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value as "manager" | "support_agent" | "admin")}
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="manager">Manager (Products & Orders)</option>
              <option value="support_agent">Support Agent (Tickets Only)</option>
              <option value="admin">Admin (Full System Access)</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold p-3 rounded-xl transition-all duration-200 shadow-sm mt-2 cursor-pointer active:scale-95">
            Send Invitation Link
          </button>
        </form>
      </div>
    </div>
  );
}

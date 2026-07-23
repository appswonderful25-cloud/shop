"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: {
    documentId?: string;
    memberName: string;
    memberEmail: string;
    statusAccess: "admin" | "manager" | "support_agent";
  } | null;
  onUpdate: (documentId: string, data: { memberEmail: string; statusAccess: "admin" | "manager" | "support_agent" }) => Promise<void>;
}

export default function EditMemberModal({ isOpen, onClose, member, onUpdate }: EditMemberModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "manager" | "support_agent">("support_agent");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (member) {
      setEmail(member.memberEmail);
      setRole(member.statusAccess);
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !member.documentId) return;
    setSaving(true);
    try {
      await onUpdate(member.documentId, { memberEmail: email, statusAccess: role });
      onClose();
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs" onClick={onClose} />
      
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-xl z-50 animate-scale-in text-left relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Edit Team Member</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Name</label>
            <input 
              type="text" 
              value={member.memberName}
              disabled
              className="w-full bg-slate-100 dark:bg-zinc-800/80 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl text-slate-500 dark:text-zinc-400 cursor-not-allowed"
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
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Role</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value as "manager" | "support_agent" | "admin")}
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="admin">Admin (Full System Access)</option>
              <option value="manager">Manager (Products & Orders)</option>
              <option value="support_agent">Support Agent (Tickets Only)</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold p-3 rounded-xl transition-all duration-200 shadow-sm mt-2 cursor-pointer active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : null}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

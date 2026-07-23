"use client";

import { useState, useContext } from "react";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { DataContext, SupportTicket } from "../page";
import toast from "react-hot-toast";
import { supportFetch } from "../lib/support-api";
import SupportTicketModal from "./SupportTicketModal";

export default function TicketTable({ sharedData, search }: { sharedData: string; search: string }) {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const { data, setData, loadData } = useContext(DataContext);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const handleDelete = async (documentId: string) => {
    const loadingToast = toast.loading("Deleting ticket...");
    try {
      await supportFetch(`/support-tickets/${documentId}`, { method: "DELETE" });
      setData((prev) => prev.filter((t) => t.documentId !== documentId));
      toast.success("Ticket deleted!", { id: loadingToast });
    } catch {
      toast.error("Failed to delete ticket.", { id: loadingToast });
    }
  };

  const dataFiltered = data.filter((t: SupportTicket) => {
    if (sharedData === "pending" && t.status !== "pending") return false;
    if (sharedData === "in_progress" && t.status !== "in_progress") return false;
    if (sharedData === "solved" && t.status !== "solved") return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        t.subject?.toLowerCase().includes(s) ||
        t.description?.toLowerCase().includes(s) ||
        t.user?.username?.toLowerCase().includes(s) ||
        t.user?.email?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="w-full rounded-2xl" dir="ltr">
      <table className="w-full min-w-[800px] text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/50 text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
            <th className="p-4 w-12"><input type="checkbox" className="rounded cursor-pointer" /></th>
            <th className="p-4">Ticket ID</th>
            <th className="p-4">Requested By</th>
            <th className="p-4">Subject</th>
            <th className="p-4">Date</th>
            <th className="p-4">Status</th>
            <th className="p-4 w-16"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
          {dataFiltered.map((ticket: SupportTicket) => {
            const isDropdownOpen = activeDropdownId === ticket.documentId;
            const statusColors: Record<string, string> = {
              pending: "bg-orange-50 text-orange-500 dark:bg-orange-950/30 dark:text-orange-400",
              in_progress: "bg-blue-50 text-blue-500 dark:bg-blue-950/30 dark:text-blue-400",
              solved: "bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-400",
            };
            const dotColors: Record<string, string> = {
              pending: "bg-orange-500",
              in_progress: "bg-blue-500",
              solved: "bg-emerald-500",
            };
            const statusLabels: Record<string, string> = {
              pending: "Pending",
              in_progress: "In Progress",
              solved: "Solved",
            };

            return (
              <tr key={ticket.documentId} className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/20 transition-colors text-sm text-slate-700 dark:text-zinc-300">
                <td className="p-4"><input type="checkbox" className="rounded cursor-pointer" /></td>
                <td className="p-4 font-bold text-slate-900 dark:text-white">#{ticket.id}</td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[180px] block">
                      {ticket.user?.username || ticket.user?.email || "Unknown"}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">{ticket.user?.email}</span>
                  </div>
                </td>
                <td className="p-4 max-w-[280px] truncate font-medium">{ticket.subject}</td>
                <td className="p-4 text-slate-500 dark:text-zinc-400 text-xs">
                  {ticket.dateTicket ? new Date(ticket.dateTicket).toLocaleDateString() : "-"}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusColors[ticket.status] || ""}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColors[ticket.status] || ""}`} />
                    {statusLabels[ticket.status] || ticket.status}
                  </span>
                </td>
                <td className="p-4 relative">
                  <button
                    onClick={() => setActiveDropdownId(isDropdownOpen ? null : ticket.documentId || "")}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                  {isDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setActiveDropdownId(null)} />
                      <div className="absolute right-0 bottom-full mb-1 w-40 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-slate-200 dark:border-zinc-700/50 py-1.5 z-50 text-left">
                        <button
                          onClick={() => { setSelectedTicket(ticket); setActiveDropdownId(null); }}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700/50 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <Eye size={14} /> Open
                        </button>
                        <button
                          onClick={() => { handleDelete(ticket.documentId || ""); setActiveDropdownId(null); }}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors flex items-center gap-2 cursor-pointer border-t border-slate-100 dark:border-zinc-700/30 mt-0.5 pt-1.5"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
          {dataFiltered.length === 0 && (
            <tr>
              <td colSpan={7} className="p-8 text-center text-sm text-slate-400 dark:text-zinc-500">
                No tickets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedTicket && (
        <SupportTicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </div>
  );
}

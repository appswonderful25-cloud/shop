"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { X, Send, Loader2, User2 } from "lucide-react";
import { SupportTicket, SupportMessage, DataContext } from "../page";
import { supportFetch } from "../lib/support-api";
import toast from "react-hot-toast";

async function getUserId(): Promise<number | null> {
  try {
    const res = await fetch('/api/auth/session', { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.userId || null;
  } catch {
    return null;
  }
}

export default function SupportTicketModal({
  ticket,
  onClose,
}: {
  ticket: SupportTicket;
  onClose: () => void;
}) {
  const { loadData } = useContext(DataContext);
  const [localTicket, setLocalTicket] = useState<SupportTicket>({ ...ticket });
  const [messages, setMessages] = useState<SupportMessage[]>(ticket.support_messages || []);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserIdRef = useRef<number | null>(null);

  useEffect(() => {
    getUserId().then((id) => {
      currentUserIdRef.current = id;
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async () => {
    if (!ticket.documentId) return;
    setLoading(true);
    try {
      const allMessages = await supportFetch("/support-messages?populate[user]=true&populate[ticket]=true");
      const ticketMessages = (allMessages?.data || allMessages || []).filter(
        (m: any) => m.ticket?.documentId === ticket.documentId
      );
      setMessages(ticketMessages);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [ticket.documentId]);

  const handleSend = async () => {
    if (!replyText.trim() || sending) return;
    setSending(true);
    try {
      const userId = await getUserId();
      const newMsg = await supportFetch("/support-messages", {
        method: "POST",
        body: JSON.stringify({
          data: {
            content: replyText.trim(),
            ticket: ticket.documentId,
            user: userId,
            isRead: false,
          },
        }),
      });
      setMessages((prev) => [...prev, newMsg]);
      setReplyText("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!localTicket.documentId || updatingStatus) return;
    setUpdatingStatus(true);
    try {
      await supportFetch(`/support-tickets/${localTicket.documentId}`, {
        method: "PUT",
        body: JSON.stringify({ data: { status: newStatus } }),
      });
      setLocalTicket((prev) => ({ ...prev, status: newStatus as any }));
      toast.success(`Status updated to ${newStatus}`);
      loadData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const statusOptions = [
    { value: "pending", label: "Pending", color: "text-orange-500" },
    { value: "in_progress", label: "In Progress", color: "text-blue-500" },
    { value: "solved", label: "Solved", color: "text-emerald-500" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-lg shadow-xl z-50 text-left relative flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer z-10">
          <X size={18} />
        </button>

        <div className="mb-3 border-b border-slate-100 dark:border-zinc-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User2 size={16} className="text-indigo-600" />
            {localTicket.user?.username || localTicket.user?.email || "Unknown User"}
          </h3>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">{localTicket.subject}</p>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Status:</span>
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleStatusChange(opt.value)}
              disabled={updatingStatus}
              className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                localTicket.status === opt.value
                  ? `${opt.color} bg-slate-100 dark:bg-zinc-800`
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Description</span>
          <div className="bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700/30 p-3 rounded-xl">
            <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">{localTicket.description}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[250px] mb-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={16} className="animate-spin text-slate-400" />
            </div>
          ) : messages.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-zinc-500 text-center py-8">No messages yet. Send the first reply below.</p>
          ) : (
            messages.map((msg) => {
              const isAdmin = currentUserIdRef.current !== null && msg.user?.id === currentUserIdRef.current;
              const authorLabel = isAdmin ? "You (Admin)" : msg.user?.username || msg.user?.email || localTicket.user?.username || "User";
              return (
                <div key={msg.id} className={`flex flex-col max-w-[85%] space-y-1 ${isAdmin ? "ml-auto items-end" : "mr-auto items-start"}`}>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{authorLabel}</span>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed font-semibold ${
                      isAdmin
                        ? "bg-indigo-600 text-white rounded-tr-none shadow-sm"
                        : "bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700/50 text-slate-800 dark:text-zinc-200 rounded-tl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-slate-300 dark:text-zinc-600">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a reply..."
            className="flex-1 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleSend}
            disabled={!replyText.trim() || sending}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white p-2.5 rounded-xl cursor-pointer"
          >
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}

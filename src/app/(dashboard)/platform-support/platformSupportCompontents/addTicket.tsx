import React, { useState } from "react";
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

export default function AddTicket({
  isOpen,
  setIsOpen,
  onCreated,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCreated: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const userId = await getUserId();
      await supportFetch("/support-tickets", {
        method: "POST",
        body: JSON.stringify({
          data: {
            subject,
            description,
            status: "pending",
            dateTicket: new Date().toISOString(),
            user: userId,
          },
        }),
      });
      toast.success("Ticket created!");
      setSubject("");
      setDescription("");
      onCreated();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-6 max-w-md mx-auto space-y-5 text-left" dir="ltr">
      <div className="flex flex-col space-y-1.5">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Subject</label>
        <input
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Brief description of the issue"
          className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10"
        />
      </div>

      <div className="flex flex-col space-y-1.5">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Explain the problem in detail..."
          rows={4}
          className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 resize-none"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-400 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/10 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
              Processing...
            </>
          ) : (
            "Submit Ticket"
          )}
        </button>
      </div>
    </form>
  );
}

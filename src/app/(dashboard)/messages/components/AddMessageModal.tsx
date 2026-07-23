"use client";

import { useState, useRef } from "react";
import { X, MessageSquare, Mail, Plus, Loader2, ImagePlus } from "lucide-react";
import toast from "react-hot-toast";
import { getAccessToken } from "../lib/api";

interface AddMessageModalProps {
  onClose: () => void;
  onSubmit: (data: { subject: string; email: string; content: string; image: string | null }) => Promise<void>;
}

export default function AddMessageModal({ onClose, onSubmit }: AddMessageModalProps) {
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const formData = new FormData();
      formData.append("files", file);
      const res = await fetch("http://localhost:1337/api/upload", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const data = await res.json();
      if (data && data[0] && data[0].url) {
        setImageUrl(data[0].url.startsWith("http") ? data[0].url : `http://localhost:1337${data[0].url}`);
        toast.success("Image uploaded!");
      } else {
        throw new Error("No URL returned from upload");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !email.trim() || !content.trim() || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        subject: subject.trim(),
        email: email.trim(),
        content: content.trim(),
        image: imageUrl.trim() || null,
      });
      setSubject("");
      setEmail("");
      setContent("");
      setImageUrl("");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to create this message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-lg shadow-xl z-50 animate-scale-in text-left relative flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
          <X size={16} />
        </button>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-50 dark:border-zinc-800 pb-2 flex items-center gap-2">
          <MessageSquare size={16} className="text-indigo-600" /> New Customer Message
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3 overflow-y-auto pr-1">
          {error && <p className="text-[11px] font-semibold text-red-500">{error}</p>}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Refund Request"
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-xs p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 font-medium"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1"><Mail size={12} /> Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@mail.com"
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-xs p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 font-medium"
              required
            />
            <span className="text-[10px] text-slate-400 dark:text-zinc-500">Must match an existing customer account.</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Message Content</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the message content..."
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-xs p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 resize-none font-medium leading-relaxed"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1"><ImagePlus size={12} /> Attachment (optional)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-dashed border-slate-200 dark:border-zinc-700 text-xs p-4 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-500 dark:text-zinc-400 font-medium flex items-center justify-center gap-2 hover:border-indigo-400 transition-colors cursor-pointer disabled:opacity-60"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
              {uploading ? "Uploading..." : imageUrl ? "Replace Image" : "Upload Image or Media"}
            </button>
            {imageUrl.trim() && (
              <img
                src={imageUrl.trim()}
                alt="preview"
                className="w-full max-h-40 object-cover rounded-xl border border-slate-100 dark:border-zinc-800"
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
            )}
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm disabled:opacity-60"
            >
              {submitting ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              {submitting ? "Creating..." : "Add Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Trash2,
  User2,
  Clock,
  ShieldCheck,
  Send,
  Loader2,
  ImagePlus,
} from 'lucide-react';
import { MessageThread } from '../lib/types';
import { getCurrentUserId, updateThread, getAccessToken } from '../lib/api';
import toast from 'react-hot-toast';

interface ConversationModalProps {
  thread: MessageThread;
  onClose: () => void;
  onDelete: (documentId: string) => Promise<void>;
  onSendReply: (
    threadDocumentId: string,
    text: string,
    image: string | null,
  ) => Promise<void>;
}

export default function ConversationModal({
  thread,
  onClose,
  onDelete,
  onSendReply,
}: ConversationModalProps) {
  const [replyText, setReplyText] = useState('');
  const [replyImage, setReplyImage] = useState('');
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getCurrentUserId().then(setCurrentUserId);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const formData = new FormData();
      formData.append('files', file);
      const res = await fetch('http://localhost:1337/api/upload', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const data = await res.json();
      if (data && data[0] && data[0].url) {
        setReplyImage(data[0].url.startsWith('http') ? data[0].url : `http://localhost:1337${data[0].url}`);
        toast.success('Image uploaded!');
      } else {
        throw new Error('No URL returned from upload');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const customerName =
    thread.user?.username || thread.user?.email || `Customer #${thread.id}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || sending || !thread.documentId) return;
    setError(null);
    setSending(true);
    try {
      await onSendReply(thread.documentId, replyText.trim(), replyImage.trim() || null);
      setReplyText('');
      setReplyImage('');
    } catch (err: any) {
      setError(err?.message || 'Failed to send the reply. Please try again.');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const markAsRead = async () => {
      if (thread && !thread.statusRead && thread.documentId) {
        try {
          await updateThread(thread.documentId, { statusRead: true });
        } catch (err) {
          console.error('Failed to mark conversation as read:', err);
        }
      }
    };
    markAsRead();
  }, [thread?.documentId]);

  const handleDelete = async () => {
    if (deleting || !thread.documentId) return;
    setDeleting(true);
    try {
      await onDelete(thread.documentId);
      toast.success('Conversation deleted successfully!');
    } catch (err: any) {
      setError(err?.message || 'Failed to delete this conversation.');
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-lg shadow-xl z-50 animate-scale-in text-left relative flex flex-col max-h-[90vh]">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer disabled:opacity-50"
        >
          {deleting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
        </button>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 border-b border-slate-50 dark:border-zinc-800 pb-2 flex items-center gap-2">
          <User2 size={16} className="text-indigo-600" /> {thread.user?.username || thread.user?.email || thread.sender?.username || thread.sender?.email || 'Unknown'}
        </h3>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[250px] mb-4 mt-3">
          {thread.subject && (
            <div className="flex flex-col max-w-[85%] mr-auto items-start">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {customerName}
              </span>
              <div className="p-3 rounded-2xl text-xs leading-relaxed font-semibold bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700/50 text-slate-800 dark:text-zinc-200 rounded-tl-none">
                {thread.subject}
              </div>
            </div>
          )}
          {(thread.messages_conversations || []).slice(1).map((chat) => {
            const isAdmin =
              currentUserId !== null &&
              chat.users_permissions_user?.id === currentUserId;
            const authorLabel = isAdmin
              ? 'You (Admin)'
              : chat.users_permissions_user?.username ||
                chat.users_permissions_user?.email ||
                customerName;
            return (
              <div
                key={chat.id}
                className={`flex flex-col max-w-[85%] space-y-1 ${isAdmin ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {authorLabel}
                </span>
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed font-semibold
                  ${
                    isAdmin
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700/50 text-slate-800 dark:text-zinc-200 rounded-tl-none'
                  }`}
                >
                  {chat.image && (
                    <img
                      src={chat.image}
                      alt="attachment"
                      className="rounded-lg mb-2 max-h-40 object-cover w-full"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).style.display = 'none')
                      }
                    />
                  )}
                  <p>{chat.content}</p>
                </div>
                <span className="text-[9px] text-slate-400 font-medium flex items-center gap-0.5">
                  <Clock size={9} />{' '}
                  {chat.createdAt
                    ? new Date(chat.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : ''}
                </span>
              </div>
            );
          })}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 pt-3 border-t border-slate-50 dark:border-zinc-800"
        >
          {error && (
            <p className="text-[11px] font-semibold text-red-500">{error}</p>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={13} /> Construct Quick Reply Email
            </label>
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Type your answer to send to ${customerName}...`}
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-xs p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 resize-none font-medium leading-relaxed"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1">
              <ImagePlus size={12} /> Attachment (optional)
            </label>
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
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-dashed border-slate-200 dark:border-zinc-700 text-xs p-3 rounded-xl focus:outline-none text-slate-500 dark:text-zinc-400 font-medium flex items-center justify-center gap-2 hover:border-indigo-400 transition-colors cursor-pointer disabled:opacity-60"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
              {uploading ? 'Uploading...' : replyImage ? 'Replace Image' : 'Upload Image or Media'}
            </button>
            {replyImage && (
              <img
                src={replyImage}
                alt="preview"
                className="w-full max-h-32 object-cover rounded-xl border border-slate-100 dark:border-zinc-800"
                onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
              />
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm disabled:opacity-60"
            >
              {sending ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Send size={13} />
              )}
              {sending ? 'Sending...' : 'Dispatch Response'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

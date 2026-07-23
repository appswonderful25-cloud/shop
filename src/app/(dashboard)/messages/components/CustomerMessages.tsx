'use client';

import { useEffect, useState } from 'react';
import {
  MessageSquare,
  Loader2,
  AlertTriangle,
  RotateCw,
  Circle,
} from 'lucide-react';
import { MessageThread } from '../lib/types';
import InboxToolbar from './InboxToolbar';
import MessagesTable from './MessagesTable';
import ConversationModal from './ConversationModal';
import AddMessageModal from './AddMessageModal';
import { useSocket } from '@/components/hooks/SocketConnection';
import toast from 'react-hot-toast';
import {
  fetchThreads,
  updateThread,
  deleteThread,
  createConversationMessage,
  createThread,
  findUserByEmail,
  getCurrentUserId,
} from '../lib/api';

export default function CustomerMessages() {
  const { socket, connected } = useSocket();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(
    null,
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isReadingAll, setIsReadingAll] = useState(false);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchThreads();
      if (!Array.isArray(data)) {
        console.error('Invalid data structure received:', data);
        setLoadError('Invalid data format received');
        setThreads([]);
        return;
      }
      setThreads(data);
    } catch (err: any) {
      console.error('Failed to load messages:', err);
      setLoadError(err?.message || 'Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('new_message', (message: any) => {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === message.conversation
            ? {
                ...t,
                messages_conversations: [
                  ...(t.messages_conversations || []),
                  message,
                ],
                updatedAt: new Date().toISOString(),
              }
            : t,
        ),
      );
    });

    socket.on('new_thread', (thread: MessageThread) => {
      setThreads((prev) => [thread, ...prev]);
    });

    socket.on('user_online', (data: { userId: number }) => {
      setThreads((prev) =>
        prev.map((t) =>
          t.user?.id === data.userId ? { ...t, online: true } : t,
        ),
      );
    });

    socket.on('user_offline', (data: { userId: number }) => {
      setThreads((prev) =>
        prev.map((t) =>
          t.user?.id === data.userId ? { ...t, online: false } : t,
        ),
      );
    });

    return () => {
      socket.off('new_message');
      socket.off('new_thread');
      socket.off('user_online');
      socket.off('user_offline');
    };
  }, [socket]);

  const handleSelectMessage = async (thread: MessageThread) => {
    setSelectedThread(thread);
    if (thread.statusRead) return;
    try {
      if (thread.documentId) {
        await updateThread(thread.documentId, { statusRead: true });
        setThreads((prev) =>
          prev.map((t) =>
            t.documentId === thread.documentId
              ? { ...t, statusRead: true }
              : t,
          ),
        );
      }
    } catch {
      // non-critical
    }
  };

  const handleReadAll = async () => {
    if (isReadingAll) return;

    const unreadThreads = threads.filter((t) => !t.statusRead);
    if (unreadThreads.length === 0) {
      toast.success('All messages are already read');
      return;
    }

    setIsReadingAll(true);

    try {
      const updatePromises = unreadThreads.map((thread) =>
        thread.documentId
          ? updateThread(thread.documentId, { statusRead: true })
          : Promise.reject(new Error('Missing documentId')),
      );

      const results = await Promise.allSettled(updatePromises);
      const failures = results.filter((r) => r.status === 'rejected');

      if (failures.length === 0) {
        setThreads((prev) => prev.map((t) => ({ ...t, statusRead: true })));
        toast.success(
          `Successfully marked ${unreadThreads.length} messages as read!`,
        );
      } else if (failures.length < unreadThreads.length) {
        const failedIds = new Set(
          failures.map((_, i) => unreadThreads[i].documentId),
        );
        setThreads((prev) =>
          prev.map((t) =>
            !failedIds.has(t.documentId) ? { ...t, statusRead: true } : t,
          ),
        );
        toast.error(
          `${failures.length}/${unreadThreads.length} messages failed to mark as read.`,
        );
      } else {
        const firstErr = (failures[0] as PromiseRejectedResult).reason;
        toast.error(
          firstErr?.message?.includes('log in')
            ? 'Please log in to mark messages as read.'
            : `Failed to mark messages as read: ${firstErr?.message || 'Unknown error'}`,
        );
      }
    } catch (error: any) {
      console.error('Failed to mark messages as read:', error);
      toast.error(error?.message || 'Failed to mark messages as read');
    } finally {
      setIsReadingAll(false);
    }
  };

  const handleDeleteMessage = async (documentId: string) => {
    try {
      await deleteThread(documentId);
      setThreads((prev) => prev.filter((t) => t.documentId !== documentId));
      setSelectedThread(null);
      toast.success('Conversation deleted successfully!');
    } catch (error: any) {
      console.error('Failed to delete conversation:', error);
      toast.error(error?.message || 'Failed to delete conversation');
    }
  };

  const handleSendReply = async (
    threadDocumentId: string,
    text: string,
    image: string | null,
  ) => {
    try {
      const adminId = await getCurrentUserId();
      if (!adminId)
        throw new Error(
          "Couldn't determine the current admin user. Please log in.",
        );

      const newMessage = await createConversationMessage({
        content: text,
        isRead: true,
        image,
        conversation: threadDocumentId,
        users_permissions_user: adminId,
      });

      if (socket && connected) {
        socket.emit('send_message', {
          ...newMessage,
          conversation: threadDocumentId,
        });
      }

      setThreads((prev) =>
        prev.map((t) =>
          t.documentId === threadDocumentId
            ? {
                ...t,
                sender: { ...t.sender, id: adminId },
                messages_conversations: [
                  ...(t.messages_conversations || []),
                  newMessage,
                ],
                updatedAt: new Date().toISOString(),
              }
            : t,
        ),
      );

      setSelectedThread((prev) =>
        prev && prev.documentId === threadDocumentId
          ? {
              ...prev,
              sender: { id: adminId } as any,
              messages_conversations: [
                ...(prev.messages_conversations || []),
                newMessage,
              ],
              updatedAt: new Date().toISOString(),
            }
          : prev,
      );

      toast.success('Reply sent successfully!');
    } catch (error) {
      console.error('Failed to send reply:', error);
      throw error;
    }
  };

  const handleAddMessage = async (data: {
    subject: string;
    email: string;
    content: string;
    image: string | null;
  }) => {
    try {
      const existingUser = await findUserByEmail(data.email);
      if (!existingUser) {
        throw new Error('Email not found. No account exists with this address.');
      }

      const thread = await createThread({
        subject: data.subject,
        statusRead: false,
        online: false,
        user: existingUser.id,
        sender: existingUser.id,
      });

      const firstMessage = await createConversationMessage({
        content: data.content,
        isRead: false,
        image: data.image,
        conversation: thread.documentId,
        users_permissions_user: existingUser.id,
      });

      const fullThread: MessageThread = {
        ...thread,
        user: existingUser as any,
        sender: existingUser as any,
        messages_conversations: [firstMessage],
        updatedAt: new Date().toISOString(),
      };

      setThreads((prev) => [fullThread, ...prev]);
      setShowAddModal(false);
    } catch (error: any) {
      console.error('Failed to add message:', error);
      toast.error(error?.message || 'Failed to create message');
      throw error;
    }
  };

  const filteredThreads = threads.filter((t) => {
    const customerName = t.user?.username || '';
    const customerEmail = t.user?.email || '';
    const term = searchTerm.toLowerCase();
    return (
      customerName.toLowerCase().includes(term) ||
      customerEmail.toLowerCase().includes(term) ||
      (t.subject || '').toLowerCase().includes(term)
    );
  });

  return (
    <div
      className="w-full max-w-5xl mx-auto space-y-6 text-left relative"
      dir="ltr"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <MessageSquare
              className="text-indigo-600 dark:text-indigo-400"
              size={24}
            />
            Customer Inbox
            <Circle
              size={12}
              className={
                connected
                  ? 'text-emerald-500 fill-emerald-500'
                  : 'text-red-500 fill-red-500'
              }
            />
          </h1>
          <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1">
            Read directly messages from store visitors, manage read receipts,
            and view full communication history.
          </p>
        </div>
      </div>

      <InboxToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setShowAddModal(true)}
        onReadAll={handleReadAll}
        hasUnread={threads.some((t) => !t.statusRead)}
        isReadingAll={isReadingAll}
      />

      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 text-sm text-slate-400 dark:text-zinc-500 py-16">
          <Loader2 size={20} className="animate-spin" /> Loading messages...
        </div>
      )}

      {!loading && loadError && (
        <div className="flex flex-col items-center justify-center gap-3 text-sm text-red-500 py-16">
          <AlertTriangle size={20} />
          <span>{loadError}</span>
          <button
            onClick={load}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            <RotateCw size={13} /> Retry
          </button>
        </div>
      )}

      {!loading && !loadError && filteredThreads.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 text-sm text-slate-400 dark:text-zinc-500 py-16">
          <MessageSquare size={24} />
          <span>No messages found.</span>
        </div>
      )}

      {!loading && !loadError && filteredThreads.length > 0 && (
        <MessagesTable threads={filteredThreads} onOpen={handleSelectMessage} />
      )}

      {selectedThread && (
        <ConversationModal
          thread={selectedThread}
          onClose={() => setSelectedThread(null)}
          onDelete={handleDeleteMessage}
          onSendReply={handleSendReply}
        />
      )}

      {showAddModal && (
        <AddMessageModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddMessage}
        />
      )}
    </div>
  );
}

'use client';

import { Mail, Eye, CheckCheck, Clock } from 'lucide-react';
import { MessageThread } from '../lib/types';
import { formatDate } from '../lib/utils';

interface MessagesTableProps {
  threads: MessageThread[];
  onOpen: (thread: MessageThread) => void;
}

export default function MessagesTable({ threads, onOpen }: MessagesTableProps) {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/50 text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              <th className="p-4 w-10">Status</th>
              <th className="p-4">Customer Info</th>
              <th className="p-4">Email Subject</th>
              <th className="p-4">Messages Count</th>
              <th className="p-4">Received Date</th>
              <th className="p-4 w-24">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
            {threads.map((thread) => {
              const customerName =
                thread.user?.username ||
                thread.user?.email ||
                `Customer #${thread.id}`;
              const customerEmail = thread.user?.email || '—';
              return (
                <tr
                  key={thread.id}
                  className={`hover:bg-slate-50/40 dark:hover:bg-zinc-800/20 transition-colors text-sm
                  ${thread.statusRead ? 'text-slate-600 dark:text-zinc-400' : 'text-slate-900 dark:text-white font-semibold bg-indigo-50/5 dark:bg-indigo-950/5'}`}
                >
                  <td className="p-4">
                    {!thread.statusRead ? (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white animate-pulse">
                        New
                      </span>
                    ) : (
                      <CheckCheck
                        size={16}
                        className="text-emerald-500 mx-auto"
                      />
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full ${thread.online ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'}`}
                          title={thread.online ? 'Online' : 'Offline'}
                        />
                        {customerName}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-zinc-500 flex items-center gap-1 mt-0.5">
                        <Mail size={11} />
                        {customerEmail}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 truncate max-w-[150px] font-bold text-slate-800 dark:text-zinc-200">
                    {thread.subject}
                  </td>

                  <td className="p-4 text-xs font-bold text-slate-500 dark:text-zinc-400 pl-8">
                    {(thread.messages_conversations || []).length ?? 0} logs
                  </td>

                  <td className="p-4 text-xs text-slate-400 dark:text-zinc-500 flex items-center gap-1 mt-3">
                    <Clock size={12} />
                    {formatDate(thread.updatedAt)}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => onOpen(thread)}
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95"
                    >
                      <Eye size={14} /> Open
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.success) {
        setMessages(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isRead: !currentStatus } : m))
        );
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Website Inquiries & Messages
            </h1>
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {messages.length} Messages
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            General questions and feedback submitted via the public Contact page.
          </p>
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="text-xs mt-3">Loading inquiries...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-slate-950 p-16 rounded-3xl border border-slate-800 text-center text-slate-500 text-xs">
          No contact inquiries recorded yet.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-3xl border transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                msg.isRead
                  ? 'bg-slate-950/70 border-slate-800/80 text-slate-400'
                  : 'bg-slate-950 border-indigo-500/40 text-slate-200 ring-1 ring-indigo-500/20 shadow-lg'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold text-white text-base">{msg.name}</span>
                  {!msg.isRead && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      NEW MESSAGE
                    </span>
                  )}
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatDateTime(msg.createdAt)}
                  </span>
                </div>

                <div className="text-xs text-indigo-400 font-semibold">{msg.subject || 'General Inquiry'}</div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/60">
                  {msg.message}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                  <a
                    href={`tel:${msg.phone}`}
                    className="text-emerald-400 font-mono font-bold hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" /> {msg.phone}
                  </a>
                  {msg.email && (
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-slate-400 hover:underline flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5" /> {msg.email}
                    </a>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <button
                  onClick={() => toggleReadStatus(msg.id, msg.isRead)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    msg.isRead
                      ? 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      : 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500 shadow-md'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{msg.isRead ? 'Mark as Unread' : 'Mark Resolved'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

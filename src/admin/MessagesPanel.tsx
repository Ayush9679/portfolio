import React, { useState, useEffect } from 'react';
import { adminApi, type MessageRecord } from '../services/api';

interface MessagesPanelProps {
  token: string;
  onUnauthorized: () => void;
}

export const MessagesPanel: React.FC<MessagesPanelProps> = ({
  token,
  onUnauthorized,
}) => {
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<MessageRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const readParam = filter === 'unread' ? false : filter === 'read' ? true : undefined;
      const res = await adminApi.getMessages(token, 1, 100, search || undefined, readParam);
      setMessages(res.data);
      setTotalCount(res.total);

      if (selectedMessage) {
        const updated = res.data.find((m) => m.id === selectedMessage.id);
        setSelectedMessage(updated ?? null);
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('401')) {
        onUnauthorized();
      } else {
        setError(err instanceof Error ? err.message : 'Failed to retrieve messages from database');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [token, filter, search, onUnauthorized]);

  const handleToggleRead = async (msg: MessageRecord) => {
    try {
      const updated = await adminApi.markRead(token, msg.id, !msg.read);
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? updated : m)));
      if (selectedMessage && selectedMessage.id === msg.id) {
        setSelectedMessage(updated);
      }
    } catch {
      setError('Failed to update message read status');
    }
  };

  const handleStatusChange = async (msg: MessageRecord, newStatus: string) => {
    try {
      const res = await adminApi.updateMessage(token, msg.id, { status: newStatus });
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? res.data : m)));
      if (selectedMessage && selectedMessage.id === msg.id) {
        setSelectedMessage(res.data);
      }
    } catch {
      setError('Failed to update message status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Are you sure you want to permanently delete message #${id}?`)) return;
    try {
      await adminApi.deleteMessage(token, id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setTotalCount((prev) => Math.max(0, prev - 1));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
    } catch {
      setError('Failed to delete message from database');
    }
  };

  const handleSelectMessage = async (msg: MessageRecord) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      try {
        const updated = await adminApi.markRead(token, msg.id, true);
        setMessages((prev) => prev.map((m) => (m.id === msg.id ? updated : m)));
        setSelectedMessage(updated);
      } catch {
        // Silently proceed
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in flex flex-col h-full relative z-10">
      {/* Title bar */}
      <div className="border-b border-[#1A2A38] pb-6 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl font-normal tracking-wide text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            TRANSACTION <span className="text-[#00D4FF]">LOGS</span>
          </h1>
          <p className="text-xs text-[#3A5A6A]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            // DIRECT SQLITE DATABASE VIEW & PAYLOAD INSPECTOR
          </p>
        </div>
        <div className="text-[10px] text-[#5A7A8A] px-3 py-1.5 border border-[#1A2A38] bg-[#0C1219]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          TOTAL RECORDS: <span className="text-[#00D4FF] font-bold">{totalCount}</span>
        </div>
      </div>

      {error && (
        <div className="p-4 border border-red-500/20 bg-red-500/5 text-xs text-red-400 shrink-0" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          [!] WARNING: {error}
        </div>
      )}

      {/* Filter and Search Controls */}
      <div
        className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0C1219] p-4 border border-[#1A2A38] shrink-0"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {(['all', 'unread', 'read'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase font-medium border transition-colors ${
                filter === opt
                  ? 'border-[#00D4FF] text-[#00D4FF] bg-[#00D4FF]/5'
                  : 'border-[#1A2A38] text-[#5A7A8A] hover:border-[#3A5A6A] hover:text-[#A8BEC8]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="Search sender, channel, payload..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#070B0F] border border-[#1A2A38] focus:border-[#00D4FF]/60 text-xs text-[#E8F4F8] placeholder-[#2A4A5A] px-4 py-2 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Split grid for message list and message details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 flex-1">
        {/* Left: Message Log List */}
        <div className="lg:col-span-7 flex flex-col min-h-0 border border-[#1A2A38] bg-[#0C1219]">
          <div className="px-6 py-3 border-b border-[#1A2A38] bg-[#070B0F] flex items-center justify-between shrink-0">
            <span
              className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#3A5A6A]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              // BUFFER LOGS: {messages.length} of {totalCount}
            </span>
            <button
              onClick={fetchMessages}
              className="text-[9px] tracking-[0.2em] uppercase text-[#00D4FF] hover:underline"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              [ REFRESH ]
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 select-none">
            {loading && messages.length === 0 ? (
              <p className="text-xs text-[#00D4FF] text-center py-10 animate-pulse" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                ⟳ QUERYING SQLITE RECORDS...
              </p>
            ) : messages.length === 0 ? (
              <p className="text-xs text-[#5A7A8A] text-center py-10" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                NO RECORDS MATCHING ACTIVE FILTER.
              </p>
            ) : (
              messages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected
                        ? 'border-[#00D4FF] bg-[#00D4FF]/5'
                        : 'border-[#1A2A38] bg-[#070B0F]/40 hover:border-[#2A4A5A] hover:bg-[#070B0F]/70'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono text-[#00D4FF] font-bold">
                          #{String(msg.id).padStart(4, '0')}
                        </span>
                        <span className="text-xs font-semibold text-[#A8BEC8]">{msg.sender}</span>
                        <span
                          className="text-[10px] text-[#5A7A8A]"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          ({msg.channel})
                        </span>
                        {!msg.read && (
                          <span
                            className="text-[8px] font-bold tracking-widest text-[#00D4FF] bg-[#00D4FF]/10 px-1.5 py-0.5 border border-[#00D4FF]/30"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            UNREAD
                          </span>
                        )}
                        <span
                          className="text-[8px] tracking-widest uppercase text-[#5A7A8A] px-1.5 py-0.5 border border-[#1A2A38]"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {msg.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#5A7A8A] line-clamp-1">{msg.payload}</p>
                    </div>
                    <div
                      className="text-[9px] text-[#2A4A5A] font-mono whitespace-nowrap shrink-0 md:text-right"
                    >
                      {new Date(msg.created_at).toLocaleDateString()}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Message Detail Viewer */}
        <div className="lg:col-span-5 border border-[#1A2A38] bg-[#0C1219] flex flex-col min-h-0">
          <div className="px-6 py-3 border-b border-[#1A2A38] bg-[#070B0F] shrink-0">
            <span
              className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#3A5A6A]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              // PAYLOAD INSPECTOR
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {!selectedMessage ? (
              <div
                className="h-full flex flex-col items-center justify-center text-center space-y-2 py-10"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                <span className="text-[#2A4A5A] text-xs font-mono border border-[#1A2A38] px-3 py-1">[ NO SELECTION ]</span>
                <p className="text-[10px] text-[#3A5A6A] uppercase tracking-widest mt-2">SELECT A LOG ROW TO VIEW PAYLOAD & METADATA</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Meta details */}
                <div
                  className="space-y-3 p-4 border border-[#1A2A38] bg-[#070B0F]/50"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <div className="flex justify-between items-center border-b border-[#1A2A38] pb-2">
                    <span className="text-[9px] text-[#3A5A6A] uppercase">RECORD ID</span>
                    <span className="text-xs text-[#00D4FF] font-bold">
                      #{String(selectedMessage.id).padStart(5, '0')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#3A5A6A] uppercase block">SENDER</span>
                    <span className="text-xs text-[#A8BEC8] font-semibold">{selectedMessage.sender}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#3A5A6A] uppercase block">CHANNEL / EMAIL</span>
                    <a
                      href={`mailto:${selectedMessage.channel}`}
                      className="text-xs text-[#00D4FF] hover:underline"
                    >
                      {selectedMessage.channel}
                    </a>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#3A5A6A] uppercase block">TIMESTAMP</span>
                    <span className="text-xs text-[#A8BEC8]">
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </span>
                  </div>
                  {selectedMessage.ip_address && (
                    <div>
                      <span className="text-[9px] text-[#3A5A6A] uppercase block">CLIENT IP ORIGIN</span>
                      <span className="text-xs text-[#A8BEC8]">{selectedMessage.ip_address}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-[9px] text-[#3A5A6A] uppercase block">CURRENT STATUS</span>
                    <div className="flex gap-2 mt-1">
                      {['received', 'reviewed', 'archived'].map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(selectedMessage, st)}
                          className={`text-[8px] tracking-wider uppercase px-2 py-0.5 border ${
                            selectedMessage.status === st
                              ? 'border-[#00D4FF] text-[#00D4FF] bg-[#00D4FF]/10'
                              : 'border-[#1A2A38] text-[#5A7A8A] hover:border-[#3A5A6A]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Message payload */}
                <div>
                  <span
                    className="text-[9px] text-[#3A5A6A] uppercase block mb-2"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    TRANSMISSION PAYLOAD:
                  </span>
                  <div
                    className="p-4 border border-[#1A2A38] bg-[#070B0F] text-xs text-[#E8F4F8] whitespace-pre-wrap leading-relaxed"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {selectedMessage.payload}
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="flex gap-3 pt-4 border-t border-[#1A2A38]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <button
                    onClick={() => handleToggleRead(selectedMessage)}
                    className="flex-1 py-2 text-[9px] font-semibold tracking-[0.2em] uppercase border border-[#1A2A38] text-[#A8BEC8] hover:border-[#00D4FF] hover:text-[#00D4FF] transition-all"
                  >
                    {selectedMessage.read ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="flex-1 py-2 text-[9px] font-semibold tracking-[0.2em] uppercase border border-red-500/20 bg-red-500/5 text-red-400 hover:border-red-500 hover:bg-red-500/10 transition-all"
                  >
                    Delete Record
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { adminApi, type StatsResponse, type MessageRecord } from '../services/api';
import { StatCard } from './components/StatCard';
import { useSystemStatus } from '../hooks/useSystemStatus';

interface DashboardProps {
  token: string;
  onUnauthorized: () => void;
  setActiveTab: (tab: 'overview' | 'messages') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  token,
  onUnauthorized,
  setActiveTab,
}) => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [recentMessages, setRecentMessages] = useState<MessageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { health } = useSystemStatus();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const statsData = await adminApi.getStats(token);
        setStats(statsData);

        const msgs = await adminApi.messages(token);
        setRecentMessages(msgs.slice(0, 5));
      } catch (err) {
        if (err instanceof Error && err.message.includes('401')) {
          onUnauthorized();
        } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, onUnauthorized]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 space-y-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        <span className="text-[#00D4FF] text-xs animate-pulse">⟳ FETCHING TELEMETRY FROM FASTAPI & SQLITE...</span>
      </div>
    );
  }

  const dbStatus = stats?.database?.status || health?.database || 'connected';
  const dbRecords = stats?.database?.records ?? stats?.messages ?? 0;

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      {/* Title bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1A2A38] pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-normal tracking-wide text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            ADMIN <span className="text-[#00D4FF]">COMMAND CENTER</span>
          </h1>
          <p className="text-xs text-[#3A5A6A]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            // REAL-TIME SYSTEM TELEMETRY & SQLITE LOGGER
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          <div className="text-[10px] text-[#5A7A8A] px-3 py-1.5 border border-[#1A2A38] bg-[#0C1219]">
            DATABASE: <span className={dbStatus === 'connected' ? 'text-[#00D4FF]' : 'text-red-400'}>
              ● SQLITE ({dbStatus.toUpperCase()})
            </span>
          </div>
          <div className="text-[10px] text-[#5A7A8A] px-3 py-1.5 border border-[#1A2A38] bg-[#0C1219]">
            RECORDS: <span className="text-[#A8BEC8] font-semibold">{dbRecords}</span>
          </div>
          <div className="text-[10px] text-[#5A7A8A] px-3 py-1.5 border border-[#1A2A38] bg-[#0C1219]">
            API: <span className="text-[#00D4FF]">ONLINE</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 border border-red-500/20 bg-red-500/5 text-xs text-red-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          [!] WARNING: {error}
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Dispatches"
          value={stats?.messages ?? stats?.total_messages ?? 0}
          code="// 01"
          description="Stored in SQLite database"
        />
        <StatCard
          title="Unread Dispatches"
          value={stats?.unread_messages ?? 0}
          code="// 02"
          description="Awaiting admin review"
        />
        <StatCard
          title="Read Dispatches"
          value={stats?.read_messages ?? 0}
          code="// 03"
          description="Reviewed transmissions"
        />
        <StatCard
          title="Featured Projects"
          value={stats?.projects ?? 4}
          code="// 04"
          description="Configured in portfolio"
        />
      </div>

      {/* Database Telemetry Panel */}
      <div className="border border-[#1A2A38] bg-[#0C1219] p-6 space-y-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        <div className="flex items-center justify-between border-b border-[#1A2A38] pb-3">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#00D4FF]">
            // DATABASE INSPECTION
          </span>
          <span className="text-[9px] text-[#3A5A6A]">SQLITE WAL MODE</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 border border-[#1A2A38] bg-[#070B0F]">
            <span className="text-[9px] text-[#3A5A6A] block mb-1">ENGINE</span>
            <span className="text-[#A8BEC8] font-bold">SQLITE (LOCAL FILE)</span>
          </div>
          <div className="p-3 border border-[#1A2A38] bg-[#070B0F]">
            <span className="text-[9px] text-[#3A5A6A] block mb-1">STATUS</span>
            <span className="text-[#00D4FF] font-bold">CONNECTED & OPERATIONAL</span>
          </div>
          <div className="p-3 border border-[#1A2A38] bg-[#070B0F]">
            <span className="text-[9px] text-[#3A5A6A] block mb-1">TOTAL TABLE ROWS</span>
            <span className="text-[#00D4FF] font-bold">{dbRecords} RECORD(S)</span>
          </div>
        </div>
      </div>

      {/* Recent submissions panel */}
      <div className="border border-[#1A2A38] bg-[#0C1219] overflow-hidden">
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A2A38] bg-[#070B0F]">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#3A5A6A]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            // Recent Incoming Dispatches
          </span>
          <button
            onClick={() => setActiveTab('messages')}
            className="text-[9px] tracking-[0.2em] uppercase text-[#00D4FF] hover:underline"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            [ Open Full Message Manager ]
          </button>
        </div>

        {/* Panel body */}
        <div className="p-6">
          {recentMessages.length === 0 ? (
            <p className="text-xs text-[#5A7A8A] py-4 text-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              NO RECENT DISPATCHES STORED IN SQLITE.
            </p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setActiveTab('messages')}
                  className="p-4 border border-[#1A2A38] hover:border-[#00D4FF]/30 bg-[#070B0F]/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-[#A8BEC8]">{msg.sender}</span>
                      <span className="text-[10px] text-[#5A7A8A]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
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
                    </div>
                    <p className="text-xs text-[#5A7A8A] line-clamp-1">{msg.payload}</p>
                  </div>
                  <div className="text-[9px] text-[#3A5A6A] font-mono whitespace-nowrap shrink-0 md:text-right">
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

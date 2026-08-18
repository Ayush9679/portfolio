import React from 'react';
import { useSystemStatus } from '../../hooks/useSystemStatus';

interface SidebarProps {
  activeTab: 'overview' | 'messages';
  setActiveTab: (tab: 'overview' | 'messages') => void;
  onLogout: () => void;
  navigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
  navigate,
}) => {
  const { status } = useSystemStatus();

  return (
    <aside className="w-64 bg-[#0C1219] border-r border-[#1A2A38] flex flex-col justify-between h-full select-none">
      <div className="flex flex-col">
        {/* Title/Branding */}
        <div className="p-6 border-b border-[#1A2A38] flex items-center justify-between">
          <span
            className="text-xs font-semibold tracking-[0.3em] uppercase text-[#00D4FF]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            AKD // CONTROL
          </span>
          <span
            className="text-[8px] tracking-[0.15em] px-1.5 py-0.5 border font-mono"
            style={{
              color: status === 'online' ? '#00D4FF' : '#EF4444',
              borderColor: status === 'online' ? '#00D4FF30' : '#EF444430',
            }}
          >
            {status === 'online' ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-3 text-xs tracking-[0.2em] uppercase transition-all duration-200 border ${
              activeTab === 'overview'
                ? 'border-[#00D4FF] text-[#00D4FF] bg-[#00D4FF]/5'
                : 'border-transparent text-[#5A7A8A] hover:text-[#A8BEC8] hover:bg-[#111B26]/30'
            }`}
          >
            // 01 Overview
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full text-left px-4 py-3 text-xs tracking-[0.2em] uppercase transition-all duration-200 border ${
              activeTab === 'messages'
                ? 'border-[#00D4FF] text-[#00D4FF] bg-[#00D4FF]/5'
                : 'border-transparent text-[#5A7A8A] hover:text-[#A8BEC8] hover:bg-[#111B26]/30'
            }`}
          >
            // 02 Messages
          </button>
        </nav>
      </div>

      {/* Footer Area */}
      <div className="p-4 border-t border-[#1A2A38] space-y-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        <button
          onClick={() => navigate('/')}
          className="w-full text-center py-2.5 text-[9px] tracking-[0.25em] uppercase border border-[#1A2A38] text-[#5A7A8A] hover:text-[#A8BEC8] hover:border-[#3A5A6A] transition-all"
        >
          [ Web Portfolio ]
        </button>
        <button
          onClick={onLogout}
          className="w-full text-center py-2.5 text-[9px] tracking-[0.25em] uppercase border border-red-500/30 text-red-400 hover:bg-red-500/5 hover:border-red-500 transition-all"
        >
          Logout →
        </button>
      </div>
    </aside>
  );
};

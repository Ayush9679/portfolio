import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './Dashboard';
import { MessagesPanel } from './MessagesPanel';

interface AdminAppProps {
  navigate: (path: string) => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({ navigate }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [activeTab, setActiveTab] = useState<'overview' | 'messages'>('overview');

  useEffect(() => {
    // Sync token from localStorage
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLogin = (newToken: string) => {
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    navigate('/');
  };

  if (!token) {
    return <AdminLogin onLogin={handleLogin} navigate={navigate} />;
  }

  return (
    <div className="flex h-screen bg-[#070B0F] text-[#E8F4F8] overflow-hidden font-body">
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        navigate={navigate}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#080C10] p-6 md:p-10 relative">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.03) 0%, transparent 70%)' }} />

        {activeTab === 'overview' && (
          <Dashboard token={token} onUnauthorized={handleLogout} setActiveTab={setActiveTab} />
        )}
        {activeTab === 'messages' && (
          <MessagesPanel token={token} onUnauthorized={handleLogout} />
        )}
      </main>
    </div>
  );
};

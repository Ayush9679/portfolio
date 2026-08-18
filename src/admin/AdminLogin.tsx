import React, { useState } from 'react';
import { adminApi } from '../services/api';

interface AdminLoginProps {
  onLogin: (token: string) => void;
  navigate: (path: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, navigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await adminApi.login(username, password);
      onLogin(data.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070B0F] px-4 py-12 sm:px-6 lg:px-8 font-body relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)' }} />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-[10px] tracking-[0.3em] text-[#3A5A6A] hover:text-[#00D4FF] transition-colors mb-6 uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            ← Back to Portfolio
          </button>
          <h2 className="text-4xl font-normal tracking-wide text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            ADMIN <span className="text-[#00D4FF]">ACCESS</span>
          </h2>
          <p className="mt-2 text-xs text-[#3A5A6A]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            // SECURE GATEWAY AUTHORIZATION
          </p>
        </div>

        <form className="mt-8 space-y-6 border border-[#1A2A38] bg-[#0C1219] p-8 relative" onSubmit={handleSubmit}>
          {/* Top border flare */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D4FF]/60 to-transparent" />
          
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#00D4FF]/50" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#00D4FF]/50" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#00D4FF]/50" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#00D4FF]/50" />

          {error && (
            <div className="p-3 border border-red-500/20 bg-red-500/5 text-xs text-red-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              [!] ERROR: {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-[9px] tracking-[0.25em] uppercase text-[#2A4A5A] mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                --username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter identity..."
                className="w-full bg-[#070B0F] border border-[#1A2A38] focus:border-[#00D4FF]/60 text-xs text-[#E8F4F8] placeholder-[#2A4A5A] px-4 py-3 outline-none transition-colors"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[9px] tracking-[0.25em] uppercase text-[#2A4A5A] mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                --passphrase
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter key..."
                className="w-full bg-[#070B0F] border border-[#1A2A38] focus:border-[#00D4FF]/60 text-xs text-[#E8F4F8] placeholder-[#2A4A5A] px-4 py-3 outline-none transition-colors"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 border transition-all duration-300 text-[10px] font-semibold tracking-[0.28em] uppercase flex items-center justify-center gap-2 disabled:opacity-50"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              borderColor: loading ? '#1A2A38' : '#00D4FF',
              backgroundColor: loading ? 'transparent' : 'rgba(0,212,255,0.08)',
              color: loading ? '#3A5A6A' : '#00D4FF',
            }}
          >
            {loading ? 'AUTHENTICATING...' : 'AUTHORIZE ACCESS ↗'}
          </button>
        </form>
      </div>
    </div>
  );
};

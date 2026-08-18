import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  code?: string;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  code,
  description,
}) => {
  return (
    <div
      className="border border-[#1A2A38] bg-[#0C1219] p-6 relative overflow-hidden group hover:border-[#00D4FF]/30 transition-all duration-300"
      style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}
    >
      {/* Corner bracket accent */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00D4FF]/30 group-hover:border-[#00D4FF]/70 transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00D4FF]/30 group-hover:border-[#00D4FF]/70 transition-colors" />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p
            className="text-[9px] tracking-[0.25em] uppercase text-[#3A5A6A] font-semibold"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {title}
          </p>
          <p
            className="text-4xl font-normal text-white group-hover:text-[#00D4FF] transition-colors"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {value}
          </p>
        </div>
        {code && (
          <span
            className="text-[10px] font-mono text-[#00D4FF]/50 border border-[#00D4FF]/20 px-2 py-1 select-none"
          >
            {code}
          </span>
        )}
      </div>
      {description && (
        <p
          className="mt-3 text-[10px] text-[#5A7A8A]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          // {description}
        </p>
      )}
    </div>
  );
};

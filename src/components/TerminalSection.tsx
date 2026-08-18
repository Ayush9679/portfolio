import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSystemStatus } from '../hooks/useSystemStatus';

interface TerminalLine {
  id: number;
  type: 'input' | 'output' | 'error' | 'system' | 'blank';
  content: string;
}

// ── Portfolio data pulled into terminal responses ──────────────────────────────

const PORTFOLIO_DATA = {
  projects: [
    { name: 'CyberGuard AI',           tech: ['FastAPI', 'DeBERTa-v3', 'GROQ LLM', 'React'],        status: 'Active' },
    { name: 'Release Risk Heatmap',     tech: ['scikit-learn', 'Random Forest', 'FastAPI', 'React'],   status: 'Active' },
    { name: 'Multi-Tenant SaaS',        tech: ['Node.js', 'PostgreSQL', 'Docker', 'RBAC'],             status: 'Production' },
    { name: 'Payment Gateway',          tech: ['Spring Boot', 'Node.js', 'UPI Integration'],           status: 'Production' },
  ],
  skills: {
    'AI / Machine Learning': ['Python', 'scikit-learn', 'NumPy / Pandas', 'Transformers', 'NLP / NER', 'LLM APIs', 'Generative AI', 'Hugging Face', 'PyTorch', 'TensorFlow', 'OpenCV'],
    'Backend Engineering':   ['FastAPI', 'Pydantic', 'SQLAlchemy', 'REST APIs', 'SQLite', 'PostgreSQL', 'JWT Authentication', 'Node.js'],
    'Full Stack / Web':      ['HTML / CSS', 'React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'REST API Integration', 'Responsive UI', 'Vite'],
    'DevOps / Automation':   ['Git / GitHub', 'API Integration', 'Docker', 'n8n Workflows', 'Webhooks', 'CI/CD', 'Linux', 'Deployment'],
  },
  experience: [
    { org: 'WebMobril Technologies',   role: 'AI/ML Intern',         period: 'Jun 2026–Present', focus: 'ML Pipelines & NLP' },
    { org: 'IBM',                       role: 'Generative AI Intern', period: 'Oct–Dec 2025',     focus: 'LLMs & Prompt Engineering' },
    { org: 'MCN Solutions',             role: 'C++ Intern',           period: 'Jun–Jul 2024',     focus: 'Systems Programming' },
  ],
  about: {
    name: 'Ayush Kumar Dubey',
    role: 'AI/ML + Backend Engineer',
    cgpa: '8.71',
    dsa: '200+',
    education: 'B.Tech CSE, Mangalmay Institute (2023–2027)',
    location: 'India',
  },
};

const HELP_OUTPUT = `
Available commands:
  help          — Show this help menu
  whoami        — Display portfolio summary
  projects      — List all featured projects
  skills        — Show tech stack matrix
  experience    — Show internship history
  contact       — Show contact information
  status        — Check API + system status
  clear         — Clear terminal
  easter        — [secret]
`.trim();

// ── Command processor ─────────────────────────────────────────────────────────

function processCommand(
  cmd: string,
  health: ReturnType<typeof useSystemStatus>['health'],
  apiStatus: string
): string[] {
  const trimmed = cmd.trim().toLowerCase();
  const lines: string[] = [];

  switch (trimmed) {
    case 'help':
      return HELP_OUTPUT.split('\n');

    case 'whoami':
      return [
        `Name     : ${PORTFOLIO_DATA.about.name}`,
        `Role     : ${PORTFOLIO_DATA.about.role}`,
        `CGPA     : ${PORTFOLIO_DATA.about.cgpa}`,
        `DSA      : ${PORTFOLIO_DATA.about.dsa} problems solved`,
        `Education: ${PORTFOLIO_DATA.about.education}`,
        `Location : ${PORTFOLIO_DATA.about.location}`,
        '',
        'Run `projects`, `skills`, or `experience` to learn more.',
      ];

    case 'projects':
      lines.push('FEATURED PROJECTS:');
      lines.push('');
      PORTFOLIO_DATA.projects.forEach((p, i) => {
        lines.push(`  [${String(i + 1).padStart(2, '0')}] ${p.name}  [${p.status.toUpperCase()}]`);
        lines.push(`       Tech: ${p.tech.join(', ')}`);
        lines.push('');
      });
      lines.push('Run `contact` to discuss a project.');
      return lines;

    case 'skills':
      lines.push('TECH STACK MATRIX:');
      lines.push('');
      Object.entries(PORTFOLIO_DATA.skills).forEach(([category, techs]) => {
        lines.push(`  ▸ ${category.toUpperCase()}`);
        lines.push(`    ${techs.join(' · ')}`);
        lines.push('');
      });
      return lines;

    case 'experience':
      lines.push('INTERNSHIP HISTORY:');
      lines.push('');
      PORTFOLIO_DATA.experience.forEach((e, i) => {
        lines.push(`  [${i + 1}] ${e.org}`);
        lines.push(`      Role   : ${e.role}`);
        lines.push(`      Period : ${e.period}`);
        lines.push(`      Focus  : ${e.focus}`);
        lines.push('');
      });
      return lines;

    case 'contact':
      return [
        'CONTACT CHANNELS:',
        '',
        '  GitHub   : github.com/AyushKumarDubey',
        '  LinkedIn : linkedin.com/in/ayushkumardubey',
        '  Email    : Use the form on this page → #contact',
        '',
        'Or scroll down to the DISPATCH TERMINAL to send a message directly.',
      ];

    case 'status':
      return [
        'SYSTEM STATUS:',
        '',
        `  API        : ${apiStatus === 'online' ? '● OPERATIONAL' : apiStatus === 'offline' ? '✗ OFFLINE' : '○ ' + apiStatus.toUpperCase()}`,
        `  DATABASE   : ${health?.database === 'connected' ? '● CONNECTED' : '○ CHECKING...'}`,
        `  VERSION    : ${health?.version ?? 'N/A'}`,
        `  UPTIME     : ${health ? Math.floor(health.uptime_seconds) + 's' : 'N/A'}`,
        `  MESSAGES   : ${health?.message_count ?? 0} stored`,
        '',
        'Portfolio stack: React + FastAPI + SQLite',
      ];

    case 'clear':
      return ['__CLEAR__'];

    case 'easter':
      return [
        '// SECRET TERMINAL ACCESS GRANTED',
        '',
        '  "The best code is the code that',
        '   solves real problems, not the code',
        '   that looks impressive in interviews."',
        '',
        '                     — someone on the internet',
      ];

    case '':
      return [];

    default:
      return [`bash: ${cmd}: command not found`, `Try 'help' for available commands.`];
  }
}

// ── Terminal Component ────────────────────────────────────────────────────────

let lineIdCounter = 100;

const INITIAL_LINES: TerminalLine[] = [
  { id: 1, type: 'system', content: '┌─────────────────────────────────────────────────────┐' },
  { id: 2, type: 'system', content: '│  AYUSH KUMAR DUBEY — PORTFOLIO TERMINAL v1.0.0      │' },
  { id: 3, type: 'system', content: '│  AI/ML + Backend Engineer · FastAPI · Python · LLMs  │' },
  { id: 4, type: 'system', content: '└─────────────────────────────────────────────────────┘' },
  { id: 5, type: 'blank',  content: '' },
  { id: 6, type: 'output', content: "Type 'help' to see available commands." },
  { id: 7, type: 'blank',  content: '' },
];

export const TerminalSection: React.FC = () => {
  const [lines, setLines]       = useState<TerminalLine[]>(INITIAL_LINES);
  const [input, setInput]       = useState('');
  const [history, setHistory]   = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { status, health }      = useSystemStatus();

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    const responses = processCommand(trimmed, health, status);

    if (responses[0] === '__CLEAR__') {
      setLines(INITIAL_LINES);
      return;
    }

    const newLines: TerminalLine[] = [];

    // Input echo
    newLines.push({
      id: ++lineIdCounter,
      type: 'input',
      content: trimmed,
    });

    // Response lines
    responses.forEach((r) => {
      newLines.push({
        id: ++lineIdCounter,
        type: r.startsWith('bash:') ? 'error' : 'output',
        content: r,
      });
    });

    newLines.push({ id: ++lineIdCounter, type: 'blank', content: '' });

    setLines((prev) => [...prev, ...newLines]);

    // Update history
    if (trimmed) {
      setHistory((prev) => [trimmed, ...prev.slice(0, 49)]);
      setHistoryIdx(-1);
    }
  }, [health, status]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIdx = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(nextIdx);
      setInput(history[nextIdx] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(nextIdx);
      setInput(nextIdx === -1 ? '' : history[nextIdx]);
    }
  };

  return (
    <section
      id="terminal"
      className="relative w-full bg-[#070B0F] py-24 px-6 sm:px-12 lg:px-20 overflow-hidden"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[30rem] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.04) 0%, transparent 70%)' }}
      />

      <div className="max-w-5xl mx-auto w-full relative z-10">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4 mb-7"
        >
          <span
            className="text-[10px] font-medium tracking-[0.4em] uppercase text-[#00D4FF]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span className="text-[#2A4A5A]">06 //</span> DEVELOPER CONSOLE
          </span>
          <div className="w-16 h-px bg-gradient-to-r from-[#00D4FF]/60 to-transparent" />
        </motion.div>

        {/* Section headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mb-10"
        >
          <h2
            className="text-5xl sm:text-6xl md:text-7xl tracking-tight uppercase leading-[0.85] select-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#C8DDE8] to-[#506070]">
              INTERACTIVE
            </span>
            <span
              className="block text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(180deg, #00D4FF 0%, #0088CC 60%, #003A55 100%)' }}
            >
              TERMINAL.
            </span>
          </h2>
          <p className="text-xs text-[#3A5A6A] mt-3 max-w-md font-light">
            Query my portfolio from the command line. Real commands, real data.
          </p>
        </motion.div>

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="border border-[#1A2A38] bg-[#070B0F] shadow-[0_20px_80px_rgba(0,0,0,0.9)]"
          style={{ boxShadow: '0 0 0 1px #1A2A38, 0 20px 80px rgba(0,0,0,0.9), 0 0 60px rgba(0,212,255,0.03)' }}
        >
          {/* Title bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#1A2A38] bg-[#0C1219]">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] shadow-[0_0_6px_rgba(0,212,255,0.6)]" />
              <span
                className="text-[9px] tracking-[0.3em] uppercase text-[#4A6A7A] font-semibold"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                PORTFOLIO.TERMINAL — CLI.SESSION
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 border"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: status === 'online' ? '#00D4FF' : '#EF4444',
                  borderColor: status === 'online' ? '#00D4FF30' : '#EF444430',
                }}
              >
                {status === 'online' ? '● API LIVE' : '○ API OFFLINE'}
              </span>
            </div>
          </div>

          {/* Output area */}
          <div
            ref={scrollRef}
            className="h-96 overflow-y-auto px-5 py-4 space-y-0.5"
            onClick={() => inputRef.current?.focus()}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {lines.map((line) => {
              if (line.type === 'blank') return <div key={line.id} className="h-2" />;

              const colorMap: Record<string, string> = {
                system: '#2A5A7A',
                input:  '#E8F4F8',
                output: '#5A8A9A',
                error:  '#EF4444',
              };

              return (
                <div key={line.id} className="flex items-start gap-2 leading-relaxed">
                  {line.type === 'input' && (
                    <span className="text-[#00D4FF] text-xs shrink-0 select-none">
                      ayush@portfolio:~$
                    </span>
                  )}
                  <span
                    className="text-xs break-all whitespace-pre-wrap"
                    style={{ color: colorMap[line.type] ?? '#5A8A9A' }}
                  >
                    {line.content}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Input row */}
          <div
            className="flex items-center gap-3 px-5 py-4 border-t border-[#1A2A38]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span className="text-[#00D4FF] text-xs shrink-0 select-none">
              ayush@portfolio:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="type a command..."
              className="flex-1 bg-transparent text-xs text-[#E8F4F8] outline-none placeholder-[#1E3547] caret-[#00D4FF]"
              id="terminal-input"
            />
            <span className="terminal-cursor" />
          </div>
        </motion.div>

        {/* Quick command pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {['help', 'whoami', 'projects', 'skills', 'experience', 'status'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => {
                setInput(cmd);
                setTimeout(() => {
                  executeCommand(cmd);
                  setInput('');
                }, 50);
              }}
              className="px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase border border-[#1A2A38] text-[#2A4A5A] hover:border-[#00D4FF]/30 hover:text-[#00D4FF] transition-all duration-200"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {cmd}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TerminalSection;

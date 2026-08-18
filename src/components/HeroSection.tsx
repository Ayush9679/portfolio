import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useSystemStatus } from '../hooks/useSystemStatus';
import watermarkImg from '../assets/watermark.png';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.2 },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
  },
};

const navItems = [
  { name: 'ABOUT',      href: '#about' },
  { name: 'PROJECTS',   href: '#work' },
  { name: 'SKILLS',     href: '#skills' },
  { name: 'EXPERIENCE', href: '#experience' },
  { name: 'TERMINAL',   href: '#terminal' },
  { name: 'CONTACT',    href: '#contact' },
];

/* ── System status dot ─────────────────────────────────────────────────────── */
function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    online:   '#00D4FF',
    degraded: '#F59E0B',
    offline:  '#EF4444',
    checking: '#5A7A8A',
  };
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
      style={{
        backgroundColor: colors[status] ?? colors.checking,
        boxShadow: status === 'online'
          ? '0 0 6px rgba(0,212,255,0.8)'
          : status === 'degraded'
          ? '0 0 6px rgba(245,158,11,0.8)'
          : 'none',
      }}
    />
  );
}

export const HeroSection: React.FC = () => {
  const [cursorPos, setCursorPos]   = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered]   = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { status, health }          = useSystemStatus();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) =>
      setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      className="relative w-screen h-screen overflow-hidden bg-[#070B0F] text-[#E8F4F8] cursor-none"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* ── Custom cursor ─────────────────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-[#00D4FF]/50"
        animate={{
          x: cursorPos.x - (isHovered ? 20 : 4),
          y: cursorPos.y - (isHovered ? 20 : 4),
          width:  isHovered ? 40 : 8,
          height: isHovered ? 40 : 8,
          backgroundColor: isHovered ? 'rgba(0,212,255,0.08)' : 'rgba(0,212,255,0.9)',
        }}
        transition={{ type: 'spring', damping: 28, stiffness: 380, mass: 0.4 }}
      />

      {/* ── Background: video + gradients ─────────────────────────────────── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-end bg-[#070B0F]">
        <video
          autoPlay muted loop playsInline
          className="h-screen w-auto max-w-none object-contain origin-right opacity-40 scale-100"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Left gradient blend */}
        <div className="absolute inset-y-0 left-0 w-3/5 bg-gradient-to-r from-[#070B0F] via-[#070B0F]/90 to-transparent pointer-events-none" />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070B0F] to-transparent pointer-events-none" />

        {/* Ambient cyan glow top-left */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.07, 0.14, 0.07] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-20 w-[36rem] h-[36rem] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)' }}
        />

        {/* Developer insignia — covers watermark area in bottom-right of video */}
        <motion.div
          animate={{ y: [-2, 2, -2], opacity: [0.55, 0.75, 0.55] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute pointer-events-none"
          style={{
            /* Shifted right to cover the Gemini watermark in the video.
               Reduced right value moves element toward right edge.
               bottom kept the same — vertical position was already correct. */
            bottom: 'clamp(2rem, 7vh, 5rem)',
            right:  'clamp(0.5rem, 2vw, 2rem)',
          }}
        >
          {/* Bleed halo — dark ring to blend with video background */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(7,11,15,0.85) 30%, rgba(7,11,15,0.5) 60%, transparent 80%)',
              transform: 'scale(1.6)',
            }}
          />
          <img
            src={watermarkImg}
            alt="Insignia"
            className="relative w-28 h-28 sm:w-32 sm:h-32 object-contain"
            style={{ filter: 'hue-rotate(185deg) saturate(0.4) brightness(0.55)' }}
          />
        </motion.div>

        {/* Grid lines overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,212,255,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* ── Content layer ─────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full px-6 sm:px-12 lg:px-16 pt-6 pb-8 pointer-events-none">

        {/* ── Navigation ──────────────────────────────────────────────────── */}
        <header className="relative flex items-center justify-between w-full pointer-events-auto">
          {/* Logo */}
          <a
            href="#"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="text-xs font-semibold tracking-[0.3em] uppercase text-[#00D4FF] hover:opacity-80 transition-opacity"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            AKD<span className="text-[#5A7A8A]">_</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-7 text-[10px] tracking-[0.28em] font-medium uppercase text-[#5A7A8A] absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative group py-1 transition-colors duration-300 hover:text-[#00D4FF]"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#00D4FF]/60 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right CTA + mobile toggle */}
          <div className="flex items-center gap-4">
            {/* System status badge */}
            <div
              className="hidden sm:flex items-center text-[9px] tracking-[0.2em] uppercase text-[#5A7A8A] px-2.5 py-1 border border-[#1A2A38] rounded-sm"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <StatusDot status={status} />
              {status === 'online' ? 'API ONLINE' : status === 'offline' ? 'API OFFLINE' : status.toUpperCase()}
            </div>

            <a
              href="#contact"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.22em] font-medium uppercase py-2 px-4 border border-[#1A2A38] hover:border-[#00D4FF]/50 text-[#A8BEC8] hover:text-[#00D4FF] transition-all duration-300"
            >
              <span>CONNECT</span>
              <span className="text-xs">↗</span>
            </a>

            {/* Mobile burger */}
            <button
              className="md:hidden text-[#5A7A8A] hover:text-[#00D4FF] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-5 space-y-1">
                <span className={`block h-px bg-current transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block h-px bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-px bg-current transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </header>

        {/* Mobile nav dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 left-0 right-0 z-40 bg-[#0C1219]/95 backdrop-blur-xl border-b border-[#1A2A38] px-6 py-4 pointer-events-auto md:hidden"
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-[11px] tracking-[0.28em] uppercase text-[#5A7A8A] hover:text-[#00D4FF] transition-colors border-b border-[#1A2A38] last:border-0"
              >
                {item.name}
              </a>
            ))}
          </motion.div>
        )}

        {/* ── Main hero content ────────────────────────────────────────────── */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between w-full my-auto">

          {/* Left: headline + CTAs */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl pointer-events-auto z-20"
          >
            {/* Pre-headline monoline */}
            <motion.div variants={fadeUpVariants} className="mb-4">
              <span
                className="text-[10px] font-medium tracking-[0.4em] uppercase text-[#00D4FF]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                <span className="text-[#5A7A8A]">// </span>
                AVAILABLE FOR OPPORTUNITIES
              </span>
            </motion.div>

            {/* Massive headline */}
            <motion.div variants={fadeUpVariants} className="mb-4 select-none">
              <h1
                className="text-[4.5rem] sm:text-[6rem] md:text-[7rem] lg:text-[8rem] xl:text-[9rem] tracking-tight uppercase leading-[0.82]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#C8DDE8] to-[#506070]">
                  AI/ML +
                </span>
                <span
                  className="block text-transparent bg-clip-text"
                  style={{
                    backgroundImage: 'linear-gradient(180deg, #00D4FF 0%, #0088CC 50%, #004466 100%)',
                    filter: 'drop-shadow(0 0 20px rgba(0,212,255,0.3))',
                  }}
                >
                  BACKEND
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#A8BEC8] via-[#6A8A9A] to-[#2A4050]">
                  ENGINEER.
                </span>
              </h1>
            </motion.div>

            {/* Sub-descriptor */}
            <motion.div variants={fadeUpVariants} className="mb-3">
              <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.3em] uppercase text-[#5A7A8A]">
                AYUSH KUMAR DUBEY
                <span className="text-[#00D4FF]/40 mx-2">//</span>
                FULL STACK · AI PIPELINES · FASTAPI · LLMs
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeUpVariants}
              className="text-xs sm:text-sm font-light text-[#5A7A8A] leading-[1.85] max-w-lg mb-8"
            >
              I build{' '}
              <span className="text-[#A8BEC8]">intelligent systems</span> and{' '}
              <span className="text-[#A8BEC8]">scalable APIs</span> — from NLP pipelines and
              LLM integrations to production FastAPI backends with real databases. Engineering
              that actually works.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUpVariants} className="flex flex-row flex-wrap items-center gap-4">
              <motion.a
                href="#work"
                whileHover={{ scale: 1.02 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative inline-flex items-center gap-3 px-6 py-3.5 bg-[#00D4FF] text-[#070B0F] text-[11px] font-semibold tracking-[0.22em] uppercase transition-all duration-300 hover:bg-[#00A8CC]"
                style={{ boxShadow: '0 0 30px rgba(0,212,255,0.25)' }}
              >
                <span>VIEW PROJECTS</span>
                <span className="text-xs">↗</span>
              </motion.a>

              <motion.a
                href="#terminal"
                whileHover={{ scale: 1.02 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#1A2A38] hover:border-[#00D4FF]/40 text-[#5A7A8A] hover:text-[#00D4FF] text-[11px] font-medium tracking-[0.22em] uppercase transition-all duration-300"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                <span className="text-[#00D4FF]/60">$</span>
                <span>RUN TERMINAL</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right: floating stats card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex flex-col gap-3 pointer-events-auto z-20 pr-16"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* API Status card */}
            <div
              className="border border-[#1A2A38] bg-[#0C1219]/80 backdrop-blur-xl p-4 w-56"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#5A7A8A]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  SYSTEM STATUS
                </span>
                <StatusDot status={status} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <span className="text-[#3A5A6A]">API</span>
                  <span className={status === 'online' ? 'text-[#00D4FF]' : 'text-[#EF4444]'}>
                    {status === 'online' ? 'OPERATIONAL' : status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <span className="text-[#3A5A6A]">DATABASE</span>
                  <span className={health?.database === 'connected' ? 'text-[#00D4FF]' : 'text-[#5A7A8A]'}>
                    {health?.database === 'connected' ? 'CONNECTED' : 'CHECKING...'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <span className="text-[#3A5A6A]">VERSION</span>
                  <span className="text-[#A8BEC8]">{health?.version ?? '---'}</span>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'DSA SOLVED', value: '200+' },
                { label: 'CGPA',        value: '8.71' },
                { label: 'PROJECTS',    value: '12+' },
                { label: 'INTERNSHIPS', value: '3+' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="border border-[#1A2A38] bg-[#0C1219]/60 p-3 text-center"
                >
                  <div
                    className="text-xl text-[#00D4FF] font-light leading-none mb-1"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[8px] tracking-[0.2em] uppercase text-[#3A5A6A]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom status bar */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-6 text-[9px] tracking-[0.25em] uppercase text-[#3A5A6A]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <span>PORTFOLIO // 2026</span>
            <span className="hidden sm:block">B.TECH CSE · MANGALMAY INSTITUTE</span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-[#3A5A6A]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <span>SCROLL</span>
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              ↓
            </motion.span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
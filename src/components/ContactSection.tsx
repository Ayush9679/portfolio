import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { api, type MessageRecord } from '../services/api';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export const ContactSection: React.FC = () => {
  const [sender, setSender] = useState('');
  const [channel, setChannel] = useState('');
  const [payload, setPayload] = useState('');

  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [lastSubmission, setLastSubmission] = useState<MessageRecord | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sender.trim()) {
      setFormState('error');
      setErrorMsg('SENDER NAME IS REQUIRED');
      return;
    }
    if (!channel.trim()) {
      setFormState('error');
      setErrorMsg('CONTACT CHANNEL / EMAIL IS REQUIRED');
      return;
    }
    if (!payload.trim() || payload.trim().length < 5) {
      setFormState('error');
      setErrorMsg('PAYLOAD REQUIRED (MINIMUM 5 CHARACTERS)');
      return;
    }

    setFormState('loading');
    setErrorMsg('');

    try {
      const res = await api.sendMessage({
        sender: sender.trim(),
        channel: channel.trim(),
        payload: payload.trim(),
      });

      setLastSubmission(res.data);
      setFormState('success');
      setSender('');
      setChannel('');
      setPayload('');
    } catch (err: unknown) {
      setFormState('error');
      setErrorMsg(
        err instanceof Error
          ? err.message.toUpperCase()
          : 'TRANSMISSION FAILED: UNABLE TO REACH BACKEND'
      );
    }
  };

  return (
    <footer
      id="contact"
      className="relative w-full bg-[#070B0F] text-[#E8F4F8] pt-16 pb-16 px-6 sm:px-12 lg:px-20 overflow-hidden"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* Background ambient lighting */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60rem] h-[20rem] pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.04) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left: heading + system links */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-10">
            <div>
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-4 mb-5"
              >
                <span
                  className="text-[10px] font-medium tracking-[0.4em] uppercase text-[#00D4FF]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <span className="text-[#2A4A5A]">05 //</span> CONTACT & DISPATCH
                </span>
                <div className="w-12 h-px bg-gradient-to-r from-[#00D4FF]/60 to-transparent" />
              </motion.div>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-6"
              >
                <h2
                  className="text-5xl sm:text-6xl md:text-7xl tracking-tight uppercase leading-[0.85] select-none"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#C8DDE8] to-[#506070]">
                    INITIALIZE
                  </span>
                  <span
                    className="block text-transparent bg-clip-text"
                    style={{ backgroundImage: 'linear-gradient(180deg, #00D4FF 0%, #0088CC 60%, #003A55 100%)' }}
                  >
                    TRANSMISSION.
                  </span>
                </h2>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-xs sm:text-[13px] font-light text-[#4A6A7A] leading-relaxed max-w-sm mb-8"
              >
                Have an ambitious system to architect, an engineering opportunity, or a collaborative inquiry?
                Send a direct dispatch — validated via FastAPI, persisted in SQLite.
              </motion.p>

              {/* System Navigation Links */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="space-y-2.5"
              >
                {[
                  { label: 'GITHUB', href: 'https://github.com/AyushKumarDubey', marker: '↗' },
                  { label: 'LINKEDIN', href: 'https://linkedin.com/in/ayushkumardubey', marker: '↗' },
                  { label: 'ADMIN CONSOLE', href: '/admin', marker: '→' },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3 border border-[#1A2A38] bg-[#0C1219]/60 hover:border-[#00D4FF]/40 text-[#4A6A7A] hover:text-[#00D4FF] transition-all duration-300 group"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    <span className="text-[10px] tracking-[0.25em] uppercase font-medium">{link.label}</span>
                    <span className="text-xs text-[#2A4A5A] group-hover:text-[#00D4FF] group-hover:translate-x-0.5 transition-all duration-200">
                      {link.marker}
                    </span>
                  </a>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Right: Technical Dispatch Form */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 relative w-full border border-[#1A2A38] bg-[#0C1219] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Top border glow */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D4FF]/50 to-transparent" />

            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#00D4FF]/40" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#00D4FF]/40" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#00D4FF]/40" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#00D4FF]/40" />

            {/* Terminal Header Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#1A2A38] bg-[#070B0F]">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] shadow-[0_0_6px_rgba(0,212,255,0.6)]" />
                <span
                  className="text-[9px] tracking-[0.3em] uppercase text-[#4A6A7A] font-semibold"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  DISPATCH.TERMINAL — SQLITE.STREAM
                </span>
              </div>
              <span
                className="text-[8px] font-mono tracking-widest text-[#2A4A5A] uppercase border border-[#1A2A38] px-1.5 py-0.5"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                FASTAPI // POST
              </span>
            </div>

            <div className="p-8 sm:p-10">
              {formState === 'success' && lastSubmission ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center space-y-4"
                >
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 border text-base mx-auto"
                    style={{ borderColor: '#00D4FF40', color: '#00D4FF' }}
                  >
                    //
                  </div>
                  <h3
                    className="text-3xl text-white font-normal uppercase"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    MESSAGE STORED
                  </h3>

                  <div
                    className="p-4 border border-[#1A2A38] bg-[#070B0F] text-left max-w-md mx-auto space-y-2"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    <div className="flex justify-between text-[10px]">
                      <span className="text-[#3A5A6A]">RECORD ID:</span>
                      <span className="text-[#00D4FF] font-semibold">
                        #{String(lastSubmission.id).padStart(5, '0')}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-[#3A5A6A]">STATUS:</span>
                      <span className="text-[#10B981] uppercase">{lastSubmission.status}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-[#3A5A6A]">TIMESTAMP:</span>
                      <span className="text-[#A8BEC8]">
                        {new Date(lastSubmission.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <p
                    className="text-xs text-[#5A7A8A]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Transmission registered directly to SQLite database.
                  </p>

                  <button
                    onClick={() => {
                      setFormState('idle');
                      setLastSubmission(null);
                    }}
                    className="text-[10px] tracking-[0.25em] uppercase text-[#00D4FF]/70 hover:text-[#00D4FF] border border-[#1A2A38] hover:border-[#00D4FF]/40 px-4 py-2 mt-4 inline-block transition-colors"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    [ EXECUTE ANOTHER DISPATCH ]
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Terminal instruction */}
                  <div className="mb-4">
                    <p
                      className="text-[9px] tracking-[0.3em] uppercase text-[#2A4A5A]"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      $ dispatch --execute POST /api/messages
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="dispatch-sender"
                        className="block text-[9px] tracking-[0.25em] uppercase text-[#2A4A5A] mb-2"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        --sender
                      </label>
                      <input
                        id="dispatch-sender"
                        type="text"
                        required
                        value={sender}
                        onChange={(e) => {
                          setSender(e.target.value);
                          if (formState === 'error') setFormState('idle');
                        }}
                        placeholder="Ayush Dubey"
                        className="w-full bg-[#070B0F] border border-[#1A2A38] focus:border-[#00D4FF]/60 text-xs text-[#E8F4F8] placeholder-[#2A4A5A] px-4 py-3 outline-none transition-colors"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="dispatch-channel"
                        className="block text-[9px] tracking-[0.25em] uppercase text-[#2A4A5A] mb-2"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        --channel
                      </label>
                      <input
                        id="dispatch-channel"
                        type="text"
                        required
                        value={channel}
                        onChange={(e) => {
                          setChannel(e.target.value);
                          if (formState === 'error') setFormState('idle');
                        }}
                        placeholder="email / contact info"
                        className="w-full bg-[#070B0F] border border-[#1A2A38] focus:border-[#00D4FF]/60 text-xs text-[#E8F4F8] placeholder-[#2A4A5A] px-4 py-3 outline-none transition-colors"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="dispatch-payload"
                      className="block text-[9px] tracking-[0.25em] uppercase text-[#2A4A5A] mb-2"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      --payload
                    </label>
                    <textarea
                      id="dispatch-payload"
                      required
                      rows={5}
                      value={payload}
                      onChange={(e) => {
                        setPayload(e.target.value);
                        if (formState === 'error') setFormState('idle');
                      }}
                      placeholder="Enter transmission payload / project details..."
                      className="w-full bg-[#070B0F] border border-[#1A2A38] focus:border-[#00D4FF]/60 text-xs text-[#E8F4F8] placeholder-[#2A4A5A] p-4 outline-none resize-none transition-colors"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    />
                  </div>

                  {/* Error display with technical marker */}
                  {formState === 'error' && (
                    <div
                      className="p-3 border border-red-500/30 bg-red-500/10 text-[10px] text-red-400 flex items-start gap-2"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      <span className="font-mono font-bold text-red-400">[!]</span>
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    id="dispatch-submit-btn"
                    disabled={formState === 'loading'}
                    className="w-full py-3.5 border transition-all duration-300 text-[10px] font-semibold tracking-[0.28em] uppercase flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      borderColor: formState === 'loading' ? '#1A2A38' : '#00D4FF',
                      backgroundColor: formState === 'loading' ? 'transparent' : 'rgba(0,212,255,0.08)',
                      color: formState === 'loading' ? '#3A5A6A' : '#00D4FF',
                    }}
                  >
                    {formState === 'loading' ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="inline-block"
                        >
                          //
                        </motion.span>
                        <span>[ DISPATCHING... ]</span>
                      </>
                    ) : (
                      <>
                        <span>EXECUTE DISPATCH</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* Footer info line */}
        <div className="pt-16 mt-16 border-t border-[#1A2A38] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span
            className="text-[9px] tracking-widest text-[#2A4A5A] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            PORTFOLIO // EDITION 2026
          </span>
          <span
            className="text-[9px] text-[#2A4A5A]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            © {new Date().getFullYear()} AYUSH KUMAR DUBEY · ENGINEERED WITH PRECISION
          </span>
        </div>
      </div>
    </footer>
  );
};

export default ContactSection;
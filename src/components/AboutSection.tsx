import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import type { Variants } from 'framer-motion';
import aboutImg from '../assets/about.png';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
};

const interests = [
  'LLM INTEGRATION',
  'AI PIPELINES',
  'FASTAPI ARCHITECTURE',
  'NLP SYSTEMS',
  'BACKEND ENGINEERING',
  'DATA SCIENCE',
  'AUTOMATION WORKFLOWS',
  'SYSTEM DESIGN',
];

const engineeringPillars = [
  {
    code: '01',
    label: 'FAST ITERATION',
    desc: 'Rapid prototyping and production-focused implementation',
  },
  {
    code: '02',
    label: 'AI-FIRST SYSTEMS',
    desc: 'Integrating intelligence into real-world software systems',
  },
  {
    code: '03',
    label: 'CLEAN ARCHITECTURE',
    desc: 'Layered, maintainable backend and application design',
  },
  {
    code: '04',
    label: 'DATA → INTELLIGENCE',
    desc: 'Building pipelines from raw data to deployed ML systems',
  },
];

const metrics = [
  { value: '200+', label: 'DSA PROBLEMS SOLVED', accent: false },
  { value: '8.71', label: 'B.TECH CGPA', accent: true },
  { value: '12+',  label: 'PROJECTS BUILT', accent: false },
  { value: '3+',   label: 'INDUSTRY-CERTIFIED INTERNSHIPS', accent: true },
];

export const AboutSection: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isCardHovered, setIsCardHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightX = useMotionValue(200);
  const spotlightY = useMotionValue(200);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { damping: 20, stiffness: 240 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { damping: 20, stiffness: 240 });

  const spotlightBg = useTransform(
    [spotlightX, spotlightY],
    ([x, y]) =>
      `radial-gradient(circle 220px at ${x}px ${y}px, rgba(0,212,255,0.12), rgba(0,100,150,0.06), transparent 75%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    spotlightX.set(e.clientX - rect.left);
    spotlightY.set(e.clientY - rect.top);
  };

  return (
    <section
      id="about"
      className="relative w-screen min-h-screen bg-[#070B0F] text-[#E8F4F8] py-24 lg:py-32 px-6 sm:px-12 lg:px-20 overflow-hidden flex items-center"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* Ambient glows */}
      <motion.div
        animate={{ scale: [1, 1.18, 1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/6 w-[34rem] h-[34rem] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">

        {/* Section eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4 mb-12"
        >
          <span
            className="text-[10px] font-medium tracking-[0.4em] uppercase text-[#00D4FF]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span className="text-[#2A4A5A]">01 //</span> ABOUT ME
          </span>
          <div className="w-16 h-px bg-gradient-to-r from-[#00D4FF]/60 to-transparent" />
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left: content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-7 flex flex-col"
          >
            {/* Headline */}
            <motion.div variants={fadeUpVariants} className="mb-7 select-none">
              <h2
                className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] tracking-tight uppercase leading-[0.87]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#C8DDE8] to-[#506070]">
                  I DON'T JUST WRITE
                </span>
                <span
                  className="block text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(180deg, #00D4FF 0%, #0088CC 60%, #003A55 100%)' }}
                >
                  CODE.
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#A8BEC8] to-[#384850]">
                  I BUILD SYSTEMS.
                </span>
              </h2>
            </motion.div>

            {/* Bio */}
            <motion.p
              variants={fadeUpVariants}
              className="text-sm md:text-[14.5px] font-light text-[#6A8A9A] leading-[1.9] mb-8 max-w-xl"
            >
              I'm{' '}
              <span className="text-[#E8F4F8] font-medium">Ayush Kumar Dubey</span>, a Computer Science student specializing in Machine Learning and Backend Engineering. I build{' '}
              <span className="text-[#A8BEC8]">AI-powered applications</span>, scalable{' '}
              <span className="text-[#A8BEC8]">REST APIs</span>, and real production systems — not just projects.
              Currently pursuing B.Tech at Mangalmay Institute with an{' '}
              <span className="text-[#00D4FF] font-medium">8.71 CGPA</span>, interning across industry organizations, and engineering
              data-driven software solutions.
            </motion.p>

            {/* Interests — horizontal tags */}
            <motion.div variants={fadeUpVariants} className="mb-8">
              <p
                className="text-[9px] tracking-[0.35em] uppercase text-[#2A4A5A] mb-3"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                // ENGINEERING INTERESTS
              </p>
              <div className="flex flex-wrap gap-2">
                {interests.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-[9.5px] font-medium tracking-[0.14em] uppercase border border-[#1A2A38] bg-[#0C1219] text-[#6A8A9A] hover:border-[#00D4FF]/40 hover:text-[#00D4FF] hover:bg-[#00D4FF]/5 transition-all duration-300 cursor-default"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Engineering Pillars cards without emojis */}
            <motion.div variants={fadeUpVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-10">
              {engineeringPillars.map((p) => (
                <div
                  key={p.label}
                  className="p-4 border border-[#1A2A38] bg-[#0C1219]/70 hover:border-[#00D4FF]/40 hover:bg-[#0C1219] transition-all duration-300 group relative"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[10.5px] font-semibold tracking-[0.2em] uppercase text-[#E8F4F8] group-hover:text-[#00D4FF] transition-colors"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {p.label}
                    </span>
                    <span
                      className="text-[8.5px] font-mono text-[#00D4FF]/60 px-1.5 py-0.5 border border-[#00D4FF]/20 group-hover:border-[#00D4FF]/40 group-hover:text-[#00D4FF] transition-colors"
                    >
                      // {p.code}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-[#4A6A7A] leading-relaxed group-hover:text-[#8BA8B8] transition-colors font-light">
                    {p.desc}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Stats row with refined professional metrics */}
            <motion.div
              variants={fadeUpVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-[#1A2A38]"
            >
              {metrics.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span
                    className={`text-3xl sm:text-4xl font-light tracking-tight leading-none mb-1.5 ${stat.accent ? 'text-[#00D4FF]' : 'text-[#E8F4F8]'}`}
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-[8.5px] font-medium tracking-[0.2em] uppercase text-[#3A5A6A] leading-tight"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: 3D portrait card */}
          <div className="lg:col-span-5 flex items-center justify-center relative" style={{ perspective: '1400px' }}>

            {/* Ambient glow ring */}
            <motion.div
              animate={{
                scale: isCardHovered ? 1.12 : 1,
                opacity: isCardHovered ? 0.3 : 0.1,
              }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
              className="absolute -inset-6 rounded-sm pointer-events-none"
              style={{ background: 'conic-gradient(from 0deg, rgba(0,212,255,0.4) 0%, rgba(124,58,237,0.2) 40%, transparent 60%, rgba(0,212,255,0.4) 100%)', filter: 'blur(20px)' }}
            />

            {/* Cyan spark on hover */}
            {isCardHovered && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: [0, 1, 0], y: -50, x: -20 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute top-1/4 -left-4 w-1 h-1 bg-[#00D4FF] rounded-full pointer-events-none z-30"
                  style={{ boxShadow: '0 0 8px #00D4FF' }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: [0, 1, 0], y: -55, x: 30 }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
                  className="absolute bottom-1/3 -right-4 w-1.5 h-1.5 bg-[#7C3AED] rounded-full pointer-events-none z-30"
                  style={{ boxShadow: '0 0 8px #7C3AED' }}
                />
              </>
            )}

            {/* 3D card */}
            <motion.div
              ref={cardRef}
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsCardHovered(true)}
              onMouseLeave={() => {
                setIsCardHovered(false);
                mouseX.set(0);
                mouseY.set(0);
              }}
              initial={{ opacity: 0, scale: 0.92, y: 25 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-3 border border-[#1A2A38] rounded-sm bg-[#0C1219]/80 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] cursor-pointer group hover:border-[#00D4FF]/40 transition-colors duration-500"
            >
              {/* Laser sweep */}
              <div className="absolute inset-0 rounded-sm overflow-hidden pointer-events-none">
                <motion.div
                  animate={{ x: isCardHovered ? ['-100%', '200%'] : '-100%' }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                  className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#00D4FF]/15 to-transparent skew-x-12"
                />
              </div>

              {/* Corner brackets — cyan */}
              <div className="pointer-events-none">
                <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-[#00D4FF]/60 group-hover:border-[#00D4FF] transition-colors" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-[#00D4FF]/60 group-hover:border-[#00D4FF] transition-colors" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-[#00D4FF]/60 group-hover:border-[#00D4FF] transition-colors" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-[#00D4FF]/60 group-hover:border-[#00D4FF] transition-colors" />
              </div>

              {/* Portrait — full color, no filters */}
              <div className="relative overflow-hidden w-full max-w-[360px] aspect-[4/5] bg-[#070B0F] rounded-sm">
                <img
                  src={aboutImg}
                  alt="Ayush Kumar Dubey"
                  className="w-full h-full object-cover object-top"
                />
                {/* Mouse spotlight (blend mode: overlay only — no colour shift) */}
                <motion.div
                  className="absolute inset-0 pointer-events-none mix-blend-overlay"
                  style={{ background: spotlightBg, opacity: isCardHovered ? 0.6 : 0, transition: 'opacity 0.3s' }}
                />
                {/* Bottom vignette for signature legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C1219]/60 via-transparent to-transparent pointer-events-none" />

                {/* Signature */}
                <div className="absolute bottom-4 right-4 z-20 select-none">
                  <span
                    className="text-2xl text-[#00D4FF]/70 group-hover:text-[#00D4FF] transition-colors duration-300"
                    style={{ fontFamily: "'Herr Von Muellerhoff', cursive" }}
                  >
                    Ayush
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
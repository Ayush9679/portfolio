import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface JourneyStop {
  id: string;
  year: string;
  type: 'work' | 'education';
  title: string;
  organization: string;
  location: string;
  tech: string[];
  description: string;
  highlights: string[];
}

const journey: JourneyStop[] = [
  {
    id: '01',
    year: 'JUN 2026 – PRESENT',
    type: 'work',
    title: 'AI / ML INTERN',
    organization: 'WebMobril Technologies Pvt. Ltd.',
    location: 'India',
    tech: ['Python', 'scikit-learn', 'NLP', 'FastAPI', 'Data Pipelines'],
    description:
      'Working on machine learning and AI workflows involving data processing, model development, NLP, and practical AI application engineering.',
    highlights: [
      'Developed and integrated ML models into production AI pipelines',
      'Applied NLP techniques for text classification and entity recognition',
      'Collaborated on API integration for intelligent automation workflows',
    ],
  },
  {
    id: '02',
    year: 'OCT – DEC 2025',
    type: 'work',
    title: 'GENERATIVE AI INTERN',
    organization: 'IBM',
    location: 'Remote',
    tech: ['Generative AI', 'LLMs', 'Prompt Engineering', 'AI APIs', 'Python'],
    description:
      'Explored Generative AI, large language models, prompt engineering, and AI application development through IBM\'s structured training program.',
    highlights: [
      'Gained hands-on experience with LLM integration and AI APIs',
      'Built prompt-engineered workflows for real business use cases',
      'Studied enterprise AI deployment patterns and responsible AI principles',
    ],
  },
  {
    id: '03',
    year: 'JUN – JUL 2024',
    type: 'work',
    title: 'C++ / SOFTWARE DEVELOPMENT INTERN',
    organization: 'MCN Solutions Pvt. Ltd.',
    location: 'India',
    tech: ['C++', 'OOP', 'Data Structures', 'Algorithms', 'Problem Solving'],
    description:
      'Worked on C++ programming, object-oriented design, and algorithm development, building a strong systems programming foundation.',
    highlights: [
      'Implemented data structure and algorithm solutions in C++',
      'Practiced OOP design patterns and clean software architecture',
      'Strengthened low-level programming and performance optimization skills',
    ],
  },
  {
    id: '04',
    year: '2023 – 2027',
    type: 'education',
    title: 'B.TECH IN COMPUTER SCIENCE & ENGINEERING',
    organization: 'Mangalmay Institute of Engineering and Technology',
    location: 'Greater Noida, India',
    tech: ['Machine Learning', 'System Design', 'Algorithms', 'DBMS', 'OS', 'Networks'],
    description:
      'Specializing in Machine Learning and System Design. Maintaining an 8.71 CGPA while solving 200+ algorithm challenges across competitive platforms.',
    highlights: [
      '8.71 CGPA — consistently top-performing student',
      '200+ problems solved on LeetCode, CodeChef, GeeksforGeeks',
      'Coursework: ML, DBMS, OS, CN, System Design, Algorithms',
    ],
  },
];

const typeConfig = {
  work:      { color: '#00D4FF', label: 'WORK' },
  education: { color: '#7C3AED', label: 'EDU' },
};

export const ExperienceSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 85%'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative w-full bg-[#070B0F] text-[#E8F4F8] pt-4 pb-24 px-6 sm:px-12 lg:px-20 overflow-hidden"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* Subtle center glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.025) 0%, transparent 70%)' }}
      />

      <div className="max-w-4xl mx-auto w-full relative z-10">

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
            <span className="text-[#2A4A5A]">04 //</span> EXPERIENCE
          </span>
          <div className="w-16 h-px bg-gradient-to-r from-[#00D4FF]/60 to-transparent" />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <h2
            className="text-5xl sm:text-6xl md:text-7xl tracking-tight uppercase leading-[0.85] select-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#C8DDE8] to-[#506070]">
              EXPERIENCE &
            </span>
            <span
              className="block text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(180deg, #00D4FF 0%, #0088CC 60%, #003A55 100%)' }}
            >
              MILESTONES.
            </span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative w-full">

          {/* Background track */}
          <div className="absolute left-[19px] md:left-[148px] top-4 bottom-8 w-px bg-[#1A2A38]" />

          {/* Animated cyan track */}
          <motion.div
            className="absolute left-[19px] md:left-[148px] top-4 w-[2px] origin-top"
            style={{
              height: lineHeight,
              background: 'linear-gradient(to bottom, #00D4FF, rgba(0,212,255,0.3), transparent)',
              boxShadow: '0 0 8px rgba(0,212,255,0.4)',
            }}
          />

          <div className="space-y-10">
            {journey.map((stop, idx) => {
              const isExpanded = expandedId === stop.id;
              const config = typeConfig[stop.type];

              return (
                <motion.div
                  key={stop.id}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.7, delay: idx * 0.08 }}
                  className="relative flex flex-col md:flex-row items-start group"
                >
                  {/* Desktop year (left of track) */}
                  <div className="hidden md:flex flex-col items-end w-[148px] shrink-0 pr-8 pt-1 gap-1">
                    <span
                      className="text-[9px] font-medium tracking-[0.2em] text-[#2A4A5A] group-hover:text-[#00D4FF] transition-colors text-right"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {stop.year}
                    </span>
                    <span
                      className="text-[8px] tracking-[0.2em] uppercase px-1.5 py-0.5 border"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: config.color,
                        borderColor: `${config.color}30`,
                      }}
                    >
                      {config.label}
                    </span>
                  </div>

                  {/* Route node */}
                  <div className="absolute left-[19px] md:left-[148px] top-2 -translate-x-1/2 flex items-center justify-center">
                    <div
                      className="absolute w-7 h-7 rounded-full border opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500"
                      style={{ borderColor: `${config.color}30` }}
                    />
                    <div
                      className="w-3 h-3 rounded-full border-2 transition-all duration-300 group-hover:shadow-[0_0_12px_currentColor]"
                      style={{
                        backgroundColor: isExpanded ? config.color : '#070B0F',
                        borderColor: isExpanded ? config.color : '#2A4A5A',
                        color: config.color,
                        ...(isExpanded && { boxShadow: `0 0 10px ${config.color}` }),
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="ml-14 md:ml-10 pl-2 flex-1">
                    {/* Mobile year */}
                    <div className="md:hidden mb-1.5 flex items-center gap-2">
                      <span
                        className="text-[9px] tracking-[0.2em] text-[#00D4FF]"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {stop.year}
                      </span>
                      <span
                        className="text-[8px] tracking-[0.15em] uppercase px-1 py-0.5 border"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color: config.color,
                          borderColor: `${config.color}40`,
                        }}
                      >
                        {config.label}
                      </span>
                    </div>

                    <h3
                      className="text-3xl sm:text-4xl tracking-wide text-white group-hover:text-[#E8F4F8] transition-colors mb-1 leading-none"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      {stop.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#2A4A5A] group-hover:text-[#3A6A7A] transition-colors"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {stop.organization}
                      </span>
                      <span className="text-[#1A2A38]">·</span>
                      <span
                        className="text-[9.5px] text-[#1E3547]"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {stop.location}
                      </span>
                    </div>

                    <p className="text-xs sm:text-[13px] font-light text-[#3A5A6A] leading-[1.75] max-w-lg group-hover:text-[#5A7A8A] transition-colors mb-3">
                      {stop.description}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {stop.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-1 text-[8.5px] tracking-[0.14em] uppercase border border-[#1A2A38] text-[#2A4A5A] group-hover:border-[#00D4FF]/20 group-hover:text-[#3A6A7A] transition-all duration-300"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Expand toggle */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : stop.id)}
                      className="text-[9px] tracking-[0.25em] uppercase transition-colors flex items-center gap-1.5"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: isExpanded ? config.color : '#2A4A5A',
                      }}
                    >
                      <span>{isExpanded ? '[ COLLAPSE ]' : '[ EXPAND DETAILS ]'}</span>
                    </button>

                    {/* Expanded highlights */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-2 border-l-2 pl-4"
                        style={{ borderColor: `${config.color}30` }}
                      >
                        {stop.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-[#00D4FF]/40 text-xs mt-0.5">▸</span>
                            <p
                              className="text-[11.5px] text-[#4A6A7A] leading-relaxed"
                              style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                              {h}
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
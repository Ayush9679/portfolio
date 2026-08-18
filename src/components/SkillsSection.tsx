import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface SkillItem {
  name: string;
  level: 'Expert' | 'Proficient' | 'Familiar';
}

interface SkillCategory {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  items: SkillItem[];
  colSpan: string;
}

const levelColors: Record<string, string> = {
  Expert:     '#00D4FF',
  Proficient: '#8B5CF6',
  Familiar:   '#4A6A7A',
};

const skillCategories: SkillCategory[] = [
  {
    id: 'ai-ml',
    title: 'AI / MACHINE LEARNING',
    badge: 'INTELLIGENCE',
    tagline: 'FROM MODELS TO DEPLOYED AI PIPELINES',
    description:
      'Building NLP, transformer and LLM-powered systems and integrating ML capabilities into production-oriented applications.',
    items: [
      { name: 'Python',         level: 'Expert' },
      { name: 'scikit-learn',   level: 'Expert' },
      { name: 'NumPy / Pandas', level: 'Expert' },
      { name: 'Transformers',   level: 'Proficient' },
      { name: 'NLP / NER',      level: 'Proficient' },
      { name: 'LLM APIs',       level: 'Proficient' },
      { name: 'Generative AI',  level: 'Proficient' },
      { name: 'Hugging Face',   level: 'Proficient' },
      { name: 'PyTorch',        level: 'Familiar' },
      { name: 'TensorFlow',     level: 'Familiar' },
      { name: 'OpenCV',         level: 'Familiar' },
    ],
    colSpan: 'lg:col-span-7',
  },
  {
    id: 'backend',
    title: 'BACKEND ENGINEERING',
    badge: 'CORE PILLAR',
    tagline: 'CLEAN APIS. REAL DATABASES. SOLID AUTH.',
    description:
      'Designing REST APIs, validation layers, database-backed services and authentication systems using FastAPI and Python.',
    items: [
      { name: 'FastAPI',            level: 'Expert' },
      { name: 'Pydantic',           level: 'Expert' },
      { name: 'SQLAlchemy',         level: 'Expert' },
      { name: 'REST APIs',          level: 'Expert' },
      { name: 'SQLite',             level: 'Proficient' },
      { name: 'PostgreSQL',         level: 'Proficient' },
      { name: 'JWT Authentication', level: 'Proficient' },
      { name: 'Node.js',            level: 'Proficient' },
    ],
    colSpan: 'lg:col-span-5',
  },
  {
    id: 'fullstack',
    title: 'FULL STACK / WEB',
    badge: 'END-TO-END',
    tagline: 'FRONTEND TO BACKEND, SHIPPED TO PRODUCTION',
    description:
      'Building responsive web applications with clean frontend/backend integration and API-driven architecture.',
    items: [
      { name: 'HTML / CSS',            level: 'Expert' },
      { name: 'React',                 level: 'Proficient' },
      { name: 'TypeScript',            level: 'Proficient' },
      { name: 'JavaScript',            level: 'Proficient' },
      { name: 'Tailwind CSS',          level: 'Proficient' },
      { name: 'REST API Integration',  level: 'Proficient' },
      { name: 'Responsive UI',         level: 'Proficient' },
      { name: 'Vite',                  level: 'Proficient' },
    ],
    colSpan: 'lg:col-span-5',
  },
  {
    id: 'devops',
    title: 'DEVOPS / AUTOMATION',
    badge: 'INFRASTRUCTURE',
    tagline: 'DEPLOY. AUTOMATE. INTEGRATE.',
    description:
      'Containerized deployments, workflow automation, webhooks and API integrations that reduce manual engineering work.',
    items: [
      { name: 'Git / GitHub',   level: 'Expert' },
      { name: 'API Integration', level: 'Expert' },
      { name: 'Docker',         level: 'Proficient' },
      { name: 'n8n Workflows',  level: 'Proficient' },
      { name: 'Webhooks',       level: 'Proficient' },
      { name: 'CI/CD',          level: 'Proficient' },
      { name: 'Linux',          level: 'Proficient' },
      { name: 'Deployment',     level: 'Proficient' },
    ],
    colSpan: 'lg:col-span-7',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

export const SkillsSection: React.FC = () => {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  return (
    <section
      id="skills"
      className="relative w-screen bg-[#070B0F] text-[#E8F4F8] pt-8 pb-24 px-6 sm:px-12 lg:px-20 overflow-hidden"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* Ambient glow backgrounds */}
      <div
        className="absolute top-1/3 left-1/4 w-[32rem] h-[32rem] rounded-full pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] rounded-full pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">

        {/* Section Eyebrow */}
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
            <span className="text-[#2A4A5A]">03 //</span> TECH MATRIX
          </span>
          <div className="w-16 h-px bg-gradient-to-r from-[#00D4FF]/60 to-transparent" />
        </motion.div>

        {/* Section Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <h2
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] tracking-tight uppercase leading-[0.85] select-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#C8DDE8] to-[#506070]">
              ARCHITECTURAL
            </span>
            <span
              className="block text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(180deg, #00D4FF 0%, #0088CC 60%, #003A55 100%)' }}
            >
              MASTERY.
            </span>
          </h2>
        </motion.div>

        {/* Skill level legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center gap-6 mb-8"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {(['Expert', 'Proficient', 'Familiar'] as const).map((level) => (
            <div key={level} className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: levelColors[level],
                  boxShadow: level === 'Expert' ? '0 0 6px rgba(0,212,255,0.6)' : 'none',
                }}
              />
              <span className="text-[9px] tracking-[0.2em] uppercase text-[#4A6A7A]">{level}</span>
            </div>
          ))}
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-5"
        >
          {skillCategories.map((block) => (
            <motion.div
              key={block.id}
              variants={cardVariants}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={`${block.colSpan} relative p-7 sm:p-8 rounded-none border border-[#1A2A38] bg-[#0C1219] overflow-hidden transition-all duration-300 hover:border-[#00D4FF]/40 hover:shadow-[0_12px_40px_rgba(0,212,255,0.04)] cursor-default group`}
            >
              {/* Top border glow on hover */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D4FF]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#00D4FF]/30 group-hover:border-[#00D4FF]/70 transition-colors" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#00D4FF]/30 group-hover:border-[#00D4FF]/70 transition-colors" />

              {/* Header: Technical Label & Dynamic Skill Count */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] shadow-[0_0_6px_rgba(0,212,255,0.6)]" />
                  <span
                    className="text-[9.5px] font-semibold tracking-[0.3em] uppercase text-[#00D4FF]/80 group-hover:text-[#00D4FF] transition-colors"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {block.badge}
                  </span>
                </div>
                <span
                  className="text-[8.5px] px-2 py-0.5 border border-[#1A2A38] text-[#4A6A7A] group-hover:border-[#00D4FF]/30 group-hover:text-[#A8BEC8] transition-all font-mono"
                >
                  {block.items.length} SKILLS
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-2xl sm:text-3xl font-normal tracking-wide text-white mb-1.5 group-hover:text-[#E8F4F8] transition-colors uppercase"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {block.title}
              </h3>

              {/* Tagline */}
              <p
                className="text-[9.5px] tracking-[0.2em] uppercase text-[#3A5A6A] mb-3 group-hover:text-[#5A7A8A] transition-colors font-medium"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                // {block.tagline}
              </p>

              {/* Technical Description */}
              <p className="text-xs text-[#5A7A8A] font-light leading-relaxed mb-6 max-w-xl group-hover:text-[#8BA8B8] transition-colors">
                {block.description}
              </p>

              {/* Skill Badges with Level Indicators */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-[#1A2A38]">
                {block.items.map((skill) => {
                  const isHovered = hoveredTag === skill.name;
                  const color = levelColors[skill.level];

                  return (
                    <span
                      key={skill.name}
                      onMouseEnter={() => setHoveredTag(skill.name)}
                      onMouseLeave={() => setHoveredTag(null)}
                      className="relative px-3 py-1.5 text-[9.5px] font-medium tracking-[0.14em] uppercase border transition-all duration-200 cursor-default"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        borderColor: isHovered ? color : '#1A2A38',
                        color: isHovered ? color : '#6A8A9A',
                        backgroundColor: isHovered ? `${color}10` : '#070B0F',
                        boxShadow: isHovered ? `0 0 10px ${color}20` : 'none',
                      }}
                    >
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                        style={{ backgroundColor: color }}
                      />
                      {skill.name}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default SkillsSection;
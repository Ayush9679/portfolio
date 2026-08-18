import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

interface Project {
  number: string;
  title: string;
  category: string;
  categoryTag: 'AI/ML' | 'Backend' | 'Full Stack' | 'Automation';
  description: string;
  problem: string;
  githubUrl: string;
  liveUrl?: string;
  tech: string[];
  metrics: { label: string; value: string }[];
  status: 'Production' | 'Active' | 'Archived';
}

const projects: Project[] = [
  {
    number: '01',
    title: 'CyberGuard AI',
    category: 'AI / CYBER-SECURITY PLATFORM',
    categoryTag: 'AI/ML',
    description:
      'AI-powered cybersecurity intelligence platform engineered for automated phishing detection, URL and email threat analysis, identity intelligence, and evidence-based risk assessment. Combines NLP models, threat intelligence, and Generative AI to identify, analyze, and explain cyber threats in real time.',
    problem: 'Security analysts manually reviewing thousands of threats — too slow, error-prone, and unscalable.',
    githubUrl: 'https://github.com/AyushKumarDubey',
    tech: ['React.js', 'Python', 'FastAPI', 'DeBERTa-v3', 'GROQ LLM', 'PostgreSQL', 'Docker', 'JWT', 'TypeScript'],
    metrics: [
      { label: 'PLATFORMS', value: 'Web · Desktop' },
      { label: 'AI ENGINE', value: 'DeBERTa + LLM' },
      { label: 'PIPELINE', value: 'Detect → Analyze → Report' },
    ],
    status: 'Active',
  },
  {
    number: '02',
    title: 'Release Risk Heatmap',
    category: 'ML / DEV PLATFORM',
    categoryTag: 'AI/ML',
    description:
      'Full-stack predictive release management platform using Machine Learning. Implements a trained Random Forest classifier to categorize release stability from Low to Critical risk, rendered over a live interactive team heatmap.',
    problem: 'Engineering teams deploying without knowing the statistical risk of their release — causing avoidable incidents.',
    githubUrl: 'https://github.com/AyushKumarDubey',
    tech: ['React.js', 'TypeScript', 'Python', 'FastAPI', 'scikit-learn', 'PostgreSQL', 'Tailwind CSS', 'JWT'],
    metrics: [
      { label: 'MODEL', value: 'Random Forest' },
      { label: 'OUTPUT', value: 'Risk Score 0–100' },
      { label: 'INTERFACE', value: 'Live Heatmap' },
    ],
    status: 'Active',
  },
  {
    number: '03',
    title: 'Multi-Tenant SaaS Platform',
    category: 'CLOUD / DISTRIBUTED SYSTEM',
    categoryTag: 'Backend',
    description:
      'Enterprise-grade multi-tenant platform built for unified management of teams, projects, and execution lifecycles. Architected with strict tenant data isolation, granular Role-Based Access Control (RBAC), and containerized deployments.',
    problem: 'Organizations needing isolated per-tenant environments without managing separate infrastructure.',
    githubUrl: 'https://github.com/AyushKumarDubey',
    tech: ['Node.js', 'Express.js', 'PostgreSQL', 'React', 'Docker', 'JWT', 'RBAC', 'REST APIs'],
    metrics: [
      { label: 'ISOLATION', value: 'Row-Level Security' },
      { label: 'AUTH', value: 'JWT + RBAC' },
      { label: 'DEPLOY', value: 'Docker Compose' },
    ],
    status: 'Production',
  },
  {
    number: '04',
    title: 'Payment Gateway',
    category: 'FINTECH / PAYMENT SYSTEMS',
    categoryTag: 'Full Stack',
    description:
      'End-to-end hosted payment gateway infrastructure supporting seamless merchant order generation, multi-currency processing, and secure consumer checkout via UPI and Cards with webhook transaction verification.',
    problem: 'Merchants needing a reliable, self-hosted payment solution without vendor lock-in.',
    githubUrl: 'https://github.com/AyushKumarDubey',
    tech: ['Node.js', 'Spring Boot', 'PostgreSQL', 'React', 'Docker', 'UPI Integration', 'Card APIs', 'Webhooks'],
    metrics: [
      { label: 'PROTOCOLS', value: 'UPI + Cards' },
      { label: 'BACKEND', value: 'Spring Boot + Node' },
      { label: 'DATABASE', value: 'ACID-compliant' },
    ],
    status: 'Production',
  },
];

type FilterTag = 'ALL' | 'AI/ML' | 'Backend' | 'Full Stack' | 'Automation';

const statusColors: Record<string, string> = {
  Production: '#00D4FF',
  Active: '#10B981',
  Archived: '#5A7A8A',
};

export const ProjectsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterTag>('ALL');

  const filters: FilterTag[] = ['ALL', 'AI/ML', 'Backend', 'Full Stack', 'Automation'];
  const filtered = activeFilter === 'ALL'
    ? projects
    : projects.filter((p) => p.categoryTag === activeFilter);

  return (
    <section
      id="work"
      className="relative w-full bg-[#070B0F] text-[#E8F4F8] pt-20 pb-32 px-6 sm:px-12 lg:px-20 overflow-hidden"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/4 w-[36rem] h-[36rem] rounded-full pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] rounded-full pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto w-full relative z-10">

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
            <span className="text-[#2A4A5A]">02 //</span> FEATURED WORK
          </span>
          <div className="w-16 h-px bg-gradient-to-r from-[#00D4FF]/60 to-transparent" />
        </motion.div>

        {/* Headline + filter row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6"
        >
          <h2
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] tracking-tight uppercase leading-[0.85] select-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#C8DDE8] to-[#506070]">
              SELECTED WORKS.
            </span>
            <span
              className="block text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(180deg, #00D4FF 0%, #0088CC 60%, #003A55 100%)' }}
            >
              REAL ENGINEERING.
            </span>
          </h2>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 text-[9px] tracking-[0.22em] uppercase font-medium border transition-all duration-200 ${
                  activeFilter === f
                    ? 'border-[#00D4FF] text-[#00D4FF] bg-[#00D4FF]/8'
                    : 'border-[#1A2A38] text-[#3A5A6A] hover:border-[#00D4FF]/30 hover:text-[#6A8A9A]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ScrollStack — preserved excellent existing interaction */}
        <ScrollStack
          itemDistance={20}
          itemScale={0.035}
          itemStackDistance={28}
          stackPosition="15%"
          scaleEndPosition="6%"
          baseScale={0.88}
          useWindowScroll={true}
        >
          {filtered.map((project) => (
            <ScrollStackItem key={project.title}>
              <div className="relative w-full rounded-sm border border-[#1A2A38] bg-[#0C1219] p-8 sm:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.98)] group overflow-hidden transition-colors duration-500 hover:border-[#00D4FF]/30">

                {/* Top cyan border flare */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D4FF]/60 to-transparent" />

                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#00D4FF]/40 group-hover:border-[#00D4FF] transition-colors" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#00D4FF]/40 group-hover:border-[#00D4FF] transition-colors" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#00D4FF]/40 group-hover:border-[#00D4FF] transition-colors" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#00D4FF]/40 group-hover:border-[#00D4FF] transition-colors" />

                {/* Watermark number */}
                <span
                  className="absolute -bottom-6 -right-3 text-8xl sm:text-9xl font-bold text-[#E8F4F8]/[0.03] select-none pointer-events-none leading-none"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {project.number}
                </span>

                {/* Content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">

                  {/* Left: description */}
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <span
                          className="text-xs font-bold text-[#00D4FF]"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {project.number} //
                        </span>
                        <span
                          className="text-[10px] tracking-[0.25em] uppercase text-[#3A5A6A]"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {project.category}
                        </span>
                        {/* Status badge */}
                        <span
                          className="text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 border"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            color: statusColors[project.status],
                            borderColor: `${statusColors[project.status]}40`,
                          }}
                        >
                          {project.status}
                        </span>
                      </div>

                      <h3
                        className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white mb-4 group-hover:text-[#00D4FF] transition-colors uppercase leading-[0.9]"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      >
                        {project.title}
                      </h3>

                      {/* Problem statement */}
                      <div className="mb-4 p-3 border-l-2 border-[#00D4FF]/30 bg-[#00D4FF]/[0.03]">
                        <p
                          className="text-[10px] tracking-[0.2em] uppercase text-[#00D4FF]/60 mb-1"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          // PROBLEM
                        </p>
                        <p className="text-[12px] text-[#5A7A8A] leading-relaxed">{project.problem}</p>
                      </div>

                      <p className="text-xs sm:text-sm font-light text-[#4A6A7A] leading-[1.85] mb-8 max-w-2xl">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2 pt-5 border-t border-[#1A2A38]">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 text-[9px] font-medium tracking-[0.16em] uppercase border border-[#1A2A38] bg-[#111B26] text-[#6A8A9A] group-hover:border-[#00D4FF]/25 transition-all duration-300"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: metrics + CTA */}
                  <div className="lg:col-span-5 flex flex-col justify-between h-full gap-6 lg:pl-6 lg:border-l lg:border-[#1A2A38]">
                    <div className="space-y-3">
                      <span
                        className="text-[9px] tracking-[0.3em] uppercase text-[#2A4A5A] block mb-2"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        // ARCHITECTURE METRICS
                      </span>
                      {project.metrics.map((m) => (
                        <div
                          key={m.label}
                          className="p-3 border border-[#1A2A38] bg-[#070B0F] flex items-center justify-between group-hover:border-[#1A3A4A] transition-colors"
                        >
                          <span
                            className="text-[9.5px] text-[#3A5A6A]"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            {m.label}
                          </span>
                          <span
                            className="text-[10.5px] font-medium text-[#A8BEC8]"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            {m.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 px-5 py-3 border border-[#1A2A38] bg-[#111B26] hover:border-[#00D4FF] hover:bg-[#00D4FF] text-[#A8BEC8] hover:text-[#070B0F] text-[10px] font-semibold tracking-[0.22em] uppercase transition-all duration-300"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        <span>VIEW SOURCE</span>
                        <span>↗</span>
                      </a>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-3 px-5 py-3 border border-[#1A2A38] text-[#3A5A6A] hover:text-[#00D4FF] hover:border-[#00D4FF]/30 text-[10px] font-medium tracking-[0.22em] uppercase transition-all duration-300"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          <span>LIVE DEMO</span>
                          <span>→</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>

      </div>
    </section>
  );
};

export default ProjectsSection;
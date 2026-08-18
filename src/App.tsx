import { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { TerminalSection } from './components/TerminalSection';
import { ContactSection } from './components/ContactSection';
import { AdminApp } from './admin/AdminApp';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Check if we are in admin dashboard mode
  if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
    return <AdminApp navigate={navigate} />;
  }

  return (
    <div className="w-full min-h-screen bg-[#070B0F] text-[#E8F4F8] selection:bg-[#00D4FF]/20 selection:text-[#E8F4F8] relative noise-overlay">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <ExperienceSection />
      <TerminalSection />
      <ContactSection />
    </div>
  );
}

export default App;
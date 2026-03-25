import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Shield, Lock, Cpu, Globe, FileText, ArrowRight, Linkedin, Github } from 'lucide-react';

import { blogPosts } from '../data/blogPosts';

import { SEO } from './SEO';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  activeSection?: string;
  theme: 'dark' | 'light';
  themeMode: 'dark' | 'light' | 'auto';
  toggleTheme: (mode?: 'dark' | 'light' | 'auto') => void;
  seo?: {
    title?: string;
    description?: string;
    image?: string;
    article?: boolean;
  };
}

export const Layout: React.FC<LayoutProps> = ({ children, activeSection = 'home', theme, themeMode, toggleTheme, seo }) => {
  const latestPost = blogPosts[0];

  return (
    <div className="relative min-h-screen text-text-primary selection:bg-accent-primary selection:text-white transition-colors duration-400"
      style={{ background: 'var(--bg-primary)' }}>
      <SEO {...seo} />
      {/* Wayland Transition Overlay */}
      <div className="wayland-transition-overlay" aria-hidden="true" />

      {/* Wallpaper crossfade layer (light/dark) */}
      <div className="fixed inset-0 wallpaper-layer pointer-events-none z-[-1]" aria-hidden="true">
        <div className="wp-light" />
        <div className="wp-dark" />
      </div>


      {/* Fixed Background — circuit + blueprint ambient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        {/* Circuit line pattern */}
        <div className="absolute inset-0 circuit-bg opacity-[0.05]" />

        {/* Cinematic ambient lights — Cyber Purple */}
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)', opacity: 0.15 }} />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(34, 211, 238, 0.1), transparent 70%)', opacity: 0.1 }} />

        {/* Subtle cyber graphics: Vertical glowing lines */}
        <div className="absolute left-[10%] top-0 bottom-0 w-px opacity-20"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--accent-primary), transparent)' }} />
        <div className="absolute right-[10%] top-0 bottom-0 w-px opacity-15"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--accent-secondary), transparent)' }} />
      </div>

      <Navigation activeSection={activeSection} theme={theme} themeMode={themeMode} toggleTheme={toggleTheme} />

      <main className="relative z-10">
        {children}
      </main>

      <Footer />

    </div>
  );
};

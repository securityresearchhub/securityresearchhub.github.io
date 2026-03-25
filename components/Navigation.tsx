import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Cpu, MessageSquare, Briefcase, ShieldAlert, Sun, Moon, Monitor, ChevronDown, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  activeSection: string;
  theme: 'dark' | 'light';
  themeMode: 'dark' | 'light' | 'auto';
  toggleTheme: (mode?: 'dark' | 'light' | 'auto') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeSection, theme, themeMode, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isResearchHubActive = location.pathname.startsWith('/blog') || 
                             location.pathname.startsWith('/paths') || 
                             location.pathname.startsWith('/database');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainNavItems = [
    { id: 'research-hub', label: 'RESEARCH', icon: Shield, path: '/' },
    { id: 'vulnerabilities', label: 'VULNERABILITIES', icon: ShieldAlert, path: '/vulnerabilities' },
    { id: 'database', label: 'DATABASE', icon: Briefcase, path: '/database' },
  ];

  const secondaryNavItems: any[] = [];

  const handleNavClick = (id: string, path: string) => {
    if (path.startsWith('/#')) {
      const elementId = path.substring(2);
      const element = document.getElementById(elementId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const NavItem = ({ item, isActive }: { item: any; isActive: boolean }) => (
    <Link
      key={item.id}
      to={item.path}
      onClick={() => handleNavClick(item.id, item.path)}
      aria-current={isActive ? 'page' : undefined}
      className={`flex flex-col items-center gap-1 transition-all duration-200 group relative`}
      style={{
        color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
      }}
    >
      <item.icon
        size={14}
        aria-hidden="true"
        style={{
          transition: 'transform 0.2s, filter 0.2s',
          filter: isActive ? 'drop-shadow(0 0 4px var(--accent-glow))' : 'none',
        }}
      />
      <span className="text-[7.5px] font-orbitron font-black tracking-[0.18em] uppercase hidden sm:block">
        {item.label}
      </span>
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -bottom-2 w-1 h-1 rounded-full"
          style={{ background: 'var(--accent-primary)', boxShadow: '0 0 6px var(--accent-glow)' }}
          initial={false}
          transition={{ type: 'spring', stiffness: 350, damping: 35 }}
        />
      )}
    </Link>
  );

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300
        ${isScrolled ? 'pt-3 pb-0' : 'pt-5 pb-0'}`}
    >
      <div
        className={`px-5 sm:px-7 py-3 flex items-center gap-5 sm:gap-8 rounded-2xl transition-all duration-300`}
        style={{
          background: 'var(--bg-nav)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-color)',
          boxShadow: isScrolled
            ? '0 2px 24px rgba(0,0,0,0.5), 0 0 30px var(--accent-glow-subtle)'
            : '0 1px 12px rgba(0,0,0,0.3)',
        }}
      >
        <div className="flex items-center gap-5 sm:gap-7">
          {mainNavItems.map((item) => (
            <NavItem key={item.id} item={item} isActive={activeSection === item.id} />
          ))}
        </div>

        <div className="h-3.5 w-px" style={{ background: 'var(--border-color)' }} aria-hidden="true" />

        <div className="flex items-center gap-5 sm:gap-7">
          {secondaryNavItems.length > 0 && secondaryNavItems.map((item) => (
            <NavItem 
              key={item.id} 
              item={item} 
              isActive={item.id === 'research-hub' ? isResearchHubActive : activeSection === item.id} 
            />
          ))}
        </div>

        <div className="h-3.5 w-px" style={{ background: 'var(--border-color)' }} aria-hidden="true" />

        {/* Unified Theme Toggle Button */}
        <div className="relative flex items-center">
          <button
            onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full border transition-all duration-300 group shadow-sm
              ${theme === 'dark' 
                ? 'bg-accent-primary/10 border-accent-primary/30 shadow-[0_0_15px_var(--accent-glow-subtle)]' 
                : 'bg-white border-border-color shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:border-accent-primary/30 hover:bg-slate-50'}`}
            aria-label="Toggle Theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {theme === 'dark' ? (
                <motion.div
                  key="moon"
                  initial={{ rotate: -90, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex items-center justify-center"
                >
                  <Moon size={18} className="text-accent-primary drop-shadow-[0_0_8px_rgba(var(--accent-primary-rgb),0.5)]" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ rotate: 90, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: -90, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex items-center justify-center"
                >
                  <Sun size={20} className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Minimalist interactive ripple effect element */}
            <div className="absolute inset-0 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 origin-center bg-accent-primary/[0.03] z-[-1]" />
          </button>
        </div>

      </div>
    </motion.nav>
  );
};

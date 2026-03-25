import React from 'react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Shield, Database } from 'lucide-react';

interface ResearchLayoutProps {
  children: React.ReactNode;
}

const tabs = [
  { label: 'Blog', path: '/blog', icon: BookOpen },
  { label: 'Database', path: '/database', icon: Database },
];

export const ResearchLayout: React.FC<ResearchLayoutProps> = ({ children }) => {
  const location = useLocation();

  const activeTab = tabs.find(t => location.pathname.startsWith(t.path)) || tabs[0];

  return (
    <div className="min-h-screen bg-bg pt-20">
      {/* Research Hub Tab Navigation */}
      <div className="sticky top-20 z-40 border-b border-border-color"
        style={{ background: 'var(--bg-nav)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
        <div className="max-w-[1300px] mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
            {tabs.map(tab => {
              const isActive = location.pathname.startsWith(tab.path);
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className="relative flex items-center gap-2.5 px-5 py-3.5 rounded-xl font-orbitron font-black text-[10px] uppercase tracking-[0.25em] whitespace-nowrap transition-all duration-300 shrink-0"
                  style={{
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                    background: isActive ? 'var(--accent-primary-faded)' : 'transparent',
                  }}
                >
                  <tab.icon size={13} />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="research-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: 'var(--accent-primary)' }}
                      initial={false}
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1300px] mx-auto px-6 py-14">
        {children}
      </main>
    </div>
  );
};

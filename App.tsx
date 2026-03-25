import React, { useState, useEffect, Suspense } from 'react';
import emailjs from '@emailjs/browser';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

// Components
import { Layout } from './components/Layout';
import { Navigation } from './components/Navigation';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CookieNotice } from './components/CookieNotice';
import { PageTransition } from './components/PageTransition';

// Context
import { LanguageProvider } from './src/context/LanguageContext';

// Pages (Lazy Loading)
const Blog = React.lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const BlogPost = React.lazy(() => import('./pages/BlogPost').then(m => ({ default: m.BlogPost })));
const Privacy = React.lazy(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })));
const Terms = React.lazy(() => import('./pages/Terms').then(m => ({ default: m.Terms })));
const Disclaimer = React.lazy(() => import('./pages/Disclaimer').then(m => ({ default: m.Disclaimer })));
const VulnerabilityDatabase = React.lazy(() => import('./pages/VulnerabilityDatabase').then(m => ({ default: m.VulnerabilityDatabase })));
const ResearchIndex = React.lazy(() => import('./pages/ResearchIndex').then(m => ({ default: m.ResearchIndex })));
const Vulnerabilities = React.lazy(() => import('./pages/Vulnerabilities').then(m => ({ default: m.Vulnerabilities })));
const LegalUse = React.lazy(() => import('./pages/LegalUse').then(m => ({ default: m.LegalUse })));
const CopyrightNotice = React.lazy(() => import('./pages/CopyrightNotice').then(m => ({ default: m.CopyrightNotice })));

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [pathname, hash]);
  return null;
};

const PageTracker = () => {
  const location = useLocation();

  // Page view tracking on every route change
  useEffect(() => {
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('config', 'G-PPFJ77F37G', {
        page_path: location.pathname + location.search
      });
    }
  }, [location]);

  // Scroll depth tracking — fires at 25, 50, 75, 100%
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    const fired = new Set<number>();

    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      const pct = Math.round((scrolled / total) * 100);

      milestones.forEach(m => {
        if (pct >= m && !fired.has(m)) {
          fired.add(m);
          if (typeof (window as any).gtag === 'function') {
            (window as any).gtag('event', 'scroll_depth', {
              event_category: 'engagement',
              event_label: `${m}%`,
              depth_percent: m,
              page_path: location.pathname
            });
          }
          // At 100%, fire blog read completion if on blog post
          if (m === 100 && location.pathname.startsWith('/blog/')) {
            if (typeof (window as any).gtag === 'function') {
              (window as any).gtag('event', 'blog_read_complete', {
                event_category: 'engagement',
                page_path: location.pathname
              });
            }
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return null;
};

const App: React.FC = () => {
  useEffect(() => {
    emailjs.init("yaUVsV7Lc0lVhiMGS");
  }, []);

  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <PageTracker />
        <div className="min-h-screen selection:bg-accent-primary selection:text-white overflow-x-hidden">
          <ErrorBoundary feature="Application Router">
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
                <div className="w-8 h-8 border-2 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin" />
              </div>
            }>
              <AppContent />
            </Suspense>
          </ErrorBoundary>
          <CookieNotice />
        </div>
      </Router>
    </LanguageProvider>
  );
};

/* ── Hyprland swww — butter-smooth circle reveal on content ── */
// Removed local PageTransition definition in favor of shared component

const AppContent = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'auto'>(() => {
    const saved = localStorage.getItem('site-theme');
    if (saved === 'dark' || saved === 'light' || saved === 'auto') return saved;
    return 'auto';
  });

  const getEffectiveTheme = () => {
    if (themeMode === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return themeMode;
  };

  const theme = getEffectiveTheme();

  useEffect(() => {
    const effectiveTheme = getEffectiveTheme();
    document.documentElement.className = effectiveTheme;
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [themeMode]);

  useEffect(() => {
    if (themeMode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const effectiveTheme = mediaQuery.matches ? 'dark' : 'light';
        document.documentElement.className = effectiveTheme;
        document.documentElement.setAttribute('data-theme', effectiveTheme);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  useEffect(() => {
    // 1. Route-based top-level state syncing
    if (location.pathname.startsWith('/blog')) {
      setActiveSection('blog');
      return;
    }
    // Scroll Spy for Home Page sections removed
  }, [location.pathname, location.hash]);


  const toggleTheme = (newMode?: 'dark' | 'light' | 'auto') => {
    let mode: 'dark' | 'light' | 'auto';

    if (newMode) {
      mode = newMode;
    } else {
      if (themeMode === 'dark') mode = 'light';
      else if (themeMode === 'light') mode = 'auto';
      else mode = 'dark';
    }

    setThemeMode(mode);
    localStorage.setItem('site-theme', mode);
  };

  return (
    <Layout activeSection={activeSection} theme={theme} toggleTheme={toggleTheme} themeMode={themeMode}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><ResearchIndex /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
          <Route path="/research-hub" element={<PageTransition><ResearchIndex /></PageTransition>} />
          <Route path="/research" element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
          <Route path="/disclaimer" element={<PageTransition><Disclaimer /></PageTransition>} />
          <Route path="/database" element={<PageTransition><VulnerabilityDatabase /></PageTransition>} />
          <Route path="/vulnerabilities" element={<PageTransition><Vulnerabilities /></PageTransition>} />
          <Route path="/legal-use" element={<PageTransition><LegalUse /></PageTransition>} />
          <Route path="/copyright" element={<PageTransition><CopyrightNotice /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
};

export default App;

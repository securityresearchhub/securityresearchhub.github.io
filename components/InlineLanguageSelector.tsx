import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Globe, ChevronDown, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supportedLanguages } from '../data/languages';
import { useLanguage } from '../src/context/LanguageContext';

interface Props {
  value?: string;
  onChange?: (lang: string) => void;
  label?: string;
  compact?: boolean;
}

export const InlineLanguageSelector: React.FC<Props> = ({
  value: propValue,
  onChange: propOnChange,
  label = 'Translate Article',
  compact = false,
}) => {
  const { language: globalLang, setLanguage: setGlobalLang } = useLanguage();
  
  const value = propValue || globalLang;
  const onChange = (lang: string) => {
    if (propOnChange) propOnChange(lang);
    setGlobalLang(lang as any);
  };
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const current = supportedLanguages.find(l => l.code === value) || supportedLanguages.find(l => l.code === 'en') || supportedLanguages[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    } else {
      setSearchQuery('');
    }
  }, [open]);

  const filteredLanguages = useMemo(() => {
    if (!searchQuery) return supportedLanguages;
    const lowerQuery = searchQuery.toLowerCase();
    return supportedLanguages.filter(lang => 
      lang.name.toLowerCase().includes(lowerQuery) || 
      lang.code.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  return (
    <div className="relative group w-full" ref={ref}>
      <div className="absolute inset-0 bg-accent-primary/20 blur-lg group-hover:blur-xl transition-all rounded-xl opacity-50" />
      <button
        onClick={() => setOpen(o => !o)}
        className="relative flex items-center justify-between bg-bg/80 border border-accent-primary/40 hover:border-accent-primary/60 backdrop-blur-md rounded-xl px-4 py-3 shadow-[0_0_15px_rgba(0,0,0,0.5)] w-full transition-all duration-300"
        aria-label="Translate page"
      >
        <div className="flex items-center overflow-hidden">
          <Globe size={16} className="text-accent-primary shrink-0 mr-3" />
          {!compact && (
            <span className="font-orbitron font-black text-[10px] text-text-primary uppercase tracking-widest mr-3 whitespace-nowrap shrink-0">
              {label}
            </span>
          )}
          <span className="font-mono text-[10px] uppercase font-black text-accent-primary truncate">
            {current.name} ({current.code.toUpperCase()})
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
          <ChevronDown size={14} className="text-accent-primary ml-2" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-accent-primary/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[200] overflow-hidden"
            style={{ background: 'var(--bg-nav)', backdropFilter: 'blur(24px)' }}
          >
            <div className="p-3 border-b border-white/10 bg-white/5 relative">
              <Search size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted/50" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#050506] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs font-mono text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-accent-primary/50 transition-colors"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="p-2 max-h-72 overflow-y-auto support-scroll">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { onChange(lang.code); setOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 group
                      ${value === lang.code ? 'bg-accent-primary/10 text-accent-primary shadow-[inset_0_0_10px_var(--accent-glow-subtle)]' : 'text-text-muted hover:bg-white/5 hover:text-text-primary'}`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-orbitron font-black text-[10px] uppercase tracking-wider">{lang.name}</span>
                    </div>
                    {value === lang.code && <Check size={11} className="text-accent-primary shrink-0" />}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center flex flex-col items-center justify-center opacity-50">
                   <Globe size={24} className="mb-2" />
                   <span className="font-mono text-[10px] uppercase">Language not found</span>
                </div>
              )}
            </div>
            <div className="border-t border-white/5 px-4 py-2 text-center bg-black/40">
              <span className="text-[7px] font-mono text-text-muted/30 uppercase tracking-widest">Supports 130+ Global Languages</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

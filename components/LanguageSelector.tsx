import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, ChevronDown, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../src/context/LanguageContext';
import { supportedLanguages, Language as LangType } from '../data/languages';

export const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { language: currentLangCode, setLanguage } = useLanguage();
  
  const selectedLang = supportedLanguages.find(l => l.code === currentLangCode) || supportedLanguages[0];
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (lang: LangType) => {
    setLanguage(lang.code as any);
    setIsOpen(false);
  };

  const filteredLanguages = supportedLanguages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border-color bg-bg-card hover:border-accent-primary transition-all duration-300 group"
        aria-label="Select Language"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
      >
        <Globe size={14} className="text-accent-primary" />
        <span className="text-[9px] font-orbitron font-black tracking-widest text-text-primary hidden lg:block uppercase">
          {selectedLang.code}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={12} className="text-text-muted group-hover:text-accent-primary" />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-3 w-72 rounded-2xl border border-border-color shadow-2xl overflow-hidden z-50 flex flex-col"
            style={{ background: 'var(--bg-nav)', backdropFilter: 'blur(24px)' }}
          >
            {/* Search Box */}
            <div className="p-4 border-b border-border-color bg-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={12} />
                <input
                  type="text"
                  placeholder="Search languages..."
                  className="w-full bg-bg-primary/50 border border-border-color rounded-lg py-2 pl-9 pr-3 text-[10px] font-mono text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Language List */}
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col py-2">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang)}
                    className={`w-full flex items-center justify-between px-5 py-2.5 text-left transition-all duration-200 group hover:bg-white/5
                      ${selectedLang.code === lang.code ? 'bg-accent-primary/10 text-accent-primary' : 'text-text-muted hover:text-text-primary'}`}
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] font-orbitron font-bold uppercase tracking-wider">
                        {lang.name}
                      </span>
                      <span className="text-[8px] font-mono opacity-40 uppercase">
                        {lang.code}
                      </span>
                    </div>
                    {selectedLang.code === lang.code && (
                      <Check size={12} className="text-accent-primary" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-5 py-8 text-center text-[10px] font-mono text-text-muted italic opacity-50">
                  No match found in database
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border-color bg-white/5 flex justify-center">
               <span className="text-[8px] font-mono text-text-muted uppercase tracking-widest opacity-30">
                 Shield: Translated via Google
               </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

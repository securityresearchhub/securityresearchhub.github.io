import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BookOpen, Database, ChevronRight, ArrowRight, Layers } from 'lucide-react';
import { ResearchLayout } from '../components/ResearchLayout';
import { InlineLanguageSelector } from '../components/InlineLanguageSelector';
import { translateText } from '../src/utils/translate';
import { useLanguage } from '../src/context/LanguageContext';

export const ResearchIndex: React.FC = () => {
  const { language: lang, isTranslating, setIsTranslating } = useLanguage();
  const [translatedSections, setTranslatedSections] = useState<any[]>([]);
  const [translatedUI, setTranslatedUI] = useState({
    status: 'Portal_Status: Online',
    badge: 'Unified Intelligence Dashboard_v5.0',
    heading: 'RESEARCH HUB',
    sub: 'Standardized gateway to our vulnerability intelligence platform. Access technical research, taxonomies, and the global threat registry.',
    ctaTitle: 'INTELLIGENCE OVERRIDE',
    ctaDesc: 'Direct access to our neural search engine. Filter entire repository via CVE ID, CWE classification, or core technical markers.',
    ctaButton: 'INITIALIZE_SEARCH_SESSION'
  });

  const hubSections = [
    {
      id: 'blog',
      title: 'Technical Blog',
      description: 'Deep-dive security analyses, exploitation breakdown, and enterprise-grade research dossiers following our standardized technical format.',
      icon: BookOpen,
      path: '/blog',
      color: 'var(--accent-primary)',
      stats: 'Published Dossiers'
    },
    {
      id: 'database',
      title: 'Threat Database',
      description: 'Standardized registry of CVE identifiers, CWE references, and MITRE ATT&CK mappings. Search by any identifier to find linked research.',
      icon: Database,
      path: '/database',
      color: '#3b82f6',
      stats: 'Registry Core'
    }
  ];

  useEffect(() => {
    const translate = async () => {
      if (lang === 'en') {
        setTranslatedSections([]);
        setTranslatedUI({
          status: 'Portal_Status: Online',
          badge: 'Unified Intelligence Dashboard_v5.0',
          heading: 'RESEARCH HUB',
          sub: 'Standardized gateway to our vulnerability intelligence platform. Access technical research, taxonomies, and the global threat registry.',
          ctaTitle: 'INTELLIGENCE OVERRIDE',
          ctaDesc: 'Direct access to our neural search engine. Filter entire repository via CVE ID, CWE classification, or core technical markers.',
          ctaButton: 'INITIALIZE_SEARCH_SESSION'
        });
        return;
      }

      setIsTranslating(true);
      try {
        const uiStrings = [
          'Portal_Status: Online',
          'Unified Intelligence Dashboard_v5.0',
          'RESEARCH HUB',
          'Standardized gateway to our vulnerability intelligence platform. Access technical research, taxonomies, and the global threat registry.',
          'INTELLIGENCE OVERRIDE',
          'Direct access to our neural search engine. Filter entire repository via CVE ID, CWE classification, or core technical markers.',
          'INITIALIZE_SEARCH_SESSION'
        ];

        const [translates, sections] = await Promise.all([
          Promise.all(uiStrings.map(s => translateText(s, lang))),
          Promise.all(hubSections.map(async (s) => ({
            ...s,
            title: await translateText(s.title, lang),
            description: await translateText(s.description, lang),
            stats: await translateText(s.stats, lang)
          })))
        ]);

        setTranslatedUI({
          status: translates[0],
          badge: translates[1],
          heading: translates[2],
          sub: translates[3],
          ctaTitle: translates[4],
          ctaDesc: translates[5],
          ctaButton: translates[6]
        });
        setTranslatedSections(sections);
      } catch (err) {
        console.error('Research Hub translation failed', err);
      } finally {
        setIsTranslating(false);
      }
    };
    
    translate();
  }, [lang]);

  const displaySections = translatedSections.length > 0 ? translatedSections : hubSections;

  return (
    <ResearchLayout>
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar with Language Selector */}
          <div className="flex justify-between items-center mb-16 px-4">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.3em] font-black italic">
                {translatedUI.status}
              </span>
            </div>
            <InlineLanguageSelector label="🌐 Translate Hub" />
          </div>

          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-24 text-center"
          >
            <div className="inline-block px-4 py-1.5 mb-6 border border-border-color rounded-full font-mono text-[10px] text-accent-primary tracking-[0.4em] font-black uppercase italic"
              style={{ background: 'var(--accent-primary-faded)' }}>
              {translatedUI.badge}
            </div>
            <h1 className="font-orbitron text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none italic text-text-primary flex flex-col items-center uppercase">
              {translatedUI.heading.includes('RESEARCH') ? (
                <>RESEARCH <span className="text-accent-primary">HUB</span></>
              ) : (
                <span>{translatedUI.heading}</span>
              )}
            </h1>
            <p className="text-text-muted max-w-2xl mx-auto font-medium text-lg leading-relaxed">
              {translatedUI.sub}
            </p>
          </motion.div>

          {/* Navigation Cards — 2-column centered */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-32" style={{ maxWidth: '900px' }}>
            {displaySections.map((section, idx) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group h-full"
              >
                <Link to={section.path} className="block h-full">
                  <div className="h-full p-8 rounded-[2.5rem] border-2 border-border-color bg-white/[0.01] hover:border-accent-primary/50 transition-all duration-500 relative flex flex-col items-center text-center overflow-hidden group-hover:scale-[1.02]">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-accent-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className={`w-20 h-20 rounded-3xl mb-8 flex items-center justify-center transition-all duration-500 group-hover:rotate-[360deg]`}
                      style={{ 
                        background: `${section.color}10`,
                        border: `1px solid ${section.color}30`,
                        color: section.color,
                        boxShadow: `0 0 20px ${section.color}10`
                      }}>
                      <section.icon size={36} />
                    </div>

                    <h3 className="font-orbitron font-black text-2xl mb-6 text-text-primary uppercase italic tracking-tighter group-hover:text-accent-primary transition-colors">
                      {section.title}
                    </h3>

                    <p className="text-sm text-text-muted font-medium leading-relaxed mb-8 opacity-70">
                      {section.description}
                    </p>

                    <div className="mt-auto pt-4 flex flex-col items-center gap-4 w-full">
                      <div className="w-full h-px bg-border-color/50" />
                      <div className="flex items-center justify-between w-full px-4">
                        <span className="text-[9px] font-mono text-text-muted/40 uppercase tracking-[0.2em] font-black italic font-bold">
                          {section.stats}
                        </span>
                        <div className="w-8 h-8 rounded-full border border-border-color flex items-center justify-center text-text-muted group-hover:text-accent-primary group-hover:border-accent-primary/40 transition-all">
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-12 glass-card rounded-[3rem] border border-border-color bg-accent-primary/[0.01] text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent" />
            <Layers size={48} className="mx-auto text-accent-primary opacity-20 mb-8 group-hover:scale-110 transition-transform duration-700" />
            <h3 className="font-orbitron font-black text-3xl text-text-primary uppercase italic mb-6">{translatedUI.ctaTitle}</h3>
            <p className="text-text-muted max-w-lg mx-auto font-medium text-lg leading-relaxed mb-10">
              {translatedUI.ctaDesc}
            </p>
            <div className="pt-4">
              <Link
                to="/blog"
                className="inline-flex items-center gap-4 px-10 py-4 bg-accent-primary text-black rounded-full font-orbitron font-black text-xs tracking-widest uppercase shadow-[0_0_30px_rgba(0,245,255,0.4)] hover:scale-105 active:scale-95 transition-all"
              >
                {translatedUI.ctaButton} <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </ResearchLayout>
  );
};

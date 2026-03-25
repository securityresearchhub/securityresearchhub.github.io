import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, Shield } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { ResearchLayout } from '../components/ResearchLayout';
import { InlineLanguageSelector } from '../components/InlineLanguageSelector';
import { batchTranslate } from '../src/utils/translate';
import { useLanguage } from '../src/context/LanguageContext';

const OWASP_LABELS: Record<string, string> = {
  A01: 'A01 · Broken Access Control',
  A02: 'A02 · Cryptographic Failures',
  A03: 'A03 · Injection',
  A04: 'A04 · Insecure Design',
  A05: 'A05 · Security Misconfiguration',
  A06: 'A06 · Vulnerable Components',
  A07: 'A07 · Auth Failures',
  A08: 'A08 · Software Integrity',
  A09: 'A09 · Logging Failures',
  A10: 'A10 · SSRF',
};

const CVSS_COLOR = (score: number) => {
  if (score >= 9.0) return 'text-red-500';
  if (score >= 7.0) return 'text-orange-400';
  if (score >= 4.0) return 'text-yellow-400';
  return 'text-green-400';
};

export const Blog: React.FC = () => {
  const { language: lang, isTranslating, setIsTranslating } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedOWASP, setSelectedOWASP] = useState<string>(searchParams.get('owasp') || 'ALL');
  const [translatedContent, setTranslatedContent] = useState<Record<string, { title: string, excerpt: string }>>({});
  const [translatedUI, setTranslatedUI] = useState({ 
    heading: 'TECHNICAL BLOG', 
    sub: 'Deep-dive technical research articles following our standardized technical layout.', 
    searchPlaceholder: 'Search by name, CVE, CWE, MITRE technique...',
    found: 'research articles found',
    foundSingle: 'research article found',
    translating: 'Translating articles...',
    readResearch: 'Read Research',
    noArticles: 'No Articles Found',
    noArticlesDesc: 'No research articles match your current search or filter parameters.',
    clearFilters: 'Clear Filters'
  });

  const publishedPosts = useMemo(() =>
    blogPosts.filter(p => p.publishDate !== 'TBA' && p.publishDate !== 'Ready Soon'),
    []
  );

  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return publishedPosts
      .filter(post => {
        const englishMatch = !q ||
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tags.some(t => t.toLowerCase().includes(q)) ||
          post.intel?.cve?.toLowerCase().includes(q) ||
          post.intel?.cwe?.toLowerCase().includes(q) ||
          post.intel?.mitre?.toLowerCase().includes(q);

        const translated = translatedContent[post.id];
        const translatedMatch = translated && (
          translated.title.toLowerCase().includes(q) ||
          translated.excerpt.toLowerCase().includes(q)
        );

        const matchOWASP = selectedOWASP === 'ALL' || post.intel?.owasp === selectedOWASP;
        return (englishMatch || translatedMatch) && matchOWASP;
      })
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }, [searchQuery, selectedOWASP, publishedPosts, translatedContent]);

  const translateDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Debounce rapid language switches to avoid race conditions
    if (translateDebounceRef.current) clearTimeout(translateDebounceRef.current);

    if (lang === 'en') {
      // Reset to English immediately — no API call needed
      setTranslatedContent({});
      setTranslatedUI({
        heading: 'TECHNICAL BLOG',
        sub: 'Deep-dive technical research articles following our standardized technical layout.',
        searchPlaceholder: 'Search by name, CVE, CWE, MITRE technique...',
        found: 'research articles found',
        foundSingle: 'research article found',
        translating: 'Translating articles...',
        readResearch: 'Read Research',
        noArticles: 'No Articles Found',
        noArticlesDesc: 'No research articles match your current search or filter parameters.',
        clearFilters: 'Clear Filters'
      });
      return;
    }

    translateDebounceRef.current = setTimeout(async () => {
      setIsTranslating(true);
      try {
        const uiStrings = [
          'TECHNICAL BLOG',
          'Deep-dive technical research articles following our standardized technical layout.',
          'Search by name, CVE, CWE, MITRE technique...',
          'research articles found',
          'research article found',
          'Translating articles...',
          'Read Research',
          'No Articles Found',
          'No research articles match your current search or filter parameters.',
          'Clear Filters'
        ];

        const translates = await batchTranslate(uiStrings, lang);

        // Swap UI only on success — never clear before new data arrives
        setTranslatedUI({
          heading: translates[0] || uiStrings[0],
          sub: translates[1] || uiStrings[1],
          searchPlaceholder: translates[2] || uiStrings[2],
          found: translates[3] || uiStrings[3],
          foundSingle: translates[4] || uiStrings[4],
          translating: translates[5] || uiStrings[5],
          readResearch: translates[6] || uiStrings[6],
          noArticles: translates[7] || uiStrings[7],
          noArticlesDesc: translates[8] || uiStrings[8],
          clearFilters: translates[9] || uiStrings[9],
        });

        const blogDataToTranslate = publishedPosts.slice(0, 12).flatMap(post => [post.title, post.excerpt]);
        const translatedBlogData = await batchTranslate(blogDataToTranslate, lang);

        const newTranslations: Record<string, { title: string; excerpt: string }> = {};
        publishedPosts.slice(0, 12).forEach((post, i) => {
          newTranslations[post.id] = {
            title: translatedBlogData[i * 2] || post.title,
            excerpt: translatedBlogData[i * 2 + 1] || post.excerpt
          };
        });
        // Swap card content only on success — no blank state
        setTranslatedContent(newTranslations);
      } catch (err) {
        console.warn('Blog translation failed, keeping previous content', err);
        // Do NOT clear translatedContent on error — keep showing previous or English
      } finally {
        setIsTranslating(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (translateDebounceRef.current) clearTimeout(translateDebounceRef.current);
    };
  }, [lang, publishedPosts]);

  useEffect(() => {
    const params: any = {};
    if (searchQuery) params.q = searchQuery;
    if (selectedOWASP !== 'ALL') params.owasp = selectedOWASP;
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedOWASP]);

  const owaspOptions = ['ALL', 'A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09', 'A10'];

  return (
    <ResearchLayout>
      {/* Header with translate button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-14"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
          <div>
            <div
              className="inline-block px-4 py-1.5 mb-5 border border-border-color rounded-full font-mono text-[10px] text-accent-primary tracking-[0.35em] font-black uppercase italic"
              style={{ background: 'var(--accent-primary-faded)' }}
            >
              Vulnerability Research Repository
            </div>
            <h1 className="font-orbitron text-5xl md:text-7xl font-black text-text-primary uppercase italic leading-none">
              {translatedUI.heading.includes('TECHNICAL') ? (
                <>TECHNICAL <span className="text-accent-primary">BLOG</span></>
              ) : (
                <span>{translatedUI.heading}</span>
              )}
            </h1>
          </div>
          <div className="mt-2">
            <InlineLanguageSelector label="🌐 Translate Page" />
          </div>
        </div>
        <p className="text-text-muted max-w-2xl font-medium text-base leading-relaxed opacity-80">
          {translatedUI.sub}
        </p>
      </motion.div>

      {/* Search + OWASP Filter */}
      <div className="mb-12 space-y-4">
        <div className="relative group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder={translatedUI.searchPlaceholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white/[0.02] border border-border-color rounded-2xl font-mono text-sm focus:border-accent-primary/50 outline-none transition-all placeholder:text-text-muted/30"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {owaspOptions.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedOWASP(cat)}
              className={`px-4 py-2 rounded-full font-mono text-[9px] font-black uppercase tracking-widest transition-all ${
                selectedOWASP === cat
                  ? 'bg-accent-primary text-black shadow-[0_0_16px_var(--accent-glow-subtle)]'
                  : 'bg-white/5 text-text-muted hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat === 'ALL' ? 'ALL OWASP' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="font-mono text-[10px] text-text-muted/50 uppercase tracking-widest mb-8">
        {filteredPosts.length} {filteredPosts.length !== 1 ? translatedUI.found : translatedUI.foundSingle}
      </p>

      {/* Loading overlay */}
      {isTranslating && (
        <div className="text-center py-4 mb-4">
          <span className="font-mono text-[10px] text-accent-primary uppercase tracking-widest animate-pulse">{translatedUI.translating}</span>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="group"
            >
              <Link to={`/blog/${post.slug}`} className="block h-full">
                <div className="h-full flex flex-col p-7 rounded-2xl border border-border-color bg-white/[0.01] hover:border-accent-primary/40 transition-all duration-400 hover:shadow-[0_0_30px_var(--accent-glow-subtle)] hover:-translate-y-1 relative overflow-hidden">

                  {/* Thumbnail */}
                  <div className="relative w-full h-44 rounded-xl overflow-hidden mb-6 border border-white/5 shrink-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-600"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                    {post.intel?.cvss && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 border border-white/10 rounded-lg font-mono text-[9px] font-black uppercase tracking-widest backdrop-blur-sm">
                        <span className={CVSS_COLOR(post.intel.cvss)}>CVSS {post.intel.cvss}</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-accent-primary/10 border border-accent-primary/20 rounded-lg font-mono text-[9px] font-black text-accent-primary uppercase tracking-widest backdrop-blur-sm">
                      {post.intel?.owasp || 'MISC'}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 
                    className="font-orbitron font-black mb-3 text-text-primary uppercase italic leading-tight group-hover:text-accent-primary transition-colors line-clamp-2"
                    style={{ fontSize: '14px' }}
                  >
                    {translatedContent[post.id]?.title || post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-text-muted leading-relaxed mb-5 line-clamp-2 opacity-70 flex-grow">
                    {translatedContent[post.id]?.excerpt || post.excerpt}
                  </p>

                  {/* Intel tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {post.intel?.cwe && (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 font-mono text-[8px] text-text-muted/60 uppercase tracking-widest">
                        {post.intel.cwe.split(':')[0]}
                      </span>
                    )}
                    {post.intel?.mitre && (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 font-mono text-[8px] text-text-muted/60 uppercase tracking-widest">
                        {post.intel.mitre.split(':')[0]}
                      </span>
                    )}
                    {post.intel?.cve && (
                      <span className="px-2 py-0.5 rounded-md bg-accent-primary/5 border border-accent-primary/10 font-mono text-[8px] text-accent-primary/60 uppercase tracking-widest">
                        {post.intel.cve}
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <span className="font-mono text-[9px] text-text-muted/40 uppercase tracking-widest">
                      {post.readingTime}
                    </span>
                    <div className="flex items-center gap-1.5 text-accent-primary font-orbitron font-black text-[10px] tracking-[0.25em] uppercase italic">
                      {translatedUI.readResearch} <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center">
          <div className="inline-block p-10 bg-white/5 rounded-full mb-8">
            <Shield size={40} className="text-text-muted opacity-20" />
          </div>
          <h2 className="font-orbitron font-black text-2xl text-text-primary uppercase italic mb-4">
            {translatedUI.noArticles}
          </h2>
          <p className="text-text-muted font-medium max-w-md mx-auto text-sm leading-relaxed mb-8">
            {translatedUI.noArticlesDesc}
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedOWASP('ALL'); }}
            className="px-8 py-3 border border-accent-primary text-accent-primary rounded-full font-orbitron font-black text-[10px] tracking-widest uppercase hover:bg-accent-primary hover:text-black transition-all"
          >
            {translatedUI.clearFilters}
          </button>
        </motion.div>
      )}
    </ResearchLayout>
  );
};

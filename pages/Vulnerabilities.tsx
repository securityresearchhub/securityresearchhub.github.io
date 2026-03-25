import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Shield, Lock, Database, Cpu, Activity, Target,
  Zap, Globe, Layers, ChevronRight, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { ResearchLayout } from '../components/ResearchLayout';
import { useLanguage } from '../src/context/LanguageContext';
import { translateText } from '../src/utils/translate';

const OWASP_META: Record<string, { label: string; desc: string; icon: any }> = {
  A01: { label: 'A01 · Broken Access Control', desc: 'Authorization bypass, IDOR, privilege escalation', icon: Lock },
  A02: { label: 'A02 · Cryptographic Failures', desc: 'Weak encryption, sensitive data exposure', icon: Shield },
  A03: { label: 'A03 · Injection', desc: 'SQL, OS, LDAP and code injection attacks', icon: Database },
  A04: { label: 'A04 · Insecure Design', desc: 'Architectural flaws and missing security controls', icon: Cpu },
  A05: { label: 'A05 · Security Misconfiguration', desc: 'Insecure defaults, unnecessary features enabled', icon: Shield },
  A06: { label: 'A06 · Vulnerable Components', desc: 'Outdated libraries with known vulnerabilities', icon: Layers },
  A07: { label: 'A07 · Authentication Failures', desc: 'Broken auth, session fixation, credential stuffing', icon: Zap },
  A08: { label: 'A08 · Software Integrity Failures', desc: 'Insecure CI/CD pipelines and update mechanisms', icon: Globe },
  A09: { label: 'A09 · Security Logging Failures', desc: 'Insufficient logging and monitoring', icon: Activity },
  A10: { label: 'A10 · SSRF', desc: 'Server-side request forgery attacks', icon: Target },
};

const CVSS_BADGE = (score: number) => {
  if (score >= 9.0) return 'bg-red-500/10 text-red-400 border-red-500/20';
  if (score >= 7.0) return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
  if (score >= 4.0) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
  return 'bg-green-500/10 text-green-400 border-green-500/20';
};

export const Vulnerabilities: React.FC = () => {
  const { language: targetLang, isTranslating, setIsTranslating } = useLanguage();
  const [translatedMeta, setTranslatedMeta] = React.useState<typeof OWASP_META>(OWASP_META);
  const [translatedTitles, setTranslatedTitles] = React.useState<Record<string, string>>({});

  // Only published posts with intel metadata
  const publishedPosts = useMemo(() =>
    blogPosts.filter(p =>
      p.publishDate !== 'TBA' &&
      p.publishDate !== 'Ready Soon' &&
      p.intel?.owasp
    ),
    []
  );

  // Group by OWASP category
  const grouped = useMemo(() => {
    const map: Record<string, typeof publishedPosts> = {};
    publishedPosts.forEach(post => {
      const cat = post.intel!.owasp;
      if (!map[cat]) map[cat] = [];
      map[cat].push(post);
    });
    return map;
  }, [publishedPosts]);

  React.useEffect(() => {
    if (targetLang === 'en') {
      setTranslatedMeta(OWASP_META);
      setTranslatedTitles({});
      return;
    }

    const translateExplorer = async () => {
      setIsTranslating(true);
      try {
        // Translate category metadata
        const newMeta = { ...OWASP_META };
        await Promise.all(Object.keys(OWASP_META).map(async (key) => {
          newMeta[key] = {
            ...OWASP_META[key],
            label: await translateText(OWASP_META[key].label, targetLang),
            desc: await translateText(OWASP_META[key].desc, targetLang)
          };
        }));
        setTranslatedMeta(newMeta);

        // Translate post titles
        const newTitles: Record<string, string> = {};
        await Promise.all(publishedPosts.map(async (post) => {
          newTitles[post.id] = await translateText(post.title, targetLang);
        }));
        setTranslatedTitles(newTitles);
      } finally {
        setIsTranslating(false);
      }
    };
    translateExplorer();
  }, [targetLang, publishedPosts]);

  const sortedCategories = Object.keys(grouped).sort();

  return (
    <ResearchLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-14"
      >
        <div
          className="inline-block px-4 py-1.5 mb-5 border border-border-color rounded-full font-mono text-[10px] text-accent-primary tracking-[0.35em] font-black uppercase italic"
          style={{ background: 'var(--accent-primary-faded)' }}
        >
          Published Vulnerability Research
        </div>
        <h1 className="font-orbitron text-5xl md:text-7xl font-black text-text-primary uppercase italic leading-none mb-6">
          VULNERABILITY <span className="text-accent-primary">EXPLORER</span>
        </h1>
        <p className="text-text-muted max-w-2xl font-medium text-base leading-relaxed opacity-80">
          {publishedPosts.length} verified research articles mapped to OWASP Top 10.
          Each vulnerability links directly to its full technical research dossier.
        </p>
      </motion.div>

      {/* Categories */}
      <div className="space-y-20">
        {sortedCategories.map((cat) => {
          const meta = translatedMeta[cat] || { label: cat, desc: '', icon: Shield };
          const Icon = meta.icon;
          const posts = grouped[cat];

          return (
            <section key={cat}>
              {/* Category Header */}
              <div className="flex items-start gap-5 mb-10 pb-6 border-b border-white/5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-accent-primary border border-accent-primary/20 shrink-0"
                  style={{ background: 'var(--accent-primary-faded)' }}>
                  <Icon size={26} />
                </div>
                <div>
                  <h2 className="font-orbitron font-black text-2xl text-text-primary uppercase italic tracking-tight mb-1">
                    {meta.label}
                  </h2>
                  <p className="font-mono text-[11px] text-text-muted/60 uppercase tracking-widest">
                    {meta.desc} &mdash; {posts.length} article{posts.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {posts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.06 }}
                    className="group"
                  >
                    <Link to={`/blog/${post.slug}`} className="block">
                      <div className="p-6 rounded-2xl border border-border-color bg-white/[0.01] hover:border-accent-primary/40 transition-all duration-300 hover:shadow-[0_0_24px_var(--accent-glow-subtle)] hover:-translate-y-0.5 flex flex-col gap-4">

                        {/* Thumb */}
                        {post.image && (
                          <div className="relative h-36 rounded-xl overflow-hidden border border-white/5">
                            <img
                              src={post.image}
                              alt={post.title}
                              loading="lazy"
                              className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-90 transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                          </div>
                        )}

                        {/* Title */}
                        <h3 
                          className="font-orbitron font-black text-text-primary uppercase italic leading-snug group-hover:text-accent-primary transition-colors"
                          style={{ fontSize: '14px' }}
                        >
                          {translatedTitles[post.id] || post.title}
                        </h3>

                        {/* Metadata chips */}
                        <div className="flex flex-wrap gap-2">
                          {post.intel?.cvss && (
                            <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-mono font-black uppercase tracking-widest border ${CVSS_BADGE(post.intel.cvss)}`}>
                              CVSS {post.intel.cvss}
                            </span>
                          )}
                          {post.intel?.cwe && (
                            <span className="px-2.5 py-0.5 rounded-full text-[8px] font-mono font-black uppercase tracking-widest bg-white/5 border border-white/5 text-text-muted/60">
                              {post.intel.cwe.split(':')[0]}
                            </span>
                          )}
                          {post.intel?.mitre && (
                            <span className="px-2.5 py-0.5 rounded-full text-[8px] font-mono font-black uppercase tracking-widest bg-white/5 border border-white/5 text-text-muted/60">
                              {post.intel.mitre.split(':')[0]}
                            </span>
                          )}
                        </div>

                        {/* CTA Row */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <span className="font-mono text-[8px] text-text-muted/40 uppercase tracking-widest">
                            {post.intel?.cve || '—'}
                          </span>
                          <div className="flex items-center gap-1.5 text-accent-primary font-orbitron font-black text-[10px] tracking-[0.2em] uppercase italic">
                            Read Research <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Empty global state */}
      {publishedPosts.length === 0 && (
        <div className="py-32 text-center">
          <Shield size={48} className="mx-auto text-text-muted/20 mb-6" />
          <h2 className="font-orbitron font-black text-2xl text-text-primary uppercase italic mb-4">
            No Research Available Yet
          </h2>
          <p className="text-text-muted font-medium max-w-md mx-auto text-sm">
            Published vulnerability articles will appear here automatically.
          </p>
        </div>
      )}
    </ResearchLayout>
  );
};

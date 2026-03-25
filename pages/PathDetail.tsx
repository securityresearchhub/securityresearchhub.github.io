import React from 'react';
import { motion } from 'motion/react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Clock, BookOpen, 
  Target, Shield, Zap, CheckCircle2,
  Lock, Play, Activity, Award, ChevronRight,
  Sparkles, Terminal, Database
} from 'lucide-react';
import { learningPaths } from '../data/learningPaths';
import { blogPosts } from '../data/blogPosts';

const iconMap = {
  Shield: Shield,
  Globe: Activity,
  Target: Target,
  Zap: Zap
};

export const PathDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const path = learningPaths.find(p => p.id === id);

  if (!path) return <Navigate to="/paths" />;

  const Icon = iconMap[path.icon as keyof typeof iconMap] || Activity;

  return (
    <div className="min-h-screen bg-bg selection:bg-accent-primary/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-primary/5 rounded-full blur-[150px] translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-blue/5 rounded-full blur-[180px] -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <Link to="/paths" className="inline-flex items-center gap-3 text-text-muted hover:text-accent-primary transition-all mb-16 font-orbitron font-bold text-[10px] tracking-[0.5em] uppercase group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK_TO_CURRICULUM_OVERVIEW
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-24"
          >
            <div className="flex flex-col md:flex-row items-center gap-12 md:text-left text-center">
              <div className="relative group/icon">
                <div className="absolute inset-0 bg-accent-primary/20 rounded-[2.5rem] blur-2xl group-hover/icon:blur-[40px] transition-all duration-700 opacity-50" />
                <div className="relative w-32 h-32 rounded-[2.5rem] bg-accent-primary/5 border border-accent-primary/20 flex items-center justify-center text-accent-primary shrink-0 transition-transform duration-700 group-hover/icon:scale-110">
                  <Icon size={56} className="animate-pulse" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <div className={`px-5 py-1.5 rounded-full font-mono text-[9px] font-black uppercase tracking-[0.2em] border backdrop-blur-md ${
                    path.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    path.difficulty === 'Intermediate' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                    path.difficulty === 'Professional' ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20 shadow-[0_0_15px_rgba(0,245,255,0.1)]' :
                    'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_20px_rgba(255,0,0,0.2)]'
                  }`}>
                    {path.difficulty}
                  </div>
                  <div className="flex items-center gap-2.5 text-[9px] font-mono text-text-muted uppercase tracking-[0.3em] font-black">
                     <Clock size={16} className="text-accent-primary" />
                     {path.estimatedTime}
                  </div>
                  <div className="flex items-center gap-2.5 text-[9px] font-mono text-text-muted uppercase tracking-[0.3em] font-black">
                     <Terminal size={16} className="text-accent-primary" />
                     {path.modules.length} MODULES_VERIFIED
                  </div>
                </div>
                <h1 className="font-orbitron text-5xl md:text-7xl font-black text-text-primary uppercase italic leading-[0.9] tracking-tighter">
                  {path.title}
                </h1>
                <p className="text-text-muted max-w-2xl font-medium leading-relaxed uppercase opacity-80 italic text-base">
                  {path.description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Roadmap */}
          <div className="relative space-y-16">
            {/* Vertical Line with Gradient */}
            <div className="absolute left-[39px] md:left-[47px] top-12 bottom-12 w-0.5 bg-gradient-to-b from-accent-primary/40 via-accent-primary/5 to-transparent hidden sm:block" />

            {path.modules.map((module, idx) => {
              const post = blogPosts.find(p => p.slug === module.slug);
              
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="relative pl-16 md:pl-32 group/module"
                >
                  {/* Step Connector Node */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 md:w-32 h-px bg-white/5 group-hover/module:bg-accent-primary/20 group-hover/module:w-40 transition-all duration-500 hidden sm:block" />
                  <div className="absolute left-[31px] md:left-[39px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-4 border-bg bg-white/10 z-10 hidden sm:block group-hover/module:border-accent-primary/40 group-hover/module:bg-accent-primary transition-all duration-500 shadow-xl">
                     <div className="absolute inset-0 rounded-full bg-accent-primary opacity-0 group-hover/module:opacity-100 group-hover/module:animate-ping duration-1000" />
                  </div>

                  <Link 
                    to={`/blog/${module.slug}`}
                    className="block p-8 md:p-12 glass-card border border-border-color hover:border-accent-primary/40 hover:bg-white/[0.02] transition-all duration-700 rounded-[2.5rem] relative overflow-hidden group/card"
                    style={{ background: 'var(--bg-card)' }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="text-[10px] font-mono text-accent-primary font-black uppercase tracking-[0.4em]">MISSION_PROTOCOL 0{idx + 1}</span>
                          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg font-mono text-[9px] text-text-muted font-black uppercase tracking-widest">
                            {module.type}
                          </span>
                          {post?.isPremium && (
                             <span className="flex items-center gap-1.5 px-2 py-0.5 bg-accent-primary/10 border border-accent-primary/20 rounded text-[8px] font-mono text-accent-primary font-black uppercase tracking-tighter">
                               <Zap size={10} fill="currentColor" /> PREMIUM_LEVEL
                             </span>
                          )}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-orbitron font-black text-text-primary group-hover/card:text-accent-primary transition-colors uppercase italic leading-tight tracking-tight">
                          {module.title}
                        </h3>
                        {post && (
                          <p className="text-sm text-text-muted font-medium line-clamp-2 opacity-70 group-hover/card:opacity-100 transition-opacity max-w-2xl leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0 flex items-center gap-8 md:border-l border-white/10 md:pl-10">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-center text-text-muted group-hover/card:bg-accent-primary group-hover/card:text-black group-hover/card:scale-110 group-hover/card:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all duration-500">
                          <Play size={24} className="group-hover/card:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Module ID watermark */}
                    <div className="absolute -bottom-4 -right-2 font-mono text-[60px] font-black text-white/[0.02] group-hover/card:text-accent-primary/[0.05] transition-colors pointer-events-none select-none italic">
                      0{idx + 1}
                    </div>
                  </Link>
                </motion.div>
              );
            })}

            {/* Completion Node */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative pl-16 md:pl-32"
            >
               <div className="absolute left-[31px] md:left-[39px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-accent-primary/20 border border-accent-primary/40 hidden sm:block animate-pulse" />
               <div className="p-16 border-2 border-dashed border-accent-primary/20 rounded-[3rem] text-center space-y-8 bg-accent-primary/[0.01] relative overflow-hidden group/final">
                 <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-secondary-blue/5 opacity-0 group-hover/final:opacity-100 transition-opacity duration-1000" />
                 
                 <div className="relative z-10">
                   <div className="w-20 h-20 mx-auto bg-accent-primary/5 rounded-[2rem] flex items-center justify-center text-accent-primary border border-accent-primary/20 mb-8 group-hover/final:scale-110 group-hover/final:rotate-12 transition-all duration-700">
                     <Award size={48} />
                   </div>
                   <h4 className="font-orbitron font-black text-3xl text-text-primary uppercase italic mb-4 tracking-tighter">CURRICULUM_TERMINATED</h4>
                   <p className="text-xs font-mono text-text-muted uppercase tracking-[0.5em] font-black mb-10 opacity-60 italic">Complete all missions to synchronize certification status</p>
                   
                   <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4">
                      <Link 
                        to="/paths"
                        className="w-full md:w-auto px-10 py-4 border border-border-color text-text-primary rounded-full font-orbitron font-black text-[10px] tracking-[0.4em] uppercase hover:bg-white/5 transition-all"
                      >
                        BACK_TO_PATH_ROOT
                      </Link>
                      <Link 
                        to="/contact"
                        className="w-full md:w-auto px-10 py-4 bg-accent-primary text-black rounded-full font-orbitron font-black text-[10px] tracking-[0.4em] uppercase shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:scale-105 transition-all"
                      >
                        REQUEST_EVALUATION_PROTOCOLS
                      </Link>
                   </div>
                 </div>
               </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

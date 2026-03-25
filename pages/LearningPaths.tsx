import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Shield, Globe, Target, Zap, ArrowRight, 
  Clock, Award, BookOpen, ChevronRight,
  Lock, CheckCircle2, Play, Activity, Sparkles, Database
} from 'lucide-react';
import { learningPaths } from '../data/learningPaths';

const iconMap = {
  Shield: Shield,
  Globe: Globe,
  Target: Target,
  Zap: Zap
};

export const LearningPaths: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg selection:bg-accent-primary/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen z-0">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-accent-primary/5 rounded-full blur-[150px] -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary-blue/5 rounded-full blur-[180px] translate-x-1/4" />
      </div>

      <div className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-24 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-primary/10 border border-accent-primary/20 rounded-full font-mono text-[10px] text-accent-primary tracking-[0.4em] font-black uppercase italic mb-8">
              <Award size={14} className="animate-bounce" /> Operative Training Curricula v5.0.2
            </div>
            <h1 className="font-orbitron text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none italic text-text-primary uppercase flex flex-col items-center">
              LEARNING <span className="text-accent-primary drop-shadow-[0_0_20px_var(--accent-glow)]">PATHS</span>
            </h1>
            <p className="text-text-muted max-w-2xl mx-auto font-medium text-lg leading-relaxed uppercase opacity-80 tracking-wide">
              Structured multi-tier roadmaps designed to guide you from security 
              fundamentals to elite-level vulnerability research and exploitation.
            </p>
          </motion.div>

          {/* Paths Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {learningPaths.map((path, index) => {
              const Icon = iconMap[path.icon as keyof typeof iconMap] || Activity;
              
              return (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.7 }}
                  className="group"
                >
                  <Link 
                    to={`/paths/${path.id}`}
                    className="block p-10 md:p-14 glass-card border border-border-color hover:border-accent-primary/40 transition-all duration-700 rounded-[3rem] relative overflow-hidden h-full group/card"
                    style={{ background: 'var(--bg-card)' }}
                  >
                    {/* Background Icon Glow - Dynamic on hover */}
                    <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover/card:opacity-[0.1] group-hover/card:scale-110 group-hover/card:rotate-12 transition-all duration-1000">
                      <Icon size={240} className="text-accent-primary" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-10">
                        <div className="w-20 h-20 rounded-[2rem] bg-accent-primary/5 flex items-center justify-center text-accent-primary border border-white/5 group-hover/card:bg-accent-primary group-hover/card:text-black group-hover/card:scale-110 transition-all duration-700 shadow-2xl">
                          <Icon size={40} className="transition-transform group-hover/card:rotate-[360deg] duration-1000" />
                        </div>
                        <div className={`px-5 py-2 rounded-full font-mono text-[10px] font-black uppercase tracking-[0.2em] border backdrop-blur-md shadow-lg ${
                          path.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          path.difficulty === 'Intermediate' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                          path.difficulty === 'Professional' ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20 shadow-[0_0_20px_rgba(0,245,255,0.15)]' :
                          'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_25px_rgba(255,0,0,0.3)]'
                        }`}>
                          {path.difficulty}
                        </div>
                      </div>

                      <h3 className="font-orbitron font-black text-3xl md:text-4xl text-text-primary mb-6 uppercase italic group-hover/card:text-accent-primary transition-colors leading-tight">
                        {path.title}
                      </h3>
                      
                      <p className="text-text-muted text-base font-medium leading-relaxed mb-12 flex-grow opacity-80 group-hover/card:opacity-100 transition-opacity">
                        {path.description}
                      </p>

                      <div className="flex items-end justify-between pt-10 border-t border-white/5">
                        <div className="flex gap-10">
                          <div className="space-y-2">
                            <span className="text-[9px] font-mono text-text-muted uppercase tracking-[0.3em] font-black opacity-40">Temporal_Commitment</span>
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-accent-primary">
                                <Clock size={16} />
                              </div>
                              <span className="text-sm font-mono font-black text-text-primary uppercase tracking-widest">
                                {path.estimatedTime}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <span className="text-[9px] font-mono text-text-muted uppercase tracking-[0.3em] font-black opacity-40">Curriculum_Depth</span>
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-accent-primary">
                                <BookOpen size={16} />
                              </div>
                              <span className="text-sm font-mono font-black text-text-primary uppercase tracking-widest">
                                {path.modules.length} MODULES
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-accent-primary group-hover/card:bg-accent-primary group-hover/card:text-black group-hover/card:scale-110 group-hover/card:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all duration-500">
                          <ArrowRight size={28} className="group-hover/card:translate-x-1.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* CTA / Callout */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-32 p-16 glass-card rounded-[4rem] border border-accent-primary/20 bg-accent-primary/[0.01] text-center relative overflow-hidden group/cta"
          >
             <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover/cta:opacity-[0.08] transition-opacity duration-1000">
                <Sparkles size={180} className="text-accent-primary" />
             </div>
             
            <div className="w-20 h-20 mx-auto bg-accent-primary/5 rounded-[2rem] flex items-center justify-center text-accent-primary border border-accent-primary/20 mb-10 group-hover/cta:scale-110 group-hover/cta:bg-accent-primary group-hover/cta:text-black transition-all duration-700">
               <Lock size={40} />
            </div>
            
            <h2 className="font-orbitron font-black text-4xl md:text-5xl text-text-primary uppercase italic mb-8 tracking-tight">ELEVATE YOUR TACTICAL LEVEL</h2>
            <p className="text-text-muted max-w-2xl mx-auto font-medium text-lg leading-relaxed uppercase opacity-80 mb-12">
              Each module is curated from live research dossiers and industry-validated 
              operational reports. Master the art of technical exploitation through 
              structured, project-based advancement.
            </p>
            <div className="pt-4 flex flex-col md:flex-row items-center justify-center gap-6">
              <Link 
                to="/blog"
                className="w-full md:w-auto inline-flex items-center justify-center gap-4 px-12 py-5 bg-accent-primary text-black rounded-full font-orbitron font-black text-xs tracking-widest uppercase shadow-[0_0_35px_rgba(0,245,255,0.4)] hover:scale-105 active:scale-95 transition-all"
              >
                INITIALIZE_FULL_RESEARCH_SYNC <ArrowRight size={16} />
              </Link>
              <Link 
                to="/database"
                className="w-full md:w-auto inline-flex items-center justify-center gap-4 px-12 py-5 border border-border-color text-text-primary rounded-full font-orbitron font-black text-xs tracking-widest uppercase hover:bg-white/5 transition-all"
              >
                ACCESS_THREAT_DATABASE <Database size={16} className="text-accent-primary" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

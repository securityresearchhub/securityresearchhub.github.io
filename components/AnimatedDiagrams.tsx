import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Server, Database, ShieldAlert, ArrowRight, Lock, Unlock, Search, Globe, ChevronRight, Activity } from 'lucide-react';

export const AnimatedWorkflowDiagram: React.FC<{ externalStep?: number; speed?: number }> = ({ externalStep, speed = 1 }) => {
  const [step, setStep] = useState(0);

  // Sync with external control if provided
  useEffect(() => {
    if (externalStep !== undefined) {
      setStep(externalStep % 4);
    }
  }, [externalStep]);

  useEffect(() => {
    if (externalStep !== undefined) return; // Disable internal timer if externally controlled
    
    const timer = setInterval(() => {
      setStep(s => (s + 1) % 4);
    }, 2500 / speed);
    return () => clearInterval(timer);
  }, [externalStep, speed]);

  return (
    <div className="p-8 md:p-12 rounded-2xl border border-border-color bg-bg-card overflow-hidden relative min-h-[350px] flex flex-col items-center justify-center">
      <div className="flex items-center w-full max-w-4xl justify-between relative z-10">
        <motion.div className="flex flex-col items-center gap-3">
          <div className={`p-4 rounded-xl border ${step === 0 ? 'border-accent-primary bg-accent-primary/10 shadow-[0_0_20px_var(--accent-glow-subtle)]' : 'border-border-color bg-bg-primary'}`}>
            <User size={24} className={step === 0 ? 'text-accent-primary' : 'text-text-muted'} />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">User</span>
        </motion.div>

        <div className="flex-1 px-4 relative flex items-center justify-center">
          <div className="w-full h-px border-t border-dashed border-border-color absolute" />
          <AnimatePresence>
            {step === 0 && (
              <motion.div
                initial={{ left: '0%' }}
                animate={{ left: '100%' }}
                transition={{ duration: 1, ease: 'linear' }}
                className="absolute w-12 h-6 bg-accent-primary/20 border border-accent-primary rounded-full flex items-center justify-center -translate-y-1/2 -mt-3 text-[8px] font-mono font-bold text-green-700 dark:text-accent-primary"
              >
                req
              </motion.div>
            )}
            {step === 1 && (
              <motion.div
                initial={{ left: '0%' }}
                animate={{ left: '100%' }}
                transition={{ duration: 1, ease: 'linear' }}
                className="absolute w-20 h-6 bg-red-500/20 border border-red-500 rounded-full flex items-center justify-center -translate-y-1/2 -mt-3 text-[8px] font-mono font-bold text-red-700 dark:text-red-500"
              >
                id=101 ❗
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div className="flex flex-col items-center gap-3">
          <div className={`p-4 rounded-xl border ${step === 2 ? 'border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-border-color bg-bg-primary'}`}>
            <Server size={24} className={step === 2 ? 'text-red-500' : 'text-text-muted'} />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">API Endpoint</span>
        </motion.div>

        <div className="flex-1 px-4 relative flex items-center justify-center">
          <div className="w-full h-px border-t border-dashed border-border-color absolute" />
          <AnimatePresence>
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute text-red-500 bg-bg px-2"
              >
                <Unlock size={16} />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                initial={{ right: '0%' }}
                animate={{ right: '100%' }}
                transition={{ duration: 1, ease: 'linear' }}
                className="absolute w-16 h-6 bg-red-500/20 border border-red-500 rounded-full flex items-center justify-center -translate-y-1/2 -mt-3 text-[8px] font-mono font-bold text-red-700 dark:text-red-500"
              >
                leak
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div className="flex flex-col items-center gap-3">
          <div className={`p-4 rounded-xl border ${step === 3 ? 'border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-border-color bg-bg-primary'}`}>
            <Database size={24} className={step === 3 ? 'text-red-500' : 'text-text-muted'} />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">Database</span>
        </motion.div>
      </div>

      <div className="mt-12 h-16 flex items-center justify-center text-center max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="font-mono text-[10px] uppercase tracking-widest leading-relaxed text-text-primary"
          >
            {step === 0 && '1. Attacker initiates standard request'}
            {step === 1 && <span className="text-red-600 dark:text-red-400 font-medium">2. Parameter Manipulation: Modifies ID in transit</span>}
            {step === 2 && <span className="text-red-700 dark:text-red-500 font-bold">3. Missing Authorization: Server fails to validate ownership</span>}
            {step === 3 && <span className="text-red-700 dark:text-red-500 font-bold border border-red-500/30 bg-red-500/10 px-3 py-1 rounded inline-block">4. Data Leakage: Unauthorized data returned</span>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export const AnimatedArchDiagram: React.FC = () => {
  return (
    <div className="p-8 rounded-2xl border border-border-color bg-bg-card overflow-hidden">
      <div className="flex flex-col items-center gap-4 relative">
        <div className="w-px h-full bg-border-color absolute left-1/2 -ml-px z-0" />
        
        <motion.div 
          whileInView={{ y: 0, opacity: 1 }} initial={{ y: -20, opacity: 0 }}
          className="bg-bg-primary border border-border-color p-5 rounded-2xl w-full max-w-xl flex items-center gap-6 relative z-10 backdrop-blur-sm"
        >
          <Globe className="text-accent-primary" />
          <div>
            <div className="font-orbitron font-black text-xs uppercase text-text-primary">Browser / Client</div>
            <div className="font-mono text-[8px] text-gray-600 dark:text-text-muted font-bold uppercase mt-1">Presentation Layer</div>
          </div>
        </motion.div>

        <motion.div 
          whileInView={{ y: 0, opacity: 1 }} initial={{ y: -20, opacity: 0 }} transition={{ delay: 0.1 }}
          className="bg-bg-primary border border-border-color p-5 rounded-2xl w-full max-w-xl flex items-center gap-6 relative z-10 backdrop-blur-sm"
        >
          <Server className="text-text-muted" />
          <div>
            <div className="font-orbitron font-black text-xs uppercase text-text-primary">API Gateway</div>
            <div className="font-mono text-[8px] text-gray-600 dark:text-text-muted font-bold uppercase mt-1">Routing & Rate Limiting</div>
          </div>
        </motion.div>

        <motion.div 
          whileInView={{ y: 0, opacity: 1 }} initial={{ y: -20, opacity: 0 }} transition={{ delay: 0.2 }}
          className="bg-red-500/5 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.1)] p-5 rounded-2xl w-full max-w-xl flex items-center gap-6 relative z-10 backdrop-blur-sm"
        >
          <Activity className="text-red-500" />
          <div className="flex-1">
            <div className="font-orbitron font-black text-xs uppercase text-red-500 flex justify-between">
              Application Server
              <ShieldAlert size={14} className="animate-pulse" />
            </div>
            <div className="font-mono text-[8px] text-red-600 dark:text-red-400/70 font-bold uppercase mt-1">Failure Point: Missing Object Auth</div>
          </div>
        </motion.div>

        <motion.div 
          whileInView={{ y: 0, opacity: 1 }} initial={{ y: -20, opacity: 0 }} transition={{ delay: 0.3 }}
          className="bg-bg-primary border border-border-color p-5 rounded-2xl w-full max-w-xl flex items-center gap-6 relative z-10 backdrop-blur-sm"
        >
          <Database className="text-text-muted" />
          <div>
            <div className="font-orbitron font-black text-xs uppercase text-text-primary">Database</div>
            <div className="font-mono text-[8px] text-gray-600 dark:text-text-muted font-bold uppercase mt-1">Data Storage Layer</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const AnimatedRootCauseDiagram: React.FC<{ externalStep?: number }> = ({ externalStep }) => {
  const steps = [
    { label: 'User Controlled ID', icon: User, color: 'text-text-muted', desc: 'Client supplies target object identifier' },
    { label: 'Missing Authorization Check', icon: ShieldAlert, color: 'text-orange-500', desc: 'Server fails to verify ownership mapping' },
    { label: 'Direct Database Query', icon: Search, color: 'text-red-600 dark:text-red-400', desc: 'Query executes using untrusted input directly' },
    { label: 'Unauthorized Data Exposure', icon: Unlock, color: 'text-red-700 dark:text-red-500', desc: 'Sensitive data returned to attacker' },
  ];

  return (
    <div className="p-8 md:p-12 rounded-2xl border border-border-color bg-bg-card overflow-hidden">
      <div className="space-y-6 max-w-4xl mx-auto">
        {steps.map((st, i) => {
          const isActive = externalStep !== undefined && (externalStep % steps.length) === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              animate={isActive ? { scale: 1.02, borderColor: 'rgba(239, 68, 68, 0.5)' } : { scale: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className={`p-4 rounded-xl border flex items-center gap-4 transition-all duration-300 ${isActive || i === steps.length - 1 && externalStep === undefined ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-bg-primary border-border-color'}`}
            >
              <div className={`p-3 rounded-xl bg-bg-secondary ${isActive ? 'bg-red-500/20' : ''}`}>
                <st.icon size={18} className={isActive ? 'text-red-500' : st.color} />
              </div>
              <div>
                <div className={`font-orbitron font-black text-xs uppercase ${isActive ? 'text-red-500' : st.color}`}>{st.label}</div>
                <div className="font-mono text-[9px] text-text-muted uppercase mt-1 tracking-widest opacity-70">{st.desc}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

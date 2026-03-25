import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ShieldCheck, Bug, Terminal, ChevronRight, Lock, Unlock, Zap } from 'lucide-react';

interface CyberLabProps {
  vulnerability: string;
  insecureCode: string;
  secureCode: string;
  explanation: string;
}

export const CyberLab: React.FC<CyberLabProps> = ({ vulnerability, insecureCode, secureCode, explanation }) => {
  const [showSecure, setShowSecure] = useState(false);

  return (
    <div className="my-16 flex flex-col gap-6">
      <div className="flex items-center justify-between px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${showSecure ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
            {showSecure ? <ShieldCheck size={20} /> : <Bug size={20} />}
          </div>
          <div>
            <h4 className="text-sm font-orbitron font-black text-white uppercase tracking-widest">
              Laboratory Analysis: {vulnerability}
            </h4>
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest opacity-60">
              Interactive Remediation Protocol
            </p>
          </div>
        </div>
        
        <div className="flex bg-bg-secondary p-1 rounded-xl border border-border-color">
          <button 
            onClick={() => setShowSecure(false)}
            className={`px-4 py-2 rounded-lg text-[9px] font-mono font-black uppercase tracking-widest transition-all ${!showSecure ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-text-muted hover:text-white'}`}
          >
            Insecure
          </button>
          <button 
            onClick={() => setShowSecure(true)}
            className={`px-4 py-2 rounded-lg text-[9px] font-mono font-black uppercase tracking-widest transition-all ${showSecure ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'text-text-muted hover:text-black hover:bg-white/10'}`}
          >
            Secure
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="relative group">
          <div className="absolute top-4 right-4 z-10">
             {showSecure ? <Lock size={14} className="text-green-500" /> : <Unlock size={14} className="text-red-500" />}
          </div>
          <motion.div 
            key={showSecure ? 'secure' : 'insecure'}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-6 rounded-3xl border-2 h-full font-mono text-xs leading-relaxed overflow-hidden transition-all ${showSecure ? 'bg-green-500/[0.02] border-green-500/20 shadow-[inset_0_0_30px_rgba(34,197,94,0.05)]' : 'bg-red-500/[0.02] border-red-500/20 shadow-[inset_0_0_30px_rgba(239,68,68,0.05)]'}`}
          >
            <div className="flex items-center gap-2 mb-4 opacity-40">
              <Terminal size={12} />
              <span className="text-[10px] tracking-widest font-black uppercase italic">
                {showSecure ? 'HARDEN_SOURCE_V2' : 'VULNERABLE_SOURCE_ORIGIN'}
              </span>
            </div>
            <pre className="whitespace-pre-wrap break-all">
              {showSecure ? secureCode : insecureCode}
            </pre>
          </motion.div>
        </div>

        <div className="flex flex-col gap-6 p-8 border border-white/10 rounded-3xl bg-white/[0.02] relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 blur-3xl rounded-full" />
           
           <div className="flex items-center gap-2 text-accent-primary mb-2">
              <Zap size={16} />
              <span className="text-[11px] font-orbitron font-black uppercase tracking-[0.3em]">Tactical Insight</span>
           </div>
           
           <p className="text-sm text-text-primary/70 leading-relaxed italic border-l-2 border-white/10 pl-6">
             {explanation}
           </p>
           
           <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Remediation Status</span>
                <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${showSecure ? 'text-green-500' : 'text-red-500 animate-pulse'}`}>
                  {showSecure ? 'VERIFIED' : 'CRITICAL_FIX_REQUIRED'}
                </span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: showSecure ? '100%' : '15%' }}
                  className={`h-full transition-all duration-700 ${showSecure ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}
                />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

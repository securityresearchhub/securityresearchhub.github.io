import React from 'react';
import { Search, X, Shield, Target, Zap, Activity, Info, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BlogPost } from '../types';

interface AdvancedSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ value, onChange }) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const handleClear = () => {
    onChange('');
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative max-w-2xl mx-auto mb-16 px-4">
      <div className={`
        relative flex items-center gap-4 p-2 pl-6 bg-white/[0.02] border-2 rounded-[2rem] transition-all duration-500
        ${isFocused ? 'border-accent-primary shadow-[0_0_30px_rgba(0,245,255,0.15)] bg-white/[0.04]' : 'border-white/5'}
      `}>
        <Search size={22} className={`${isFocused ? 'text-accent-primary' : 'text-text-muted'} transition-colors duration-500`} />
        
        <input
          type="text"
          value={value}
          onChange={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="SEARCH BY CVE, CWE, MITRE, OR DOSSIER NAME..."
          className="flex-grow bg-transparent border-none outline-none font-mono text-xs font-black tracking-widest text-text-primary placeholder:text-text-muted/30 placeholder:italic py-4 uppercase h-full"
        />

        {value && (
          <button 
            onClick={handleClear}
            className="p-2 hover:bg-white/10 rounded-full text-text-muted hover:text-accent-primary transition-all active:scale-90"
          >
            <X size={18} />
          </button>
        )}

        <div className="hidden md:flex gap-1 pr-4">
           <div className={`px-2 py-1 rounded border text-[8px] font-mono font-black tracking-tighter transition-all ${isFocused ? 'bg-accent-primary/10 border-accent-primary/30 text-accent-primary' : 'bg-white/5 border-white/10 text-text-muted/40'}`}>
             UPLINK_LIVE
           </div>
        </div>
      </div>

      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-4 z-50 p-6 glass-card border border-accent-primary/20 bg-bg-card shadow-2xl rounded-3xl"
          >
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-3 text-accent-primary font-mono text-[9px] font-black uppercase tracking-[0.3em]">
                 <Zap size={14} fill="currentColor" />
                 <span>Advanced Neural Query Active</span>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: 'CVE-ID', icon: <Shield size={12} />, color: 'text-text-primary' },
                    { label: 'CWE-ID', icon: <Target size={12} />, color: 'text-text-primary' },
                    { label: 'MITRE', icon: <Activity size={12} />, color: 'text-text-primary' },
                    { label: 'OWASP', icon: <Info size={12} />, color: 'text-text-primary' },
                    { label: 'TOPIC', icon: <Filter size={12} />, color: 'text-text-primary' },
                    { label: 'NAME', icon: <Search size={12} />, color: 'text-text-primary' }
                  ].map((tip, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-white/5 border border-white/5 rounded-xl hover:border-accent-primary/20 hover:bg-white/[0.08] transition-all cursor-default">
                       <div className="p-1.5 bg-accent-primary/10 rounded-lg text-accent-primary">
                          {tip.icon}
                       </div>
                       <span className="text-[10px] font-mono font-black text-text-muted uppercase tracking-widest">{tip.label}</span>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

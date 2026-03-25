import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Globe, Database, ShieldCheck } from 'lucide-react';

interface ProtocolProps {
  protocols: string[];
}

export const ProtocolMapping: React.FC<ProtocolProps> = ({ protocols }) => {
  return (
    <div className="my-16 p-8 md:p-12 border border-border-color rounded-[2.5rem] bg-white/[0.01]">
      <h3 className="text-xl font-orbitron font-black text-text-primary uppercase tracking-widest mb-10 flex items-center gap-3">
        <Globe className="text-accent-primary" size={20} />
        23 PROTOCOL MAPPING
      </h3>

      <div className="flex flex-wrap gap-6 items-center justify-center">
        {protocols.map((protocol, i) => (
          <React.Fragment key={protocol}>
            <motion.div 
              className="flex flex-col items-center gap-4 group"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 rounded-2xl bg-white/[0.02] border border-border-color flex items-center justify-center relative overflow-hidden group-hover:border-accent-primary transition-colors duration-500">
                <div className="absolute inset-0 bg-accent-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Cpu className="text-accent-primary group-hover:scale-110 transition-transform duration-500" size={32} />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono font-black text-accent-primary uppercase tracking-widest">{protocol}</span>
                <span className="text-[8px] font-mono text-text-muted font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">PROTOCOL_LAYER</span>
              </div>
            </motion.div>
            {i < protocols.length - 1 && (
              <div className="hidden md:block w-12 h-px bg-border-color opacity-20" />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-2xl border border-border-color bg-white/[0.01] flex items-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary shrink-0">
          <ShieldCheck size={24} />
        </div>
        <p className="text-xs text-text-muted leading-relaxed font-mono">
          <span className="text-text-primary font-black uppercase tracking-widest">PROTOCOL STACK INTEGRITY:</span> These protocols form the primary communication vector for this vulnerability. Security analysis focuses on the interception and manipulation of these specific packet types.
        </p>
      </div>
    </div>
  );
};

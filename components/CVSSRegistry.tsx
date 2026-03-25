import React from 'react';
import { motion } from 'motion/react';
import { Target, Shield, Zap, Info } from 'lucide-react';

interface CVSSProps {
  score: number;
  vector: string;
  severity: string;
  metrics: { [key: string]: string };
}

export const CVSSRegistry: React.FC<CVSSProps> = ({ score, vector, severity, metrics }) => {
  return (
    <div className="my-16 p-8 md:p-12 border border-border-color rounded-[2.5rem] bg-white/[0.01]">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Score Card */}
        <div className="lg:w-1/3 flex flex-col items-center justify-center p-10 rounded-[2rem] border border-border-color bg-white/[0.02] relative overflow-hidden group">
          <div className="absolute inset-0 bg-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <span className="text-[10px] font-mono font-black text-accent-primary uppercase tracking-[0.4em] mb-4">CVSS v4.0 SCORE</span>
          <motion.div 
            className="text-7xl font-orbitron font-black text-text-primary mb-2 italic"
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            viewport={{ once: true }}
          >
            {score.toFixed(1)}
          </motion.div>
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-mono font-black uppercase tracking-widest border ${
            severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]' :
            severity === 'HIGH' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
            'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
          }`}>
            {severity}
          </div>
          
          <div className="mt-8 text-[9px] font-mono text-text-muted/50 break-all text-center leading-relaxed">
            {vector}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="lg:w-2/3">
          <h3 className="text-xl font-orbitron font-black text-text-primary uppercase tracking-widest mb-8 flex items-center gap-3">
            <Target className="text-accent-primary" size={20} />
            10 CVSS ANALYSIS
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(metrics).map(([key, value], i) => (
              <motion.div 
                key={key}
                className="p-4 rounded-xl border border-border-color bg-white/[0.02] flex items-center justify-between group hover:border-accent-primary/20 transition-colors"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-text-muted uppercase tracking-widest mb-1">{key}</span>
                  <span className="text-sm font-orbitron font-black text-text-primary uppercase">{value}</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-accent-primary/30 group-hover:text-accent-primary transition-colors">
                  <Shield size={14} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-2 text-[10px] font-mono text-text-muted italic bg-white/5 p-4 rounded-xl border border-border-color">
            <Info size={14} className="text-accent-primary" />
            <span>This score reflects the inherent risk based on CVSS v4.0 metrics as applied to a standard enterprise web environment.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

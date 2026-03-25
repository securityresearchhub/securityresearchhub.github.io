import React from 'react';
import { motion } from 'motion/react';
import { Shield, Database, Activity, AlertTriangle } from 'lucide-react';

interface CIAProps {
  confidentiality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  integrity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  availability: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'CRITICAL': return 'text-red-500 bg-red-500/10 border-red-500/20';
    case 'HIGH': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    case 'LOW': return 'text-green-500 bg-green-500/10 border-green-500/20';
    default: return 'text-text-muted bg-white/5 border-border-color';
  }
};

const getLevelWidth = (level: string) => {
  switch (level) {
    case 'CRITICAL': return '100%';
    case 'HIGH': return '75%';
    case 'MEDIUM': return '50%';
    case 'LOW': return '25%';
    default: return '0%';
  }
};

export const CIATriadAnalysis: React.FC<CIAProps> = ({ confidentiality, integrity, availability, description }) => {
  const pillars = [
    { label: 'Confidentiality', level: confidentiality, icon: Shield, desc: 'Protection of sensitive information from unauthorized access.' },
    { label: 'Integrity', level: integrity, icon: Database, desc: 'Maintaining the accuracy and consistency of data over its lifecycle.' },
    { label: 'Availability', level: availability, icon: Activity, desc: 'Ensuring reliable access to information by authorized users.' }
  ];

  return (
    <div className="my-16 p-8 md:p-12 border border-border-color rounded-[2.5rem] bg-white/[0.01] relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <ShieldAlert size={120} className="text-accent-primary" />
      </div>

      <h3 className="text-2xl font-orbitron font-black text-text-primary uppercase tracking-widest mb-10 flex items-center gap-4">
        <Activity className="text-accent-primary" size={24} />
        09 IMPACT ANALYSIS (CIA TRIAD)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {pillars.map((pillar, i) => (
          <motion.div 
            key={i}
            className="flex flex-col gap-4 p-6 rounded-3xl border border-border-color bg-white/[0.02]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between">
              <pillar.icon size={20} className="text-accent-primary" />
              <span className={`text-[10px] font-mono font-black px-3 py-1 rounded-full border ${getLevelColor(pillar.level)}`}>
                {pillar.level}
              </span>
            </div>
            <div>
              <div className="font-orbitron font-black text-xs uppercase tracking-widest text-text-primary mb-1">{pillar.label}</div>
              <div className="text-[10px] text-text-muted leading-relaxed">{pillar.desc}</div>
            </div>
            <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${pillar.level === 'CRITICAL' ? 'bg-red-500' : pillar.level === 'HIGH' ? 'bg-orange-500' : pillar.level === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'}`}
                initial={{ width: 0 }}
                whileInView={{ width: getLevelWidth(pillar.level) }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: true }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-6 rounded-2xl border border-accent-primary/10 bg-accent-primary/[0.02] flex gap-4">
        <div className="text-accent-primary shrink-0 pt-1">
          <AlertTriangle size={18} />
        </div>
        <p className="text-sm text-text-muted leading-relaxed italic">
          <span className="font-bold text-accent-primary not-italic">TACTICAL ASSESSMENT:</span> {description}
        </p>
      </div>
    </div>
  );
};

const ShieldAlert: React.FC<{ size: number, className: string }> = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

import React from 'react';
import { Shield, Target, Activity, Zap, ExternalLink, AlertTriangle, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface IntelligenceCardsProps {
  intel?: {
    cwe: string;
    cvss: number;
    mitre: string;
    owasp: string;
    cve?: string;
    related: string[];
  };
}

export const IntelligenceCards: React.FC<IntelligenceCardsProps> = ({ intel }) => {
  if (!intel) return null;

  const getSeverityData = (cvss: number) => {
    if (cvss >= 9.0) return { label: 'CRITICAL', color: 'text-[#FF0000]', bg: 'bg-[#FF0000]/10', border: 'border-[#FF0000]/20' };
    if (cvss >= 7.0) return { label: 'HIGH', color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/20' };
    if (cvss >= 4.0) return { label: 'MEDIUM', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/20' };
    return { label: 'LOW', color: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20' };
  };

  const severity = getSeverityData(intel.cvss);

  const cards = [
    {
      title: 'CWE Mapping',
      value: intel.cwe,
      icon: <Target size={18} className="text-accent-primary" />,
      desc: 'Common Weakness Enumeration'
    },
    {
      title: 'MITRE ATT&CK',
      value: intel.mitre,
      icon: <Activity size={18} className="text-[#00F5FF]" />,
      desc: 'Adversarial Tactics & Techniques'
    },
    {
      title: 'OWASP Category',
      value: intel.owasp,
      icon: <Shield size={18} className="text-[#A855F7]" />,
      desc: 'Top 10 Risk Classification'
    },
    ...(intel.cve ? [{
      title: 'CVE ID',
      value: intel.cve,
      icon: <Search size={18} className="text-[#F59E0B]" />,
      desc: 'Common Vulnerabilities'
    }] : [])
  ];

  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* CVSS Severity Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`p-6 glass-card border-2 ${severity.border} ${severity.bg} relative overflow-hidden group`}
      >
        <div className="absolute top-0 right-0 p-2">
          <AlertTriangle size={14} className={severity.color} />
        </div>
        <div className="flex flex-col h-full">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-50 mb-2">Threat Severity</span>
          <div className="flex items-baseline gap-2 mb-1">
            <span className={`text-4xl font-orbitron font-black ${severity.color}`}>{intel.cvss.toFixed(1)}</span>
            <span className="text-xs font-mono opacity-40">/ 10.0</span>
          </div>
          <div className={`text-[10px] font-black font-mono px-2 py-0.5 rounded ${severity.bg} ${severity.color} self-start border ${severity.border}`}>
            {severity.label}
          </div>
          <div className="mt-auto pt-4 border-t border-white/5">
             <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${intel.cvss * 10}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className={`h-full ${severity.color === 'text-[#FF0000]' ? 'bg-[#FF0000]' : severity.color === 'text-[#EF4444]' ? 'bg-[#EF4444]' : severity.color === 'text-[#F59E0B]' ? 'bg-[#F59E0B]' : 'bg-[#10B981]'}`}
                />
             </div>
          </div>
        </div>
      </motion.div>

      {/* Intelligence Cards */}
      {cards.map((card, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 * (idx + 1) }}
          className="p-6 glass-card border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/5 rounded-lg group-hover:bg-accent-primary/10 transition-colors">
              {card.icon}
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-40 italic">{card.desc}</span>
          </div>
          <h3 className="text-white font-orbitron text-sm font-black tracking-wider uppercase mb-2">
            {card.title}
          </h3>
          <p className="text-accent-primary font-mono text-xs font-bold bg-accent-primary/5 p-2 rounded border border-accent-primary/10">
            {card.value}
          </p>
        </motion.div>
      ))}

      {/* Related Vulnerabilities (Global Footer Style) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="md:col-span-2 lg:col-span-4 p-6 glass-card border-white/5 bg-white/[0.01] flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-accent-primary/10 rounded-full">
            <Zap size={20} className="text-accent-primary" />
          </div>
          <div>
            <h4 className="text-sm font-orbitron font-black text-white uppercase tracking-widest">Cross-Linked Vulnerabilities</h4>
            <p className="text-xs text-text-muted mt-1 font-mono opacity-50">Logically connected security patterns in this mission track.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {intel.related.map((rel, idx) => (
            <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-text-primary hover:border-accent-primary/30 transition-colors cursor-default">
              #{rel.replace(/\s+/g, '_').toUpperCase()}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

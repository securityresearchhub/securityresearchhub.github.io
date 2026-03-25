import React from 'react';
import { motion } from 'motion/react';
import { Shield, Target, Activity, Search, Database, Cpu, Globe } from 'lucide-react';

interface GlobalIntelligenceProps {
  cwe?: string;
  tech?: string[];
}

export const GlobalIntelligence: React.FC<GlobalIntelligenceProps> = ({ cwe, tech }) => {
  // Simulated intelligence engine: correlate CWE + Tech to relevant CVEs
  const getCorrelatedCVEs = () => {
    if (cwe?.includes('284') || cwe?.includes('285') || cwe?.includes('639')) {
      return [
        { id: 'CVE-2023-28121', title: 'WooCommerce Admin Auth Bypass', score: 9.8 },
        { id: 'CVE-2022-24355', title: 'WordPress IDOR in Profile Service', score: 7.5 },
        { id: 'CVE-2021-22911', title: 'Rocket.Chat Auth Bypass', score: 8.1 }
      ];
    }
    if (cwe?.includes('89')) {
      return [
        { id: 'CVE-2021-24488', title: 'PostGrid SQL Injection', score: 9.8 },
        { id: 'CVE-2020-11738', title: 'Duplicator SQLi', score: 8.8 }
      ];
    }
    return [
      { id: 'CVE-2023-4863', title: 'Heap Buffer Overflow in libwebp', score: 8.8 },
      { id: 'CVE-2021-44228', title: 'Apache Log4j RCE', score: 10.0 }
    ];
  };

  const correlatedCVEs = getCorrelatedCVEs();

  return (
    <div className="space-y-8 sticky top-32">
      {/* Global Intelligence Card */}
      <div className="p-6 rounded-3xl border border-accent-primary/20 bg-accent-primary/[0.02] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
          <Globe size={40} className="text-accent-primary" />
        </div>
        
        <h3 className="font-orbitron font-black text-[10px] text-accent-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
          <Activity size={12} />
          GLOBAL_CVE_INTELLIGENCE
        </h3>

        <div className="space-y-4">
          {correlatedCVEs.map(cve => (
            <a 
              key={cve.id}
              href={`https://nvd.nist.gov/vuln/detail/${cve.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-accent-primary/40 transition-all group/card"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] font-black text-accent-primary">{cve.id}</span>
                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  cve.score >= 9 ? 'bg-severity-critical/10 text-severity-critical' :
                  cve.score >= 7 ? 'bg-severity-high/10 text-severity-high' : 'bg-severity-medium/10 text-severity-medium'
                }`}>
                  {cve.score}
                </span>
              </div>
              <p className="text-[10px] font-mono font-black text-text-primary uppercase tracking-tight group-hover/card:text-accent-primary transition-colors line-clamp-1">
                {cve.title}
              </p>
            </a>
          ))}
        </div>

        <button className="w-full mt-6 py-3 rounded-xl bg-white/5 border border-white/10 font-mono text-[8px] font-black text-text-muted uppercase tracking-widest hover:border-accent-primary/20 hover:text-accent-primary transition-all">
          LOAD_MORE_INTELLIGENCE
        </button>
      </div>

      {/* Affected Technology Stack Card */}
      <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.01]">
        <h3 className="font-orbitron font-black text-[10px] text-text-muted uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
          <Cpu size={12} />
          AFFECTED_STACK
        </h3>
        <div className="flex flex-wrap gap-2">
          {tech && tech.length > 0 ? tech.map(t => (
            <span key={t} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 font-mono text-[8px] font-black text-text-muted uppercase tracking-widest">
              {t}
            </span>
          )) : (
            <span className="text-[8px] font-mono text-text-muted/40 italic">GENERIC_WEB_STACK</span>
          )}
        </div>
      </div>
    </div>
  );
};

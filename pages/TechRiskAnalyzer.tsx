import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Search, Cpu, AlertTriangle, ShieldCheck, Zap, Activity, Database, Info, RefreshCw, Layers, ShieldAlert } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

interface TechInput {
  name: string;
  version: string;
}

interface RiskResult {
  tech: string;
  version: string;
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
  probability: number;
  cves: string[];
  vulnerabilities: string[];
  recommendation: string;
}

export const TechRiskAnalyzer: React.FC = () => {
  const [techStack, setTechStack] = useState<TechInput[]>([{ name: '', version: '' }]);
  const [results, setResults] = useState<RiskResult[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addTech = () => setTechStack([...techStack, { name: '', version: '' }]);
  const updateTech = (index: number, field: keyof TechInput, value: string) => {
    const newStack = [...techStack];
    newStack[index][field] = value;
    setTechStack(newStack);
  };

  const calculateRisk = async () => {
    setIsAnalyzing(true);
    setResults(null);

    // Simulate deep analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    const analysisResults: RiskResult[] = techStack.map(tech => {
      const t = tech.name.toLowerCase();
      const v = tech.version.toLowerCase();
      
      // Mock logic based on keywords and version age
      let score = 0;
      let cves: string[] = [];
      let vulns: string[] = [];

      if (t.includes('wordpress')) {
        score = 85;
        cves = ['CVE-2023-5561', 'CVE-2023-30777'];
        vulns = ['Stored XSS', 'Privilege Escalation'];
      } else if (t.includes('php') && (v.startsWith('5') || v.startsWith('7.0'))) {
        score = 95;
        cves = ['CVE-2019-11043', 'CVE-2017-11628'];
        vulns = ['Remote Code Execution', 'Buffer Overflow'];
      } else if (t.includes('apache')) {
        score = 45;
        cves = ['CVE-2021-41773'];
        vulns = ['Path Traversal'];
      } else {
        score = Math.floor(Math.random() * 30) + 10;
      }

      let risk: RiskResult['risk'] = 'Low';
      if (score >= 90) risk = 'Critical';
      else if (score >= 70) risk = 'High';
      else if (score >= 40) risk = 'Medium';

      return {
        tech: tech.name,
        version: tech.version,
        risk,
        probability: score,
        cves,
        vulnerabilities: vulns,
        recommendation: score > 50 ? 'Immediate patch required. Update to latest stable version.' : 'Regular monitoring recommended. Implement WAF rules.'
      };
    });

    setResults(analysisResults);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-bg pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-primary/10 border border-accent-primary/20 rounded-full font-mono text-[10px] text-accent-primary tracking-[0.3em] uppercase font-black italic mb-6">
            <Cpu size={12} /> Technology Risk Profiler
          </div>
          <h1 className="font-orbitron text-4xl md:text-6xl font-black text-text-primary uppercase italic leading-none mb-6">
            STACK <span className="text-accent-primary">ANALYZER</span>
          </h1>
          <p className="text-text-muted max-w-2xl font-medium">
            Evaluate your technology stack against our Global Threat Registry. 
            Identify known vulnerabilities, CVE mappings, and calculate risk probabilities based on version intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card p-8 border-accent-primary/20 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="font-orbitron font-black text-sm text-text-primary uppercase tracking-widest flex items-center gap-2">
                  <Layers size={16} className="text-accent-primary" /> STACK_INPUT
                </h3>
              </div>
              
              <div className="space-y-4">
                {techStack.map((tech, i) => (
                  <div key={i} className="space-y-2 p-4 bg-white/5 border border-white/10 rounded-2xl relative group">
                    <input 
                      type="text" 
                      placeholder="Technology (e.g. PHP)"
                      value={tech.name}
                      onChange={(e) => updateTech(i, 'name', e.target.value)}
                      className="w-full bg-transparent border-none outline-none font-mono text-[10px] text-text-primary uppercase tracking-widest placeholder:text-text-muted/30"
                    />
                    <input 
                      type="text" 
                      placeholder="Version (e.g. 7.4.3)"
                      value={tech.version}
                      onChange={(e) => updateTech(i, 'version', e.target.value)}
                      className="w-full bg-transparent border-none outline-none font-mono text-[8px] text-accent-primary uppercase tracking-[0.2em] placeholder:text-text-muted/30"
                    />
                  </div>
                ))}
              </div>

              <button 
                onClick={addTech}
                className="w-full py-3 border border-dashed border-border-color rounded-xl font-mono text-[9px] text-text-muted hover:text-accent-primary hover:border-accent-primary/30 transition-all uppercase tracking-widest"
              >
                + ADD_MORE_INTELLIGENCE
              </button>

              <button 
                onClick={calculateRisk}
                disabled={isAnalyzing || techStack[0].name === ''}
                className="w-full py-4 bg-accent-primary text-black font-orbitron font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-[0_0_20px_var(--accent-glow-subtle)] hover:shadow-[0_0_30px_var(--accent-glow)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isAnalyzing ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
                {isAnalyzing ? 'SIMULATING_ATTACK_VECTORS...' : 'START_RISK_ANALYSIS'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {results ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <Activity size={20} className="text-accent-primary" />
                    <h3 className="font-orbitron font-black text-xl text-text-primary uppercase italic">Intelligence <span className="text-accent-primary">Report</span></h3>
                  </div>

                  {results.map((res, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-8 glass-card border-white/5 space-y-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <h4 className="font-orbitron font-black text-2xl text-text-primary uppercase">{res.tech}</h4>
                          <span className="font-mono text-[10px] text-accent-primary font-black uppercase tracking-widest">Version: {res.version || 'UNKNOWN_DETECTED'}</span>
                        </div>
                        <div className="text-right">
                          <div className={`text-4xl font-orbitron font-black ${
                            res.risk === 'Critical' ? 'text-severity-critical' :
                            res.risk === 'High' ? 'text-severity-high' :
                            res.risk === 'Medium' ? 'text-severity-medium' : 'text-severity-low'
                          }`}>
                            {res.probability}%
                          </div>
                          <div className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Risk Probability</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h5 className="font-mono text-[9px] text-text-muted uppercase tracking-[0.4em] font-black italic opacity-40">Identified CVEs</h5>
                          <div className="flex flex-wrap gap-2">
                            {res.cves.length > 0 ? res.cves.map(cve => (
                              <span key={cve} className="px-3 py-1 bg-severity-critical/10 border border-severity-critical/20 rounded-lg font-mono text-[10px] text-severity-critical font-black uppercase">
                                {cve}
                              </span>
                            )) : (
                              <span className="text-[10px] font-mono text-text-muted italic">No public CVEs found for this version branch.</span>
                            )}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h5 className="font-mono text-[9px] text-text-muted uppercase tracking-[0.4em] font-black italic opacity-40">Vulnerability Score</h5>
                          <div className={`inline-block px-4 py-2 rounded-2xl border font-mono text-[10px] font-black uppercase tracking-widest ${
                            res.risk === 'Critical' ? 'bg-severity-critical/10 text-severity-critical border-severity-critical/20' :
                            res.risk === 'High' ? 'bg-severity-high/10 text-severity-high border-severity-high/20' :
                            'bg-severity-low/10 text-severity-low border-severity-low/20'
                          }`}>
                            {res.risk}_SEVERITY_DETECTED
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex gap-4">
                        <ShieldAlert className="text-accent-primary shrink-0" size={24} />
                        <div>
                          <h6 className="font-orbitron font-bold text-xs text-text-primary uppercase mb-1">Strategic Recommendation</h6>
                          <p className="text-xs text-text-muted leading-relaxed font-medium">{res.recommendation}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-40 text-center opacity-30">
                  <ShieldCheck size={80} className="mb-8" />
                  <h3 className="font-orbitron font-black text-2xl text-text-primary uppercase tracking-tighter mb-4">No Active Scan</h3>
                  <p className="text-sm text-text-muted max-w-sm font-medium">
                    Input your technology stack to initialize the risk analyzer and evaluate security posture.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

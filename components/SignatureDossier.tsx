import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  FileText, Info, Search, Terminal, Workflow, Database, 
  ShieldAlert, Code2, Activity, Target, Network, Layers, 
  AlertTriangle, CheckSquare, Settings, Flame, Repeat,
  ShieldCheck, ArrowRightCircle
} from 'lucide-react';
import { SignatureResearch } from '../types';
import { Mermaid } from './Mermaid';
import { CyberLab } from './CyberLab';
import { CIATriadAnalysis } from './CIATriadAnalysis';
import { CVSSRegistry } from './CVSSRegistry';
import { OSIMapping } from './OSIMapping';
import { ProtocolMapping } from './ProtocolMapping';
import { ComparisonTable } from './ComparisonTable';

interface SignatureDossierProps {
  data: SignatureResearch;
}

export const SignatureDossier: React.FC<SignatureDossierProps> = ({ data }) => {
  const sections = [
    { id: '01', title: 'Executive Summary', icon: FileText, content: data.executive_summary },
    { id: '02', title: 'Introduction', icon: Info, content: data.introduction },
    { id: '03', title: 'Simple Explanation', icon: Search, content: data.simple_explanation },
    { id: '04', title: 'Technical Deep Dive', icon: Terminal, content: data.technical_deep_dive },
    { id: '05', title: 'Attack Workflow', icon: Workflow, type: 'diagram', content: data.attack_workflow },
    { id: '06', title: 'Application Architecture', icon: Database, type: 'diagram', content: data.application_architecture },
    { id: '07', title: 'Root Cause Analysis', icon: ShieldAlert, content: data.root_cause_analysis },
    { id: '08', title: 'Code Examples', icon: Code2, type: 'lab', content: data.code_examples },
    { id: '09', title: 'Impact Analysis (CIA Triad)', icon: Activity, type: 'cia', content: data.impact_analysis },
    { id: '10', title: 'CVSS Analysis', icon: Target, type: 'cvss', content: data.cvss_analysis },
    { id: '11', title: 'CWE Mapping', icon: Network, content: data.cwe_mapping },
    { id: '12', title: 'CVE References', icon: FileText, type: 'list', content: data.cve_references },
    { id: '13', title: 'MITRE ATT&CK Mapping', icon: Target, content: data.mitre_mapping },
    { id: '14', title: 'Industry & Compliance Impact', icon: ShieldAlert, content: data.industry_impact },
    { id: '15', title: 'Detection Methodologies', icon: Search, type: 'list', content: data.detection_methodologies },
    { id: '16', title: 'Manual Testing Checklist', icon: CheckSquare, type: 'checklist', content: data.manual_checklist },
    { id: '17', title: 'Automated Testing Tools', icon: Settings, type: 'tools', content: data.automated_tools },
    { id: '18', title: 'Prevention Strategy', icon: ShieldCheck, type: 'list', content: data.prevention_strategy },
    { id: '19', title: 'Common Developer Mistakes', icon: Flame, type: 'list', content: data.developer_mistakes },
    { id: '20', title: 'Bug Bounty Report Example', icon: FileText, type: 'bugbounty', content: data.bug_bounty_example },
    { id: '21', title: 'Comparison Table', icon: Repeat, type: 'comparison', content: data.comparison_table },
    { id: '22', title: 'OSI Model Layer Mapping', icon: Layers, type: 'osi', content: { layer: data.osi_layer, desc: data.root_cause_analysis } },
    { id: '23', title: 'Protocol Mapping', icon: Network, type: 'protocols', content: data.protocols },
    { id: '24', title: 'Key Takeaways', icon: CheckSquare, type: 'list', content: data.key_takeaways },
    { id: '25', title: 'Strategic Conclusion', icon: ArrowRightCircle, content: data.strategic_conclusion },
  ];

  return (
    <div className="space-y-24 mt-20">
      {sections.map((section, index) => (
        <motion.section
          key={section.id}
          id={section.title.toLowerCase().replace(/[^\w]/g, '-')}
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <div className="flex items-center gap-6 mb-12 group">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-accent-primary/40 mb-1 font-black">{section.id}</span>
              <div className="w-12 h-12 rounded-2xl bg-accent-primary/5 border border-accent-primary/10 flex items-center justify-center text-accent-primary group-hover:bg-accent-primary/10 transition-colors">
                <section.icon size={20} />
              </div>
            </div>
            <h2 className="text-3xl md:text-5xl font-orbitron font-black text-white uppercase tracking-tighter italic border-l-4 border-accent-primary/20 pl-6 group-hover:border-accent-primary transition-colors">
              {section.title}
            </h2>
          </div>

          {/* Section Content */}
          <div className="prose prose-invert prose-cyber max-w-none ml-2 md:ml-20">
            {section.type === 'diagram' ? (
              typeof section.content === 'string' && (section.content.startsWith('graph') || section.content.startsWith('sequenceDiagram'))
                ? <Mermaid chart={section.content} />
                : <img src={section.content as string} alt={section.title} className="rounded-2xl border border-border-color shadow-2xl" />
            ) : section.type === 'lab' ? (
              <CyberLab {...(section.content as any)} />
            ) : section.type === 'cia' ? (
              <CIATriadAnalysis {...(section.content as any)} />
            ) : section.type === 'cvss' ? (
              <CVSSRegistry {...(section.content as any)} />
            ) : section.type === 'osi' ? (
              <OSIMapping primaryLayer={(section.content as any).layer} description={(section.content as any).desc} />
            ) : section.type === 'protocols' ? (
              <ProtocolMapping protocols={section.content as string[]} />
            ) : section.type === 'list' ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                {(section.content as string[]).map((item, i) => (
                  <li key={i} className="flex items-start gap-4 p-4 rounded-xl border border-border-color bg-white/[0.01]">
                    <div className="w-2 h-2 rounded-full bg-accent-primary mt-2 shrink-0 shadow-[0_0_10px_var(--accent-glow)]" />
                    <span className="text-sm text-text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            ) : section.type === 'checklist' ? (
              <ul className="space-y-4 list-none p-0">
                {(section.content as string[]).map((item, i) => (
                  <li key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border-color bg-white/[0.01]">
                    <CheckSquare size={16} className="text-accent-primary" />
                    <span className="text-sm text-text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            ) : section.type === 'tools' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(section.content as { name: string; description: string }[]).map((tool, i) => (
                  <div key={i} className="p-6 rounded-2xl border border-border-color bg-white/[0.02] hover:border-accent-primary/30 transition-colors">
                    <div className="font-orbitron font-black text-xs text-accent-primary uppercase tracking-widest mb-2">{tool.name}</div>
                    <div className="text-[10px] text-text-muted leading-relaxed">{tool.description}</div>
                  </div>
                ))}
              </div>
            ) : section.type === 'bugbounty' ? (
              <div className="p-8 md:p-12 rounded-[2.5rem] border border-border-color bg-red-500/[0.02] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 rotate-12 opacity-5 pointer-events-none">
                  <Flame size={120} className="text-red-500" />
                </div>
                <div className="flex flex-col gap-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                      <Terminal size={24} />
                    </div>
                    <h4 className="text-xl font-orbitron font-black text-text-primary uppercase tracking-widest">{(section.content as any).title}</h4>
                  </div>
                  <p className="text-sm text-text-muted italic">{(section.content as any).summary}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    <div>
                      <h5 className="text-[10px] font-mono font-black text-red-500 uppercase tracking-widest mb-4">REPRODUCTION STEPS</h5>
                      <ol className="space-y-4 list-none p-0">
                        {(section.content as any).steps.map((step: string, i: number) => (
                          <li key={i} className="flex gap-4 text-xs text-text-muted">
                            <span className="font-mono text-red-500/40">{i+1}</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h5 className="text-[10px] font-mono font-black text-red-500 uppercase tracking-widest mb-2">IMPACT</h5>
                        <p className="text-xs text-text-muted">{(section.content as any).impact}</p>
                      </div>
                      <div>
                        <h5 className="text-[10px] font-mono font-black text-red-500 uppercase tracking-widest mb-2">RECOMMENDATION</h5>
                        <p className="text-xs text-text-muted">{(section.content as any).recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : section.type === 'comparison' ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border-color">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="p-4 border border-border-color text-left font-orbitron text-[10px] uppercase tracking-widest text-accent-primary">FEATURE</th>
                      <th className="p-4 border border-border-color text-left font-orbitron text-[10px] uppercase tracking-widest text-text-primary">TARGET</th>
                      <th className="p-4 border border-border-color text-left font-orbitron text-[10px] uppercase tracking-widest text-text-muted">RELATED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(section.content as any[]).map((row, i) => (
                      <tr key={i} className="hover:bg-white/[0.01]">
                        <td className="p-4 border border-border-color font-mono text-[10px] font-black">{row.feature}</td>
                        <td className="p-4 border border-border-color text-sm text-text-primary">{row.target}</td>
                        <td className="p-4 border border-border-color text-sm text-text-muted">{row.related.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content as string}</ReactMarkdown>
            )}
          </div>
        </motion.section>
      ))}
    </div>
  );
};

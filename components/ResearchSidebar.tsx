import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Shield, Lock, Database, Cpu, Activity, Target, Zap, 
  ChevronDown, ChevronRight, BookOpen, Layers, Globe
} from 'lucide-react';
import { getActiveTaxonomy, TaxonomyNode } from '../data/researchTaxonomy';

const IconMap: Record<string, any> = {
  A01: Lock,
  A02: Shield,
  A03: Database,
  A04: Cpu,
  A05: Shield,
  A06: Layers,
  A07: Zap,
  A08: Globe,
  A09: Activity,
  A10: Target
};

const TreeItem: React.FC<{ node: TaxonomyNode; depth: number }> = ({ node, depth }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isLeaf = node.type === 'vulnerability';
  const isActive = node.slug ? location.pathname === `/blog/${node.slug}` : false;
  
  // Auto-expand if child is active
  useEffect(() => {
    if (node.children?.some(child => 
      child.slug ? location.pathname === `/blog/${child.slug}` : false
    )) {
      setIsOpen(true);
    }
  }, [location.pathname, node.children]);

  const Icon = node.type === 'owasp' ? (IconMap[node.id] || Shield) : (isLeaf ? BookOpen : ChevronRight);

  return (
    <div className="select-none">
      <div 
        onClick={() => !isLeaf && setIsOpen(!isOpen)}
        className={`flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer transition-all duration-300 group ${
          isActive ? 'bg-accent-primary/10 text-accent-primary' : 'hover:bg-white/5 text-text-muted'
        }`}
        style={{ marginLeft: `${depth * 12}px` }}
      >
        <div className={`shrink-0 transition-transform duration-300 ${isOpen && !isLeaf ? 'rotate-90' : ''}`}>
          <Icon size={14} className={isActive ? 'text-accent-primary' : 'text-text-muted opacity-40 group-hover:opacity-100'} />
        </div>
        
        {isLeaf ? (
          <Link 
            to={`/blog/${node.slug || node.id.toLowerCase().replace(/_/g, '-')}`} 
            className={`flex-grow font-mono text-[11px] font-bold uppercase tracking-tight truncate ${!node.slug ? 'opacity-50' : ''}`}
          >
            {node.title}
            {!node.slug && (
              <span className="ml-2 font-mono text-[8px] text-accent-primary/40 uppercase font-black italic">
                (SOON)
              </span>
            )}
          </Link>
        ) : (
          <span className="flex-grow font-orbitron text-[10px] font-black uppercase tracking-widest truncate">
            {node.title}
          </span>
        )}

        {!isLeaf && node.children && (
          <div className="shrink-0 opacity-20 group-hover:opacity-100">
            {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-l border-white/5 ml-4 mt-1"
          >
            {node.children.map(child => (
              <TreeItem key={child.id} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ResearchSidebar: React.FC = () => {
  const activeTaxonomy = getActiveTaxonomy();

  return (
    <div className="w-full h-full flex flex-col bg-bg-secondary/30 backdrop-blur-xl border-r border-border-color">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
          <span className="font-mono text-[10px] text-accent-primary uppercase tracking-[0.4em] font-black italic">
            INTEL_NODE: ACTIVE
          </span>
        </div>
        <h2 className="font-orbitron font-black text-xs text-text-primary uppercase tracking-[0.4em] italic">
          RESEARCH_TREE_v2.0
        </h2>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-2">
        {activeTaxonomy.map(node => (
          <TreeItem key={node.id} node={node} depth={0} />
        ))}
        
        {activeTaxonomy.length === 0 && (
          <div className="py-12 text-center px-4">
            <Activity size={24} className="mx-auto text-text-muted opacity-20 mb-4 animate-spin-slow" />
            <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest leading-relaxed">
              SCANNING_INTELLIGENCE... // NO_PUBLISHED_DOSSIERS_FOUND
            </p>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-white/5">
        <div className="p-4 rounded-xl bg-accent-primary/5 border border-accent-primary/10">
          <p className="font-mono text-[9px] text-text-muted leading-relaxed uppercase tracking-widest mb-3 italic">
            Hierarchy enforced by OWASP Top 10:2021 framework.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary opacity-40" />
            <span className="font-mono text-[8px] text-text-muted/60 uppercase">Revision: 4.15.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

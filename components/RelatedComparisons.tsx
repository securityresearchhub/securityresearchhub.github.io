import React from 'react';
import { vulnerabilityComparisons } from '../data/vulnerabilityComparisons';
import { ComparisonTable } from './ComparisonTable';
import { Zap } from 'lucide-react';

interface RelatedComparisonsProps {
  postId: string;
}

export const RelatedComparisons: React.FC<RelatedComparisonsProps> = ({ postId }) => {
  const comparisons = vulnerabilityComparisons[postId];

  if (!comparisons || comparisons.length === 0) return null;

  return (
    <div className="mt-24 pt-16 border-t border-white/5">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-accent-primary/10 rounded-xl">
          <Zap size={24} className="text-accent-primary animate-pulse" />
        </div>
        <div>
          <h2 className="text-2xl font-orbitron font-black text-text-primary uppercase tracking-wider italic">
            Technical VS Comparison
          </h2>
          <p className="text-text-muted text-sm font-mono mt-1 opacity-60">
            AUTO-SUGGESTED BY LOGICAL COMPARISON ENGINE v1.0.4
          </p>
        </div>
      </div>

      <div className="space-y-16">
        {comparisons.map((comp, index) => (
          <div key={index}>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-8 h-px bg-accent-primary/30" />
              <span className="font-mono text-[10px] text-accent-primary uppercase tracking-[0.3em] font-black">
                {comp.title}
              </span>
            </div>
            <ComparisonTable data={comp.table} />
          </div>
        ))}
      </div>
    </div>
  );
};

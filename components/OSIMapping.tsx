import React from 'react';
import { motion } from 'motion/react';
import { Layers, CheckCircle2, ShieldAlert } from 'lucide-react';

interface OSIProps {
  primaryLayer: number;
  description: string;
}

const OSI_LAYERS = [
  { num: 7, name: "Application", func: "Web apps, APIs, backend logic" },
  { num: 6, name: "Presentation", func: "Encryption / formatting" },
  { num: 5, name: "Session", func: "Session handling" },
  { num: 4, name: "Transport", func: "TCP / UDP delivery" },
  { num: 3, name: "Network", func: "IP routing" },
  { num: 2, name: "Data Link", func: "Frame transmission" },
  { num: 1, name: "Physical", func: "Hardware signals" }
];

export const OSIMapping: React.FC<OSIProps> = ({ primaryLayer, description }) => {
  return (
    <div className="my-16 p-8 md:p-12 border border-border-color rounded-[2.5rem] bg-white/[0.01]">
      <h3 className="text-xl font-orbitron font-black text-text-primary uppercase tracking-widest mb-10 flex items-center gap-3">
        <Layers className="text-accent-primary" size={20} />
        22 OSI MODEL LAYER MAPPING
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-2">
          {OSI_LAYERS.map((layer, i) => (
            <motion.div 
              key={layer.num}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-500 ${
                layer.num === primaryLayer 
                ? 'bg-accent-primary/10 border-accent-primary shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.1)]' 
                : 'bg-white/[0.01] border-border-color opacity-60 grayscale'
              }`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: (7-layer.num) * 0.05 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4">
                <span className={`font-mono text-xs font-black ${layer.num === primaryLayer ? 'text-accent-primary' : 'text-text-muted'}`}>
                  L{layer.num}
                </span>
                <span className={`font-orbitron font-black text-xs uppercase tracking-widest ${layer.num === primaryLayer ? 'text-text-primary' : 'text-text-muted'}`}>
                  {layer.name}
                </span>
              </div>
              {layer.num === primaryLayer && (
                <div className="flex items-center gap-2">
                   <span className="text-[9px] font-mono font-black text-accent-primary uppercase tracking-widest bg-accent-primary/10 px-2 py-0.5 rounded">PRIMARY TARGET</span>
                   <ShieldAlert size={14} className="text-accent-primary animate-pulse" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="p-8 rounded-[2rem] border border-border-color bg-white/[0.02] flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 opacity-5">
            <Layers size={200} className="text-accent-primary" />
          </div>

          <div className="flex items-center gap-4 text-accent-primary">
            <CheckCircle2 size={24} />
            <span className="text-sm font-orbitron font-black uppercase tracking-widest">TACTICAL TARGETING ANALYSIS</span>
          </div>

          <div className="space-y-4 relative z-10">
            <p className="text-sm text-text-muted leading-relaxed">
              <span className="text-text-primary font-bold">PRIMARY VECTOR:</span> This vulnerability originates at <span className="text-accent-primary">Layer {primaryLayer} ({OSI_LAYERS.find(l => l.num === primaryLayer)?.name})</span>.
            </p>
            <div className="h-px bg-border-color/10" />
            <p className="text-sm text-text-muted leading-relaxed italic">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

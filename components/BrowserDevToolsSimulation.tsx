import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutPanelTop, Database, Cookie, Key, Search, RefreshCw, AlertTriangle, MonitorSmartphone } from 'lucide-react';

interface StorageItem {
  key: string;
  value: string;
  isModified?: boolean;
}

interface DevToolsStep {
  title: string;
  description: string;
  items: StorageItem[];
  highlightKey?: string;
  action?: 'edit' | 'delete' | 'add';
}

interface BrowserDevToolsProps {
  steps: DevToolsStep[];
  title?: string;
  type?: 'localStorage' | 'sessionStorage' | 'cookies';
  externalStep?: number;
  activeStage?: number; // 0: Idle, 1: Inspect/View, 2: Manipulate/Edit
  speed?: number;
}

export const BrowserDevToolsSimulation: React.FC<BrowserDevToolsProps> = ({ 
  steps, 
  title = "Client-Side Manipulation",
  type = 'localStorage',
  externalStep,
  activeStage,
  speed = 1
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Sync with external control if provided
  useEffect(() => {
    if (activeStage !== undefined) {
      const targetIdx = externalStep !== undefined ? (externalStep % steps.length) : currentStep;
      setCurrentStep(targetIdx);
      setAutoPlay(false);
      
      // BrowserDevTools steps are usually pre-defined in 'steps'
      // We can use activeStage to control sub-animations if needed, 
      // but for now mapping chunk to step index is primary.
    } else if (externalStep !== undefined) {
      setCurrentStep(externalStep % steps.length);
      setAutoPlay(false); // Disable internal timer when externally controlled
    }
  }, [externalStep, activeStage, steps.length]);

  useEffect(() => {
    if (!autoPlay || externalStep !== undefined) return;
    
    const timer = setTimeout(() => {
      setCurrentStep((s) => (s + 1) % steps.length);
    }, 4500 / speed); // Wait 4.5 seconds / speed per step
    
    return () => clearTimeout(timer);
  }, [currentStep, autoPlay, steps.length, externalStep, speed]);

  const step = steps[currentStep];

  const getIcon = () => {
    switch (type) {
      case 'cookies': return <Cookie size={14} className="text-yellow-500" />;
      case 'sessionStorage': return <Key size={14} className="text-blue-500" />;
      default: return <Database size={14} className="text-purple-500" />;
    }
  };

  return (
    <div className="rounded-2xl border border-border-color bg-bg-card overflow-hidden shadow-2xl my-8 font-mono">
      {/* DevTools Title Bar */}
      <div className="bg-bg-secondary border-b border-border-color p-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-text-muted px-2">
            <MonitorSmartphone size={14} />
            <span className="text-[10px] sm:text-xs">Developer Tools</span>
          </div>
          <div className="flex gap-4 text-[10px] text-text-muted">
            <span className="hover:text-text-primary cursor-pointer transition-colors">Elements</span>
            <span className="hover:text-text-primary cursor-pointer transition-colors">Console</span>
            <span className="hover:text-text-primary cursor-pointer transition-colors">Network</span>
            <span className="text-accent-primary font-bold border-b-2 border-accent-primary pb-1 -mb-2">Application</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setAutoPlay(!autoPlay)}
            className={`p-1 rounded-md transition-colors ${autoPlay ? 'text-accent-primary' : 'text-text-muted hover:text-white'}`}
            title={autoPlay ? "Pause Simulation" : "Play Simulation"}
          >
            <RefreshCw size={12} className={autoPlay ? "animate-spin-slow" : ""} />
          </button>
        </div>
      </div>

      <div className="flex bg-bg-primary min-h-[300px]">
        {/* Left Sidebar (Storage Types) */}
        <div className="w-48 border-r border-border-color p-2 hidden md:block select-none">
          <div className="text-[10px] text-text-muted font-bold mb-2 pl-2">Storage</div>
          
          <div className={`flex items-center gap-2 text-[11px] p-1.5 rounded-lg cursor-pointer ${type === 'localStorage' ? 'bg-accent-primary/10 text-accent-primary font-bold' : 'text-text-muted hover:bg-bg-secondary'}`}>
            <Database size={12} />
            Local Storage
          </div>
          <div className="pl-6 text-[10px] text-text-muted/60 mt-1 mb-2">https://target.com</div>
          
          <div className={`flex items-center gap-2 text-[11px] p-1.5 rounded-lg cursor-pointer ${type === 'sessionStorage' ? 'bg-blue-500/10 text-blue-400 font-bold' : 'text-text-muted hover:bg-bg-secondary'}`}>
            <Key size={12} />
            Session Storage
          </div>
          
          <div className={`flex items-center gap-2 text-[11px] p-1.5 rounded-lg cursor-pointer mt-2 ${type === 'cookies' ? 'bg-yellow-500/10 text-yellow-500 font-bold' : 'text-text-muted hover:bg-bg-secondary'}`}>
            <Cookie size={12} />
            Cookies
          </div>
        </div>

        {/* Right Content Area (Key/Value Table) */}
        <div className="flex-1 flex flex-col">
          {/* Table Toolbar */}
          <div className="flex items-center justify-between p-2 border-b border-border-color bg-bg-secondary">
            <div className="flex items-center gap-2 text-text-muted">
              {getIcon()}
              <span className="text-[10px] sm:text-xs">https://target.com</span>
            </div>
            <div className="flex items-center bg-bg-primary border border-border-color rounded px-2 py-1">
              <Search size={10} className="text-text-muted mr-2" />
              <div className="text-[9px] text-text-muted/50 w-24">Filter</div>
            </div>
          </div>

          {/* Table Headers */}
          <div className="grid grid-cols-12 gap-2 p-2 border-b border-border-color text-[10px] text-text-muted font-bold bg-bg-secondary">
            <div className="col-span-4 border-r border-border-color">Key</div>
            <div className="col-span-8">Value</div>
          </div>

          {/* Table Rows */}
          <div className="flex-1 overflow-y-auto w-full max-w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full relative"
              >
                 {step.items.map((item, i) => (
                   <div 
                     key={i} 
                     className={`grid grid-cols-12 gap-2 p-2 border-b border-border-color text-[10px] sm:text-[11px] hover:bg-bg-secondary transition-colors relative overflow-hidden`}
                   >
                     {/* Highlight effect for modified items */}
                     {item.isModified && (
                        <motion.div 
                          className="absolute inset-0 bg-red-500/10 border-l-2 border-red-500 pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0.5] }}
                          transition={{ duration: 0.5 }}
                        />
                     )}
                     
                     <div className={`col-span-4 py-1 flex items-center gap-2 truncate ${item.isModified ? 'text-red-400 font-bold' : 'text-[#8b9bb4]'}`}>
                        {item.key}
                     </div>
                     <div className={`col-span-8 py-1 truncate relative ${item.isModified ? 'text-red-300' : 'text-[#a2aabc]'}`}>
                        {item.isModified ? (
                           <motion.div 
                             initial={{ opacity: 0, x: -10 }}
                             animate={{ opacity: 1, x: 0 }}
                             className="flex flex-col"
                           >
                             <span className="pr-4">{item.value}</span>
                             <span className="absolute right-0 top-1/2 -translate-y-1/2 text-red-500 font-orbitron text-[8px] uppercase tracking-widest bg-red-500/10 px-1 py-0.5 rounded animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.3)]">Edited</span>
                           </motion.div>
                        ) : (
                          <span className="pr-4 block truncate w-full" title={item.value}>{item.value}</span>
                        )}
                     </div>
                   </div>
                 ))}
                 
                 {/* Simulate a click/action indicator */}
                 {step.action && step.highlightKey && (
                    <motion.div
                      initial={{ opacity: 0, scale: 2 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', delay: 0.5 }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10 drop-shadow-2xl"
                    >
                       <div className="bg-text-primary text-black rounded-full p-2 mb-2 shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                          <LayoutPanelTop size={16} />
                       </div>
                       <div className="font-orbitron text-[10px] uppercase font-black tracking-widest text-[#050506] bg-text-primary px-3 py-1 rounded shadow-lg">
                          Double-click to {step.action}
                       </div>
                    </motion.div>
                 )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Explanation Footer */}
      <div className="bg-bg-secondary border-t border-border-color p-4 relative z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-start gap-3"
          >
            {step.items.some(i => i.isModified) ? (
              <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
            ) : (
              <MonitorSmartphone size={16} className="text-accent-primary mt-0.5 shrink-0" />
            )}
            <div>
              <span className="font-orbitron font-black text-[11px] uppercase tracking-wider text-text-primary block mb-1">
                {step.title}
              </span>
              <p className="font-mono text-[10px] text-text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

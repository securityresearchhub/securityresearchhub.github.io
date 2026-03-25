import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldX, ArrowRight, Play, RefreshCw, Server, Search, Globe, ChevronRight } from 'lucide-react';

interface ProxyStep {
  title: string;
  description: string;
  request: string;
  highlightedLine?: number;
  newRequest?: string;
  response?: string;
}

interface BurpSimulationProps {
  steps: ProxyStep[];
  title?: string;
  externalStep?: number;
  activeStage?: number; // 0: Idle, 1: Intercept, 2: Manipulate, 3: Response
  speed?: number;
}

export const BurpSimulation: React.FC<BurpSimulationProps> = ({ 
  steps, 
  title = "Proxy Interception Simulation",
  externalStep,
  activeStage,
  speed = 1
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isModifying, setIsModifying] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  // Sync with external control if provided
  useEffect(() => {
    if (activeStage !== undefined) {
      setAutoPlay(false);
      // activeStage mappings: 
      // 1: Captured/Intercepted
      // 2: Manipulated
      // 3: Response shown
      setIsModifying(activeStage >= 2);
      setShowResponse(activeStage >= 3);
      if (externalStep !== undefined) {
        setCurrentStep(externalStep % steps.length);
      }
    } else if (externalStep !== undefined) {
      setCurrentStep(externalStep % steps.length);
      setAutoPlay(false);
      
      // Reset sub-states when step changes
      setIsModifying(false);
      setShowResponse(false);
      
      // Auto-logic for a single step within narration:
      // We can use a small internal sequence to show the tool action
      const timer1 = setTimeout(() => setIsModifying(true), 1500 / speed);
      const timer2 = setTimeout(() => setShowResponse(true), 3500 / speed);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [externalStep, activeStage, steps.length, speed]);

  const step = steps[currentStep];

  useEffect(() => {
    if (!autoPlay || externalStep !== undefined) return;
    
    let timer: NodeJS.Timeout;
    
    if (!isModifying && !showResponse) {
      timer = setTimeout(() => setIsModifying(true), 2500 / speed);
    } else if (isModifying && !showResponse) {
      timer = setTimeout(() => setShowResponse(true), 2000 / speed);
    } else if (showResponse) {
      timer = setTimeout(() => {
        setIsModifying(false);
        setShowResponse(false);
        setCurrentStep((s) => (s + 1) % steps.length);
      }, 4000 / speed);
    }
    
    return () => clearTimeout(timer);
  }, [currentStep, isModifying, showResponse, autoPlay, steps.length, externalStep]);

  const renderHeaders = (content: string, highlightStr?: string, isModified = false) => {
    return content.split('\n').map((line, i) => {
      const isHighlighted = highlightStr && line.includes(highlightStr.split('=')[0]);
      return (
        <div key={i} className={`font-mono text-[10px] sm:text-xs leading-relaxed ${isHighlighted ? (isModified ? 'bg-red-500/20 text-red-400 font-bold px-1 -mx-1 rounded' : 'bg-accent-primary/20 text-accent-primary font-bold px-1 -mx-1 rounded') : 'text-text-muted'}`}>
          {line}
        </div>
      );
    });
  };

  return (
    <div className="rounded-2xl border border-border-color bg-bg-primary overflow-hidden shadow-xl my-8">
      {/* Header bar */}
      <div className="bg-bg-secondary border-b border-border-color p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldX size={16} className="text-orange-500" />
          <span className="font-orbitron text-xs font-black uppercase tracking-widest text-text-primary">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setAutoPlay(!autoPlay)}
            className={`p-1.5 rounded-md transition-colors ${autoPlay ? 'bg-accent-primary/20 text-accent-primary' : 'bg-bg-secondary text-text-muted hover:text-text-primary'}`}
            title={autoPlay ? "Pause Simulation" : "Play Simulation"}
          >
            {autoPlay ? <RefreshCw size={12} className="animate-spin-slow" /> : <Play size={12} />}
          </button>
        </div>
      </div>

      <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Side: Request/Proxy view */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={14} className="text-text-muted" />
            <h4 className="font-mono text-[10px] font-black uppercase tracking-widest text-text-muted">Intercepted Request</h4>
            {isModifying && (
              <span className="ml-auto flex items-center gap-1 font-mono text-[9px] text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Parameter Modified
              </span>
            )}
          </div>
          
          <div className="bg-bg-primary border border-border-color rounded-xl p-4 flex-grow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/50 to-red-500/50 opacity-50" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={isModifying ? 'modified' : 'original'}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {renderHeaders(
                  isModifying && step.newRequest ? step.newRequest : step.request, 
                  isModifying && step.newRequest ? 'id=' : undefined,
                  isModifying
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Server Response view */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Server size={14} className={showResponse ? 'text-text-primary' : 'text-text-muted/50'} />
            <h4 className={`font-mono text-[10px] font-black uppercase tracking-widest ${showResponse ? 'text-text-primary' : 'text-text-muted/50'}`}>Server Response</h4>
            {showResponse && (
              <span className="ml-auto font-mono text-[9px] text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded border border-accent-primary/30">
                Data Extracted
              </span>
            )}
          </div>
          
          <div className={`bg-bg-primary border ${showResponse ? 'border-red-500/30 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]' : 'border-border-color'} rounded-xl p-4 flex-grow relative transition-all duration-500 min-h-[150px]`}>
            {!showResponse ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
                 <RefreshCw size={24} className={isModifying ? 'animate-spin' : ''} />
                 <span className="font-mono text-[9px] uppercase mt-4 tracking-widest">
                   {isModifying ? 'Forwarding request...' : 'Waiting for request...'}
                 </span>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                className="h-full overflow-hidden"
              >
                {step.response ? (
                  <div className="font-mono text-[10px] sm:text-xs leading-relaxed text-red-600 dark:text-red-300">
                    {step.response.split('\n').map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                ) : (
                  <div className="font-mono text-[10px] sm:text-xs text-text-muted">No response data.</div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Explanation Footer */}
      <div className="bg-bg-secondary border-t border-border-color p-4 md:py-3 md:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep + (isModifying ? '-mod' : '') + (showResponse ? '-res' : '')}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-start gap-3"
          >
            <ChevronRight size={16} className="text-accent-primary mt-0.5 shrink-0" />
            <div>
              <span className="font-orbitron font-black text-[11px] uppercase tracking-wider text-text-primary block mb-1">
                {step.title} — Stage {showResponse ? '3' : isModifying ? '2' : '1'}
              </span>
              <p className="font-mono text-[10px] text-text-muted leading-relaxed">
                {!isModifying && !showResponse && "Attacker captures legitimate traffic moving from browser to server."}
                {isModifying && !showResponse && "Attacker manipulates object reference parameters before releasing request to server."}
                {showResponse && step.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

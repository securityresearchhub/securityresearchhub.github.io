import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Copy, CheckCircle2 } from 'lucide-react';

interface TerminalCommand {
  command: string;
  output: string;
  delayBeforeExecution?: number;
  typingSpeed?: number;
}

interface TerminalSimulationProps {
  commands: TerminalCommand[];
  title?: string;
  promptPath?: string;
  externalStep?: number;
  activeStage?: number; // 0: Idle, 1: Typing, 2: Executed/Output
  speed?: number;
}

export const TerminalSimulation: React.FC<TerminalSimulationProps> = ({ 
  commands, 
  title = "Live Reconnaissance Terminal",
  promptPath = "attacker@kali:~$",
  externalStep,
  activeStage,
  speed = 1
}) => {
  const [currentCmdIndex, setCurrentCmdIndex] = useState(0);
  const [typedCommand, setTypedCommand] = useState('');
  const [executedCommands, setExecutedCommands] = useState<TerminalCommand[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Sync with external control if provided
  useEffect(() => {
    if (activeStage !== undefined) {
      const targetIdx = externalStep !== undefined ? (externalStep % commands.length) : currentCmdIndex;
      setCurrentCmdIndex(targetIdx);
      
      if (activeStage === 0) {
        setExecutedCommands([]);
        setTypedCommand('');
        setIsTyping(false);
      } else if (activeStage === 1) {
        // Typing stage
        setExecutedCommands(commands.slice(0, targetIdx));
        setTypedCommand(commands[targetIdx]?.command || '');
        setIsTyping(true);
      } else if (activeStage >= 2) {
        // Executed stage
        setExecutedCommands(commands.slice(0, targetIdx + 1));
        setTypedCommand('');
        setIsTyping(false);
      }
    } else if (externalStep !== undefined) {
      const targetIdx = externalStep % (commands.length + 1);
      
      if (targetIdx < currentCmdIndex) {
          // Reset if we're moving backwards
          setExecutedCommands([]);
          setCurrentCmdIndex(0);
      } else if (targetIdx > currentCmdIndex) {
          // Fast-forward executed commands
          const toAdd = commands.slice(currentCmdIndex, targetIdx);
          setExecutedCommands(prev => [...prev, ...toAdd]);
          setCurrentCmdIndex(targetIdx);
      }
      setTypedCommand('');
      setIsTyping(false);
    }
  }, [externalStep, commands, currentCmdIndex]);

  useEffect(() => {
    if (externalStep !== undefined || currentCmdIndex >= commands.length) return;

    const cmd = commands[currentCmdIndex];
    let typingTimer: NodeJS.Timeout;
    let executeTimer: NodeJS.Timeout;
    
    // Start typing after delay
    const startDelay = (cmd.delayBeforeExecution || 1500) / speed;
    
    executeTimer = setTimeout(() => {
      setIsTyping(true);
      setTypedCommand('');
      
      let charIndex = 0;
      const tSpeed = (cmd.typingSpeed || 50) / speed;
      
      typingTimer = setInterval(() => {
        if (charIndex <= cmd.command.length) {
          setTypedCommand(cmd.command.substring(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typingTimer);
          setIsTyping(false);
          
          // Execute command immediately after typing
          setTimeout(() => {
            setExecutedCommands(prev => [...prev, cmd]);
            setCurrentCmdIndex(i => i + 1);
            setTypedCommand('');
          }, 300 / speed);
        }
      }, tSpeed);
    }, startDelay);

    return () => {
      clearTimeout(executeTimer);
      clearInterval(typingTimer);
    };
  }, [currentCmdIndex, commands, externalStep]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderOutput = (output: string) => {
    return output.split('\n').map((line, i) => {
      // Basic syntax highlighting for terminal output
      let colorClass = "text-text-muted";
      if (line.includes('[+]') || line.includes('Success')) colorClass = "text-green-600 dark:text-green-400";
      if (line.includes('[-]') || line.includes('Error')) colorClass = "text-red-600 dark:text-red-400";
      if (line.includes('[*]')) colorClass = "text-blue-600 dark:text-blue-400";
      if (line.includes('200 OK')) colorClass = "text-emerald-600 dark:text-emerald-400 font-bold";
      if (line.includes('403 Forbidden') || line.includes('401 Unauthorized')) colorClass = "text-rose-600 dark:text-rose-400 font-bold";
      
      return (
        <div key={i} className={`font-mono text-[10px] sm:text-xs leading-relaxed ${colorClass}`}>
          {line || <br/>}
        </div>
      );
    });
  };

  return (
    <div className="rounded-2xl border border-border-color bg-bg-primary overflow-hidden shadow-xl my-8">
      {/* Terminal Title Bar */}
      <div className="bg-bg-secondary border-b border-border-color p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-2 text-text-muted ml-2">
            <Terminal size={14} />
            <span className="font-mono text-[10px] font-bold tracking-widest">{title}</span>
          </div>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 md:p-6 bg-bg-primary min-h-[300px] max-h-[500px] overflow-y-auto">
        <AnimatePresence>
          {/* History */}
          {executedCommands.map((cmd, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 relative group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[10px] sm:text-xs text-green-500 font-bold">{promptPath}</span>
                <span className="font-mono text-[10px] sm:text-xs text-text-primary px-1">{cmd.command}</span>
                <button 
                  onClick={() => copyToClipboard(cmd.command, i)}
                  className="ml-auto p-1 rounded transition-colors opacity-0 group-hover:opacity-100 hover:bg-bg-secondary"
                  title="Copy command"
                >
                  {copiedIndex === i ? <CheckCircle2 size={12} className="text-green-400" /> : <Copy size={12} className="text-text-muted" />}
                </button>
              </div>
              <div className="pl-2 border-l-2 border-white/10 py-1">
                {renderOutput(cmd.output)}
              </div>
            </motion.div>
          ))}

          {/* Current line being typed */}
          {currentCmdIndex < commands.length && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <span className="font-mono text-[10px] sm:text-xs text-green-500 font-bold">{promptPath}</span>
              <span className="font-mono text-[10px] sm:text-xs text-text-primary relative px-1">
                {typedCommand}
                <motion.span 
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-2 h-3.5 bg-accent-primary ml-px -mb-0.5"
                />
              </span>
            </motion.div>
          )}

          {/* Finished State */}
          {currentCmdIndex >= commands.length && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 mt-4"
            >
              <span className="font-mono text-[10px] sm:text-xs text-green-500 font-bold">{promptPath}</span>
              <motion.span 
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-2 h-3.5 bg-accent-primary ml-1.5 -mb-0.5"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

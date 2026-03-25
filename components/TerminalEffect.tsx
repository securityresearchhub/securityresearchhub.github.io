import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const lines = [
  "Initializing Secure Environment...",
  "Scanning Network Nodes...",
  "Enumerating Open Ports...",
  "Testing Web Application Security...",
  "Attempting Privilege Escalation...",
  "Access Granted"
];

export const TerminalEffect: React.FC = () => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setTimeout(() => setIsComplete(true), 1500);
      return;
    }

    const line = lines[currentLineIndex];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex < line.length) {
        setDisplayText(prev => prev + line[charIndex]);
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setDisplayText("");
          setCurrentLineIndex(prev => prev + 1);
        }, 600);
      }
    }, 40);

    return () => clearInterval(typeInterval);
  }, [currentLineIndex]);

  if (isComplete) return null;

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background-dark flex items-center justify-center font-mono p-4"
        >
          <div className="max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="text-accent-primary text-sm sm:text-base leading-relaxed h-12">
              <span className="text-text-muted mr-2">root@mani-varma:~$</span>
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-accent-primary ml-1 align-middle"
              />
            </div>
            
            {/* History of previous lines */}
            <div className="mt-4 space-y-1 opacity-40 text-[10px] sm:text-xs">
              {lines.slice(0, currentLineIndex).map((line, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-text-muted">#</span>
                  <span className="text-text-muted italic">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

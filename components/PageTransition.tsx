import React, { Suspense } from 'react';
import { motion } from 'motion/react';

// Minimal skeleton fallback — shows structure immediately (no blank screen)
const PageSkeleton = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
    <div className="relative w-16 h-16 mb-8">
      <div className="absolute inset-0 border-2 border-accent-primary/10 rounded-full" />
      <div className="absolute inset-0 border-t-2 border-accent-primary rounded-full animate-spin" />
    </div>
    <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden relative">
      <div className="absolute inset-0 bg-accent-primary/20 animate-pulse" />
    </div>
    <span className="mt-4 font-mono text-[10px] text-accent-primary/40 uppercase tracking-[0.4em] animate-pulse">
      Syncing Intelligence
    </span>
  </div>
);

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<PageSkeleton />}>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{ willChange: 'opacity' }}
    >
      {children}
    </motion.div>
  </Suspense>
);

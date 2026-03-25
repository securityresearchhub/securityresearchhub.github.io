import React from 'react';
import { Target, Shield } from 'lucide-react';
import { Difficulty, ResearchTrack } from '../types';

interface ResearchFiltersProps {
  activeTrack: ResearchTrack | 'All';
  setActiveTrack: (track: ResearchTrack | 'All') => void;
  activeDifficulty: Difficulty | 'All';
  setActiveDifficulty: (diff: Difficulty | 'All') => void;
}

export const ResearchFilters: React.FC<ResearchFiltersProps> = ({
  activeTrack,
  setActiveTrack,
  activeDifficulty,
  setActiveDifficulty
}) => {
  const tracks: (ResearchTrack | 'All')[] = ['All', 'AppSec', 'InfraSec', 'CloudSec', 'BugBounty'];
  const difficulties: (Difficulty | 'All')[] = ['All', 'Beginner', 'Intermediate', 'Professional', 'Advanced'];

  return (
    <div className="mb-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-8 rounded-3xl border border-border-color relative overflow-hidden"
        style={{ background: 'var(--bg-card)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        {/* Track Filters */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3 text-[10px] font-mono text-accent-primary uppercase tracking-[0.4em] font-black italic">
            <Target size={14} className="animate-pulse" />
            Mission Track
          </div>
          <div className="flex flex-wrap gap-2.5">
            {tracks.map((track) => (
              <button
                key={track}
                onClick={() => setActiveTrack(track)}
                className={`px-5 py-2.5 rounded-2xl font-orbitron text-[9px] font-black uppercase tracking-widest transition-all duration-300 border ${
                  activeTrack === track
                    ? 'bg-accent-primary text-black border-accent-primary shadow-[0_0_25px_var(--accent-glow)] scale-105'
                    : 'bg-transparent text-text-muted border-border-color hover:border-accent-primary/40 hover:text-text-primary'
                }`}
              >
                {track}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filters */}
        <div className="flex flex-col gap-5 border-t md:border-t-0 md:border-l border-border-color pt-8 md:pt-0 md:pl-8 lg:pl-12">
          <div className="flex items-center gap-3 text-[10px] font-mono text-accent-primary uppercase tracking-[0.4em] font-black italic">
            <Shield size={14} className="animate-pulse" />
            Clearance Level
          </div>
          <div className="flex flex-wrap gap-2.5">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setActiveDifficulty(diff)}
                className={`px-5 py-2.5 rounded-2xl font-orbitron text-[9px] font-black uppercase tracking-widest transition-all duration-300 border ${
                  activeDifficulty === diff
                    ? 'bg-accent-primary text-black border-accent-primary shadow-[0_0_25px_var(--accent-glow)] scale-105'
                    : 'bg-transparent text-text-muted border-border-color hover:border-accent-primary/40 hover:text-text-primary'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

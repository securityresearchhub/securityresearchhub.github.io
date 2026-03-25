import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Tag, BookOpen, Layers, Hash, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import { ResearchTrack } from '../types';

interface TopicExplorerProps {
  activeTrack: ResearchTrack | 'All';
  onTrackSelect: (track: ResearchTrack | 'All') => void;
}

export const TopicExplorer: React.FC<TopicExplorerProps> = ({ activeTrack, onTrackSelect }) => {
  // Extract all unique tags
  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags))).sort();
  
  const tracks: (ResearchTrack | 'All')[] = [
    'All',
    'AppSec',
    'InfraSec',
    'CloudSec',
    'BugBounty'
  ];

  return (
    <div className="space-y-10 font-mono">
      {/* Categories / Tracks */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-accent-primary italic">
          <Layers size={14} />
          Mission Tracks
        </div>
        <div className="grid grid-cols-1 gap-2">
          {tracks.map((track) => (
            <button
              key={track}
              onClick={() => onTrackSelect(track)}
              className={`flex items-center justify-between p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all group
                ${activeTrack === track 
                  ? 'bg-accent-primary/10 border-accent-primary text-accent-primary shadow-[0_0_15px_rgba(0,245,255,0.15)]' 
                  : 'bg-white/[0.02] border-white/5 text-text-muted hover:border-white/20 hover:bg-white/[0.04]'}
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${activeTrack === track ? 'bg-accent-primary animate-pulse' : 'bg-white/10 group-hover:bg-white/30'}`} />
                {track === 'All' ? 'FULL_SPECTRUM' : track.replace(/\s+/g, '_')}
              </div>
              <span className="opacity-40 text-[8px]">
                [{blogPosts.filter(p => track === 'All' || p.track === track).length}]
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Tag Cloud */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-accent-primary italic">
          <Hash size={14} />
          Intelligence Tags
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Link
              key={tag}
              to={`/blog?search=${tag.toLowerCase()}`}
              className="px-3 py-1.5 bg-white/[0.02] border border-white/5 rounded-lg text-[9px] font-black text-text-muted uppercase tracking-widest hover:border-accent-primary/40 hover:text-accent-primary transition-all hover:bg-accent-primary/5"
            >
              #{tag.replace(/\s+/g, '_')}
            </Link>
          ))}
        </div>
      </section>

      {/* Index Quick Link */}
      <section className="p-6 glass-card border border-accent-primary/20 bg-accent-primary/[0.02] rounded-2xl relative overflow-hidden group">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-text-primary italic">
            <BookOpen size={16} className="text-accent-primary" />
            Research Index
          </div>
          <p className="text-[9px] text-text-muted font-medium leading-relaxed opacity-60 uppercase">
            Access the complete A-Z registry of documented vulnerabilities and research dossiers.
          </p>
          <Link 
            to="/index"
            className="flex items-center gap-2 text-[10px] font-black text-accent-primary uppercase tracking-widest group-hover:gap-4 transition-all"
          >
            VIEW_FULL_INDEX <ArrowRight size={14} />
          </Link>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <BookOpen size={40} className="text-accent-primary" />
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

export const CopyrightNotice: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="pt-24 pb-12 notranslate">
      <div className="container-progressive">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="markdown-body"
        >
          <div className="flex items-center gap-4 mb-8">
             <Shield className="text-accent-primary" size={40} />
             <h1 className="font-orbitron font-black text-3xl md:text-5xl uppercase tracking-tighter mb-0 italic text-text-primary">Copyright <span className="text-accent-primary">Notice</span></h1>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-12 opacity-60">© {currentYear} Manikanta Varma Cyber Research. All rights reserved.</p>

          <div className="space-y-12 text-sm leading-relaxed font-medium">
            <div className="space-y-4">
              <p className="text-base text-text-primary border-l-4 border-accent-primary pl-4 py-3 bg-white/5 rounded-r-xl">All content published on this website is the intellectual property of the website owner.</p>
              <p className="text-base text-text-muted">This includes but is not limited to: cybersecurity research articles, vulnerability analysis, technical explanations, diagrams and visualizations, attack workflow illustrations, lab simulations, and educational materials.</p>
            </div>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-accent-primary uppercase tracking-widest border-b border-white/10 pb-2">Content Ownership</h2>
              <p>All original research, explanations, tutorials, and educational content on this platform are created and owned by the author. This includes:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>blog articles</li>
                <li>in-depth vulnerability research dossiers</li>
                <li>diagrams and architecture explanations</li>
                <li>attack workflow visualizations</li>
                <li>code examples and labs</li>
              </ul>
              <div className="mt-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10">
                <p className="text-red-400 font-mono text-xs uppercase tracking-wider font-bold">Unauthorized copying, reproduction, redistribution, or republishing of this content is strictly prohibited.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-white uppercase tracking-widest border-b border-white/10 pb-2">Restrictions</h2>
              <p>You may NOT:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>copy the full article and publish it on another website</li>
                <li>republish research content without permission</li>
                <li>reproduce diagrams or research material for commercial use</li>
                <li>distribute the content as your own work</li>
              </ul>
              <div className="mt-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10">
                <p className="text-red-400 font-mono text-xs uppercase tracking-wider font-bold">Any attempt to copy or reuse the content without authorization may result in copyright violation claims.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-white uppercase tracking-widest border-b border-white/10 pb-2">Limited Fair Use</h2>
              <p>Small excerpts of content may be quoted only for educational or research discussion purposes, provided that:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>proper credit is given</li>
                <li>a link to the original source is included</li>
              </ul>
              <div className="mt-6 p-4 rounded-xl bg-[#111] border border-white/10 border-l-4 border-l-accent-primary">
                <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-2 font-bold opacity-60">Example Citation:</p>
                <p className="text-text-primary text-sm italic">Source: Manikanta Varma Cyber Research Blog</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-white uppercase tracking-widest border-b border-white/10 pb-2">Unauthorized Use</h2>
              <p>If any website or individual republishes this content without permission, it may result in:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>DMCA takedown requests</li>
                <li>copyright infringement reporting</li>
                <li>removal requests to hosting providers</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-white uppercase tracking-widest border-b border-white/10 pb-2">Educational Use</h2>
              <p>This platform allows readers to learn cybersecurity concepts, but the content itself remains protected intellectual property.</p>
              <p className="text-text-muted">Learning from the content is permitted.</p>
              <p className="text-text-muted">Copying or redistributing the content is not permitted.</p>
            </section>

            <section className="mt-12 bg-[#111] p-6 md:p-8 rounded-2xl border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-accent-primary" />
              <h2 className="font-orbitron text-xl text-accent-primary uppercase tracking-widest mb-4">Contact</h2>
              <div className="space-y-2">
                <p className="text-text-primary text-base">For permissions, research collaboration, or citations, contact through the official website.</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

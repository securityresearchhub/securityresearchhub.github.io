import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, ShieldCheck, Zap, Info } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg">
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <div className="inline-block px-4 py-1.5 mb-6 border border-border-color rounded-full font-mono text-[10px] text-accent-primary tracking-[0.4em] font-black uppercase italic"
              style={{ background: 'var(--accent-primary-faded)' }}>
              Registry Protocol // 002
            </div>
            <h1 className="font-orbitron text-4xl md:text-6xl font-black text-text-primary uppercase italic mb-6">
              LEGAL <span className="text-accent-primary">DISCLAIMER</span>
            </h1>
            <p className="text-text-muted font-medium text-lg leading-relaxed">
              Last Updated: March 14, 2026
            </p>
          </motion.div>

          <div className="space-y-12 text-text-muted font-medium leading-relaxed bg-white/[0.01] border border-border-color p-12 rounded-[2.5rem]">
            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-4 mb-8">
              <AlertTriangle size={24} className="text-amber-500 shrink-0 mt-1" />
              <div>
                <h3 className="font-orbitron font-black text-xs text-amber-500 uppercase tracking-widest mb-2">High-Risk Content Warning</h3>
                <p className="text-xs text-amber-500/80 leading-relaxed font-mono font-bold uppercase italic">
                  Information on this platform describes techniques that can be used for unauthorized access. 
                  Misuse is a crime. Use responsible judgment.
                </p>
              </div>
            </div>

            <section className="space-y-4">
              <h2 className="font-orbitron font-black text-xl text-text-primary uppercase italic flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                1. Educational Nature
              </h2>
              <p>
                All information provided on Varmacyber.io is for educational, research, and authorized security testing 
                purposes only. We aim to assist security professionals and developers in building more secure systems by 
                demonstrating attack vectors and mitigation strategies.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-orbitron font-black text-xl text-text-primary uppercase italic flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                2. No Warranty
              </h2>
              <p>
                The intelligence dossiers and technical research are provided "as is" without any warranty of 
                completeness or accuracy. While we strive for technical excellence, security is a rapidly evolving 
                field, and we cannot guarantee that information is perpetually up to date.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-orbitron font-black text-xl text-text-primary uppercase italic flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                3. Limitation of Liability
              </h2>
              <p>
                Under no circumstances shall Mani Varma or Varmacyber Global Networks be liable for any direct, 
                indirect, or consequential damages resulting from the use or misuse of the information provided 
                on this platform. You assume all responsibility for your actions.
              </p>
            </section>

            <div className="pt-8 border-t border-white/5 text-center">
              <p className="text-[10px] font-mono uppercase tracking-widest opacity-40 italic">
                Registry_Verification_Status // ACTIVE
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

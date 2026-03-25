import React from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

export const LegalUse: React.FC = () => {
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
             <h1 className="font-orbitron font-black text-3xl md:text-5xl uppercase tracking-tighter mb-0 italic text-text-primary">Legal Use <span className="text-accent-primary">Policy</span></h1>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-12 opacity-60">Last updated: 2026</p>

          <div className="space-y-12 text-sm leading-relaxed font-medium">
            <div className="space-y-4">
              <p className="text-base text-text-primary border-l-4 border-accent-primary pl-4 py-3 bg-white/5 rounded-r-xl">This cybersecurity research platform is created strictly for educational and defensive security research purposes.</p>
              <p className="text-base text-text-muted">All vulnerability demonstrations, simulations, and explanations are intended to help individuals and organizations understand security risks and improve defensive security practices.</p>
            </div>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-accent-primary uppercase tracking-widest border-b border-white/10 pb-2">Authorized Use Only</h2>
              <p>All techniques described on this platform must only be used in:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>personal learning environments</li>
                <li>authorized security testing labs</li>
                <li>systems where explicit written permission has been granted</li>
              </ul>
              <div className="mt-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10">
                <p className="text-red-400 font-mono text-xs uppercase tracking-wider font-bold">Testing systems without permission may violate computer crime laws in many countries.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-white uppercase tracking-widest border-b border-white/10 pb-2">Strictly Prohibited Activities</h2>
              <p>Users are strictly prohibited from using the information on this platform to:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>hack or attack unauthorized systems</li>
                <li>exploit real-world vulnerabilities without permission</li>
                <li>perform illegal activities</li>
                <li>cause damage to systems or data</li>
              </ul>
              <div className="mt-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10">
                <p className="text-red-400 font-mono text-xs uppercase tracking-wider font-bold">Such actions may violate cybercrime laws and computer misuse laws.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-white uppercase tracking-widest border-b border-white/10 pb-2">Monitoring & Abuse Prevention</h2>
              <p>This platform reserves the right to protect its infrastructure and research content.</p>
              <p>In case of suspicious or abusive activity, the following actions may be taken:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>temporary access restrictions</li>
                <li>IP blocking</li>
                <li>security monitoring</li>
                <li>reporting abuse to hosting providers or relevant authorities when necessary</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-white uppercase tracking-widest border-b border-white/10 pb-2">Legal Responsibility</h2>
              <p>All users accessing this website acknowledge that:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>they are responsible for how they use the information</li>
                <li>the website owner is not responsible for misuse</li>
                <li>any illegal use of this information is solely the user's responsibility</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-white uppercase tracking-widest border-b border-white/10 pb-2">Educational Security Research Purpose</h2>
              <p>The goal of this platform is to:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>educate security researchers</li>
                <li>improve application security awareness</li>
                <li>help developers build secure systems</li>
                <li>promote responsible security research</li>
              </ul>
              <div className="mt-6 p-4 rounded-xl border border-green-500/20 bg-green-500/5">
                <p className="text-green-400 font-mono text-xs uppercase tracking-wider font-bold">This website does not encourage illegal hacking activities.</p>
              </div>
            </section>

            <section className="mt-12 bg-[#111] p-6 md:p-8 rounded-2xl border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-accent-primary" />
              <h2 className="font-orbitron text-xl text-accent-primary uppercase tracking-widest mb-4">Acceptance of Policy</h2>
              <div className="space-y-2">
                <p className="text-text-primary text-base">By accessing this platform, users agree to comply with this legal use policy.</p>
                <p className="text-text-muted text-sm italic">If you do not agree with these terms, you should stop using this website.</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

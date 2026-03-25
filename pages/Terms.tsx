import React from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

export const Terms: React.FC = () => {
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
             <h1 className="font-orbitron font-black text-3xl md:text-5xl uppercase tracking-tighter mb-0 italic text-text-primary">Terms & <span className="text-accent-primary">Conditions</span></h1>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-12 opacity-60">Last updated: 2026</p>

          <div className="space-y-12 text-sm leading-relaxed font-medium">
            <div className="space-y-4">
              <p className="text-base text-text-primary border-l-4 border-accent-primary pl-4 py-3 bg-white/5 rounded-r-xl">Welcome to this cybersecurity research platform. By accessing and using this website, you agree to the following terms and conditions.</p>
            </div>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-accent-primary uppercase tracking-widest border-b border-white/10 pb-2">Educational Purpose Only</h2>
              <p>All information provided on this website is strictly for educational and research purposes only.</p>
              <p>The content is intended to help:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>security researchers</li>
                <li>students learning cybersecurity</li>
                <li>developers improving application security</li>
                <li>organizations understanding security risks</li>
              </ul>
              <div className="mt-6 p-4 rounded-xl border border-green-500/20 bg-green-500/5">
                <p className="text-green-400 font-mono text-xs uppercase tracking-wider font-bold">The purpose of this platform is to promote responsible security awareness and defensive security practices.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-white uppercase tracking-widest border-b border-white/10 pb-2">No Authorization for Illegal Activities</h2>
              <p>The techniques, demonstrations, and vulnerability explanations shown on this website must not be used for unauthorized or illegal activities.</p>
              <p className="text-text-muted">Users must only test systems that they own or have explicit written permission to test.</p>
              <div className="mt-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10">
                <p className="text-red-400 font-mono text-xs uppercase tracking-wider font-bold">Any misuse of the information presented on this platform is strictly prohibited.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-white uppercase tracking-widest border-b border-white/10 pb-2">User Responsibility</h2>
              <p>By using this website you agree that:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>You will use the information responsibly.</li>
                <li>You will not use the content to perform illegal hacking activities.</li>
                <li>You understand cybersecurity concepts must only be applied in authorized environments.</li>
              </ul>
              <p className="text-text-primary mt-4 font-bold italic">The website owner takes no responsibility for any misuse of the information provided.</p>
            </section>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-white uppercase tracking-widest border-b border-white/10 pb-2">No Liability</h2>
              <p>The author and contributors of this website shall not be held responsible for any damages, legal issues, or consequences resulting from the misuse of the information available on this platform.</p>
              <p className="text-text-muted">All actions performed using the knowledge obtained from this site are the sole responsibility of the user.</p>
            </section>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-white uppercase tracking-widest border-b border-white/10 pb-2">Security Research Purpose</h2>
              <p>The vulnerability demonstrations, simulations, and labs are designed only to explain how security flaws occur and how they can be prevented.</p>
              <p>These examples are provided to:</p>
               <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>improve defensive security</li>
                <li>educate developers</li>
                <li>help organizations secure their applications</li>
              </ul>
            </section>
            
            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-white uppercase tracking-widest border-b border-white/10 pb-2">Responsible Disclosure</h2>
              <p>Users are encouraged to follow responsible disclosure practices when discovering vulnerabilities.</p>
              <div className="mt-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10">
                <p className="text-red-400 font-mono text-xs uppercase tracking-wider font-bold">Never exploit vulnerabilities in production systems without permission.</p>
              </div>
            </section>

            <section className="mt-12 bg-[#111] p-6 md:p-8 rounded-2xl border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-accent-primary" />
              <h2 className="font-orbitron text-xl text-accent-primary uppercase tracking-widest mb-4">Acceptance of Terms</h2>
              <div className="space-y-2">
                <p className="text-text-primary text-base">By accessing this website you confirm that you understand and agree to these terms and conditions.</p>
                <p className="text-text-muted text-sm italic">If you do not agree with these terms, please do not use this platform.</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

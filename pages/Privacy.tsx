import React from 'react';
import { motion } from 'motion/react';
import { Layout } from '../components/Layout';

export const Privacy: React.FC = () => {
  return (
    <div className="pt-24 pb-12 notranslate">
      <div className="container-progressive">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="markdown-body"
        >
          <h1 className="font-orbitron font-black text-3xl md:text-5xl uppercase tracking-tighter mb-8 italic text-text-primary">
            Privacy <span className="text-accent-primary">Policy</span>
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-12 opacity-60">
            Last updated: March 19, 2026
          </p>

          <div className="space-y-12 text-sm leading-relaxed font-medium">
            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-text-primary uppercase tracking-widest border-l-4 border-accent-primary pl-4">Introduction</h2>
              <p>Welcome to our cybersecurity portfolio and research platform. We value your privacy and are committed to protecting any information you may share while interacting with this website. This Privacy Policy outlines how your data is handled when you visit our site.</p>
            </section>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-text-primary uppercase tracking-widest border-l-4 border-accent-primary pl-4">Information Collection</h2>
              <p>We do not directly collect any personal identifiable information (PII) from our visitors. However, automated tools such as Google Analytics are utilized to collect anonymized technical data, including your IP address, browser type, device information, and pages visited, to help us analyze traffic and improve content quality.</p>
            </section>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-text-primary uppercase tracking-widest border-l-4 border-accent-primary pl-4">Cookies</h2>
              <p>This website uses "cookies" to enhance your browsing experience. Cookies are small data files stored on your device that help us remember your preferences, such as your theme selection, and optimize website performance for future visits.</p>
            </section>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-text-primary uppercase tracking-widest border-l-4 border-accent-primary pl-4">Google AdSense</h2>
              <p>We use Google AdSense to display advertisements on our site. Google may use cookies, including DART cookies, to serve personalized ads based on your visit to this website and other sites across the internet. You can choose to opt out of the use of the DART cookie by visiting the Google ad and content network Privacy Policy.</p>
            </section>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-text-primary uppercase tracking-widest border-l-4 border-accent-primary pl-4">Third-Party Services</h2>
              <p>This platform integrates third-party tools, including Google Analytics and Google AdSense, to track website performance and serve advertisements. These services operate under their own respective Privacy Policies, and we encourage you to review them for more details on their data practices.</p>
            </section>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-text-primary uppercase tracking-widest border-l-4 border-accent-primary pl-4">Consent</h2>
              <p>By continuing to use this website, you hereby consent to our Privacy Policy and agree to its terms and conditions.</p>
            </section>

            <section className="space-y-4">
              <h2 className="font-orbitron text-xl text-text-primary uppercase tracking-widest border-l-4 border-accent-primary pl-4">Contact</h2>
              <p>If you have any questions, require more information about our Privacy Policy, or wish to discuss cybersecurity collaboration, you can reach me directly via email at <a href="mailto:yourmail@gmail.com" className="text-accent-primary hover:underline">yourmail@gmail.com</a>.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

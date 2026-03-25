import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Globe, Lock, ExternalLink, Mail, Github, Linkedin, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg border-t border-border-color pt-20 pb-10">
      <div className="container-progressive">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center text-black shadow-[0_0_20px_var(--accent-glow)]">
                <Shield size={20} />
              </div>
              <span className="font-orbitron font-black text-xl tracking-tighter text-text-primary uppercase italic">
                VARMA<span className="text-accent-primary">CYBER</span>
              </span>
            </div>
            <p className="text-text-muted text-sm font-medium leading-relaxed max-w-xs">
              Global Cybersecurity Research Hub & Vulnerability Intelligence Platform. 
              Open-source intelligence for a safer digital frontier.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/5 text-text-muted hover:text-accent-primary hover:border-accent-primary/20 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/5 text-text-muted hover:text-accent-primary hover:border-accent-primary/20 transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/5 text-text-muted hover:text-accent-primary hover:border-accent-primary/20 transition-all">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-orbitron font-black text-[10px] text-accent-primary uppercase tracking-[0.3em] mb-8 italic">Platform_Nodes</h4>
            <ul className="space-y-4">
              {[
                { label: 'Home', path: '/' },
                { label: 'About', path: '/about' },
                { label: 'Experience', path: '/#experience' },
                { label: 'Projects', path: '/#projects' },
                { label: 'Credentials', path: '/#credentials' }
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-sm font-mono font-black text-text-muted hover:text-text-primary transition-colors flex items-center gap-2 group">
                    <div className="w-1 h-1 rounded-full bg-accent-primary opacity-0 group-hover:opacity-100 transition-all" />
                    {item.label.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Research Hub */}
          <div>
            <h4 className="font-orbitron font-black text-[10px] text-accent-primary uppercase tracking-[0.3em] mb-8 italic">Intelligence_Streams</h4>
            <ul className="space-y-4">
              {[
                { label: 'Technical Blog', path: '/blog' },
                { label: 'Threat Database', path: '/database' },
                { label: 'Research Index', path: '/research-hub' }
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-sm font-mono font-black text-text-muted hover:text-text-primary transition-colors flex items-center gap-2 group">
                    <div className="w-1 h-1 rounded-full bg-accent-primary opacity-0 group-hover:opacity-100 transition-all" />
                    {item.label.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="font-orbitron font-black text-[10px] text-accent-primary uppercase tracking-[0.3em] mb-8 italic">Registry_Protocols</h4>
            <ul className="space-y-4">
              {[
                { label: 'Privacy Policy', path: '/privacy' },
                { label: 'Terms of Service', path: '/terms' },
                { label: 'Disclaimer', path: '/disclaimer' },
                { label: 'Security Policy', path: '/security-policy' },
                { label: 'Legal Use Policy', path: '/legal-use' },
                { label: 'Copyright Notice', path: '/copyright' }
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-sm font-mono font-black text-text-muted hover:text-text-primary transition-colors flex items-center gap-2 group">
                    <div className="w-1 h-1 rounded-full bg-accent-primary opacity-0 group-hover:opacity-100 transition-all" />
                    {item.label.toUpperCase()}
                  </Link>
                </li>
              ))}
              <li className="pt-4">
                <div className="px-4 py-2 rounded-xl bg-accent-primary/5 border border-accent-primary/20 inline-flex items-center gap-2">
                  <Lock size={12} className="text-accent-primary" />
                  <span className="text-[10px] font-mono font-black text-accent-primary uppercase tracking-widest italic">Encrypted Connection</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em] font-black opacity-40">
            &copy; {currentYear} VARMACYBER_GLOBAL_NETWORKS // ALL_RIGHTS_RESERVED
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted uppercase tracking-widest font-black opacity-40">
              <Mail size={14} /> SECURITY@VARMACYBER.IO
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-green-500 uppercase tracking-widest font-black">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              SYSTEM_ONLINE_STABLE // REV_2603_1322
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { Database, FolderOpen, ExternalLink, Lock } from 'lucide-react';

export const CredentialsDatabase: React.FC = () => {
    return (
        <div id="credentials" className="py-12">
            <div className="container mx-auto px-6 max-w-2xl">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-8 border border-border-color flex items-center gap-8 group transition-all cursor-pointer relative overflow-hidden rounded-3xl"
                    style={{ background: 'var(--bg-card)' }}
                >
                    {/* Subtle Scanline Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    <div className="p-5 bg-accent-secondary/10 border border-accent-secondary/20 rounded-2xl text-accent-secondary group-hover:scale-110 transition-transform shadow-[0_0_15px_var(--accent-glow-subtle)]">
                        <FolderOpen size={32} />
                    </div>

                    <div className="space-y-2">
                        <span className="block text-[9px] font-mono text-text-muted font-black uppercase tracking-[0.4em]">CREDENTIALS_DATABASE</span>
                        <h3 className="text-lg md:text-xl font-orbitron font-black text-text-primary uppercase tracking-widest group-hover:text-accent-secondary transition-colors">
                            ACCESS SKILL CERTIFICATIONS ARCHIVE
                        </h3>
                    </div>

                    <div className="ml-auto opacity-40 group-hover:opacity-100 transition-opacity">
                        <ExternalLink size={20} className="text-text-primary" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

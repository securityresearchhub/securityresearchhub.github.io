import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, FileText } from 'lucide-react';

export const Confidentiality: React.FC = () => {
    return (
        <div className="py-20">
            <div className="p-8 md:p-12 border border-border-color relative overflow-hidden group rounded-3xl"
                style={{ background: 'var(--bg-card)' }}>
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-text-primary">
                    <Lock size={120} />
                </div>
                <div className="space-y-8 relative z-10">
                    <div className="flex items-center gap-4 text-accent-primary font-mono text-[10px] tracking-[0.6em] uppercase">
                        <ShieldCheck size={14} className="animate-pulse" />
                        <span>Security Protocol</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-orbitron font-black text-text-primary uppercase tracking-tighter leading-none">
                        SECURITY & <span className="text-accent-primary">CONFIDENTIALITY</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                        <div className="space-y-4">
                            <h4 className="text-lg font-orbitron font-black text-text-primary uppercase tracking-tight">Data Sovereignty</h4>
                            <p className="text-text-muted text-sm leading-relaxed">
                                All client data and engagement metrics are handled within air-gapped environments and shredded post-operation.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-lg font-orbitron font-black text-text-primary uppercase tracking-tight">NDA Compliance</h4>
                            <p className="text-text-muted text-sm leading-relaxed">
                                Strict adherence to international non-disclosure agreements and ethical responsible disclosure methodologies.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import emailjs from '@emailjs/browser';
import { Star, Send, Shield, User, MessageSquare, Terminal, Zap, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export const ProfessionalFeedback: React.FC = () => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [formData, setFormData] = useState({
        operator_id: '',
        assessment_notes: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async () => {
        if (!formData.operator_id || !formData.assessment_notes || rating === 0) {
            alert("Please complete identity and notes fields and select a rating.");
            return;
        }

        setStatus('submitting');
        try {
            await emailjs.send(
                "service_1d49eir",
                "template_h7jc06d",
                {
                    operator_id: formData.operator_id,
                    assessment_notes: formData.assessment_notes,
                    rating: rating,
                    to_email: "varma.portfolio@gmail.com"
                }
            );
            setStatus('success');
            setFormData({ operator_id: '', assessment_notes: '' });
            setRating(0);
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error("Feedback submission failed:", error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <div id="feedback" className="py-12">
            <div className="container mx-auto px-6 max-w-[720px]">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-8 border border-border-color relative overflow-hidden group rounded-[2.5rem]"
                    style={{ background: 'var(--bg-card)' }}
                >
                    {/* Header Area */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl font-orbitron font-[800] text-text-primary uppercase tracking-tighter leading-none italic">
                                SYSTEM <span className="text-text-primary">EVALUATION</span>
                            </h2>
                            <div className="flex items-center gap-4 text-xs font-mono text-accent-primary tracking-[0.4em] font-black italic">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                                TACTICAL_ASSESSMENT_HUD
                            </div>
                        </div>

                        <div className="px-6 py-3 bg-accent-primary/10 border border-border-color rounded-full font-mono text-[9px] text-text-muted tracking-[0.4em] font-black shadow-inner flex items-center gap-3">
                            <Shield size={14} className="text-accent-primary" />
                            SEC: ALPHA_LEVEL_7
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Star Rating Interface */}
                        <div className="p-8 border border-border-color rounded-2xl backdrop-blur-sm flex flex-col items-center gap-4"
                            style={{ background: 'var(--bg-card)' }}>
                            <div className="flex gap-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className="transition-all duration-300 transform hover:scale-[1.05]"
                                    >
                                        <Star
                                            size={36}
                                            className={`${(hover || rating) >= star
                                                ? 'text-accent-primary fill-accent-primary opacity-100'
                                                : 'text-text-muted/20'
                                                } transition-all stroke-[1.5px]`}
                                            style={{ filter: (hover || rating) >= star ? 'drop-shadow(0 0 8px var(--accent-glow))' : 'none' }}
                                        />
                                    </button>
                                ))}
                            </div>
                            <div className="px-10 py-4 border border-border-color rounded-full font-mono text-[10px] text-text-muted uppercase tracking-[0.4em] font-black group-hover:text-text-primary transition-colors"
                                style={{ background: 'var(--accent-primary-faded)' }}>
                                {rating > 0 ? `ASSESSMENT: ${rating}/5 STARS` : 'QUANTITATIVE INPUT...'}
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-text-muted font-mono text-[9px] uppercase tracking-[0.4em] font-black">
                                    <User size={14} className="text-accent-primary" />
                                    <span>OPERATOR_ID</span>
                                </div>
                                <input
                                    type="text"
                                    value={formData.operator_id}
                                    onChange={(e) => setFormData({ ...formData, operator_id: e.target.value })}
                                    className="w-full border border-border-color p-6 rounded-xl text-xs font-mono text-text-primary focus:border-accent-primary/50 outline-none transition-all placeholder:text-text-muted shadow-inner"
                                    style={{ background: 'var(--bg-card)' }}
                                    placeholder="IDENTITY_TAG"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-text-muted font-mono text-[9px] uppercase tracking-[0.4em] font-black">
                                    <MessageSquare size={14} className="text-accent-primary" />
                                    <span>ASSESSMENT_NOTES</span>
                                </div>
                                <textarea
                                    rows={3}
                                    value={formData.assessment_notes}
                                    onChange={(e) => setFormData({ ...formData, assessment_notes: e.target.value })}
                                    className="w-full border border-border-color p-4 rounded-xl text-xs font-mono text-text-primary focus:border-accent-primary/50 outline-none transition-all placeholder:text-text-muted resize-y shadow-inner"
                                    style={{ background: 'var(--bg-card)', minHeight: '120px', maxHeight: '180px' }}
                                    placeholder="Submit mission logs..."
                                />
                            </div>

                            <div className="flex flex-col items-center gap-4 mt-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={status === 'submitting'}
                                    className={`px-12 py-4 border border-border-color rounded-2xl text-text-primary font-orbitron font-bold text-xs uppercase tracking-[0.4em] hover:bg-accent-primary hover:text-white hover:border-accent-primary shadow-xl transition-all active:scale-[0.98] group flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed`}
                                    style={{ background: 'var(--accent-primary-faded)' }}
                                >
                                    {status === 'submitting' ? (
                                        <>
                                            <span>TRANSMITTING...</span>
                                            <Loader2 size={18} className="animate-spin" />
                                        </>
                                    ) : (
                                        <>
                                            <span>COMPLETE EVALUATION</span>
                                            <Send size={18} className="group-hover:translate-x-2 transition-transform" />
                                        </>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {status === 'success' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 text-accent-primary font-mono text-[10px] uppercase tracking-widest font-black"
                                        >
                                            <CheckCircle2 size={14} />
                                            <span>UPLINK_SUCCESSFUL: MISSION LOGS SECURED</span>
                                        </motion.div>
                                    )}
                                    {status === 'error' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 text-severity-critical font-mono text-[10px] uppercase tracking-widest font-black"
                                        >
                                            <AlertCircle size={14} />
                                            <span>UPLINK_FAILURE: RESUBMIT_REQUIRED</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

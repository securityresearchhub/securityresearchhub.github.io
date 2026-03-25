import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import emailjs from '@emailjs/browser';
import { Bug, X, Send, AlertCircle, CheckCircle, Camera, Shield } from "lucide-react";

interface IssueReportSystemProps {
  currentUrl: string;
  language: string;
}

export const IssueReportSystem: React.FC<IssueReportSystemProps> = ({ currentUrl, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'type' | 'details' | 'success'>('type');
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedMessage = `
--- SECURITY LAB ISSUE REPORT ---
Issue Type: ${issueType}
URL: ${currentUrl}
Language: ${language}
Device: ${/Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop"}
User Agent: ${navigator.userAgent}
---------------------------------
Description:
${description}
    `.trim();

    try {
      await emailjs.send('service_1d49eir', 'template_h7jc06d', {
        full_name: 'Issue Report System',
        email: 'system@manivarmacyber.com',
        message: formattedMessage,
        to_email: 'varma.portfolio@gmail.com',
      });
      setStep('success');
    } catch (error) {
      console.error("Failed to send issue report:", error);
      alert("Failed to send report. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
    
    // Auto-close after success
    setTimeout(() => {
      setIsOpen(false);
      setStep('type');
      setIssueType("");
      setDescription("");
    }, 3000);
  };

  const issueTypes = [
    { id: "voice", label: "Voice Narration", icon: <AlertCircle size={14} /> },
    { id: "translation", label: "Translation Error", icon: <AlertCircle size={14} /> },
    { id: "ui", label: "UI / Display Problem", icon: <AlertCircle size={14} /> },
    { id: "content", label: "Content Accuracy", icon: <AlertCircle size={14} /> },
    { id: "other", label: "Other / Suggestion", icon: <AlertCircle size={14} /> },
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[200] flex items-center justify-between px-4 py-2 rounded-full bg-accent-primary text-black font-orbitron font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.4)] transition-all hover:shadow-[0_0_30px_rgba(var(--accent-primary-rgb),0.6)] min-w-[180px]"
      >
        <span className="flex-1 pr-[10px] whitespace-nowrap overflow-hidden text-ellipsis text-left">
          Report an Issue
        </span>
        <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center bg-black/5 rounded-full">
          <Bug size={18} />
          {/* Notification Dot */}
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-accent-primary" />
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-bg/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              ref={formRef}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-bg border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-accent-primary" />
                  <span className="font-orbitron font-black text-xs text-text-primary uppercase tracking-widest">
                    Security Lab Feedback
                  </span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-lg text-text-muted transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6">
                {step === 'type' && (
                  <div className="space-y-4">
                    <p className="text-sm text-text-muted mb-4">What issue did you face? Select a category below.</p>
                    <div className="grid grid-cols-1 gap-2">
                      {issueTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => {
                            setIssueType(type.id);
                            setStep('details');
                          }}
                          className="flex items-center gap-3 w-full p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-accent-primary/20 transition-all text-left group"
                        >
                          <span className="text-accent-primary opacity-50 group-hover:opacity-100 transition-opacity">
                            {type.icon}
                          </span>
                          <span className="text-xs font-mono text-text-primary uppercase tracking-wider">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 'details' && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-accent-primary uppercase mb-2">
                       <AlertCircle size={12} /> Reporting: {issueType}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Description</label>
                      <textarea
                        required
                        placeholder="Tell us exactly what happened... (e.g., 'Voice stopped on section 3' or 'Hindi translation overlap')"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full h-32 bg-white/[0.02] border border-white/10 rounded-xl p-3 text-sm text-text-primary focus:border-accent-primary/40 focus:outline-none transition-all placeholder:text-text-muted/30"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                       <button
                        type="button"
                        onClick={() => setStep('type')}
                        className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
                      >
                        Back
                      </button>
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary text-black font-orbitron font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" size={12} /> : <Send size={12} />}
                        Submit Report
                      </button>
                    </div>

                    <p className="text-[9px] text-text-muted/50 font-mono italic">
                      Note: Your URL and device type will be shared to help us debug.
                    </p>
                  </form>
                )}

                {step === 'success' && (
                  <div className="py-8 flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-2">
                      <CheckCircle size={32} className="text-green-500" />
                    </div>
                    <h3 className="font-orbitron font-black text-sm text-text-primary uppercase tracking-widest">
                      Report Submitted
                    </h3>
                    <p className="text-xs text-text-muted max-w-[240px]">
                      Thank you for your feedback! We've captured the technical details to fix this issue ASAP.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Loader2 = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Send, 
  MessageSquare, 
  X, 
  ChevronRight, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  ThumbsUp,
  Lightbulb,
  Search,
  MessageCircle
} from 'lucide-react';
import emailjs from '@emailjs/browser';

interface ResearchFeedbackChatbotProps {
  articleTitle: string;
  mode?: 'inline' | 'floating';
}

type ChatStep = 'INITIAL' | 'FEEDBACK_OPTIONS' | 'SUGGESTIONS' | 'TOPIC_REQUEST' | 'SUBMITTING' | 'SUCCESS' | 'ERROR';

let isGlobalRendered = false;

export const ResearchFeedbackChatbot: React.FC<ResearchFeedbackChatbotProps> = ({ 
  articleTitle, 
  mode = 'inline' 
}) => {
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!rendered) {
      console.log("Feedback render");
      setRendered(true);
    }
  }, []);

  const [isOpen, setIsOpen] = useState(mode === 'inline');
  const [step, setStep] = useState<ChatStep>('INITIAL');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState('');
  const [researchRequest, setResearchRequest] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [step, isOpen, isMinimized]);

  const quickOptions = [
    "Clear Explanation",
    "Needs More Examples",
    "Add More Diagrams",
    "Add More Practice Labs",
    "Beginner Friendly",
    "Too Advanced"
  ];

  const handleOptionToggle = (option: string) => {
    // Replace state instead of appending if that was the intent, 
    // but for multi-select checkboxes we usually keep the toggle logic.
    // However, following the "Replace state" advice for single-action flows:
    setSelectedOptions([option]); 
  };

  const handleSubmit = async () => {
    setStep('SUBMITTING');
    
    // Format the feedback options as a clean list
    const formattedFeedback = selectedOptions.length > 0 
      ? selectedOptions.map(opt => `• ${opt}`).join('\n') 
      : "No specific feedback options selected";

    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    try {
      const templateParams = {
        article_title: articleTitle,
        rating: `${rating} / 5`,
        feedback_options: formattedFeedback,
        custom_suggestion: suggestion || "No custom suggestions provided",
        research_request: researchRequest || "No specific research topic requested",
        timestamp: timestamp,
        to_email: "varma.portfolio@gmail.com",
        // Backward compatibility field for older templates
        message: `Article: ${articleTitle}\nRating: ${rating}/5\nFeedback: ${formattedFeedback}\nSuggestion: ${suggestion}\nRequest: ${researchRequest}\nTime: ${timestamp}`
      };

      await emailjs.send(
        "service_1d49eir",
        "template_h7jc06d",
        templateParams
      );
      setStep('SUCCESS');
    } catch (error) {
      console.error("Feedback submission failed:", error);
      setStep('ERROR');
    }
  };

  const renderMessage = (text: string, isBot: boolean = true) => (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div className={`max-w-[80%] p-4 rounded-2xl font-mono text-xs leading-relaxed ${
        isBot 
          ? 'bg-white/5 border border-white/10 text-text-primary rounded-tl-none' 
          : 'bg-accent-primary/10 border border-accent-primary/30 text-accent-primary rounded-tr-none'
      }`}>
        {text}
      </div>
    </motion.div>
  );

  if (mode === 'floating' && !isOpen) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-accent-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.4)] z-[999] group border-2 border-white/20"
      >
        <MessageCircle className="text-white group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#050506] animate-pulse" />
      </motion.button>
    );
  }

  const containerClasses = mode === 'inline' 
    ? "w-full my-12" 
    : "fixed bottom-6 right-6 w-[360px] max-w-[calc(100vw-3rem)] z-[999] shadow-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0c] backdrop-blur-xl";

  return (
    <div className={containerClasses}>
      {/* Header (Only for Floating) */}
      {mode === 'floating' && (
        <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
            <span className="font-orbitron text-[10px] font-black uppercase tracking-widest text-text-primary">Research Assistant</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Inline Title */}
      {mode === 'inline' && (
        <div className="flex flex-col items-center mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-orbitron font-black text-text-primary uppercase tracking-tighter italic mb-4">
                RESEARCH <span className="text-accent-primary">FEEDBACK</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-accent-primary to-transparent" />
        </div>
      )}

      <div className={`${mode === 'floating' ? 'h-[400px]' : 'min-h-[300px] p-6 rounded-[2.5rem] border border-white/5 bg-white/[0.02]'} overflow-y-auto p-4 custom-scrollbar`}>
        <div className="space-y-4">
          {renderMessage("What do you think about this research?")}
          
          {/* Step 1: Rating */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                disabled={rating > 0}
                onMouseEnter={() => !rating && setHoverRating(star)}
                onMouseLeave={() => !rating && setHoverRating(0)}
                onClick={() => {
                   setRating(star);
                   setStep('FEEDBACK_OPTIONS');
                }}
                className={`transition-all duration-300 ${rating > 0 && rating !== star ? 'opacity-30' : 'hover:scale-110'}`}
              >
                <Star 
                  size={mode === 'floating' ? 24 : 32} 
                  className={`${(hoverRating || rating) >= star ? 'text-accent-primary fill-accent-primary' : 'text-text-muted/20'} transition-colors`}
                  style={{ filter: (hoverRating || rating) >= star ? 'drop-shadow(0 0 8px var(--accent-glow))' : 'none' }}
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <>
              {renderMessage(`I rate it ${rating} stars!`, false)}
              {renderMessage("Was the explanation helpful? (Select all that apply)")}
              
              {/* Step 2: Quick Feedback */}
              <div className="flex flex-wrap gap-2 mb-6">
                {quickOptions.map(opt => (
                  <button
                    key={opt}
                    disabled={step !== 'FEEDBACK_OPTIONS'}
                    onClick={() => handleOptionToggle(opt)}
                    className={`px-3 py-1.5 rounded-full font-mono text-[9px] uppercase tracking-wider transition-all border ${
                      selectedOptions.includes(opt)
                        ? 'bg-accent-primary text-white border-accent-primary shadow-[0_0_10px_rgba(var(--accent-primary-rgb),0.3)]'
                        : 'bg-white/5 text-text-muted border-white/10 hover:border-white/20'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
                {step === 'FEEDBACK_OPTIONS' && selectedOptions.length > 0 && (
                  <button 
                    onClick={() => setStep('SUGGESTIONS')}
                    className="w-full mt-2 p-2 bg-accent-primary/20 text-accent-primary rounded-xl font-orbitron text-[9px] font-black uppercase tracking-widest border border-accent-primary/30 hover:bg-accent-primary/30 transition-all flex items-center justify-center gap-2"
                  >
                    Confirm Feedback <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </>
          )}

          {step !== 'INITIAL' && step !== 'FEEDBACK_OPTIONS' && (
            <>
              {renderMessage(`Feedback confirmed.${selectedOptions.length > 0 ? ' Highlights: ' + selectedOptions.slice(0, 2).join(', ') + (selectedOptions.length > 2 ? '...' : '') : ''}`, false)}
              {renderMessage("Any suggestions to improve this research?")}
              
              {/* Step 3: Suggestions */}
              {step === 'SUGGESTIONS' ? (
                <div className="relative mb-6">
                  <textarea
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder="Type your suggestions..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 font-mono text-[10px] text-text-primary focus:border-accent-primary/50 outline-none min-h-[80px] transition-all"
                  />
                  <button 
                    onClick={() => setStep('TOPIC_REQUEST')}
                    className="mt-2 w-full p-2 bg-accent-primary text-white rounded-xl font-orbitron text-[9px] font-black uppercase tracking-widest border border-white/10 hover:bg-accent-primary focus:outline-none transition-all flex items-center justify-center gap-2"
                  >
                    Next Question <ChevronRight size={14} />
                  </button>
                </div>
              ) : (
                renderMessage(suggestion || "No suggestions, looks good!", false)
              )}
            </>
          )}

          {step !== 'INITIAL' && step !== 'FEEDBACK_OPTIONS' && step !== 'SUGGESTIONS' && (
            <>
              {renderMessage("What cybersecurity topic should we research next?")}
              
              {/* Step 4: Topic Request */}
              {step === 'TOPIC_REQUEST' ? (
                <div className="relative mb-6">
                  <textarea
                    value={researchRequest}
                    onChange={(e) => setResearchRequest(e.target.value)}
                    placeholder="e.g. OAuth misconfiguration, JWT vulnerabilities..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 font-mono text-[10px] text-text-primary focus:border-accent-primary/50 outline-none min-h-[80px] transition-all"
                  />
                  <button 
                    onClick={handleSubmit}
                    className="mt-2 w-full p-3 bg-accent-primary text-white rounded-xl font-orbitron text-[10px] font-black uppercase tracking-widest border border-white/20 hover:shadow-[0_0_15px_rgba(var(--accent-primary-rgb),0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    Finish & Submit <Send size={14} />
                  </button>
                </div>
              ) : step === 'SUBMITTING' ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 size={24} className="animate-spin text-accent-primary" />
                </div>
              ) : step === 'SUCCESS' ? (
                <div className="space-y-4">
                  {renderMessage(researchRequest ? `Request sent: ${researchRequest}` : "No specific request.", false)}
                  {renderMessage("Thank you for your feedback! Your insights help improve the platform. 🚀")}
                  <div className="p-4 rounded-2xl bg-accent-primary/10 border border-accent-primary/30 flex flex-col items-center gap-2">
                    <CheckCircle2 size={32} className="text-accent-primary" />
                    <span className="font-mono text-[10px] text-accent-primary font-black uppercase">Submission Successful</span>
                  </div>
                </div>
              ) : step === 'ERROR' && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex flex-col items-center gap-2">
                  <AlertCircle size={32} className="text-red-500" />
                  <span className="font-mono text-[10px] text-red-500 font-black uppercase text-center">Uplink Failure<br/>Please try again later</span>
                  <button 
                    onClick={() => setStep('TOPIC_REQUEST')}
                    className="mt-2 text-[8px] font-mono uppercase underline text-red-400"
                  >
                    Back to edit
                  </button>
                </div>
              )}
            </>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
    </div>
  );
};

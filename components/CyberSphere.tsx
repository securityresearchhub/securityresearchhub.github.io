import React, { useState, useEffect, useRef } from 'react';

const PENTEST_SEQUENCE = [
  { command: 'nmap -sV -T4 internal.security-lab.local', type: 'cmd' },
  { output: '[*] Initiation Nmap intense scan...', type: 'out' },
  { output: '[+] Scanning 1000 ports on 192.168.1.50', type: 'out' },
  { output: '[!] VULNERABILITY_DETECTED: CVE-2024-LOW-EXP', type: 'out', color: 'text-red-400' },
  { output: '80/tcp open http Web-Server/1.2.4', type: 'out' },
  { command: 'exploit -t web_server_rce --lport 4444', type: 'cmd' },
  { output: '[*] Deploying payload chunk 1/3...', type: 'out' },
  { progress: true, label: 'PAYLOAD_INJECTION', type: 'prog' },
  { output: '[+] Remote Code Execution Successful!', type: 'out', color: 'text-green-400' },
  { command: 'meterpreter > getuid', type: 'cmd' },
  { output: 'Server username: NT AUTHORITY\\SYSTEM', type: 'out', color: 'text-accent-primary' },
  { command: 'meterpreter > hashdump', type: 'cmd' },
  { output: 'Admin:500:aad3b435b51404eeaad3b435b51404ee...', type: 'out', color: 'text-white/40' },
  { output: '[+] Data extraction complete. Session closed.', type: 'success' },
];

const TypewriterLine = ({ text, delay = 40, onComplete }: { text: string; delay?: number; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(onComplete || (() => {}), 100);
    }
  }, [index, text, delay, onComplete]);

  return <span>{displayedText}</span>;
};

const ProgressBar = ({ label, onComplete }: { label: string; onComplete?: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress < 100) {
      const timeout = setTimeout(() => {
        setProgress((prev) => prev + Math.floor(Math.random() * 20) + 5);
      }, 250);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(onComplete || (() => {}), 400);
    }
  }, [progress, onComplete]);

  return (
    <div className="my-1.5 font-mono text-[10px]">
      <div className="flex justify-between mb-1.5 opacity-60">
        <span className="tracking-widest">{label}</span>
        <span>{Math.min(progress, 100)}%</span>
      </div>
      <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent-primary transition-all duration-300 shadow-[0_0_12px_rgba(167,139,250,0.6)]" 
          style={{ width: `${Math.min(progress, 100)}%` }} 
        />
      </div>
    </div>
  );
};

export const CyberSphereAnimation = () => {
  const [lines, setLines] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [lines]);

  const handleNext = () => {
    if (currentIndex < PENTEST_SEQUENCE.length) {
      const item = PENTEST_SEQUENCE[currentIndex];
      setLines((prev) => [...prev, item]);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setTimeout(() => {
        setLines([]);
        setCurrentIndex(0);
      }, 5000);
    }
  };

  useEffect(() => {
    if (currentIndex === 0) handleNext();
  }, [currentIndex]);

  return (
    <div className="w-full h-full flex items-center justify-center p-2 lg:p-0">
      {/* Terminal Window - Enlarged for Hero Area */}
      <div className="w-full max-w-[650px] aspect-[16/11] bg-[#0a0214]/95 backdrop-blur-2xl rounded-2xl border border-accent-primary/40 overflow-hidden shadow-[0_0_80px_rgba(109,40,217,0.3)] flex flex-col group relative">
        
        {/* Glow behind terminal */}
        <div className="absolute -inset-2 bg-gradient-to-r from-accent-primary/20 via-purple-500/10 to-accent-primary/20 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-1000 pointer-events-none" />

        {/* Terminal Header */}
        <div className="px-5 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between relative z-10">
          <div className="flex gap-2.5">
            <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] shadow-[0_0_15px_rgba(255,95,86,0.3)]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] shadow-[0_0_15px_rgba(255,189,46,0.3)]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] shadow-[0_0_15px_rgba(39,201,63,0.3)]" />
          </div>
          <div className="text-[11px] font-mono font-black text-white/50 tracking-[0.4em] uppercase select-none">
            varma@security-lab
          </div>
          <div className="w-16 h-1.5 bg-white/5 rounded-full" />
        </div>

        {/* Terminal Content */}
        <div 
          ref={scrollRef}
          className="flex-1 p-8 font-mono text-[11px] md:text-xs overflow-y-auto custom-scrollbar relative z-10 bg-transparent"
        >
          {/* CRT/Scanline Overlays */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,4px_100%]" />
          
          <div className="space-y-2">
            {lines.map((line, idx) => (
              <div key={idx} className="leading-relaxed">
                {line.type === 'cmd' ? (
                  <div className="flex gap-3 text-accent-primary brightness-125 drop-shadow-[0_0_8px_rgba(167,139,250,0.4)]">
                    <span className="opacity-80">λ</span>
                    <TypewriterLine 
                      text={line.command} 
                      onComplete={idx === lines.length - 1 ? handleNext : undefined} 
                    />
                    {idx === lines.length - 1 && <span className="animate-blink font-black">▉</span>}
                  </div>
                ) : line.type === 'prog' ? (
                  <ProgressBar 
                    label={line.label} 
                    onComplete={idx === lines.length - 1 ? handleNext : undefined} 
                  />
                ) : (
                  <div className={`
                      ${line.color || 'text-white/80'} 
                      ${line.type === 'success' ? 'bg-green-500/10 text-green-400 px-4 py-3 border-l-4 border-green-500 rounded-r-lg mt-6 font-black shadow-[0_0_30px_rgba(34,197,94,0.15)] glow-success' : ''}
                      opacity-90 animate-fade-in flex items-start gap-3
                  `}>
                    {line.type === 'success' && <span className="text-green-500">▶</span>}
                    <span className="flex-1">{line.output}</span>
                    {idx === lines.length - 1 && line.type !== 'cmd' && line.type !== 'prog' && (
                      <span className="invisible w-0 h-0">{(() => { if(idx === lines.length - 1) setTimeout(handleNext, 800); return ''; })()}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Glitch Overlay (Active during success) */}
          {lines[lines.length - 1]?.type === 'success' && (
             <div className="absolute inset-0 bg-green-500/5 animate-glitch pointer-events-none z-50 mix-blend-overlay" />
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 0.8s step-end infinite;
          color: var(--accent-primary);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateX(-4px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes glitch {
          0% { transform: translate(0); filter: hue-rotate(0deg); }
          33% { transform: translate(-3px, 1px); }
          66% { transform: translate(3px, -1px); }
          100% { transform: translate(0); filter: hue-rotate(360deg); }
        }
        .animate-glitch {
          animation: glitch 0.2s steps(3) infinite;
        }
        .glow-success {
            box-shadow: inset 0 0 20px rgba(34, 197, 94, 0.1);
            text-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(167, 139, 250, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(167, 139, 250, 0.25);
        }
      `}} />
    </div>
  );
};


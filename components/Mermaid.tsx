import React, { useEffect, useRef, useState } from 'react';

interface MermaidProps {
  chart: string;
}

export const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initMermaid = async () => {
      try {
        const { default: mermaid } = await import('mermaid');
        
        if (!isMounted) return;

        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          fontFamily: 'Orbitron, sans-serif',
          themeVariables: {
            darkMode: true,
            primaryColor: '#00F5FF',
            primaryTextColor: '#F8FAFC',
            primaryBorderColor: '#00F5FF',
            lineColor: '#64748B',
            secondaryColor: '#1E293B',
            tertiaryColor: '#0F172A',
          }
        });

        if (ref.current && chart) {
          ref.current.removeAttribute('data-processed');
          ref.current.innerHTML = chart;
          await mermaid.run({
            nodes: [ref.current]
          });
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Mermaid initialization failed:', error);
      }
    };

    initMermaid();
    return () => { isMounted = false; };
  }, [chart]);

  return (
    <div 
      className={`mermaid flex justify-center my-8 md:my-12 overflow-x-auto p-4 bg-white/5 rounded-2xl border border-border-color shadow-2xl transition-all hover:border-accent-primary/40 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
      ref={ref}
    >
      {chart}
    </div>
  );
};

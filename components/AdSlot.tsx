import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

export const AdSlot: React.FC = () => {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;

    // Small delay to let layout settle, then push AdSense init
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          // Track the ad view event in GA4
          if ((window as any).gtag) {
            (window as any).gtag('event', 'ad_view', {
              event_category: 'monetization',
              event_label: window.location.pathname
            });
          }
        }
      } catch (e) {
        console.log('AdSense error:', e);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="ad-slot w-full my-8 overflow-hidden relative" aria-label="Advertisement">
      <div className="ad-label text-center mb-1.5">
        <span className="font-mono text-[8px] text-text-muted/20 uppercase tracking-widest">Advertisement</span>
      </div>
      <div className="w-full">
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-7367345153052165"
          data-ad-slot="8621352008"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

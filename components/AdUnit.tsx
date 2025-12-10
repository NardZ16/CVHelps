import React, { useEffect } from 'react';

export const AdUnit: React.FC = () => {
  useEffect(() => {
    try {
      // Push the ad to Google's queue
      // Using 'any' to bypass TS check for window.adsbygoogle
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense failed to load:", e);
    }
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto my-2 animate-fade-in">
      <div className="text-center text-[9px] text-slate-700 uppercase tracking-widest mb-1 font-bold opacity-40">
        Sponsored
      </div>
      <div className="glass-panel p-0.5 rounded-lg border border-white/5 bg-slate-900/40 overflow-hidden flex justify-center items-center min-h-[60px]">
        {/* Replace data-ad-client and data-ad-slot with your actual AdSense values */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-4319080566007267"
          data-ad-slot="4247752217"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        
        {/* Placeholder text for development (AdSense removes this when ad loads) */}
        <span className="text-slate-700 text-xs py-1 hidden">
          Advertisement Space
        </span>
      </div>
    </div>
  );
};
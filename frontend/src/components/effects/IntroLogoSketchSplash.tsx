import React, { useState } from 'react';
import { LogoSketchAnimation } from './LogoSketchAnimation';
import { ArrowLeft, ArrowRight, Zap, Sparkles, RotateCcw, ShieldCheck, Wrench, PhoneCall } from 'lucide-react';

interface IntroLogoSketchSplashProps {
  onComplete: () => void;
  onBack?: () => void;
  onNavigate?: (path: string) => void;
}

export const IntroLogoSketchSplash: React.FC<IntroLogoSketchSplashProps> = ({
  onComplete,
  onBack,
  onNavigate
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const handleFinish = (targetPath?: string) => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
      if (targetPath && onNavigate) {
        onNavigate(targetPath);
      }
    }, 550);
  };

  const handleBackAction = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      handleFinish();
    }
  };

  const handleReplay = () => {
    setReplayKey((prev) => prev + 1);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col justify-between items-center bg-[#051736] text-slate-100 overflow-y-auto overflow-x-hidden px-3 sm:px-6 py-3 sm:py-5 transition-all duration-700 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{ minHeight: '100dvh' }}
    >
      {/* Dynamic Ambient Electric & Blueprint Background Grid */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 35%, rgba(56, 189, 248, 0.28) 0%, transparent 70%),
            linear-gradient(to right, rgba(56, 189, 248, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 28px 28px, 28px 28px'
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[620px] h-[320px] sm:h-[480px] bg-sky-500/15 blur-[130px] rounded-full pointer-events-none" />

      {/* TOP INTRO NAVIGATION BAR ("add nave and add back button also") */}
      <header className="w-full max-w-6xl mx-auto flex flex-col gap-2 relative z-20 pb-2.5 border-b border-sky-400/20">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBackAction}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#08234d]/90 hover:bg-[#0c3166] border border-sky-400/35 text-xs sm:text-sm font-bold text-sky-200 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
            title="Go Back or Previous URL"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-4 h-4 text-sky-300" />
            <span>Back</span>
          </button>

          {/* Brand Emblem & Name in Nav */}
          <div className="flex items-center gap-2 sm:gap-2.5 text-center truncate">
            <div className="p-1 sm:p-1.5 rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-300 shrink-0">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="flex flex-col text-left truncate">
              <span className="text-xs sm:text-sm font-extrabold tracking-wider text-white leading-tight truncate">
                OMKAR NAGU
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest text-sky-300 font-semibold uppercase truncate">
                ELECTRICAL WORKS
              </span>
            </div>
          </div>

          {/* Nav Quick Actions on Right: Enter Website */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleFinish()}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-sky-400 via-sky-300 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 text-xs sm:text-sm font-bold shadow-md shadow-sky-400/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              title="Enter Website directly"
            >
              <span>Enter Website</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Nav Links Row for Any Device (Mobile, Tablet, Desktop) */}
        <nav className="flex items-center justify-center gap-1.5 sm:gap-3 overflow-x-auto py-1 text-[11px] sm:text-xs font-semibold text-sky-200/90 no-scrollbar">
          <button
            type="button"
            onClick={() => handleFinish('/')}
            className="px-2.5 py-1 rounded-lg hover:bg-sky-500/15 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            Home
          </button>
          <span className="text-sky-500/30">•</span>
          <button
            type="button"
            onClick={() => handleFinish('/services?cat=Wiring')}
            className="px-2.5 py-1 rounded-lg hover:bg-sky-500/15 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            Wiring
          </button>
          <span className="text-sky-500/30">•</span>
          <button
            type="button"
            onClick={() => handleFinish('/services?cat=Ceiling%20%26%20Lighting')}
            className="px-2.5 py-1 rounded-lg hover:bg-sky-500/15 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            Lighting
          </button>
          <span className="text-sky-500/30">•</span>
          <button
            type="button"
            onClick={() => handleFinish('/services?cat=Panel%20Board')}
            className="px-2.5 py-1 rounded-lg hover:bg-sky-500/15 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            Panel Boards
          </button>
          <span className="text-sky-500/30">•</span>
          <button
            type="button"
            onClick={() => handleFinish('/services')}
            className="px-2.5 py-1 rounded-lg bg-sky-500/15 border border-sky-400/30 text-sky-200 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            Table Catalog
          </button>
          <span className="text-sky-500/30">•</span>
          <button
            type="button"
            onClick={() => handleFinish('/contact')}
            className="px-2.5 py-1 rounded-lg hover:bg-sky-500/15 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            Contact
          </button>
        </nav>
      </header>

      {/* CENTER: THE 9-SECOND LOGO OUTLINE SKETCH ANIMATION */}
      <main className="w-full flex-1 flex flex-col items-center justify-center relative z-20 my-auto py-2 sm:py-4">
        <div className="text-center mb-2 sm:mb-4 px-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-[11px] sm:text-xs font-semibold text-sky-200 mb-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>9-Second Architectural Logo Outline Trace</span>
          </div>
          <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
            Drafting Omkar Nagu Electrical Works Emblem
          </h1>
          <p className="text-[11px] sm:text-xs text-sky-200/75 max-w-md mx-auto mt-1">
            Live vector outline sketch sequence (8 to 10 seconds). Automatically opening website upon completion.
          </p>
        </div>

        {/* Responsive Animation Canvas for all device sizes (Phones 320px+ to 4K Desktop) */}
        <div className="w-full max-w-[270px] xs:max-w-[310px] sm:max-w-[370px] md:max-w-[420px] flex justify-center">
          <LogoSketchAnimation
            key={replayKey}
            durationSeconds={9.0}
            autoPlay={true}
            onComplete={() => {
              // Smooth auto-transition into website after 9 seconds!
              setTimeout(() => {
                handleFinish();
              }, 1100);
            }}
          />
        </div>
      </main>

      {/* BOTTOM CONTROLS & HINT BAR */}
      <footer className="w-full max-w-2xl mx-auto flex flex-col items-center gap-2.5 relative z-20 pt-2.5 border-t border-sky-400/20 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleReplay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#08234d] hover:bg-[#0c3166] border border-sky-400/30 text-xs font-semibold text-sky-200 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
            <span>Replay 9s Sketch</span>
          </button>

          <button
            type="button"
            onClick={() => handleFinish()}
            className="text-xs font-semibold text-sky-300 hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
          >
            Skip directly to homepage
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 text-[10px] sm:text-[11px] text-sky-300/70">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-sky-400" />
            Govt. Licensed Contractors
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Wrench className="w-3 h-3 text-amber-400" />
            Wiring • Lighting • Panel Boards
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <PhoneCall className="w-3 h-3 text-emerald-400" />
            24/7 Support
          </span>
        </div>
      </footer>
    </div>
  );
};

import React from 'react';
import { LogoSketchAnimation } from './LogoSketchAnimation';
import { X, Sparkles, Zap, RotateCcw } from 'lucide-react';

interface LogoSketchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoSketchModal: React.FC<LogoSketchModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#04122b]/85 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#08234d] border border-sky-400/40 rounded-3xl shadow-2xl shadow-[#04122b]/95 p-6 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-400/20 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Logo 9-Second Sketch Animation</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/30">
                  8-10s Live Trace
                </span>
              </h3>
              <p className="text-xs text-sky-200/70">
                Architectural outline drafting of the official Omkar Nagu emblem
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-sky-300 hover:text-white hover:bg-sky-500/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The 9-Second Logo Sketch Engine */}
        <div className="flex flex-col items-center">
          <LogoSketchAnimation
            durationSeconds={9.0}
            autoPlay={true}
            onComplete={() => {
              // Completed
            }}
          />
        </div>

        {/* Bottom Action Footer */}
        <div className="mt-6 pt-4 border-t border-sky-400/20 flex items-center justify-between gap-3 text-xs">
          <span className="text-sky-200/70 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Full 9-second vector line drafting sequence
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 shadow-md shadow-sky-500/25 hover:shadow-sky-400/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Close / Explore Site
          </button>
        </div>
      </div>
    </div>
  );
};

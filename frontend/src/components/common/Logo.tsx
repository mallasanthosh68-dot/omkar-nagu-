import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark' | 'admin';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  linkTo?: string;
  className?: string;
  enableSketchEffect?: boolean;
  onOpenSketch?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showTagline = true,
  linkTo = '/',
  className = '',
  enableSketchEffect = true,
  onOpenSketch
}) => {
  const sizeMap = {
    sm: { img: 'w-8 h-8', title: 'text-sm font-bold', sub: 'text-[9px]' },
    md: { img: 'w-10 h-10', title: 'text-base font-bold', sub: 'text-[10px]' },
    lg: { img: 'w-14 h-14', title: 'text-xl font-extrabold', sub: 'text-xs' },
    xl: { img: 'w-20 h-20', title: 'text-2xl font-black', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div
      className={`flex items-center gap-3 select-none ${className}`}
      onClick={(e) => {
        if (onOpenSketch) {
          e.preventDefault();
          onOpenSketch();
        }
      }}
    >
      {/* Emblem Badge with Thunderbolt in Hand & 8-10s Outline Sketching Overlay */}
      <div className="relative group cursor-pointer" title="Click to view 9s Logo Outline Sketch Animation">
        {/* Ambient Neon Aura */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#5B86B6] via-[#38BDF8] to-[#FACC15] rounded-full blur-xs opacity-60 group-hover:opacity-100 transition duration-500" />

        {/* Outline Sketching Animation Ring (Runs on 9s cycle: 8 to 10 seconds) */}
        {enableSketchEffect && (
          <div className="absolute -inset-1.5 pointer-events-none rounded-full overflow-visible z-20">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              {/* 9-Second Sketching Circuit / Boundary Path */}
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="animate-sketch-9s"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#FACC15"
                strokeWidth="1"
                strokeDasharray="12 8"
                opacity="0.8"
                className="animate-sketch-9s"
              />
            </svg>
            {/* 9s Traveling Laser Stylus Spark */}
            <div className="absolute inset-0 animate-sketch-laser-9s">
              <div className="w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_#FACC15] -top-1 left-1/2 -translate-x-1/2" />
            </div>
          </div>
        )}

        <div className={`relative ${currentSize.img} rounded-full overflow-hidden border-2 border-[#5B86B6]/60 bg-slate-900 shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
          <img
            src="/images/logo.jpg"
            alt="Omkar Nagu Electrical Works Logo"
            className="w-full h-full object-cover transform scale-110"
            onError={(e) => {
              // Fallback to stylized SVG if image not rendered
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          {/* Fallback stylized SVG thunderbolt held by hand */}
          <svg className="w-5 h-5 text-amber-400 absolute hidden" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 leading-tight">
          <span className={`tracking-wider ${variant === 'admin' ? 'text-white' : 'text-slate-100'} ${currentSize.title}`}>
            OMKAR NAGU
          </span>
        </div>
        <span className={`tracking-widest font-semibold uppercase text-[#5B86B6] ${currentSize.sub}`}>
          ELECTRICAL WORKS
        </span>
        {showTagline && size !== 'sm' && (
          <span className="text-[10px] text-slate-400 tracking-normal font-normal mt-0.5">
            Reliable Electrical Solutions for Every Space
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo && !onOpenSketch) {
    return (
      <Link to={linkTo} className="inline-flex transition-transform hover:scale-[1.01]">
        {content}
      </Link>
    );
  }

  return content;
};

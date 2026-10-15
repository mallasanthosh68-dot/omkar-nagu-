import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RotateCcw, Play, Pause, Zap, Check, Eye } from 'lucide-react';

interface LogoSketchAnimationProps {
  onComplete?: () => void;
  autoPlay?: boolean;
  durationSeconds?: number; // Default 9 seconds (between 8 and 10s)
  mode?: 'blueprint' | 'neon';
  compact?: boolean;
  className?: string;
}

export const LogoSketchAnimation: React.FC<LogoSketchAnimationProps> = ({
  onComplete,
  autoPlay = true,
  durationSeconds = 9.0, // Exactly 9 seconds!
  mode: initialMode = 'neon',
  compact = false,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [mode, setMode] = useState<'blueprint' | 'neon'>(initialMode);
  const [isCompleted, setIsCompleted] = useState(false);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedProgressRef = useRef<number>(0);

  const totalDurationMs = durationSeconds * 1000;

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp - pausedProgressRef.current * totalDurationMs;
      }

      const elapsed = timestamp - startTimeRef.current;
      const currentProgress = Math.min(elapsed / totalDurationMs, 1);
      setProgress(currentProgress);

      if (currentProgress >= 1) {
        setIsCompleted(true);
        setIsPlaying(false);
        if (onComplete) onComplete();
      } else {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, totalDurationMs, onComplete]);

  const handleRestart = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    startTimeRef.current = null;
    pausedProgressRef.current = 0;
    setProgress(0);
    setIsCompleted(false);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (isCompleted) {
      handleRestart();
      return;
    }
    if (isPlaying) {
      pausedProgressRef.current = progress;
      setIsPlaying(false);
    } else {
      startTimeRef.current = null;
      setIsPlaying(true);
    }
  };

  // Current stage status text based on elapsed time (0s to 9s)
  const currentSeconds = (progress * durationSeconds).toFixed(1);
  const getStageStatus = () => {
    const s = progress * durationSeconds;
    if (s < 2.2) return { text: 'Phase 1: Sketching Gear Teeth & Circular Crest...', icon: '📐' };
    if (s < 4.2) return { text: 'Phase 2: Drafting Shield Contour & Circuit Tracks...', icon: '⚡' };
    if (s < 6.2) return { text: 'Phase 3: Tracing Hand & Fist of Electrical Mastery...', icon: '✊' };
    if (s < 7.8) return { text: 'Phase 4: Drawing High-Voltage Lightning Bolt & Sparks...', icon: '⚡' };
    if (s < 8.8) return { text: "Phase 5: Outlining 'OMKAR NAGU' Brand Typography...", icon: '✨' };
    return { text: 'Phase 6: Full Color Emblem Activated!', icon: '🌟' };
  };

  const stage = getStageStatus();

  // Calculate stroke dash offsets for each layer
  // Total progress is mapped:
  // Phase 1 (Gears): 0.0 - 0.25
  // Phase 2 (Shield & Circuits): 0.20 - 0.50
  // Phase 3 (Hand/Fist): 0.45 - 0.70
  // Phase 4 (Lightning): 0.65 - 0.85
  // Phase 5 (Banner & Letters): 0.80 - 0.95
  // Full color fade-in: 0.88 - 1.0
  const getPhaseProgress = (start: number, end: number) => {
    if (progress < start) return 0;
    if (progress > end) return 1;
    return (progress - start) / (end - start);
  };

  const pGears = getPhaseProgress(0.0, 0.28);
  const pShield = getPhaseProgress(0.22, 0.50);
  const pHand = getPhaseProgress(0.44, 0.70);
  const pBolt = getPhaseProgress(0.65, 0.85);
  const pText = getPhaseProgress(0.78, 0.94);
  const pColor = getPhaseProgress(0.86, 1.0);

  // Stylus coordinates calculation for active laser spark
  const getStylusPos = () => {
    if (progress < 0.28) {
      const angle = pGears * Math.PI * 2 - Math.PI / 2;
      return { x: 250 + 190 * Math.cos(angle), y: 250 + 190 * Math.sin(angle) };
    } else if (progress < 0.50) {
      return { x: 250 + 120 * (1 - pShield * 2), y: 150 + pShield * 180 };
    } else if (progress < 0.70) {
      return { x: 230 + pHand * 40, y: 280 - pHand * 70 };
    } else if (progress < 0.85) {
      return { x: 130 + pBolt * 240, y: 370 - pBolt * 260 };
    } else {
      return { x: 140 + pText * 220, y: 395 };
    }
  };

  const stylus = getStylusPos();

  const strokeColor = mode === 'neon' ? '#38BDF8' : '#7DD3FC';
  const accentStroke = mode === 'neon' ? '#FACC15' : '#E0F2FE';

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Sketch Canvas Container */}
      <div className="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden border border-sky-400/30 bg-[#051736] shadow-2xl shadow-sky-950/80 p-4">
        {/* Architectural / Blueprint Grid Background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.15) 0%, transparent 70%),
              linear-gradient(to right, rgba(56, 189, 248, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(56, 189, 248, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 25px 25px, 25px 25px'
          }}
        />

        {/* Ambient Radial Glow */}
        <div
          className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
          style={{
            background:
              pColor > 0
                ? `radial-gradient(circle at 50% 48%, rgba(250, 204, 21, ${pColor * 0.35}) 0%, rgba(56, 189, 248, ${pColor * 0.25}) 40%, transparent 70%)`
                : 'transparent'
          }}
        />

        {/* Real Logo Image — Fades in at 8.6s to 9.0s when sketch completes */}
        <div
          className="absolute inset-6 rounded-full overflow-hidden transition-all duration-700 pointer-events-none flex items-center justify-center z-10"
          style={{
            opacity: pColor,
            transform: `scale(${0.92 + pColor * 0.08})`,
            filter: pColor >= 1 ? 'drop-shadow(0 0 25px rgba(250, 204, 21, 0.45))' : 'none'
          }}
        >
          <img
            src="/images/logo.jpg"
            alt="Omkar Nagu Electrical Works Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* SVG OUTLINE SKETCH ENGINE (Drawn line-by-line across 0s - 9s) */}
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full relative z-20 overflow-visible"
          style={{ filter: mode === 'neon' ? 'drop-shadow(0 0 4px rgba(56, 189, 248, 0.6))' : 'none' }}
        >
          <defs>
            <linearGradient id="sketchNeonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#FACC15" />
            </linearGradient>

            <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="60%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ============================================================== */}
          {/* PHASE 1: OUTER GEAR TEETH & CONCENTRIC CREST RINGS (0.0s - 2.5s) */}
          {/* ============================================================== */}
          <g opacity={1 - pColor * 0.75}>
            {/* Outer Boundary Circle */}
            <circle
              cx="250"
              cy="250"
              r="220"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeDasharray="1382"
              strokeDashoffset={1382 * (1 - pGears)}
              strokeLinecap="round"
            />

            {/* Inner Concentric Ring */}
            <circle
              cx="250"
              cy="250"
              r="200"
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.8"
              strokeDasharray="1256"
              strokeDashoffset={1256 * (1 - pGears)}
              strokeOpacity="0.8"
            />

            {/* Gear Teeth Cog Notches around perimeter */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x1 = 250 + 200 * Math.cos(rad);
              const y1 = 250 + 200 * Math.sin(rad);
              const x2 = 250 + 225 * Math.cos(rad);
              const y2 = 250 + 225 * Math.sin(rad);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={accentStroke}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="25"
                  strokeDashoffset={25 * (1 - pGears)}
                  opacity={pGears > (i / 12) * 0.8 ? 1 : 0}
                />
              );
            })}
          </g>

          {/* ============================================================== */}
          {/* PHASE 2: HERALDIC SHIELD & CIRCUIT BOARD TRACKS (2.0s - 4.5s)  */}
          {/* ============================================================== */}
          <g opacity={1 - pColor * 0.75}>
            {/* Main Center Heraldic Shield Contour */}
            <path
              d="M 140 130 Q 250 110 360 130 L 360 250 Q 360 350 250 400 Q 140 350 140 250 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth="3"
              strokeDasharray="1000"
              strokeDashoffset={1000 * (1 - pShield)}
              strokeLinejoin="round"
            />

            {/* Inner Shield Inset */}
            <path
              d="M 155 145 Q 250 128 345 145 L 345 245 Q 345 335 250 382 Q 155 335 155 245 Z"
              fill="none"
              stroke={accentStroke}
              strokeWidth="1.5"
              strokeDasharray="900"
              strokeDashoffset={900 * (1 - pShield)}
              opacity="0.8"
            />

            {/* Left PCB Circuit Board Tracks with Terminal Pads */}
            <path
              d="M 175 180 H 215 V 230 H 185"
              fill="none"
              stroke="#7DD3FC"
              strokeWidth="1.8"
              strokeDasharray="120"
              strokeDashoffset={120 * (1 - pShield)}
            />
            <circle cx="175" cy="180" r="4" fill={pShield > 0.5 ? '#38BDF8' : 'none'} />
            <circle cx="185" cy="230" r="4" fill={pShield > 0.7 ? '#38BDF8' : 'none'} />

            {/* Right PCB Circuit Board Tracks with Terminal Pads */}
            <path
              d="M 325 180 H 285 V 230 H 315"
              fill="none"
              stroke="#7DD3FC"
              strokeWidth="1.8"
              strokeDasharray="120"
              strokeDashoffset={120 * (1 - pShield)}
            />
            <circle cx="325" cy="180" r="4" fill={pShield > 0.5 ? '#38BDF8' : 'none'} />
            <circle cx="315" cy="230" r="4" fill={pShield > 0.7 ? '#38BDF8' : 'none'} />
          </g>

          {/* ============================================================== */}
          {/* PHASE 3: CLENCHED FIST & POWER HAND CONTOURS (4.0s - 6.5s)     */}
          {/* ============================================================== */}
          <g opacity={1 - pColor * 0.75}>
            {/* Wrist & Forearm */}
            <path
              d="M 225 380 L 225 320 M 275 380 L 275 320"
              fill="none"
              stroke={accentStroke}
              strokeWidth="3"
              strokeDasharray="120"
              strokeDashoffset={120 * (1 - pHand)}
              strokeLinecap="round"
            />

            {/* Clenched Fist Knuckles & Fingers Gripping the Bolt */}
            <path
              d="M 210 270 Q 210 240 230 235 Q 240 220 255 225 Q 270 220 280 235 Q 295 240 295 270 Q 295 300 275 315 L 225 315 Q 210 300 210 270 Z"
              fill="none"
              stroke={accentStroke}
              strokeWidth="3.5"
              strokeDasharray="300"
              strokeDashoffset={300 * (1 - pHand)}
              strokeLinejoin="round"
            />

            {/* Knuckle definition ridges */}
            <path
              d="M 235 235 L 235 265 M 255 225 L 255 265 M 275 235 L 275 265"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray="60"
              strokeDashoffset={60 * (1 - pHand)}
            />

            {/* Thumb wrapped tightly */}
            <path
              d="M 220 280 Q 240 290 260 280"
              fill="none"
              stroke={accentStroke}
              strokeWidth="2.5"
              strokeDasharray="50"
              strokeDashoffset={50 * (1 - pHand)}
            />
          </g>

          {/* ============================================================== */}
          {/* PHASE 4: HIGH-VOLTAGE DIAGONAL LIGHTNING BOLT (6.0s - 8.0s)    */}
          {/* ============================================================== */}
          <g opacity={1 - pColor * 0.75} filter="url(#laserGlow)">
            {/* The Main High-Voltage Thunderbolt passing through the fist */}
            <path
              d="M 395 85 L 275 225 L 325 230 L 165 375 L 220 285 L 175 280 Z"
              fill={pBolt > 0.8 ? 'rgba(250, 204, 21, 0.25)' : 'none'}
              stroke="url(#boltGrad)"
              strokeWidth="4.5"
              strokeDasharray="950"
              strokeDashoffset={950 * (1 - pBolt)}
              strokeLinejoin="miter"
              strokeMiterlimit="5"
            />

            {/* Inner Core Energy Beam */}
            <path
              d="M 390 92 L 277 223 L 320 228 L 172 368 L 217 287 L 180 282 Z"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="900"
              strokeDashoffset={900 * (1 - pBolt)}
              opacity={pBolt > 0.4 ? 0.9 : 0}
            />

            {/* Crackling High-Frequency Spark Arcs */}
            {pBolt > 0.5 && (
              <>
                <path
                  d="M 360 120 L 375 110 L 365 140"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2"
                />
                <path
                  d="M 320 180 L 335 170 L 325 195"
                  fill="none"
                  stroke="#FACC15"
                  strokeWidth="2"
                />
                <path
                  d="M 200 320 L 185 335 L 205 340"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2"
                />
                <path
                  d="M 150 360 L 135 370 L 155 385"
                  fill="none"
                  stroke="#FACC15"
                  strokeWidth="2"
                />
              </>
            )}
          </g>

          {/* ============================================================== */}
          {/* PHASE 5: BRAND TYPOGRAPHY BANNER & LETTERING (7.5s - 9.0s)     */}
          {/* ============================================================== */}
          <g opacity={1 - pColor * 0.75}>
            {/* Banner Ribbon Contour */}
            <path
              d="M 80 395 Q 250 380 420 395 L 410 445 Q 250 435 90 445 Z"
              fill="none"
              stroke={accentStroke}
              strokeWidth="3"
              strokeDasharray="800"
              strokeDashoffset={800 * (1 - pText)}
            />

            {/* Lower Ribbon Tag Contour */}
            <path
              d="M 120 445 Q 250 438 380 445 L 360 470 Q 250 460 140 470 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray="600"
              strokeDashoffset={600 * (1 - pText)}
            />

            {/* Text outlines: "OMKAR NAGU" */}
            <text
              x="250"
              y="426"
              textAnchor="middle"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.6"
              fontFamily="'Outfit', sans-serif"
              fontWeight="900"
              fontSize="30"
              letterSpacing="3"
              strokeDasharray="400"
              strokeDashoffset={400 * (1 - pText)}
            >
              OMKAR NAGU
            </text>

            {/* Text outlines: "ELECTRICAL WORKS" */}
            <text
              x="250"
              y="460"
              textAnchor="middle"
              fill="none"
              stroke="#FACC15"
              strokeWidth="1.2"
              fontFamily="'Outfit', sans-serif"
              fontWeight="800"
              fontSize="14"
              letterSpacing="4"
              strokeDasharray="300"
              strokeDashoffset={300 * (1 - pText)}
            >
              ELECTRICAL WORKS
            </text>
          </g>

          {/* ============================================================== */}
          {/* ACTIVE LASER DRAWING STYLUS / SPARK CURSOR (Visible while sketching) */}
          {/* ============================================================== */}
          {isPlaying && progress < 0.95 && (
            <g transform={`translate(${stylus.x}, ${stylus.y})`} filter="url(#laserGlow)">
              {/* Outer Energy Pulse Ring */}
              <circle r="12" fill="none" stroke="#FACC15" strokeWidth="1.5" opacity="0.8">
                <animate attributeName="r" values="8;16;8" dur="0.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="0.8s" repeatCount="indefinite" />
              </circle>
              {/* Center Bright Spark Core */}
              <circle r="4" fill="#FFFFFF" />
              <circle r="7" fill="none" stroke="#38BDF8" strokeWidth="2" />
              {/* Electric Crosshair Stylus Sparks */}
              <line x1="-10" y1="0" x2="10" y2="0" stroke="#FFFFFF" strokeWidth="1.5" />
              <line x1="0" y1="-10" x2="0" y2="10" stroke="#FFFFFF" strokeWidth="1.5" />
            </g>
          )}

          {/* Final Celebration Burst Particles at 9.0s */}
          {pColor >= 0.9 && (
            <g opacity={Math.min((pColor - 0.9) * 10, 1)}>
              <circle cx="250" cy="250" r="235" fill="none" stroke="#FACC15" strokeWidth="2" opacity="0.6" />
            </g>
          )}
        </svg>

        {/* Live Second Badge overlay in corner */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/90 border border-sky-400/40 text-[10px] font-mono font-bold text-sky-200 z-30 flex items-center gap-1.5 shadow-md">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{currentSeconds}s / {durationSeconds}s</span>
        </div>
      </div>

      {/* Control Bar & Stage Details */}
      {!compact && (
        <div className="w-full max-w-[420px] mt-4 space-y-3">
          {/* Smooth Progress Bar with Time Track */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-sky-200 flex items-center gap-1.5">
                <span>{stage.icon}</span>
                <span>{stage.text}</span>
              </span>
              <span className="font-mono font-bold text-amber-300">
                {Math.round(progress * 100)}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#061e47] border border-sky-400/25 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-amber-300 transition-all duration-100 shadow-sm"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>

          {/* Interactive Controls: Replay, Pause/Play, Mode */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 transition-all active:scale-95"
                title="Replay 9s Sketch Animation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay (9s)</span>
              </button>

              <button
                type="button"
                onClick={handleTogglePlay}
                className="p-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 transition-all active:scale-95"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Mode Switch: Neon Electric vs Blueprint */}
            <div className="flex items-center gap-1 bg-[#061e47] p-1 rounded-xl border border-sky-400/25">
              <button
                type="button"
                onClick={() => setMode('neon')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                  mode === 'neon'
                    ? 'bg-sky-400 text-slate-950 shadow-xs'
                    : 'text-sky-300/70 hover:text-white'
                }`}
              >
                ⚡ Neon
              </button>
              <button
                type="button"
                onClick={() => setMode('blueprint')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                  mode === 'blueprint'
                    ? 'bg-sky-400 text-slate-950 shadow-xs'
                    : 'text-sky-300/70 hover:text-white'
                }`}
              >
                📐 Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

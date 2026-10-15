import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * ScrollProgress3D Component
 * Pinned 3D Electric Scroll Progress Beam that tracks scroll depth with:
 * 1. Radiant Ice Blue laser gradient
 * 2. Leading electric plasma spark node
 * 3. 3D perspective depth glow
 */
export const ScrollProgress3D: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[9990] pointer-events-none overflow-visible">
      {/* 3D Depth back-glow */}
      <motion.div
        style={{ scaleX, transformOrigin: '0%' }}
        className="absolute inset-0 bg-sky-400/30 blur-[4px] h-[6px] -top-[1.5px]"
      />

      {/* Main Laser Beam */}
      <motion.div
        style={{ scaleX, transformOrigin: '0%' }}
        className="h-full w-full bg-gradient-to-r from-blue-600 via-sky-400 to-sky-100 shadow-[0_0_12px_#38bdf8] relative"
      >
        {/* Leading Spark Pulse Bead */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_#38bdf8,0_0_20px_#bae6fd] -mr-1 animate-pulse" />
      </motion.div>
    </div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition Component
 * Wraps route views in a smooth 3D perspective transition
 * that responds dynamically during page navigation / shifting.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{
          opacity: 0,
          scale: 0.985,
          rotateY: -2.5,
          filter: 'blur(4px)',
        }}
        animate={{
          opacity: 1,
          scale: 1,
          rotateY: 0,
          filter: 'blur(0px)',
          transition: {
            duration: 0.35,
            ease: [0.16, 1, 0.3, 1],
          },
        }}
        exit={{
          opacity: 0,
          scale: 0.985,
          rotateY: 2.5,
          filter: 'blur(4px)',
          transition: {
            duration: 0.22,
            ease: [0.16, 1, 0.3, 1],
          },
        }}
        style={{
          perspective: 1200,
          transformStyle: 'preserve-3d',
          width: '100%',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

import React, { useState, useRef, useCallback } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  onClick?: () => void;
}

/**
 * TiltCard Component
 * Wraps elements in a responsive 3D perspective container that tilts
 * with pointer/touch movement and renders dynamic specular light reflection.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 8,
  glare = true,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glareStyle, setGlareStyle] = useState({ opacity: 0, x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    );

    if (glare) {
      setGlareStyle({
        opacity: 0.18,
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
      });
    }
  }, [maxTilt, glare]);

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle(prev => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{
        transform,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}

      {/* Holographic Specular Glare Layer */}
      {glare && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300 overflow-hidden"
          style={{
            opacity: glareStyle.opacity,
            background: `radial-gradient(circle at ${glareStyle.x}% ${glareStyle.y}%, rgba(186, 230, 253, 0.45) 0%, rgba(56, 189, 248, 0.1) 45%, transparent 70%)`,
          }}
        />
      )}
    </div>
  );
};

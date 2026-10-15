import React, { useEffect, useRef } from 'react';

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

interface TouchRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

/**
 * TouchSparkEffect Component
 * Generates an electric micro-spark & neon ripple reaction for every touch / click
 * across the entire website. Uses a zero-cost idle canvas loop.
 */
export const TouchSparkEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: SparkParticle[] = [];
    const ripples: TouchRipple[] = [];
    let isLoopRunning = false;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#38bdf8', '#7dd3fc', '#bae6fd', '#ffffff', '#60a5fa'];

    const spawnSparks = (x: number, y: number) => {
      // 1. Concentric electric ripple ring
      ripples.push({
        x,
        y,
        radius: 4,
        maxRadius: 36,
        alpha: 0.95,
      });

      // 2. High-speed radiant spark ions (8 to 14 sparks)
      const count = Math.floor(Math.random() * 5) + 9;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 4.5 + 2.0;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.2 + 1.2,
          alpha: 1.0,
          decay: Math.random() * 0.035 + 0.025,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      if (!isLoopRunning) {
        isLoopRunning = true;
        requestAnimationFrame(renderLoop);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Ignore if out of window
      if (e.clientX < 0 || e.clientX > width || e.clientY < 0 || e.clientY > height) return;
      spawnSparks(e.clientX, e.clientY);
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    const renderLoop = () => {
      ctx.clearRect(0, 0, width, height);

      // Render ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += (r.maxRadius - r.radius) * 0.18 + 0.5;
        r.alpha -= 0.045;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${r.alpha})`;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
      }

      // Render spark particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94; // friction
        p.vy *= 0.94;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      // If still active items, keep running; otherwise stop to save 100% idle CPU
      if (particles.length > 0 || ripples.length > 0) {
        requestAnimationFrame(renderLoop);
      } else {
        isLoopRunning = false;
        ctx.clearRect(0, 0, width, height);
      }
    };

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[9999]"
      aria-hidden="true"
    />
  );
};

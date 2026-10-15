import React, { useEffect, useRef } from 'react';

/**
 * ElectricBackground Component
 * Renders an animated high-performance background with:
 * 1. Interactive cursor/touch plasma lighting glow (follows pointer/finger)
 * 2. Subtle, elegant electric lightning branch discharges at random intervals
 * 3. 3D drifting ion spark embers across the Cobalt Blue depths
 */
export const ElectricBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Pointer state with smooth interpolation
    const pointer = {
      x: width / 2,
      y: height / 3,
      targetX: width / 2,
      targetY: height / 3,
      isMoving: false,
      lastMoveTime: Date.now()
    };

    // Ambient floating electric ion particles
    const particleCount = Math.min(width < 768 ? 25 : 55, 60);
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      size: number;
      baseAlpha: number;
      alpha: number;
      pulseSpeed: number;
      hue: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.2,
        size: Math.random() * 2.2 + 0.8,
        baseAlpha: Math.random() * 0.45 + 0.2,
        alpha: Math.random() * 0.45 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        hue: Math.random() > 0.4 ? 198 : 210 // Ice Blue vs Cobalt
      });
    }

    // Lightning discharge state
    interface LightningBranch {
      points: Array<{ x: number; y: number }>;
      alpha: number;
      width: number;
    }
    let activeLightnings: LightningBranch[] = [];
    let nextLightningTime = Date.now() + 3500 + Math.random() * 4000;

    const createLightningBranch = () => {
      // Pick random origin point (top, sides, or near pointer)
      const startSide = Math.floor(Math.random() * 3);
      let startX = Math.random() * width;
      let startY = 0;

      if (startSide === 1) {
        startX = 0;
        startY = Math.random() * (height * 0.6);
      } else if (startSide === 2) {
        startX = width;
        startY = Math.random() * (height * 0.6);
      }

      // Target direction towards center/screen quadrant
      let curX = startX;
      let curY = startY;
      const targetX = width * 0.2 + Math.random() * (width * 0.6);
      const targetY = height * 0.2 + Math.random() * (height * 0.5);

      const points: Array<{ x: number; y: number }> = [{ x: curX, y: curY }];
      const segments = Math.floor(Math.random() * 8) + 8;
      const dx = (targetX - startX) / segments;
      const dy = (targetY - startY) / segments;

      for (let i = 0; i < segments; i++) {
        curX += dx + (Math.random() - 0.5) * 60;
        curY += dy + (Math.random() - 0.5) * 60;
        points.push({ x: curX, y: curY });
      }

      activeLightnings.push({
        points,
        alpha: 0.85,
        width: Math.random() * 1.8 + 1.2
      });

      // Child branch
      if (Math.random() > 0.3) {
        const midIdx = Math.floor(points.length / 2);
        const subPoints: Array<{ x: number; y: number }> = [{ ...points[midIdx] }];
        let subX = points[midIdx].x;
        let subY = points[midIdx].y;
        for (let j = 0; j < 5; j++) {
          subX += (Math.random() - 0.5) * 45;
          subY += Math.random() * 35 + 10;
          subPoints.push({ x: subX, y: subY });
        }
        activeLightnings.push({
          points: subPoints,
          alpha: 0.65,
          width: 1.0
        });
      }
    };

    // Mouse & Touch interaction handlers
    const handlePointerMove = (e: MouseEvent) => {
      pointer.targetX = e.clientX;
      pointer.targetY = e.clientY;
      pointer.isMoving = true;
      pointer.lastMoveTime = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        pointer.targetX = e.touches[0].clientX;
        pointer.targetY = e.touches[0].clientY;
        pointer.isMoving = true;
        pointer.lastMoveTime = Date.now();
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let time = 0;
    const render = () => {
      animId = requestAnimationFrame(render);
      time += 0.015;

      ctx.clearRect(0, 0, width, height);

      // Smooth pointer interpolation
      pointer.x += (pointer.targetX - pointer.x) * 0.08;
      pointer.y += (pointer.targetY - pointer.y) * 0.08;

      // 1. Dynamic Cursor Plasma Light / Follower Glow
      const glowGrad = ctx.createRadialGradient(
        pointer.x,
        pointer.y,
        0,
        pointer.x,
        pointer.y,
        width < 768 ? 260 : 380
      );
      glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.16)'); // Ice Blue radiant center
      glowGrad.addColorStop(0.35, 'rgba(14, 116, 218, 0.09)'); // Cobalt Mid
      glowGrad.addColorStop(0.7, 'rgba(6, 25, 54, 0.04)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Secondary Floating Ambient Aurora Light (drifting softly in background)
      const auroraX = width * 0.5 + Math.sin(time * 0.6) * (width * 0.25);
      const auroraY = height * 0.35 + Math.cos(time * 0.4) * (height * 0.15);
      const auroraGrad = ctx.createRadialGradient(
        auroraX,
        auroraY,
        0,
        auroraX,
        auroraY,
        width < 768 ? 320 : 500
      );
      auroraGrad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
      auroraGrad.addColorStop(0.5, 'rgba(29, 78, 216, 0.05)');
      auroraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = auroraGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Render and Update Floating Ion Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Pulse alpha
        p.alpha = p.baseAlpha + Math.sin(time * 2 + i) * 0.2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.z, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 95%, 72%, ${Math.max(0, p.alpha)})`;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // 4. Trigger & Render Electric Lightning Discharges
      const now = Date.now();
      if (now > nextLightningTime) {
        createLightningBranch();
        nextLightningTime = now + 4000 + Math.random() * 5000;
      }

      // Draw active lightning bolts
      if (activeLightnings.length > 0) {
        for (let i = activeLightnings.length - 1; i >= 0; i--) {
          const bolt = activeLightnings[i];
          if (bolt.points.length < 2) continue;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
          for (let p = 1; p < bolt.points.length; p++) {
            ctx.lineTo(bolt.points[p].x, bolt.points[p].y);
          }

          // Outer Glow
          ctx.strokeStyle = `rgba(56, 189, 248, ${bolt.alpha * 0.4})`;
          ctx.lineWidth = bolt.width * 3.5;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 15;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();

          // Inner Hot Core
          ctx.strokeStyle = `rgba(240, 249, 255, ${bolt.alpha})`;
          ctx.lineWidth = bolt.width;
          ctx.stroke();
          ctx.restore();

          // Fade out quickly like real lightning
          bolt.alpha -= 0.055;
          if (bolt.alpha <= 0) {
            activeLightnings.splice(i, 1);
          }
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-90 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
};

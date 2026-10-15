import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Login3DNodeProps {
  isLoading?: boolean;
  isTyping?: boolean;
  mode?: 'customer' | 'admin';
}

/**
 * Login3DNode Component
 * Dedicated 3D Cyber Security & Power Node for Login Pages.
 * Reacts dynamically to:
 * - Idle floating & breathing neon core
 * - Typing activity (enhanced rotation & ionization)
 * - Submission loading state (hyper-speed acceleration & radiant charge)
 */
export const Login3DNode: React.FC<Login3DNodeProps> = ({
  isLoading = false,
  isTyping = false,
  mode = 'customer',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef({ isLoading, isTyping });
  stateRef.current = { isLoading, isTyping };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 180;
    const height = container.clientHeight || 150;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Color definitions
    const primaryColor = mode === 'admin' ? 0x38bdf8 : 0x7dd3fc;
    const accentColor = mode === 'admin' ? 0x1d4ed8 : 0x0284c7;

    // 1. Central Core Sphere (Frosted Glass / Hologram)
    const coreGeo = new THREE.IcosahedronGeometry(0.72, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: primaryColor,
      emissive: accentColor,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Inner glowing crystal
    const innerGeo = new THREE.OctahedronGeometry(0.4, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: false,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreMesh.add(innerMesh);

    // 2. Orbital Gyro Ring 1 (Horizontal)
    const ring1Geo = new THREE.TorusGeometry(1.2, 0.024, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: 0.75,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    scene.add(ring1);

    // 3. Orbital Gyro Ring 2 (Tilted)
    const ring2Geo = new THREE.TorusGeometry(1.35, 0.02, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    scene.add(ring2);

    // 4. Electric Satellite Spark Nodes
    const satelliteGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const satelliteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const satellite1 = new THREE.Mesh(satelliteGeo, satelliteMat);
    const satellite2 = new THREE.Mesh(satelliteGeo, satelliteMat);
    ring1.add(satellite1);
    ring2.add(satellite2);
    satellite1.position.x = 1.2;
    satellite2.position.y = 1.35;

    // Lighting
    const pointLight = new THREE.PointLight(primaryColor, 3.5, 10);
    pointLight.position.set(0, 0, 1.5);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x0c336b, 1.5);
    scene.add(ambientLight);

    // Pointer tracking for interactive tilt
    let targetRotX = 0;
    let targetRotY = 0;
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = nx * 0.45;
      targetRotX = -ny * 0.45;
    };
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const { isLoading: loading, isTyping: typing } = stateRef.current;

      // Dynamic rotation speed multiplier
      const speedMultiplier = loading ? 6.5 : typing ? 2.4 : 1.0;

      // Rotate core & rings
      coreMesh.rotation.y += 0.012 * speedMultiplier;
      coreMesh.rotation.x += 0.008 * speedMultiplier;

      ring1.rotation.z += 0.018 * speedMultiplier;
      ring1.rotation.x += 0.009 * speedMultiplier;

      ring2.rotation.y += 0.015 * speedMultiplier;
      ring2.rotation.z -= 0.01 * speedMultiplier;

      // Levitation floating wave
      coreMesh.position.y = Math.sin(time * 2.2) * 0.08;
      ring1.position.y = Math.sin(time * 2.2) * 0.08;
      ring2.position.y = Math.sin(time * 2.2) * 0.08;

      // Pulsing emissive glow
      const pulseRate = loading ? 12 : typing ? 5 : 2;
      coreMat.emissiveIntensity = 0.5 + Math.sin(time * pulseRate) * (loading ? 0.6 : 0.3);
      pointLight.intensity = loading ? 5.5 : 3.0 + Math.sin(time * pulseRate) * 1.0;

      // Interactive smooth tilt tracking
      scene.rotation.x += (targetRotX - scene.rotation.x) * 0.08;
      scene.rotation.y += (targetRotY - scene.rotation.y) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      satelliteGeo.dispose();
      satelliteMat.dispose();
    };
  }, [mode]);

  return (
    <div
      ref={mountRef}
      className="w-full h-36 flex items-center justify-center relative select-none cursor-grab active:cursor-grabbing"
      aria-hidden="true"
    >
      {/* Underlying circular radial glow aura */}
      <div
        className={`absolute inset-0 m-auto w-24 h-24 rounded-full pointer-events-none blur-2xl transition-all duration-300 ${
          isLoading
            ? 'bg-sky-300/40 scale-125'
            : isTyping
            ? 'bg-sky-400/25 scale-110'
            : 'bg-blue-500/15 scale-100'
        }`}
      />
    </div>
  );
};

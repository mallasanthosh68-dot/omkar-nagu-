import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, Sparkles } from 'lucide-react';

interface Electrical3DSceneProps {
  height?: string;
  className?: string;
}

export const Electrical3DScene: React.FC<Electrical3DSceneProps> = ({
  height = 'h-72 md:h-84',
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  // References for animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const floatingGroupRef = useRef<THREE.Group | null>(null);
  const ribbonMeshRef = useRef<THREE.Mesh | null>(null);
  const orbitRingRef = useRef<THREE.Group | null>(null);
  const coreMeshRef = useRef<THREE.Mesh | null>(null);
  const glowLightRef = useRef<THREE.PointLight | null>(null);

  // Inertial interaction state
  const mouseState = useRef({
    isDown: false,
    lastX: 0,
    lastY: 0,
    rotX: 0.2,
    rotY: -0.4,
    targetRotX: 0.2,
    targetRotY: -0.4,
    velX: 0,
    velY: 0
  });

  const resetRotation = () => {
    mouseState.current.targetRotX = 0.2;
    mouseState.current.targetRotY = -0.4;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect WebGL capability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    const width = container.clientWidth || 500;
    const heightPx = container.clientHeight || 320;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / heightPx, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // 2. WebGL Renderer with Alpha
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 3. Cobalt & Ice-Blue Atmospheric Lighting
    const ambientLight = new THREE.AmbientLight(0x0e3670, 2.2);
    scene.add(ambientLight);

    // Rich Cobalt Directional Key Light
    const cobaltLight = new THREE.DirectionalLight(0x1d4ed8, 2.8);
    cobaltLight.position.set(5, 7, 5);
    scene.add(cobaltLight);

    // Pure Ice Blue Fill Light
    const iceLight = new THREE.DirectionalLight(0x7dd3fc, 2.0);
    iceLight.position.set(-6, -3, 3);
    scene.add(iceLight);

    // Pulsing Central Ice Point Light
    const glowLight = new THREE.PointLight(0x38bdf8, 3.5, 12);
    glowLight.position.set(0, 0, 0);
    scene.add(glowLight);
    glowLightRef.current = glowLight;

    // ==========================================
    // LEVITATING POWER CORE (Unique & Simple)
    // ==========================================
    const floatingGroup = new THREE.Group();
    scene.add(floatingGroup);
    floatingGroupRef.current = floatingGroup;

    // A. Frosted Outer Cobalt Glass Shell
    const outerGeo = new THREE.SphereGeometry(1.25, 48, 48);
    const outerMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a2e66,
      emissive: 0x0284c7,
      emissiveIntensity: 0.15,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.65,
      opacity: 0.88,
      transparent: true,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    const outerSphere = new THREE.Mesh(outerGeo, outerMat);
    coreMeshRef.current = outerSphere;
    floatingGroup.add(outerSphere);

    // B. Internal Ice-Blue Electric Ribbon Knot (Torus Knot)
    // Clean, continuous, beautiful glowing filament
    const ribbonGeo = new THREE.TorusKnotGeometry(0.68, 0.08, 120, 16, 2, 3);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x7dd3fc,
      emissiveIntensity: 1.6,
      roughness: 0.2,
      metalness: 0.8
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbonMeshRef.current = ribbonMesh;
    floatingGroup.add(ribbonMesh);

    // C. Glowing Ice-Blue Nucleus Sphere
    const nucleusGeo = new THREE.SphereGeometry(0.32, 24, 24);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    floatingGroup.add(nucleusMesh);

    // D. Elegant Single Orbital Ice-Blue Ring with Satellites
    const orbitGroup = new THREE.Group();
    orbitRingRef.current = orbitGroup;
    floatingGroup.add(orbitGroup);

    // Slender Ring
    const ringGeo = new THREE.TorusGeometry(1.9, 0.03, 16, 96);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xbae6fd,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.7
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.3;
    orbitGroup.add(ringMesh);

    // Two sleek orbiting energy nodes
    const satelliteGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const satelliteMat = new THREE.MeshBasicMaterial({ color: 0x7dd3fc });

    const sat1 = new THREE.Mesh(satelliteGeo, satelliteMat);
    sat1.position.set(1.9, 0, 0);
    orbitGroup.add(sat1);

    const sat2 = new THREE.Mesh(satelliteGeo, satelliteMat);
    sat2.position.set(-1.9, 0, 0);
    orbitGroup.add(sat2);

    // E. Base Ground Energy Glow Disk (Under levitating core)
    const baseDiskGeo = new THREE.RingGeometry(0.2, 1.8, 32);
    const baseDiskMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide
    });
    const baseDisk = new THREE.Mesh(baseDiskGeo, baseDiskMat);
    baseDisk.rotation.x = Math.PI / 2;
    baseDisk.position.y = -1.9;
    scene.add(baseDisk);

    // 4. Smooth Interaction Listeners
    const handleMouseDown = (e: MouseEvent) => {
      mouseState.current.isDown = true;
      mouseState.current.lastX = e.clientX;
      mouseState.current.lastY = e.clientY;
      setIsInteracting(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseState.current.isDown) {
        // Subtle mouse tracking when hovering
        const rect = container.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        mouseState.current.targetRotY = normX * 0.8 - 0.4;
        mouseState.current.targetRotX = normY * 0.5 + 0.2;
        return;
      }
      const dx = e.clientX - mouseState.current.lastX;
      const dy = e.clientY - mouseState.current.lastY;
      mouseState.current.targetRotY += dx * 0.008;
      mouseState.current.targetRotX += dy * 0.008;
      mouseState.current.lastX = e.clientX;
      mouseState.current.lastY = e.clientY;
    };

    const handleMouseUp = () => {
      mouseState.current.isDown = false;
      setIsInteracting(false);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        mouseState.current.isDown = true;
        mouseState.current.lastX = e.touches[0].clientX;
        mouseState.current.lastY = e.touches[0].clientY;
        setIsInteracting(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (mouseState.current.isDown && e.touches.length === 1) {
        const dx = e.touches[0].clientX - mouseState.current.lastX;
        const dy = e.touches[0].clientY - mouseState.current.lastY;
        mouseState.current.targetRotY += dx * 0.008;
        mouseState.current.targetRotX += dy * 0.008;
        mouseState.current.lastX = e.touches[0].clientX;
        mouseState.current.lastY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      mouseState.current.isDown = false;
      setIsInteracting(false);
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // 5. Responsive Resize
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 6. Animation Loop (Smooth 60fps)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Inertia Rotation
      mouseState.current.rotX += (mouseState.current.targetRotX - mouseState.current.rotX) * 0.08;
      mouseState.current.rotY += (mouseState.current.targetRotY - mouseState.current.rotY) * 0.08;

      if (floatingGroupRef.current) {
        // Smooth floating levitation bob
        floatingGroupRef.current.position.y = Math.sin(elapsedTime * 1.8) * 0.12;

        // Apply interactive orientation
        floatingGroupRef.current.rotation.x = mouseState.current.rotX;
        floatingGroupRef.current.rotation.y = mouseState.current.rotY + elapsedTime * 0.15;
      }

      // Rotate internal ice-blue ribbon knot smoothly
      if (ribbonMeshRef.current) {
        ribbonMeshRef.current.rotation.x = elapsedTime * 0.4;
        ribbonMeshRef.current.rotation.y = elapsedTime * 0.6;
      }

      // Rotate orbital ring
      if (orbitRingRef.current) {
        orbitRingRef.current.rotation.z = elapsedTime * 0.5;
      }

      // Pulse Central Glow Light
      if (glowLightRef.current) {
        glowLightRef.current.intensity = 3.0 + Math.sin(elapsedTime * 3.5) * 0.8;
      }

      // Pulse Base Disk Opacity
      baseDiskMat.opacity = 0.18 + Math.sin(elapsedTime * 1.8) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      className={`relative w-full ${height} rounded-2xl overflow-hidden bg-gradient-to-b from-[#0a2754]/80 to-[#061838]/90 border border-sky-400/30 backdrop-blur-md shadow-2xl flex items-center justify-center select-none group transition-all duration-300 hover:border-sky-400/50 ${className}`}
    >
      {/* Fallback for WebGL unsupported */}
      {!webGLSupported ? (
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
            <Sparkles className="w-8 h-8 animate-pulse text-sky-300" />
          </div>
          <p className="text-sm font-semibold text-sky-100">Quantum Energy Node</p>
          <p className="text-xs text-sky-300/80">3D graphics accelerated power beacon</p>
        </div>
      ) : (
        <>
          {/* Three.js Canvas Container */}
          <div
            ref={mountRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            title="Click and drag to rotate the power core"
          />

          {/* Minimalist Header Pill */}
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a2c5a]/80 border border-sky-400/30 backdrop-blur-md shadow-lg pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span className="text-[11px] font-semibold text-sky-100 tracking-wide">
              Smart Quantum Arc Core
            </span>
          </div>

          {/* Controls: Reset orientation */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <button
              onClick={resetRotation}
              title="Reset orientation"
              className="p-1.5 rounded-lg bg-[#0a2c5a]/75 hover:bg-sky-500/30 text-sky-300 hover:text-white border border-sky-400/30 transition-all hover:scale-105"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Minimalist Bottom Interaction Hint */}
          <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none">
            <span className="text-[11px] text-sky-200/75 bg-[#071c3b]/70 px-3 py-1 rounded-full border border-sky-400/20 backdrop-blur-sm">
              {isInteracting ? 'Rotating 3D core' : 'Drag to rotate • 3D Arc Reactor'}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

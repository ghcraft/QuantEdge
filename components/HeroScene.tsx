"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { BufferGeometry, BufferAttribute, Points, PointsMaterial } from "three";

/**
 * Componente de partículas 3D para efeito visual profissional
 */
function Particles() {
  const pointsRef = useRef<Points>(null);
  
  useEffect(() => {
    if (pointsRef.current) {
      const geometry = new BufferGeometry();
      const positions = new Float32Array(1000 * 3);
      for (let i = 0; i < 1000; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }
      geometry.setAttribute('position', new BufferAttribute(positions, 3));
      pointsRef.current.geometry = geometry;
    }
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <points ref={pointsRef}>
      <pointsMaterial size={0.05} color="#00d4aa" transparent opacity={0.4} />
    </points>
  );
}

/**
 * Hero Scene com efeitos 3D profissionais
 */
export default function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Particles />
      </Canvas>
    </div>
  );
}


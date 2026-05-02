'use client';
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1614544048536-0d28caf77f41?w=400&q=80',
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&q=80',
  'https://images.unsplash.com/photo-1705721357357-ab87523248f7?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400&q=80',
  'https://images.unsplash.com/photo-1587876931567-564ce588bfbd?w=400&q=80',
  'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&q=80',
];

const FallingBook = ({
  startPos,
  speed,
  rotSpeed,
  url,
  depth
}: {
  startPos: [number, number, number],
  speed: number,
  rotSpeed: [number, number, number],
  url: string,
  depth: number
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Try loading texture, ignore if fails for now
  const textures = useTexture([url]);
  const coverTexture = textures[0];

  // Desaturate books further back
  const color = new THREE.Color('#F5EFE0');
  if (depth < -5) color.lerp(new THREE.Color('#ffffff'), 0.5);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Fall down
    meshRef.current.position.y -= speed * delta;

    // Tumble
    meshRef.current.rotation.x += rotSpeed[0] * delta;
    meshRef.current.rotation.y += rotSpeed[1] * delta;
    meshRef.current.rotation.z += rotSpeed[2] * delta;

    // Parallax effect based on mouse
    const mouseX = (state.pointer.x * state.viewport.width) / 2;
    const parallaxFactor = 1 / Math.abs(depth || 1);
    meshRef.current.position.x = startPos[0] + mouseX * 0.1 * parallaxFactor;

    // Loop
    if (meshRef.current.position.y < -15) {
      meshRef.current.position.y = 15;
      meshRef.current.position.x = startPos[0];
    }
  });

  return (
    <mesh ref={meshRef} position={startPos} castShadow receiveShadow>
      <boxGeometry args={[2, 3, 0.4]} />
      {/* 6 materials for the box sides: Right, Left, Top, Bottom, Front (Cover), Back */}
      <meshStandardMaterial color={color} roughness={0.8} /> {/* Right spine */}
      <meshStandardMaterial color={color} roughness={0.8} /> {/* Left pages */}
      <meshStandardMaterial color={color} roughness={0.8} /> {/* Top pages */}
      <meshStandardMaterial color={color} roughness={0.8} /> {/* Bottom pages */}
      <meshStandardMaterial map={coverTexture} color="#fff" roughness={0.5} /> {/* Front Cover */}
      <meshStandardMaterial color={color} roughness={0.8} /> {/* Back */}
    </mesh>
  );
};

export const FloatingBooks3D = () => {
  const books = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => {
      const depth = -Math.random() * 15 - 2; // z between -2 and -17
      return {
        id: i,
        startPos: [
          (Math.random() - 0.5) * 20, // x between -10 and 10
          Math.random() * 30, // Start high
          depth
        ] as [number, number, number],
        speed: Math.random() * 2 + 1.5, // fall speed
        rotSpeed: [
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5
        ] as [number, number, number],
        url: SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)],
        depth
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <Canvas style={{ background: 'transparent' }} camera={{ position: [0, 0, 8], fov: 45 }} shadows>
        <ambientLight intensity={0.7} color="#FDFAF4" />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
          color="#FDFAF4"
        />

        {/* Invisible floor to receive shadows */}
        <mesh position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <shadowMaterial opacity={0.2} />
        </mesh>

        {books.map(book => (
          <React.Suspense key={book.id} fallback={null}>
            <FallingBook {...book} />
          </React.Suspense>
        ))}
      </Canvas>
    </div>
  );
};

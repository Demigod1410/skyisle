import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Particles({ count = 200, color = '#ffffff' }) {
  const mesh = useRef<THREE.Points>(null);
  
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 3 + Math.random() * 2; // Distance from center
      const theta = Math.random() * Math.PI * 2; // Angle around Y axis
      const phi = Math.random() * Math.PI; // Angle from Y axis
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2; // Y position
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return positions;
  }, [count]);

  const sizes = useMemo(() => {
    const data = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      data[i] = Math.random() * 0.03 + 0.01;
    }
    return data;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    // Slowly rotate the particle system
    mesh.current.rotation.y += 0.001;
    
    // Update particle positions
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.001;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>        <bufferAttribute
          attach="attributes-position"
          args={[particlePositions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexColors={false}
        sizeAttenuation={true}
      />
    </points>
  );
}

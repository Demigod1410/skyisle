import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls } from 'leva';

// Custom shader for particles
const particleVertexShader = `
  attribute float size;
  attribute float speed;
  attribute vec3 color;
  attribute float opacity;
  
  varying vec3 vColor;
  varying float vOpacity;
  
  void main() {
    vColor = color;
    vOpacity = opacity;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;
  
  void main() {
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
    float strength = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
    gl_FragColor = vec4(vColor, vOpacity * strength);
  }
`;

export function Particles({ count = 400 }) {
  const mesh = useRef<THREE.Points>(null);
  
  // Interactive controls for particles
  const { 
    particleColor1, 
    particleColor2,
    speed,
    size,
    spread,
    height
  } = useControls('particles', {
    particleColor1: '#63c0ff',
    particleColor2: '#e0f3ff',
    speed: { value: 0.2, min: 0.01, max: 1, step: 0.01 },
    size: { value: 0.8, min: 0.1, max: 2, step: 0.1 },
    spread: { value: 4, min: 2, max: 10, step: 0.5 },
    height: { value: 2.5, min: 1, max: 5, step: 0.5 }
  }, { collapsed: true });

  // Create particles with enhanced parameters
  const { positions, colors, sizes, speeds, opacities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    const opacities = new Float32Array(count);
    
    const color1 = new THREE.Color(particleColor1);
    const color2 = new THREE.Color(particleColor2);
    
    for (let i = 0; i < count; i++) {
      // Create a spiral pattern with random variations
      const radius = 3 + Math.random() * spread; 
      const heightRange = height;
      const angle = Math.random() * Math.PI * 2;
      const heightOffset = (Math.random() - 0.5) * heightRange;
      
      // Spiral distribution with some randomness
      positions[i * 3] = Math.cos(angle) * radius * (1 + Math.random() * 0.2);
      positions[i * 3 + 1] = heightOffset;
      positions[i * 3 + 2] = Math.sin(angle) * radius * (1 + Math.random() * 0.2);
      
      // Interpolate between two colors based on height
      const colorMix = Math.max(0, Math.min(1, (heightOffset + heightRange/2) / heightRange));
      const particleColor = new THREE.Color().lerpColors(color1, color2, colorMix);
      
      colors[i * 3] = particleColor.r;
      colors[i * 3 + 1] = particleColor.g;
      colors[i * 3 + 2] = particleColor.b;
      
      // Vary sizes based on distance from center
      const distanceFromCenter = Math.sqrt(
        positions[i * 3] ** 2 + positions[i * 3 + 2] ** 2
      );
      
      sizes[i] = (0.05 + Math.random() * 0.1) * size * (1 - distanceFromCenter / (spread + 3) * 0.5);
      speeds[i] = 0.1 + Math.random() * 0.9; // Random speeds for varied movement
      opacities[i] = 0.2 + Math.random() * 0.8;
    }
    
    return { positions, colors, sizes, speeds, opacities };
  }, [count, particleColor1, particleColor2, spread, height, size]);
  
  // Create custom shader material
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  // Animation with more dynamic behavior
  useFrame((state) => {
    if (!mesh.current) return;
    
    // Gently rotate the entire particle system
    mesh.current.rotation.y += 0.0003;
    
    const time = state.clock.elapsedTime;
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    const speedArray = mesh.current.geometry.attributes.speed.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Apply unique movement to each particle
      const particleSpeed = speedArray[i] * speed;
      const xOffset = Math.sin(time * particleSpeed + i) * 0.01;
      const yOffset = Math.cos(time * particleSpeed * 0.7 + i * 0.3) * 0.01;
      const zOffset = Math.sin(time * particleSpeed * 0.5 + i * 0.6) * 0.01;
      
      // Apply gentle floating motion
      positions[i3] += xOffset;
      positions[i3 + 1] += yOffset;
      positions[i3 + 2] += zOffset;
      
      // Keep particles within bounds (reset if they drift too far)
      const distance = Math.sqrt(
        positions[i3] ** 2 + 
        positions[i3 + 1] ** 2 + 
        positions[i3 + 2] ** 2
      );
      
      if (distance > spread + 5) {
        // Reset particle position closer to center
        const radius = 3 + Math.random() * spread;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = (Math.random() - 0.5) * height;
        positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      }
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-speed"
          args={[speeds, 1]}
        />
        <bufferAttribute
          attach="attributes-opacity"
          args={[opacities, 1]}
        />
      </bufferGeometry>
      <primitive object={shaderMaterial} attach="material" />
    </points>
  );
}

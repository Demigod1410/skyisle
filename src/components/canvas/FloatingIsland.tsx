import { useEffect, useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import gsap from 'gsap';
import * as THREE from 'three';
import { Tooltip } from './Tooltip';
import { Particles } from './Particles';

export function FloatingIsland() {
  const group = useRef<THREE.Group>(null);
  const tl = useRef<gsap.core.Timeline | undefined>(undefined);
  const [hoveredItem, setHoveredItem] = useState<{ type: string; position: THREE.Vector3 } | null>(null);
  const [hoverStates, setHoverStates] = useState({
    island: false,
    house: false,
    trees: Array(3).fill(false)
  });

  // Spring animations for each element
  const islandSpring = useSpring({
    scale: hoverStates.island ? 1.1 : 1,
    config: { tension: 300, friction: 30 }
  });

  const houseSpring = useSpring({
    scale: hoverStates.house ? 1.1 : 1,
    config: { tension: 300, friction: 30 }
  });

  const treesSprings = hoverStates.trees.map(isHovered => 
    useSpring({
      scale: isHovered ? 1.2 : 1,
      config: { tension: 300, friction: 30 }
    })
  );

  // Floating animation
  useEffect(() => {
    if (!group.current) return;

    tl.current = gsap.timeline({
      repeat: -1,
      yoyo: true,
    });

    tl.current
      .to(group.current.position, {
        y: '+= 0.2',
        duration: 2,
        ease: 'power1.inOut',
      })
      .to(group.current.rotation, {
        y: '+= 0.1',
        duration: 3,
        ease: 'none',
      }, 0);

    return () => {
      tl.current?.kill();
    };
  }, []);

  return (
    <> color="#4a9eff"
      <Particles count={200} />
      
      <group ref={group}>
        {/* Base island */}
        <animated.mesh
          receiveShadow 
          castShadow 
          position={[0, 0, 0]}
          scale={islandSpring.scale}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            setHoverStates(prev => ({ ...prev, island: true }));
            setHoveredItem({ type: 'Mystical Island Base', position: new THREE.Vector3(0, 0, 0) });
          }}
          onPointerOut={() => {
            setHoverStates(prev => ({ ...prev, island: false }));
            setHoveredItem(null);
          }}
        >
          <cylinderGeometry args={[2, 3, 1, 16]} />
          <meshPhysicalMaterial 
            color="#4a5568"
            roughness={0.8}
            metalness={0.2}
            clearcoat={0.3}
            clearcoatRoughness={0.2}
          />
        </animated.mesh>

        {/* Top surface with grass */}
        <mesh receiveShadow castShadow position={[0, 0.5, 0]}>
          <cylinderGeometry args={[2.2, 2, 0.2, 16]} />
          <meshPhysicalMaterial
            color="#48bb78"
            roughness={0.5}
            metalness={0.1}
            clearcoat={0.4}
            clearcoatRoughness={0.2}
          />
        </mesh>

        {/* House */}
        <animated.group
          position={[0, 1, 0]}
          scale={houseSpring.scale}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            setHoverStates(prev => ({ ...prev, house: true }));
            setHoveredItem({ type: 'Ancient Dwelling', position: new THREE.Vector3(0, 1.5, 0) });
          }}
          onPointerOut={() => {
            setHoverStates(prev => ({ ...prev, house: false }));
            setHoveredItem(null);
          }}
        >
          {/* House base */}
          <mesh castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshPhysicalMaterial
              color="#e2e8f0"
              roughness={0.3}
              metalness={0.2}
              clearcoat={0.5}
              clearcoatRoughness={0.3}
            />
          </mesh>
          {/* Roof */}
          <mesh castShadow position={[0, 0.7, 0]}>
            <coneGeometry args={[0.8, 0.8, 4]} />
            <meshPhysicalMaterial
              color="#fc8181"
              roughness={0.4}
              metalness={0.1}
              clearcoat={0.3}
              clearcoatRoughness={0.4}
            />
          </mesh>
        </animated.group>

        {/* Trees */}
        {[[-1.5, 0.6, -0.5], [1.2, 0.6, 0.8], [0, 0.6, -1.5]].map((pos, i) => (
          <animated.group
            key={i}
            position={pos as [number, number, number]}
            scale={treesSprings[i].scale}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              setHoverStates(prev => ({
                ...prev,
                trees: prev.trees.map((t, idx) => idx === i ? true : t)
              }));
              setHoveredItem({
                type: 'Enchanted Tree',
                position: new THREE.Vector3(pos[0], pos[1] + 1, pos[2])
              });
            }}
            onPointerOut={() => {
              setHoverStates(prev => ({
                ...prev,
                trees: prev.trees.map((t, idx) => idx === i ? false : t)
              }));
              setHoveredItem(null);
            }}
          >
            {/* Trunk */}
            <mesh castShadow>
              <cylinderGeometry args={[0.1, 0.1, 0.5]} />
              <meshPhysicalMaterial
                color="#805ad5"
                roughness={0.6}
                metalness={0.1}
                clearcoat={0.2}
                clearcoatRoughness={0.4}
              />
            </mesh>
            {/* Leaves */}
            <mesh castShadow position={[0, 0.5, 0]}>
              <coneGeometry args={[0.4, 1, 8]} />
              <meshPhysicalMaterial
                color="#48bb78"
                roughness={0.4}
                metalness={0.1}
                clearcoat={0.3}
                clearcoatRoughness={0.3}
              />
            </mesh>
          </animated.group>
        ))}

        {/* Tooltip */}
        {hoveredItem && (
          <Tooltip 
            position={hoveredItem.position}
            content={hoveredItem.type}
          />
        )}
      </group>
    </>
  );
}

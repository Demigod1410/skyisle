import { useEffect, useRef, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
import { Tooltip } from "./Tooltip";
import { Particles } from "./Particles";

export interface FloatingIslandProps {
  isDarkMode?: boolean;
}

export function FloatingIsland({ isDarkMode = true }: FloatingIslandProps) {
  const group = useRef<THREE.Group>(null);
  const tl = useRef<gsap.core.Timeline | undefined>(undefined);
  const [hoveredItem, setHoveredItem] = useState<{
    type: string;
    position: THREE.Vector3;
  } | null>(null);
  const [hoverStates, setHoverStates] = useState({
    island: false,
    house: false,
    trees: Array(3).fill(false),
  });

  // Load the house GLTF model
  const { scene: houseModel } = useGLTF("/assets/house.gltf");
  
  // Skip material processing to avoid shader issues
  useEffect(() => {
    if (houseModel) {
      houseModel.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [houseModel]);

  // Material colors based on theme
  const materialColors = {
    island: isDarkMode ? "#3a3f52" : "#4a5568",
    grass: isDarkMode ? "#2f4f4f" : "#48bb78",
    house: isDarkMode ? "#d1d5db" : "#e2e8f0",
    roof: isDarkMode ? "#991b1b" : "#fc8181",
    trunk: isDarkMode ? "#4c1d95" : "#805ad5",
    leaves: isDarkMode ? "#1e4620" : "#48bb78",
    windows: isDarkMode ? "#1e40af" : "#63b3ed",
  };

  const particleCount = isDarkMode ? 350 : 150;
  const particleColor = isDarkMode ? "#6366f1" : "#93c5fd";

  // Spring animations for each element
  const islandSpring = useSpring({
    scale: hoverStates.island ? 1.1 : 1,
    config: { tension: 300, friction: 30 },
  });

  const houseSpring = useSpring({
    scale: hoverStates.house ? 1.1 : 1,
    config: { tension: 300, friction: 30 },
  });

  const treesSprings = hoverStates.trees.map((isHovered) =>
    useSpring({
      scale: isHovered ? 1.2 : 1,
      config: { tension: 300, friction: 30 },
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
        y: "+= 0.2",
        duration: 2,
        ease: "power1.inOut",
      })
      .to(
        group.current.rotation,
        {
          y: "+= 0.1",
          duration: 3,
          ease: "none",
        },
        0
      );

    return () => {
      tl.current?.kill();
    };
  }, []);

  return (
    <>
      <Particles count={particleCount} />

      <group ref={group}>
        {/* House - Using GLTF Model with fallback */}
        <animated.group
          position={[0, 0.5, 0]}
          scale={houseSpring.scale}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            setHoverStates((prev) => ({ ...prev, house: true }));
            setHoveredItem({
              type: "Ancient Dwelling",
              position: new THREE.Vector3(0, 1.5, 0),
            });
          }}
          onPointerOut={() => {
            setHoverStates((prev) => ({ ...prev, house: false }));
            setHoveredItem(null);
          }}
        >
          {houseModel ? (
            /* GLTF House Model */
            <primitive
              object={houseModel.clone()}
              scale={[0.5, 0.5, 0.5]}
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
            />
          ) : (
            /* Fallback simple house */
            <group>
              {/* House base */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshLambertMaterial color={new THREE.Color(materialColors.house)} />
              </mesh>
              {/* Roof */}
              <mesh castShadow receiveShadow position={[0, 0.7, 0]}>
                <coneGeometry args={[0.8, 0.8, 4]} />
                <meshLambertMaterial color={new THREE.Color(materialColors.roof)} />
              </mesh>
            </group>
          )}
        </animated.group>

        {/* Tooltip */}
        {hoveredItem && (
          <Tooltip position={hoveredItem.position} content={hoveredItem.type} />
        )}
      </group>
    </>
  );
}

// Preload the GLTF model
useGLTF.preload("/assets/house.gltf");

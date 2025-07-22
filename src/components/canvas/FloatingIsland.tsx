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

  // Load GLTF model with error handling
  const [houseModel, setHouseModel] = useState<THREE.Object3D | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load the model directly using Three.js loader
  useEffect(() => {
    // Verify we're in browser environment
    if (typeof window === 'undefined') return;

    // Import the loader dynamically to avoid SSR issues
    import('three/examples/jsm/loaders/GLTFLoader').then(({ GLTFLoader }) => {
      import('three/examples/jsm/loaders/DRACOLoader').then(({ DRACOLoader }) => {
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco/');
        loader.setDRACOLoader(dracoLoader);
        
        // Load the model
        loader.load(
          '/assets/house.gltf',
          (gltf) => {
            const model = gltf.scene;
            
            // Replace all MeshStandardMaterials with MeshBasicMaterials
            model.traverse((object) => {
              if (object instanceof THREE.Mesh && object.material) {
                if (Array.isArray(object.material)) {
                  object.material = object.material.map(mat => {
                    if (mat && (mat.type === 'MeshStandardMaterial' || mat.name === 'Outline' || mat.name === 'Material')) {
                      // Create a color instance to manipulate
                      const originalColor = mat.color || new THREE.Color(0xffffff);
                      const dampedColor = new THREE.Color(
                        originalColor.r * 0.7, // Reduce red component by 30%
                        originalColor.g * 0.7, // Reduce green component by 30%
                        originalColor.b * 0.7  // Reduce blue component by 30%
                      );
                      
                      return new THREE.MeshBasicMaterial({
                        color: dampedColor,
                        map: mat.map || null,
                        transparent: !!mat.transparent,
                        opacity: mat.opacity !== undefined ? mat.opacity : 1.0,
                        side: mat.side || THREE.FrontSide
                      });
                    }
                    return mat;
                  });
                } else if (object.material && (object.material.type === 'MeshStandardMaterial' || 
                           object.material.name === 'Outline' || object.material.name === 'Material')) {
                  // Create a color instance to manipulate
                  const originalColor = object.material.color || new THREE.Color(0xffffff);
                  const dampedColor = new THREE.Color(
                    originalColor.r * 0.7, // Reduce red component by 30%
                    originalColor.g * 0.7, // Reduce green component by 30%
                    originalColor.b * 0.7  // Reduce blue component by 30%
                  );
                  
                  object.material = new THREE.MeshBasicMaterial({
                    color: dampedColor,
                    map: object.material.map || null,
                    transparent: !!object.material.transparent,
                    opacity: object.material.opacity !== undefined ? object.material.opacity : 1.0,
                    side: object.material.side || THREE.FrontSide
                  });
                }
              }
            });
            
            setHouseModel(model as THREE.Object3D);
            setIsLoading(false);
            console.log('Model loaded successfully');
          },
          // Progress callback
          (xhr) => {
            console.log(`Model ${(xhr.loaded / xhr.total) * 100}% loaded`);
          },
          // Error callback
          (error) => {
            console.error('Error loading model:', error);
            setLoadError(`Failed to load model: ${error.message}`);
            setIsLoading(false);
          }
        );
      }).catch(err => {
        console.error('Failed to load DRACOLoader:', err);
        setLoadError('Failed to load DRACOLoader');
        setIsLoading(false);
      });
    }).catch(err => {
      console.error('Failed to load GLTFLoader:', err);
      setLoadError('Failed to load GLTFLoader');
      setIsLoading(false);
    });
  }, []);

  const particleCount = isDarkMode ? 350 : 150;

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
          {isLoading ? (
            // Loading indicator
            <mesh>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshBasicMaterial color={isDarkMode ? "#334155" : "#94a3b8"} wireframe />
            </mesh>
          ) : loadError ? (
            // Error indicator
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color="red" />
            </mesh>
          ) : houseModel ? (
            // Loaded model
            <primitive
              object={houseModel as unknown as THREE.Object3D}
              scale={[0.2, 0.2, 0.2]}
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
            />
          ) : null}
        </animated.group>

        {/* Tooltip */}
        {hoveredItem && (
          <Tooltip position={hoveredItem.position} content={hoveredItem.type} />
        )}
      </group>
    </>
  );
}

// We're handling the loading directly with GLTFLoader

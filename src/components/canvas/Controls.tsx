import { OrbitControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export function Controls() {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (!controlsRef.current) return;

    // Initial camera animation
    const controls = controlsRef.current;
    const initialPosition = new THREE.Vector3(10, 10, 10);
    const targetPosition = new THREE.Vector3(7, 5, 7);

    gsap.from(controls.object.position, {
      x: initialPosition.x,
      y: initialPosition.y,
      z: initialPosition.z,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        controls.update();
      },
    });

    gsap.to(controls.target, {
      x: 0,
      y: 1,
      z: 0,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        controls.update();
      },
    });
  }, []);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={5}
      maxDistance={20}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 2}
      enableDamping
      dampingFactor={0.05}
      autoRotate
      autoRotateSpeed={0.5}
    />
  );
}

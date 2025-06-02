import { Text } from '@react-three/drei';
import { useState } from 'react';
import { Vector3 } from 'three';

interface TooltipProps {
  position: Vector3;
  content: string;
}

export function Tooltip({ position, content }: TooltipProps) {
  return (
    <group>
      <Text
        position={position.clone().add(new Vector3(0, 0.5, 0))}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="bottom"
      >
        {content}
      </Text>
      {/* Add a backdrop for better readability */}
      <mesh position={position.clone().add(new Vector3(0, 0.5, -0.01))}>
        <planeGeometry args={[2, 0.5]} />
        <meshBasicMaterial color="black" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber/native';
import type { Mesh } from 'three';

export function Oven() {
  const fire = useRef<Mesh>(null);

  useFrame((state) => {
    if (fire.current) fire.current.scale.y = 0.85 + Math.sin(state.clock.elapsedTime * 8) * 0.15;
  });

  return (
    <group position={[0.8, 0, -0.4]}>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.6, 1.2, 1.4]} />
        <meshLambertMaterial color="#b5651d" flatShading />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.55, 0.7, 0.4, 8]} />
        <meshLambertMaterial color="#8a4b14" flatShading />
      </mesh>
      <mesh position={[0, 0.5, 0.71]}>
        <boxGeometry args={[0.8, 0.55, 0.05]} />
        <meshLambertMaterial color="#2b1a0f" />
      </mesh>
      <mesh ref={fire} position={[0, 0.42, 0.75]}>
        <boxGeometry args={[0.5, 0.28, 0.05]} />
        <meshBasicMaterial color="#ff7a1a" />
      </mesh>
    </group>
  );
}

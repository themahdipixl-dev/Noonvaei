import { useRef } from 'react';
import { useFrame } from '@react-three/fiber/native';
import type { Group } from 'three';
import { useGame } from '../game/useGame';

export function Baker() {
  const ref = useRef<Group>(null);
  const level = useGame((s) => s.game.levels.baker);
  const speed = 1 + Math.min(level, 20) * 0.1; // visual feedback for the upgrade

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime * speed;
    g.position.y = Math.abs(Math.sin(t * 3)) * 0.12;
    g.rotation.y = 0.6 + Math.sin(t * 1.5) * 0.25;
  });

  return (
    <group ref={ref} position={[-1.8, 0, 0.8]}>
      <mesh position={[0, 0.65, 0]}>
        <capsuleGeometry args={[0.3, 0.7, 4, 8]} />
        <meshLambertMaterial color="#f2ede4" flatShading />
      </mesh>
      <mesh position={[0, 1.42, 0]}>
        <cylinderGeometry args={[0.27, 0.3, 0.22, 8]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

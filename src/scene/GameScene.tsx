import { StyleSheet } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { Baker } from './Baker';
import { Ground } from './Ground';
import { Oven } from './Oven';

export function GameScene() {
  return (
    <Canvas
      style={StyleSheet.absoluteFill}
      camera={{ position: [0, 4.5, 7.5], fov: 45 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.7, 0)}
    >
      <color attach="background" args={['#f4e4c1']} />
      {/* Cheap lighting only: no shadows. */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 6, 4]} intensity={1.5} />
      <Ground />
      <Oven />
      <Baker />
    </Canvas>
  );
}

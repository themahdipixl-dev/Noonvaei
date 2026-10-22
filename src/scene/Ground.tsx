export function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[12, 12]} />
      <meshLambertMaterial color="#d9b77a" />
    </mesh>
  );
}

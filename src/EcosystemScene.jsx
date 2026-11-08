import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const nodes = [
  { label: 'Crear', color: '#f15a24', position: [-2.15, 1.12, -0.3], size: 0.18 },
  { label: 'Organizar', color: '#d9e86a', position: [2.05, 0.82, 0.25], size: 0.2 },
  { label: 'Conectar', color: '#a8d7bf', position: [-1.6, -1.32, 0.4], size: 0.16 },
  { label: 'Vender', color: '#9dc8ce', position: [1.75, -1.28, -0.3], size: 0.17 },
];

function OrbitingSystem({ reducedMotion }) {
  const system = useRef();
  const core = useRef();

  useFrame((state, delta) => {
    if (reducedMotion) return;
    if (system.current) system.current.rotation.y += delta * 0.08;
    if (core.current) core.current.rotation.y += delta * 0.18;
  });

  return (
    <group ref={system}>
      <Float speed={reducedMotion ? 0 : 1.3} rotationIntensity={0.12} floatIntensity={reducedMotion ? 0 : 0.3}>
        <mesh ref={core}>
          <icosahedronGeometry args={[0.88, 8]} />
          <meshPhysicalMaterial color="#f15a24" roughness={0.27} metalness={0.05} clearcoat={0.8} clearcoatRoughness={0.25} />
        </mesh>
      </Float>
      <mesh rotation={[0.82, 0.32, -0.28]}>
        <torusGeometry args={[1.45, 0.009, 8, 160]} />
        <meshBasicMaterial color="#7b8b73" transparent opacity={0.45} />
      </mesh>
      <mesh rotation={[1.16, -0.2, 0.74]}>
        <torusGeometry args={[1.9, 0.007, 8, 160]} />
        <meshBasicMaterial color="#e4a77d" transparent opacity={0.55} />
      </mesh>
      {nodes.map((node) => (
        <group key={node.label} position={node.position}>
          <Float speed={reducedMotion ? 0 : 1.7} rotationIntensity={0.15} floatIntensity={reducedMotion ? 0 : 0.36}>
            <mesh>
              <sphereGeometry args={[node.size, 32, 32]} />
              <meshStandardMaterial color={node.color} roughness={0.34} metalness={0.08} />
            </mesh>
          </Float>
          <Html center distanceFactor={7} position={[0, -0.38, 0]}>
            <span className="scene-label">{node.label}</span>
          </Html>
        </group>
      ))}
      <Sparkles count={34} scale={5.5} size={2.2} speed={0.16} color="#e28c5e" opacity={0.55} />
    </group>
  );
}

export default function EcosystemScene() {
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  return (
    <div className="ecosystem-scene" aria-label="Visualización 3D interactiva del ecosistema Presentto: crear, organizar, conectar y vender" role="img">
      <Canvas camera={{ position: [0, 0, 7.5], fov: 36 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 4, 5]} intensity={3.1} color="#fff3d8" />
        <pointLight position={[-3, -2, 3]} intensity={10} color="#f15a24" distance={8} />
        <OrbitingSystem reducedMotion={reducedMotion} />
        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI * 0.34} maxPolarAngle={Math.PI * 0.66} autoRotate={!reducedMotion} autoRotateSpeed={0.16} />
      </Canvas>
      <span className="scene-caption">Un ecosistema en movimiento</span>
    </div>
  );
}

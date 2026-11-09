import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, OrbitControls, Sparkles } from '@react-three/drei';

const nodes = [
  { label: 'Crear', color: '#f15a24', position: [-2.15, 1.12, -0.3], size: 0.18 },
  { label: 'Organizar', color: '#ffd0b6', position: [2.05, 0.82, 0.25], size: 0.22 },
  { label: 'Conectar', color: '#b83d13', position: [-1.6, -1.32, 0.4], size: 0.19 },
  { label: 'Vender', color: '#f58b5e', position: [1.75, -1.28, -0.3], size: 0.2 },
];

function OrbitingSystem({ reducedMotion }) {
  const system = useRef();
  const core = useRef();

  useFrame((state, delta) => {
    if (reducedMotion) return;
    if (system.current) {
      system.current.rotation.y += delta * 0.16;
      system.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.32) * 0.045;
    }
    if (core.current) {
      core.current.rotation.y += delta * 0.34;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.15) * 0.025;
      core.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={system}>
      <Float speed={reducedMotion ? 0 : 1.8} rotationIntensity={reducedMotion ? 0 : 0.2} floatIntensity={reducedMotion ? 0 : 0.42}>
        <mesh ref={core}>
          <icosahedronGeometry args={[1.02, 8]} />
          <meshPhysicalMaterial color="#f15a24" roughness={0.27} metalness={0.05} clearcoat={0.8} clearcoatRoughness={0.25} />
        </mesh>
      </Float>
      <mesh rotation={[0.82, 0.32, -0.28]}>
        <torusGeometry args={[1.45, 0.009, 8, 160]} />
        <meshBasicMaterial color="#cf6b43" transparent opacity={0.62} />
      </mesh>
      <mesh rotation={[1.16, -0.2, 0.74]}>
        <torusGeometry args={[1.9, 0.007, 8, 160]} />
        <meshBasicMaterial color="#f3b99a" transparent opacity={0.75} />
      </mesh>
      {nodes.map((node) => (
        <group key={node.label} position={node.position}>
          <Float speed={reducedMotion ? 0 : 2.2} rotationIntensity={reducedMotion ? 0 : 0.24} floatIntensity={reducedMotion ? 0 : 0.48}>
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
      <Sparkles count={reducedMotion ? 10 : 42} scale={5.8} size={2.4} speed={reducedMotion ? 0 : 0.42} color="#f15a24" opacity={0.62} />
    </group>
  );
}

export default function EcosystemScene() {
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  return (
    <div className="ecosystem-scene" aria-label="Visualización 3D interactiva del ecosistema Presentto: crear, organizar, conectar y vender" role="img">
      <Canvas camera={{ position: [0, 0, 7.1], fov: 34 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 4, 5]} intensity={3.4} color="#fff1e5" />
        <pointLight position={[-3, -2, 3]} intensity={10} color="#f15a24" distance={8} />
        <OrbitingSystem reducedMotion={reducedMotion} />
        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI * 0.34} maxPolarAngle={Math.PI * 0.66} autoRotate={!reducedMotion} autoRotateSpeed={0.32} />
      </Canvas>
      <span className="scene-caption">Un ecosistema en movimiento</span>
    </div>
  );
}

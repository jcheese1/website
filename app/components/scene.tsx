import { Environment, MeshReflectorMaterial } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import { Crowd } from "./crowd";

export function Scene() {
  return (
    <Canvas
      className="inset-0 animate-fade-in opacity-0 touch-none"
      camera={{ position: [10, 12, 12], fov: 25 }}
      style={{ background: "transparent", position: "fixed" }}
      gl={{ alpha: true, antialias: true }}
      dpr={[0.5, 1.5]}
    >
      <fog attach="fog" args={["#0c0a09", 15, 27]} />

      <ambientLight intensity={0.6} />
      <Suspense fallback={null}>
        <Crowd />
      </Suspense>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          resolution={1024}
          mixBlur={1}
          mixStrength={80}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0c0a09"
          metalness={0.5}
        />
      </mesh>
      <Environment preset="city" />

      {/* <Grid
          position={[0, -0.01, 0]}
          args={[10.5, 10.5]}
          cellSize={0.6}
          cellThickness={1}
          cellColor={"#6f6f6f"}
          sectionSize={3.3}
          sectionThickness={1.5}
          sectionColor={"#c75f00"}
          fadeDistance={20}
          fadeStrength={1}
          infiniteGrid
        /> */}
    </Canvas>
  );
}

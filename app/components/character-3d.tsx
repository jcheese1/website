import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import { Model } from "./character";

export function Character3D() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Fog that fades the character as it comes from the distance */}
        <fog attach="fog" args={["#0c0a09", 5, 25]} />

        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
      </Canvas>
    </div>
  );
}

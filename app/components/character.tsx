// biome-ignore assist/source/organizeImports: organized by hand
import type * as THREE from "three";
import type { GLTF } from "three-stdlib";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import React, { useEffect } from "react";
import { SkeletonUtils } from "three-stdlib";

type ActionName =
  | "Armature.001|mixamo.com|Layer0"
  | "Armature.001|mixamo.com|Layer0.001"
  | "Armature.001|mixamo.com|Layer0.002"
  | "Armature|mixamo.com|Layer0"
  | "Armature|mixamo.com|Layer0.001"
  | "Armature|mixamo.com|Layer0.002";

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName;
}

type GLTFResult = GLTF & {
  nodes: {
    material001: THREE.SkinnedMesh;
    mixamorigHips: THREE.Bone;
  };
  materials: {
    "Material.001": THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

export function Model(props: React.JSX.IntrinsicElements["group"]) {
  const group = React.useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/me-ransformed.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as unknown as GLTFResult;
  const { actions, names } = useAnimations(animations, group);

  const walkSpeed = 2; // Adjust to match animation pace

  useEffect(() => {
    const walkAction =
      actions["Armature.001|mixamo.com|Layer0.003"] ??
      actions[names?.[0] ?? ""];

    walkAction?.reset().fadeIn(0.5).play();

    return () => {
      walkAction?.fadeOut(0.5);
    };
  }, [actions, names]);

  // Smooth constant movement
  useFrame((_, delta) => {
    if (group.current) {
      group.current.position.z += walkSpeed * delta;
    }
  });

  return (
    <group ref={group} {...props} position={[0, -1, -20]} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
        </group>
        <skinnedMesh
          name="material001"
          geometry={nodes.material001.geometry}
          material={materials["Material.001"]}
          skeleton={nodes.material001.skeleton}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/me-ransformed.glb");

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

interface ModelProps {
  xPosition?: number;
  zOffset?: number;
  animationDelay?: number;
}

export function Model({
  xPosition = 0,
  zOffset = 0,
  animationDelay = 0,
  ...props
}: ModelProps) {
  const group = React.useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/me-ransformed.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as unknown as GLTFResult;
  const { actions, names } = useAnimations(animations, group);

  const walkSpeed = 2;
  const startZ = -20 - zOffset;
  // const resetZ = -25;
  const maxZ = 5;

  useEffect(() => {
    const walkAction =
      actions["Armature.001|mixamo.com|Layer0.003"] ??
      actions[names?.[0] ?? ""];

    if (walkAction) {
      walkAction.reset();
      walkAction.time = animationDelay;
      walkAction.fadeIn(0.5).play();
    }

    return () => {
      walkAction?.fadeOut(0.5);
    };
  }, [actions, names, animationDelay]);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.position.z += walkSpeed * delta;

      if (group.current.position.z > maxZ) {
        group.current.position.z = startZ;
      }
    }
  });

  return (
    <group
      ref={group}
      {...props}
      position={[xPosition, -1, startZ]}
      dispose={null}
    >
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

export function ModelCrowd({ count = 100 }: { count?: number }) {
  const instances = React.useMemo(() => {
    const items = [];
    const spreadX = 80;
    const maxZOffset = 15;

    for (let i = 0; i < count; i++) {
      const xPosition = (i / (count - 1)) * spreadX - spreadX / 2;
      const zOffset = Math.random() * maxZOffset;
      const animationDelay = Math.random() * 2;

      items.push({
        key: i,
        xPosition,
        zOffset,
        animationDelay,
      });
    }
    return items;
  }, [count]);

  return (
    <group>
      {instances.map((instance) => (
        <Model
          key={instance.key}
          xPosition={instance.xPosition}
          zOffset={instance.zOffset}
          animationDelay={instance.animationDelay}
        />
      ))}
    </group>
  );
}

useGLTF.preload("/models/me-ransformed.glb");

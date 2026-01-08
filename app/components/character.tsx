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

export function Model({ xPosition = 0, zOffset = 0, ...props }: ModelProps) {
  const group = React.useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/me-transformed.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as unknown as GLTFResult;
  const { actions, names } = useAnimations(animations, group);
  const [dance, setDance] = React.useState(false);

  const walkSpeed = 2;
  const startZ = -20 - zOffset;
  const maxZ = 5;

  useEffect(() => {
    const danceInterval = setInterval(() => {
      if (!dance && Math.random() < 0.1) {
        setDance(true);
      }
    }, 3000);

    return () => clearInterval(danceInterval);
  }, [dance]);

  useEffect(() => {
    if (!dance) return;

    const stopDanceTimeout = setTimeout(
      () => {
        if (Math.random() < 0.3) {
          setDance(false);
        }
      },
      2000 + Math.random() * 1000
    );

    return () => clearTimeout(stopDanceTimeout);
  }, [dance]);

  useEffect(() => {
    const walkAction =
      actions["Armature.001|mixamo.com|Layer0.003"] ??
      actions[names?.[0] ?? ""];

    const danceAction =
      actions["Armature.001|mixamo.com|Layer0.004"] ??
      actions[names?.[0] ?? ""];

    if (!walkAction || !danceAction) return;

    (dance ? danceAction : walkAction).reset().fadeIn(0.5).play();

    return () => {
      (dance ? danceAction : walkAction).fadeOut(0.5);
    };
  }, [actions, names, dance]);

  useFrame((_, delta) => {
    if (group.current && !dance) {
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

      items.push({
        key: i,
        xPosition,
        zOffset,
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
        />
      ))}
    </group>
  );
}

useGLTF.preload("/models/me-transformed.glb");

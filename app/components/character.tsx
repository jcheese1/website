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
  scale?: number;
}

export function Model({
  xPosition = 0,
  zOffset = 0,
  scale = 1,
  ...props
}: ModelProps) {
  const group = React.useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/me-transformed.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as unknown as GLTFResult;
  const { actions, names } = useAnimations(animations, group);
  const [animation, setCurrentAnimation] = React.useState<
    "Walk" | "Break_Dance" | "Wave"
  >("Walk");

  const walkSpeed = 0.8;
  const startZ = -10 - zOffset;

  const maxZ = 8.5;

  const isWalking = animation === "Walk";

  useEffect(() => {
    const danceInterval = setInterval(() => {
      if (isWalking && Math.random() < 0.1) {
        setCurrentAnimation("Break_Dance");
      }
    }, 3000);

    return () => clearInterval(danceInterval);
  }, [isWalking]);

  useEffect(() => {
    if (isWalking) return;

    const stopAnimationTimeout = setTimeout(
      () => {
        if (Math.random() > 0.7) return;
        setCurrentAnimation("Walk");
      },
      2000 + Math.random() * 1000
    );

    return () => clearTimeout(stopAnimationTimeout);
  }, [isWalking, animation]);

  useEffect(() => {
    const currentAnimation = actions[animation] ?? actions[names?.[0] ?? ""];

    if (!currentAnimation) return;

    currentAnimation.reset().fadeIn(0.5).play();

    return () => {
      currentAnimation.fadeOut(0.5);
    };
  }, [actions, names, animation]);

  useFrame((_, delta) => {
    if (group.current && isWalking) {
      group.current.position.z += walkSpeed * delta;

      if (group.current.position.z > maxZ) {
        group.current.position.z = startZ;
      }
    }
  });

  return (
    <group
      ref={group}
      position={[xPosition, -1, startZ]}
      dispose={null}
      scale={scale}
      {...props}
    >
      {/* hitbox */}
      <mesh
        position={[0, 0.5, 0]}
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          setCurrentAnimation(animation === "Wave" ? "Walk" : "Wave");
        }}
      >
        <boxGeometry args={[0.5, 0.7, 0.5]} />
      </mesh>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
        </group>
        <skinnedMesh
          raycast={() => null}
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

export function ModelCrowd({ count }: { count: number }) {
  const instances = React.useMemo(() => {
    const items = [];
    const spreadX = 18;
    const maxZOffset = 10;

    for (let i = 0; i < count; i++) {
      const xPosition = (i / (count - 1)) * spreadX - spreadX / 2;
      const zOffset = Math.random() * maxZOffset;
      const scale = Math.random() * 0.5 + 0.7;

      items.push({
        key: i,
        xPosition,
        zOffset,
        scale,
      });
    }
    return items;
  }, [count]);

  return (
    <group position={[0, 1.2, 0]}>
      {instances.map((instance) => (
        <Model
          key={instance.key}
          xPosition={instance.xPosition}
          zOffset={instance.zOffset}
          scale={instance.scale}
        />
      ))}
    </group>
  );
}

useGLTF.preload("/models/me-transformed.glb");

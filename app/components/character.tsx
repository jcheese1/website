import type * as THREE from "three";
import type { GLTF } from "three-stdlib";

import { useAnimations, useCursor, useGLTF } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import { SkeletonUtils } from "three-stdlib";

import { hitboxGeometry } from "~/hitbox";

type ActionName = "Walk" | "Break_Dance" | "Wave";

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

const WALK_SPEED = 0.8;
const MAX_Z = 8.5;

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

  const startZ = -10 - zOffset;

  const isWalking = animation === "Walk";

  const [hovered, setHovered] = useState(false);

  useCursor(hovered);

  useEffect(() => {
    if (!isWalking) {
      const stopAnimationTimeout = setTimeout(
        () => {
          if (Math.random() > 0.7) return;
          setCurrentAnimation("Walk");
        },
        2000 + Math.random() * 1000
      );
      return () => clearTimeout(stopAnimationTimeout);
    }

    const danceInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        setCurrentAnimation("Break_Dance");
      }
    }, 3000);

    return () => clearInterval(danceInterval);
  }, [isWalking]);

  useEffect(() => {
    const currentAnimation = actions[animation] ?? actions[names?.[0] ?? ""];

    if (!currentAnimation) return;

    currentAnimation.reset().fadeIn(0.5).play();

    return () => {
      currentAnimation.fadeOut(0.5);
    };
  }, [actions, names, animation]);

  useFrame((_, delta) => {
    if (!group.current || !isWalking) return;
    group.current.position.z += WALK_SPEED * delta;

    if (group.current.position.z > MAX_Z) {
      group.current.position.z = startZ;
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
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          setCurrentAnimation(animation === "Wave" ? "Walk" : "Wave");
        }}
      >
        <primitive object={hitboxGeometry} />
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

useGLTF.preload("/models/me-transformed.glb");

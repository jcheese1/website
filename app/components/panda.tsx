import type * as THREE from "three";
import type { GLTF } from "three-stdlib";

import { useAnimations, useCursor, useGLTF } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import { SkeletonUtils } from "three-stdlib";

import { hitboxGeometry } from "~/hitbox";

type ActionName = "Hiphop_Dance" | "Run";

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

const WALK_SPEED = 3;
const MAX_Z = 8.5;

export function Model({
  xPosition = 0,
  zOffset = 0,
  scale = 1,
  ...props
}: ModelProps) {
  const group = React.useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/panda-transformed.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as unknown as GLTFResult;
  const { actions, names } = useAnimations(animations, group);
  const [animation, setCurrentAnimation] = React.useState<ActionName>("Run");

  const startZ = -10 - zOffset;

  const isRunning = animation === "Run";

  const [hovered, setHovered] = useState(false);

  useCursor(hovered);

  useEffect(() => {
    const currentAnimation = actions[animation] ?? actions[names?.[0] ?? ""];

    if (!currentAnimation) return;

    currentAnimation.reset().fadeIn(0.5).play();

    return () => {
      currentAnimation.fadeOut(0.5);
    };
  }, [actions, names, animation]);

  useFrame((_, delta) => {
    if (!group.current || !isRunning) return;
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
          setCurrentAnimation(animation === "Run" ? "Hiphop_Dance" : "Run");
        }}
        geometry={hitboxGeometry}
      />
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={1}>
          <primitive object={nodes.mixamorigHips} />
        </group>
        <skinnedMesh
          raycast={() => null}
          name="material001"
          geometry={nodes.material001.geometry}
          material={materials["Material.001"]}
          skeleton={nodes.material001.skeleton}
          rotation={[Math.PI / 2, 0, 0]}
          scale={1}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/panda-transformed.glb");

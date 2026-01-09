import { useMemo } from "react";

import { Model as MonkeyModel } from "./blue-monkey";
import { Model as CharacterModel } from "./character";
import { Model as PandaModel } from "./panda";

export function Crowd() {
  const instances = useMemo(() => {
    const items: Array<{
      key: number;
      type: "character" | "panda" | "monkey";
      xPosition: number;
      zOffset: number;
      scale: number;
    }> = [];

    const spreadX = 18;
    const maxZOffset = 10;
    const totalCount = 30;

    const xPositions: number[] = [];
    for (let i = 0; i < totalCount; i++) {
      xPositions.push((i / (totalCount - 1)) * spreadX - spreadX / 2);
    }

    xPositions.sort(() => Math.random() - 0.5);

    const types: Array<"character" | "panda" | "monkey"> = [
      ...Array(22).fill("character"),
      ...Array(4).fill("panda"),
      ...Array(4).fill("monkey"),
    ];

    types.sort(() => Math.random() - 0.5);

    for (let i = 0; i < totalCount; i++) {
      items.push({
        key: i,
        type: types[i] ?? "character",
        xPosition: xPositions[i] ?? 0,
        zOffset: Math.random() * maxZOffset,
        scale: Math.random() * 0.5 + 0.7,
      });
    }

    return items;
  }, []);

  return (
    <group position={[0, 1.1, 0]}>
      {instances.map((instance) => {
        const props = {
          key: instance.key,
          xPosition: instance.xPosition,
          zOffset: instance.zOffset,
          scale: instance.scale,
        };

        if (instance.type === "character") {
          return <CharacterModel {...props} />;
        }
        if (instance.type === "panda") {
          return <PandaModel {...props} />;
        }
        return <MonkeyModel {...props} />;
      })}
    </group>
  );
}

import type { Readable, Writable } from "svelte/store";
import type { BoidAttrs, Detractor } from "./lib/boid-engine/types";
import {
  defaultAttrs,
  type createBoidSimulation,
} from "./lib/boid-engine/main";
import { derived, writable } from "svelte/store";
import { height, width } from "./game";
import { getRand } from "./lib/util";
import type { Species } from "./lib/presetBoids";

export const cursorPos = writable<{ x: number; y: number } | undefined>();
export const boidSim = writable<ReturnType<typeof createBoidSimulation>>();
export const currentBoidType = writable<Partial<BoidAttrs> | Species>(
  defaultAttrs
);

export const addBoids = derived(
  [boidSim, width, height],
  ([$boidSim, $width, $height]) => {
    if (!$boidSim) return () => {};

    return (boidType: Partial<BoidAttrs>, numToAdd: number = 1) => {
      [...Array(numToAdd)].forEach(() =>
        $boidSim.addBoid(
          { x: $width / 2, y: $height / 2 },
          { x: getRand(10), y: getRand(10) },
          boidType
        )
      );
    };
  }
);

export const toggleForceSmoothing = derived(boidSim, ($boidSim) => {
  if (!$boidSim) return () => {};

  let on = false;
  return () => {
    on = !on;
    $boidSim.updateBoids({ forceSmoothing: on ? 100 : 0 });
  };
}) as Readable<() => void>;

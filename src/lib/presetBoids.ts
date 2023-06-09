import type { Boid } from "./boid-engine/main";

type BoidPreset = Boid;

/**
 * Slow moving, high gravitation boids that carry much intertia
 */
export const GrouperSpecies1: BoidAttrs = {
  mass: 0.08,
  targetV: 5,
  targetVCorrectionFactor: 0.01,
  sightRadius: 50,
  sightPeripheralDeg: 360,
  separationDistance: 10,
  separationFactor: 0.1,
  gravitationFactor: 2,
  alignmentFactor: 0.05,
  forceSmoothing: 20,
  color: "hsl(127.53137947896208, 100%, 50%)",
};

export const LilBuggers: BoidAttrs = {
  mass: 0.08,
  targetV: 5,
  targetVCorrectionFactor: 5,
  sightRadius: 85.74437378731018,
  sightPeripheralDeg: 130,
  separationDistance: 200,
  separationFactor: 2,
  gravitationFactor: 0.1,
  alignmentFactor: 0.5,
  forceSmoothing: 20,
  color: "hsl(85.1684347148621, 100%, 50%)",
};

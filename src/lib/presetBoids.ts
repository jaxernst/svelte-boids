import type { BoidAttrs } from "./boid-engine/types";

/**
 * Slow moving, high gravitation boids that carry much intertia
 */
export const GrouperSpecies1: Partial<BoidAttrs> = {
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

export const LilBuggers: Partial<BoidAttrs> = {
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

export const BlueAngels: Partial<BoidAttrs> = {
  mass: 0.08,
  targetV: 300,
  targetVCorrectionFactor: 0.01,
  sightRadius: 50,
  sightPeripheralDeg: 130,
  separationDistance: 10,
  separationFactor: 0.1,
  gravitationFactor: 0.1,
  alignmentFactor: 0.5,
  forceSmoothing: 20,
  color: "hsl(600.8582262941281, 100%, 50%)",
};

export const SlowArrows = {
  mass: 0.7154290532845526,
  targetV: 5,
  targetVCorrectionFactor: 5,
  sightRadius: 50,
  sightPeripheralDeg: 360,
  separationDistance: 200,
  separationFactor: 0.1,
  gravitationFactor: 2,
  alignmentFactor: 0.5,
  forceSmoothing: 20,
  color: "hsl(348.3409003520865, 100%, 50%)",
};

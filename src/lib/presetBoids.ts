import type { BoidAttrs } from "./boid-engine/types";

export type Species = Partial<BoidAttrs> & { name: string };

export const RedFighters = {
  name: "RedFighters",
  mass: 0.3,
  targetV: 140,
  maxV: 600,
  targetVCorrectionFactor: 1,
  sightRadius: 200,
  sightPeripheralDeg: 200,
  separationDistance: 50,
  separationFactor: 1,
  gravitationFactor: 0.9,
  alignmentFactor: 0.08,
  forceSmoothing: 20,
  randomImpulses: [],
  color: "hsl(0, 100%, 50%)",
};

/**
 * Slow moving, high gravitation boids that carry much intertia
 */
export const GrouperSpecies1 = {
  name: "GrouperSpecies1",
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

export const LilBuggers = {
  name: "LilBuggers",
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

export const BlueAngels = {
  name: "BlueAngels",
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
  name: "SlowArrows",
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
  color: "hsl(248.3409003520865, 100%, 50%)",
};

export const Juggernauts = {
  name: "Juggernauts",
  mass: 0.8336308612212452,
  targetV: 248.12441492222493,
  targetVCorrectionFactor: 0.39702938154480266,
  sightRadius: 181.04091375795372,
  sightPeripheralDeg: 143.64686510292444,
  separationDistance: 86.3372226830577,
  separationFactor: 0.4061173962322797,
  gravitationFactor: 0.46736636981965757,
  alignmentFactor: 0.18187617700290507,
  forceSmoothing: 31.14850873946981,
  color: "hsl(30.151485712160751, 100%, 50%)",
};

const AtomBoid = {
  name: "AtomBoid",
  mass: 0.08,
  targetV: 5,
  targetVCorrectionFactor: 0.3476252575658127,
  sightRadius: 196.6367335331217,
  sightPeripheralDeg: 218.38755725985425,
  separationDistance: 67.8248306069898,
  separationFactor: 1.442214435613763,
  gravitationFactor: 0.8146509495119941,
  alignmentFactor: 0.5,
  forceSmoothing: 0,
  color: "hsl(109.55667502775175, 100%, 50%)",
};

export const BoidSpecies: Species[] = [
  RedFighters,
  Juggernauts,
  SlowArrows,
  BlueAngels,
  LilBuggers,
  GrouperSpecies1,
  AtomBoid,
];

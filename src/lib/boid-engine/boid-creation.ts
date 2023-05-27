import type { BoidAttrs } from "./types";

type MinMax<T> = {
  [K in keyof T]: [T[K], T[K]];
};

const attributeRanges: MinMax<Partial<BoidAttrs>> = {
  mass: [0.0001, 0.01],
  targetV: [5, 300],
  targetVCorrectionStrength: [0.001, 0.1],
  sightRadius: [50, 500],
  sightPeripheralDeg: [80, 360],
  separationDistance: [10, 200],
  separationFactor: [0.1, 1.5],
  gravitationFactor: [0.1, 2.5],
  alignmentFactor: [0.05, 0.3],
  forceSmoothing: [1, 25],
};

export const randomizeBoidType = () => {
  const randomizedValues: Partial<BoidAttrs> = {};

  for (const key in attributeRanges) {
    if (attributeRanges.hasOwnProperty(key)) {
      const [min, max] = attributeRanges[key];
      const randomValue = Math.random() * (max - min) + min;
      randomizedValues[key] = randomValue;
    }
  }

  return {
    ...randomizedValues,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
  };
};

import type { BoidAttrs } from "./types";

type MinMax<T> = {
  [K in keyof T]: [T[K], T[K]];
};

const attributeRanges: MinMax<Partial<BoidAttrs>> = {
  mass: [1e-5, 0.1e-3],
  targetV: [5, 400],
  targetVCorrectionFactor: [0.05, 5],
  sightRadius: [50, 500],
  sightPeripheralDeg: [80, 360],
  separationDistance: [10, 200],
  separationFactor: [0.1, 2],
  gravitationFactor: [0.1, 2],
  alignmentFactor: [0.05, 1.5],
  forceSmoothing: [10, 100],
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

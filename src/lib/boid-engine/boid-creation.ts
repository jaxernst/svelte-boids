import type { BoidAttrs } from "./types";

type MinMax<T> = {
  [K in keyof T]: [T[K], T[K]];
};

const attributeRanges: MinMax<Partial<BoidAttrs>> = {
  mass: [0.5e-5, 0.1e-3],
  targetV: [5, 500],
  targetVCorrectionFactor: [0.05, 5],
  sightRadius: [50, 500],
  sightPeripheralDeg: [80, 360],
  separationDistance: [10, 250],
  separationFactor: [0.1, 5],
  gravitationFactor: [0.1, 2],
  alignmentFactor: [0.05, 2],
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

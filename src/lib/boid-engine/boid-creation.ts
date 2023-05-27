import type { BoidAttrs } from "./types";

type MinMax<T> = {
  [K in keyof T]: [T[K], T[K]];
};

const attributeRanges: MinMax<Partial<BoidAttrs>> = {
  mass: [0.00001, 0.001],
  maxV: [50, 400],
  minV: [2, 150],
  sightRadius: [40, 700],
  sightPeripheralDeg: [30, 360],
  separationDistance: [10, 200],
  separationFactor: [0.8, 1.2],
  gravitationFactor: [0.6, 2.5],
  alignmentFactor: [0.005, 0.3],
  frictionCoefficient: [0.97, 0.9999],
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

import type { BoidAttrs } from "./types";

export type AttributeRange = {
  min: number;
  max: number;
  mean?: number;
  stdev?: number;
  skew?: number;
};

type AttributeProbabilityDistribution<T> = {
  [K in keyof T]: AttributeRange;
};

const attributeRanges: AttributeProbabilityDistribution<Partial<BoidAttrs>> = {
  mass: { min: 0.08, max: 1, mean: 0.3, stdev: 0.3, skew: 0 },
  targetV: { min: 5, max: 400, mean: 150, stdev: 100, skew: 0 },
  targetVCorrectionFactor: {
    min: 0.01,
    max: 5,
    mean: 0.5,
    stdev: 0.5,
    skew: 0,
  },
  sightRadius: { min: 50, max: 500, mean: 276, stdev: 100, skew: 0 },
  sightPeripheralDeg: { min: 130, max: 360, mean: 200, stdev: 70, skew: 0 },
  separationDistance: { min: 10, max: 200, mean: 100, stdev: 25, skew: 0 },
  separationFactor: { min: 0.01, max: 2, mean: 1, stdev: 0.5, skew: 0 },
  gravitationFactor: { min: 0.01, max: 2, mean: 1, stdev: 0.5, skew: 0 },
  alignmentFactor: { min: 0.05, max: 0.5, mean: 0.1, stdev: 0.05, skew: 0 },
  forceSmoothing: { min: 0, max: 20, mean: 5, stdev: 10, skew: 0 },
};

export const randomizeBoidType = (deviationFactor: number = 3) => {
  const randomizedValues: Partial<BoidAttrs> = {};

  for (const key in attributeRanges) {
    if (attributeRanges.hasOwnProperty(key)) {
      const range = attributeRanges[key];
      const stdev = (range.stdev || 1) * deviationFactor;
      const randomValue = boxMullerRandom(range.mean, stdev, range.skew);
      const scaledRandomValue =
        randomValue * (range.max - range.min) + range.min;

      // Ensure the value stays within the range
      const clampedRandomValue = Math.min(
        range.max,
        Math.max(range.min, scaledRandomValue)
      );

      randomizedValues[key] = clampedRandomValue;
    }
  }

  return {
    ...randomizedValues,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
  };
};

function boxMullerRandom(mean = 0, stdev = 1, skew = 0) {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  // Apply the skew
  if (skew !== 0) {
    num = Math.pow(num, skew);
  }

  // Scale and shift by mean and stdev
  num = num * stdev + mean;

  return num;
}

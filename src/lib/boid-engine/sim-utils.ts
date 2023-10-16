import type { Boid, Vec2D } from "./types";
import {
  distance,
  div,
  dot,
  magnitude,
  mul,
  norm,
  subtract,
} from "./vectorMath";

export function makeMovingAverage(
  initVal: Vec2D,
  period: number = 30
): (v: Vec2D) => Vec2D {
  let vals = [];

  // Takes in the current vector, updates the moving average, then returns the moving average
  return (v: Vec2D) => {
    vals.push(v);
    const sum = vals.slice(-period).reduce((acc: Vec2D, cur: Vec2D) => {
      return [acc[0] + cur[0], acc[1] + cur[1]];
    }, initVal);

    return [
      sum[0] / Math.min(vals.length, period),
      sum[1] / Math.min(vals.length, period),
    ] as Vec2D;
  };
}

export const RandomForceGenerator = (
  chance: number,
  strength: number,
  movingAveragePeriod = 100
) => {
  const applyMovingAverage = makeMovingAverage([0, 0], movingAveragePeriod);
  const generateRandom: () => Vec2D = () =>
    Math.random() < chance
      ? [randRange(-strength, strength), randRange(-strength, strength)]
      : [0, 0];

  return () => {
    return applyMovingAverage(generateRandom());
  };
};

export function limitSpeed(
  boid: Boid,
  speedLimit: number,
  speedFloor?: number
) {
  const speed = magnitude(boid.vec.vel);
  if (speed > speedLimit) {
    return mul(div(boid.vec.vel, speed), speedLimit);
  }
  if (speedFloor && speed < speedFloor) {
    return mul(div(boid.vec.vel, speed), speedFloor);
  }
  return boid.vec.vel;
}

export function findBoidsInSight(boid: Boid, others: Boid[]) {
  const bVec = boid.vec;
  const directionNorm = norm(boid.vec.vel);

  const TOO_RAD = Math.PI / 360;
  return others.filter((other) => {
    if (distance(bVec.pos, other.vec.pos) > boid.sightRadius) {
      return false;
    }
    const toOtherNorm = norm(subtract(other.vec.pos, bVec.pos));
    const angleRad = Math.acos(dot(directionNorm, toOtherNorm));
    return angleRad < boid.sightPeripheralDeg * TOO_RAD;
  });
}

export function randRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

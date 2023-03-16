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

export function limitSpeed(boid: Boid) {
  const speed = magnitude(boid.vec.vel);
  if (speed > boid.maxV) {
    return mul(div(boid.vec.vel, speed), boid.maxV);
  }
  if (speed < boid.minV) {
    return mul(div(boid.vec.vel, speed), boid.minV);
  }
  return boid.vec.vel;
}

export function findBoidsInSight(boid: Boid, others: Boid[]) {
  const bVec = boid.vec;
  const directionNorm = norm(boid.vec.vel);

  let output = others
    .filter((other) => {
      return distance(bVec.pos, other.vec.pos) < boid.sightRadius;
    })
    .filter((other: Boid) => {
      const toOtherNorm = norm(subtract(other.vec.pos, bVec.pos));
      const angleRad = Math.acos(dot(directionNorm, toOtherNorm));
      return angleRad < ((boid.sightPeripheralDeg / 2) * Math.PI) / 180;
    });

  return output;
}

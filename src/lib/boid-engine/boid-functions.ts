import { drawPoint } from "./canvas-drawers";
import type { Boid, Vec2D } from "./types";
import {
  distance,
  dot,
  mul,
  norm,
  subtract,
  magnitude,
  add,
} from "./vectorMath";

/** Forcing / boid perception functions */

// Make the boid align with the flock
export function align(
  boid: Boid,
  others: Boid[],
  ctx: CanvasRenderingContext2D
) {
  let vSum = [0, 0];
  for (let other of others) {
    vSum[0] += other.vec.vel[0];
    vSum[1] += other.vec.vel[1];
  }

  // Average velocity of other boids
  const vAvg = [vSum[0] / others.length, vSum[1] / others.length] as Vec2D;

  return subtract(vAvg, boid.vec.vel);
}

// Gravitate toward the center (average position) of other boids
export function gravitate(boid: Boid, others: Boid[], ctx) {
  const pSum = [0, 0];
  for (let other of others) {
    pSum[0] += other.vec.pos[0];
    pSum[1] += other.vec.pos[1];
  }
  const pAvg = [pSum[0] / others.length, pSum[1] / others.length] as Vec2D;

  // Draw cg
  drawPoint(...pAvg, ctx);

  return subtract(pAvg, boid.vec.pos);
}

// Separate away from others after getting too close (closer than the separationDistance)
export function separate(
  boid: Boid,
  others: Boid[],
  refDist: number,
  ctx?: CanvasRenderingContext2D
): Vec2D {
  const pSum = [0, 0];
  for (let other of others) {
    pSum[0] += other.vec.pos[0];
    pSum[1] += other.vec.pos[1];
  }
  const pAvg = [pSum[0] / others.length, pSum[1] / others.length] as Vec2D;
  const dist = distance(boid.vec.pos, pAvg);
  if (dist > boid.separationDistance) return [0, 0];

  const vAway = norm(subtract(boid.vec.pos, pAvg));
  return mul(vAway, refDist / (dist + 0.1));
}

export function combinedBoidRules(
  boid: Boid,
  others: Boid[],
  ctx?: CanvasRenderingContext2D,
  refDist?: number
): Vec2D {
  const pSum = [0, 0];
  const vSum = [0, 0];
  for (let other of others) {
    pSum[0] += other.vec.pos[0];
    pSum[1] += other.vec.pos[1];
    vSum[0] += other.vec.vel[0];
    vSum[1] += other.vec.vel[1];
  }

  const pAvg = [pSum[0] / others.length, pSum[1] / others.length] as Vec2D;
  const vAvg = [vSum[0] / others.length, vSum[1] / others.length] as Vec2D;

  // Draw cg
  drawPoint(...pAvg, ctx);

  // Sep
  let sepResult;
  const dist = distance(boid.vec.pos, pAvg);
  if (dist > boid.separationDistance) {
    sepResult = [0, 0];
  } else {
    const vAway = norm(subtract(boid.vec.pos, pAvg));
    sepResult = mul(vAway, refDist / (dist + 0.1));
  }

  const gravResult = subtract(pAvg, boid.vec.pos);
  const alignResult = subtract(vAvg, boid.vec.vel);
  const gForce = mul(gravResult, boid.gravitationFactor);
  const aForce = mul(alignResult, boid.alignmentFactor);
  const sForce = mul(sepResult, boid.separationFactor);

  return add(gForce, aForce, sForce);
}

// Run away from the point
export function detract(
  boid: Boid,
  point: [number, number],
  strength: number,
  minDistance: number
): Vec2D {
  if (distance(boid.vec.pos, point) > minDistance) return [0, 0];

  const diff = subtract(boid.vec.pos, point);
  return mul(diff, strength / (magnitude(diff) ** 2 + 1));
}

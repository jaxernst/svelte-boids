import { align, detract, gravitate, separate } from "./boid-functions";
import { canvasArrow, drawPoint } from "./canvas-drawers";
import type { Boid, BoidAttrs, BoidVec, Vec2D } from "./types";
import { findBoidsInSight, limitSpeed, makeMovingAverage } from "./sim-utils";
import { add, magnitude, mul } from "./vectorMath";

const boidVec: BoidVec = {
  pos: [0, 0],
  vel: [0, 0],
  accel: [0, 0],
};

const defaultAttrs = {
  mass: 1,
  maxV: 700,
  minV: 58,
  sightRadius: 230,
  sightPeripheralDeg: 160,
  separationDistance: 54,
  gravitationDistance: 150,
  separationFactor: 1,
  gravitationFactor: 0.81,
  alignmentFactor: 0.09,
  frictionCoefficient: 0.988,
  forceSmoothing: 20,
};

const defaultBoid = {
  vec: boidVec,
  ...defaultAttrs,
};

const cursorSettings = {
  detractorDistance: 100,
  detractorStrength: 50000,
};

// Main simulation loop updater
function update(
  boids: Boid[],
  dt: number,
  board: { h: number; w: number },
  cursor: Vec2D | undefined,
  ctx
) {
  let i = 0;
  for (let boid of boids) {
    let vec = boid.vec;
    let others = [...boids];
    others.splice(i, 1); // Remove current boid index
    others = findBoidsInSight(boid, others);

    let force = [0, 0] as Vec2D;
    if (others.length > 0) {
      const gForce = mul(gravitate(boid, others, ctx), boid.gravitationFactor);
      const aForce = mul(align(boid, others, ctx), boid.alignmentFactor);
      const sForce = mul(
        separate(boid, others, board.w),
        boid.separationFactor
      );

      /*console.log(
        "g:",
        magnitude(gForce),
        "s:",
        magnitude(sForce),
        "a:",
        magnitude(aForce)
      ); */

      force = add(force, gForce, aForce, sForce);
    }

    if (boid.forceSmoothing > 0 && boid.forceMovingAverage) {
      let x = force[0];
      force = boid.forceMovingAverage(force);
    }

    // If cursor position, run away from the cursor
    if (cursor) {
      force = add(
        force,
        detract(
          boid,
          cursor,
          cursorSettings.detractorStrength,
          cursorSettings.detractorDistance
        )
      );
    }

    vec.accel[0] = force[0] / (boid.mass + 0.01);
    vec.accel[1] = force[1] / (boid.mass + 0.01);

    vec.vel[0] += vec.accel[0] * dt;
    vec.vel[1] += vec.accel[1] * dt;

    vec.vel[0] *= boid.frictionCoefficient;
    vec.vel[1] *= boid.frictionCoefficient;
    vec.vel = limitSpeed(boid);

    vec.pos[0] += vec.vel[0] * dt;
    vec.pos[1] += vec.vel[1] * dt;

    // Enforce boundaries
    if (vec.pos[0] > board.w) vec.pos[0] = 0;
    if (vec.pos[0] < 0) vec.pos[0] = board.w;
    if (vec.pos[1] > board.h) vec.pos[1] = 0;
    if (vec.pos[1] < 0) vec.pos[1] = board.h;

    boid.vec = vec;
    i++;
  }

  return boids;
}

export function createBoidSimulation({
  numBoids,
  startPos,
  startVel,
  boardSize,
  boidType,
}: {
  numBoids: number;
  startPos: [() => number, () => number];
  startVel: [() => number, () => number];
  boardSize: {
    h: number;
    w: number;
  };
  boidType?: Partial<BoidAttrs>;
}) {
  let boids = [...Array(numBoids)].map(() => ({
    ...defaultBoid,
    ...boidType,
    vec: {
      ...boidVec,
      pos: [startPos[0](), startPos[1]()],
      vel: [startVel[0](), startVel[1]()],
    },
  })) as Boid[];

  boids = boids.map((boid) => {
    boid.forceMovingAverage = makeMovingAverage(
      [0, 0],
      (boidType ?? defaultBoid).forceSmoothing
    );
    return boid;
  });

  let addBoidQueue: (() => Boid)[] = [];
  let updateBoidQueue: ((
    attrs: Partial<BoidAttrs>,
    atIndex: number
  ) => Boid)[] = [];
  let board = boardSize;

  return {
    update: (
      dt: number,
      cursor: Vec2D,
      ctx: {
        htmlContext?: CanvasRenderingContext2D;
        visibleBoard?: { w: number; h: number };
      }
    ) => {
      // Add boids from the queue
      for (let addBoid of addBoidQueue) {
        boids = [...boids, addBoid()];
      }

      // Apply queued boid 'behavoir' update
      for (let updateBoid of updateBoidQueue) {
        boids = boids.map((boid, i) => updateBoid(boid, i));
      }

      addBoidQueue = [];
      boids = update(
        boids,
        dt,
        ctx.visibleBoard ?? board,
        cursor,
        ctx.htmlContext
      );
      return boids;
    },
    resizeBoard: (newBoard: { h: number; w: number }) => {
      board = newBoard;
    },
    addBoid: (
      startPos: { x: number; y: number },
      startVel: { x: number; y: number }
    ) => {
      const i = boids.length;

      addBoidQueue.push(() => ({
        ...defaultAttrs,
        vec: {
          ...boidVec,
          pos: [startPos.x, startPos.y],
          vel: [startVel.x, startVel.y],
        },
      }));
      return i;
    },
    updateBoids: (newAttrs: Partial<BoidAttrs>, atIndices?: number[]) => {
      console.log("Udating");
      if (!atIndices) {
        atIndices = Array.from({ length: boids.length }, (_, i) => i);
      }
      updateBoidQueue.push((boid: Boid, boidIndex: number) => {
        if (atIndices.includes(boidIndex)) {
          return { ...boid, ...newAttrs };
        }
        return boid;
      });
    },
  };
}

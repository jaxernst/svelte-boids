import { align, detract, gravitate, separate } from "./boid-functions";
import { canvasArrow, drawPoint } from "./canvas-drawers";
import type { Boid, BoidAttrs, BoidVec, Detractor, Vec2D } from "./types";
import { findBoidsInSight, limitSpeed, makeMovingAverage } from "./sim-utils";
import { add, magnitude, mul } from "./vectorMath";

const boidVec: BoidVec = {
  pos: [0, 0],
  vel: [0, 0],
  accel: [0, 0],
};

export const defaultAttrs: BoidAttrs = {
  mass: 0.005,
  maxV: 650,
  minV: 58,
  sightRadius: 210,
  sightPeripheralDeg: 160,
  separationDistance: 50,
  separationFactor: 1.05,
  gravitationFactor: 0.79,
  alignmentFactor: 0.098,
  frictionCoefficient: 0.989,
  forceSmoothing: 20,
  randomImpulses: [],
  color: "hsl(0, 100%, 50%)",
};

const defaultBoid = {
  vec: boidVec,
  ...defaultAttrs,
};

let defaultDetractorDistance = 100;
let defaultDetractorStrength = 50000;

// Main simulation loop updater
function updateFrame(
  boids: Boid[],
  dt: number,
  board: { h: number; w: number },
  detractors: Detractor[] = [],
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

    detractors.forEach((detractor) => {
      force = add(
        force,
        detract(
          boid,
          [detractor.x, detractor.y],
          detractor.strength ? detractor.strength : defaultDetractorStrength,
          detractor.distance ? detractor.distance : defaultDetractorDistance
        )
      );
    });

    if (boid.randomImpulses.length > 0) {
      boid.randomImpulses.forEach((impulse) => (force = add(force, impulse())));
    }

    vec.accel[0] = (force[0] * dt) / (boid.mass + 0.01);
    vec.accel[1] = (force[1] * dt) / (boid.mass + 0.01);

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
  let board = boardSize;

  if (boardSize.w < 700) {
    defaultBoid.maxV = 550;
    defaultBoid.frictionCoefficient = 0.982;
    defaultDetractorDistance = 75;
  }

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
    // Currently not using because the generator significantly impacts performance
    // boid.randomImpulses = [RandomForceGenerator(0.00005, 20000, 1000)];
    boid.forceMovingAverage = makeMovingAverage(
      [0, 0],
      (boidType ?? defaultBoid).forceSmoothing
    );
    return boid;
  });

  // Add new boids to the sim
  let addBoidQueue: (() => Boid)[] = [];
  // Update existing boids in the sim
  let updateBoidQueue: ((
    attrs: Partial<BoidAttrs>,
    atIndex: number
  ) => Boid)[] = [];

  let detractors: Detractor[] = [];

  return {
    reset: () => {
      boids = [];
      detractors = [];
    },
    update: (
      dt: number,
      ctx: {
        htmlContext?: CanvasRenderingContext2D;
        visibleBoard?: { w: number; h: number };
      },
      frameDetractors?: Detractor[]
    ) => {
      // Add boids from the queue
      for (let addBoid of addBoidQueue) {
        boids = [...boids, addBoid()];
      }
      addBoidQueue = [];

      // Apply queued boid 'behavoir' updates
      for (let updateBoid of updateBoidQueue) {
        boids = boids.map((boid, i) => updateBoid(boid, i));
      }

      boids = updateFrame(
        boids,
        dt,
        ctx.visibleBoard ?? board,
        [...detractors, ...frameDetractors],
        ctx.htmlContext
      );

      return boids;
    },
    resizeBoard: (newBoard: { h: number; w: number }) => {
      board = newBoard;
    },
    addBoid: (
      startPos: { x: number; y: number },
      startVel: { x: number; y: number },
      boidType?: Partial<BoidAttrs>
    ) => {
      const i = boids.length;

      addBoidQueue.push(() => ({
        ...defaultAttrs,
        ...boidType,
        vec: {
          ...boidVec,
          pos: [startPos.x, startPos.y],
          vel: [startVel.x, startVel.y],
        },
      }));
      return i;
    },
    addDetractor: (detractor: Detractor) => {
      detractors.push(detractor);
    },
    updateBoids: (newAttrs: Partial<BoidAttrs>, atIndices?: number[]) => {
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
    getDetractors: () => detractors,
  };
}

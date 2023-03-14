export type Vec2D = [number, number];
export type BoidVec = { pos: Vec2D; vel: Vec2D; accel: Vec2D; force: Vec2D };
export type Boid = {
  vec: BoidVec;
  mass: number;
  maxV: number;
  sightRadius: number;
  sightPeripheralDeg: number;
};

export type BoidCanvasDraw = (
  pos: Vec2D,
  vel: Vec2D,
  ctx: CanvasRenderingContext2D
) => {};

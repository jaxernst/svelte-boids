type Vec2D = [number, number];

export const add = (...vecs: Vec2D[]): Vec2D => {
  const out = [0, 0] as Vec2D;
  for (const vec of vecs) {
    out[0] += vec[0];
    out[1] += vec[1];
  }
  return out;
};

export const subtract = (v1: Vec2D, v2: Vec2D): Vec2D => {
  return [v1[0] - v2[0], v1[1] - v2[1]];
};

export const mul = (v1: Vec2D, s: number): Vec2D => {
  return [v1[0] * s, v1[1] * s];
};

export const div = (v1: Vec2D, s: number): Vec2D => {
  return [v1[0] / s, v1[1] / s];
};

export const norm = (v: Vec2D): Vec2D => {
  const mag = magnitude(v);
  if (!mag) return [0, 0];
  return [v[0] / mag, v[1] / mag];
};

export const magnitude = (v: Vec2D): number => {
  return Math.sqrt(v[0] ** 2 + v[1] ** 2);
};

export const distance = (v1: Vec2D, v2: Vec2D) => {
  return magnitude(subtract(v1, v2));
};

export const dot = (v1: Vec2D, v2: Vec2D) => {
  return v1[0] * v2[0] + v1[1] * v2[1];
};

export const averageVectors = (vs: Vec2D[]) => {
  let vSum = vs.reduce((sum, v) => [sum[0] + v[0], sum[1] + v[1]], [0, 0]);
  return [vSum[0] / vs.length, vSum[1] / vs.length] as Vec2D;
};

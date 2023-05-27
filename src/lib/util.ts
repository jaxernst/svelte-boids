export const getRand = (max) =>
  Math.random() * max * (Math.random() < 0.5 ? 1 : -1);

import type { AttributeRange } from "./boid-creation";

export function drawPoint(x, y, ctx: CanvasRenderingContext2D, color?: string) {
  let inverseColor = color;

  if (color) {
    // Extract the HSL values
    let hsl = color.match(/\d+(\.\d+)?/g);

    if (hsl) {
      let h = parseFloat(hsl[0]);
      let s = parseFloat(hsl[1]);
      let l = parseFloat(hsl[2]);

      // Invert the hue
      h = (h + 180) % 360;

      // Build the inverted color
      inverseColor = `hsl(${h}, ${s}%, ${l}%)`;
    }
  } else {
    inverseColor = "hsl(60, 100%, 50%)"; // default color if no color is provided
  }

  ctx.fillStyle = inverseColor;
  ctx.moveTo(x, y);
  ctx.fillRect(x, y, 3, 3);
}

export function canvasArrow(ctx, fromx, fromy, tox, toy, arrowWidth, color) {
  //variables to be used when creating the arrow
  var headlen = 4;
  var angle = Math.atan2(toy - fromy, tox - fromx);

  ctx.save();
  ctx.strokeStyle = color;

  //starting path of the arrow from the start square to the end square
  //and drawing the stroke
  ctx.beginPath();
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.lineWidth = arrowWidth;
  ctx.stroke();

  //starting a new path from the head of the arrow to one of the sides of
  //the point
  ctx.beginPath();
  ctx.moveTo(tox, toy);
  ctx.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 7),
    toy - headlen * Math.sin(angle - Math.PI / 7)
  );

  //path from the side point of the arrow, to the other side point
  ctx.lineTo(
    tox - headlen * Math.cos(angle + Math.PI / 7),
    toy - headlen * Math.sin(angle + Math.PI / 7)
  );

  //path from the side point back to the tip of the arrow, and then
  //again to the opposite side point
  ctx.lineTo(tox, toy);
  ctx.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 7),
    toy - headlen * Math.sin(angle - Math.PI / 7)
  );

  //draws the paths created above
  ctx.stroke();
  ctx.restore();
}

export const MakeBoidDrawer = (size: number) => {
  return (
    pos: [number, number],
    vel: [number, number],
    ctx: CanvasRenderingContext2D,
    color?: string
  ) => {
    const magnitude = Math.hypot(vel[0], vel[1]);
    const angle = Math.atan2(vel[1], vel[0]);

    const length = magnitude / 15;
    const angle120 = (2 * Math.PI) / 3;
    const angle240 = (4 * Math.PI) / 3;

    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    const x1 = pos[0] + length * cosAngle;
    const y1 = pos[1] + length * sinAngle;

    const cosAngle120 = Math.cos(angle + angle120);
    const sinAngle120 = Math.sin(angle + angle120);
    const x2 = pos[0] + size * cosAngle120;
    const y2 = pos[1] + size * sinAngle120;

    const cosAngle240 = Math.cos(angle + angle240);
    const sinAngle240 = Math.sin(angle + angle240);
    const x3 = pos[0] + size * cosAngle240;
    const y3 = pos[1] + size * sinAngle240;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
  };
};

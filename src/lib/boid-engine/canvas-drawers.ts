export function drawPoint(x, y, ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "yellow";
  ctx.moveTo(x, y);
  ctx.fillRect(x, y, 3, 3);
}

export function canvasArrow(ctx, fromx, fromy, tox, toy, arrowWidth, color) {
  //variables to be used when creating the arrow
  var headlen = 4;
  var angle = Math.atan2(toy - fromy, tox - fromx);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.shadowBlur = 100;
  ctx.shadowColor = "black";

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
  return (pos, vel, ctx) => {
    // Calculate the magnitude of the velocity vector
    const magnitude = Math.sqrt(vel[0] ** 2 + vel[1] ** 2);

    // Calculate the angle between the velocity vector and the x-axis
    const angle = Math.atan2(vel[1], vel[0]);

    const length = magnitude * 4;

    // Set the fill color to red
    ctx.fillStyle = "red";

    // Calculate the position of the vertices of the triangle based on the velocity vector
    const x1 = pos[0] + length * Math.cos(angle);
    const y1 = pos[1] + length * Math.sin(angle);
    const x2 = pos[0] + size * Math.cos(angle + (2 * Math.PI) / 3);
    const y2 = pos[1] + size * Math.sin(angle + (2 * Math.PI) / 3);
    const x3 = pos[0] + size * Math.cos(angle + (4 * Math.PI) / 3);
    const y3 = pos[1] + size * Math.sin(angle + (4 * Math.PI) / 3);

    // Begin drawing the triangle
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();

    // Fill the triangle with the current fill color
    ctx.fill();
  };
};

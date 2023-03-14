<script>
  import { renderable, width, height } from "./game.js";
  import Text from "./Text.svelte";
  import vec2 from "gl-vec2";
  import { detractorPos } from "./boidSimControls";

  export let color = "#ffe554";
  export let size = 10;
  export let thickness = 3;

  export let startX = $width / 2;
  export let startY = $height / 2;
  export let moveSpeed = 0.2;
  export let maxVelocity = 5;

  let text;

  let x = startX;
  let y = startY;
  const velocity = [0, 0];

  let mouse = null;
  let pointer;
  let mouseDown = false;

  renderable((props, dt) => {
    const { context, width, height } = props;

    let position = [x, y];
    if (mouseDown) {
      const delta = vec2.sub([], mouse, position);
      const len = vec2.length(delta);
      if (len > size * 2) {
        vec2.normalize(delta, delta);
        vec2.scaleAndAdd(velocity, velocity, delta, moveSpeed);
      }
    }

    if (x < 0 || x > width) {
      x = Math.max(0, Math.min(width, x));
      velocity[0] *= -1;
    }
    if (y < 0 || y > height) {
      y = Math.max(0, Math.min(height, y));
      velocity[1] *= -1;
    }

    velocity[0] = Math.max(-maxVelocity, Math.min(maxVelocity, velocity[0]));
    velocity[1] = Math.max(-maxVelocity, Math.min(maxVelocity, velocity[1]));
    velocity[0] *= 0.98;
    velocity[1] *= 0.98;
    x += velocity[0];
    y += velocity[1];

    position[0] = x;
    position[1] = y;

    detractorPos.set([x, y]);

    context.lineCap = "round";

    context.beginPath();
    context.fillStyle = color;
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.arc(x, y, size, 0, Math.PI * 2);
    context.stroke();

    // We use this to make sure the text is in sync with the character
    // Because regular prop reactivity happens a frame too late
    text.$set({
      text: `(${position.map((n) => Math.round(n)).join(", ")})`,
      x,
      y: y + size + 10,
    });
  });

  function handleMouseMove({ clientX, clientY }) {
    if (!clientX || !clientY) return;
    mouse = [clientX, clientY];
  }

  function handleMouseDown(ev) {
    handleMouseMove(ev);
    mouseDown = true;
  }

  function handleMouseUp(ev) {
    handleMouseMove(ev);
    mouseDown = false;
  }

  function lerp(min, max, t) {
    return min * (1 - t) + max * t;
  }

  function damp(a, b, lambda, dt) {
    return lerp(a, b, 1 - Math.exp(-lambda * dt));
  }
</script>

<svelte:window
  on:touchstart={(e) =>
    e.targetTouches[0] && handleMouseDown(e.targetTouches[0])}
  on:touchend={(e) => e.targetTouches[0] && handleMouseUp(e.targetTouches[0])}
  on:touchmove={(e) =>
    e.targetTouches[0] && handleMouseMove(e.targetTouches[0])}
  on:mousedown={handleMouseDown}
  on:mouseup={handleMouseUp}
  on:mousemove={handleMouseMove}
/>

<Text fontSize={8} baseline="top" bind:this={text} />

<!-- The following allows this component to nest children -->
<slot />

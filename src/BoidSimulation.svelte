<script lang="ts">
  import { height, renderable, width } from "./game";
  import { createBoidSimulation } from "./lib/boid-engine/main";
  import { addBoid, cursorPos, forceSmoothing } from "./boidSimControls";
  import { onMount } from "svelte";
  import { MakeBoidDrawer } from "./lib/boid-engine/canvas-drawers";

  export let started = false;

  const getRand = (max) => Math.random() * max * (Math.random() < 0.5 ? 1 : -1);

  const boidSim = createBoidSimulation({
    numBoids: 150,
    startPos: [() => $width / 2, () => $height / 2],
    startVel: [() => getRand(5), () => getRand(5)],
    boardSize: { w: $width, h: $height },
  });

  $: drawBoid = MakeBoidDrawer($width > 700 ? 5 : 3);

  forceSmoothing.subscribe((newVal) => {
    boidSim.updateBoids({
      forceSmoothing: newVal == "on" ? 300 : 0,
    });
  });

  // Put simulation controls into store on mount
  onMount(() => {
    addBoid.set(() => {
      boidSim.addBoid(
        { x: $width / 2, y: $height / 2 },
        { x: getRand(10), y: getRand(10) }
      );
    });
  });

  renderable((props, dt) => {
    if (!started) return;
    const { context: ctx, width, height } = props;

    const boids = boidSim.update(dt, $cursorPos, {
      htmlContext: ctx,
      visibleBoard: {
        h: height,
        w: width,
      },
    });

    for (const boid of boids) {
      drawBoid(boid.vec.pos, boid.vec.vel, ctx);
    }
  });
</script>

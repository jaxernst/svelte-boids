<script lang="ts">
  import { height, renderable, width } from "./game";
  import { createBoidSimulation } from "./lib/boid-engine/main";
  import { addBoid, detractorPos } from "./boidSimControls";
  import { onMount } from "svelte";
  import { MakeBoidDrawer } from "./lib/boid-engine/canvas-drawers";

  export let started = false;

  const getRand = (max) => Math.random() * max * (Math.random() < 0.5 ? 1 : -1);

  const boidSim = createBoidSimulation({
    numBoids: 100,
    startPos: [() => $width / 2, () => $height / 2],
    startVel: [() => getRand(5), () => getRand(5)],
    boardSize: { w: $width, h: $height },
  });

  const drawBoid = MakeBoidDrawer($width > 700 ? 5 : 3);

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
    const boids = boidSim.update($detractorPos, ctx, { w: width, h: height });
    for (const boid of boids) {
      drawBoid(boid.vec.pos, boid.vec.vel, ctx);
    }
  });
</script>

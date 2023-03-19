<script lang="ts">
  import { height, renderable, width } from "./game";
  import { createBoidSimulation } from "./lib/boid-engine/main";
  import {
    addBoid,
    cursorPos,
    detractors,
    forceSmoothing,
  } from "./boidSimControls";
  import { onMount } from "svelte";
  import { MakeBoidDrawer } from "./lib/boid-engine/canvas-drawers";
  import { get } from "svelte/store";

  export let started = false;
  export let initNumBoids = 200;

  const getRand = (max) => Math.random() * max * (Math.random() < 0.5 ? 1 : -1);

  const boidSim = createBoidSimulation({
    numBoids: initNumBoids,
    startPos: [() => $width / 2, () => $height / 2],
    startVel: [() => getRand(5), () => getRand(50)],
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

    const boids = boidSim.update(
      dt,
      [$cursorPos].concat($detractors.map((d) => get(d))),
      {
        htmlContext: ctx,
        visibleBoard: {
          h: height,
          w: width,
        },
      }
    );

    for (const boid of boids) {
      drawBoid(boid.vec.pos, boid.vec.vel, ctx);
    }
  });
</script>

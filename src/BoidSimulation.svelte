<script lang="ts">
  import { height, renderable, width } from "./game";
  import { createBoidSimulation } from "./lib/boid-engine/main";
  import { boidSim, cursorPos } from "./boidSimControls";
  import { MakeBoidDrawer } from "./lib/boid-engine/canvas-drawers";
  import { getRand } from "./lib/util";

  export let started = false;
  export let initNumBoids = 0;

  boidSim.set(
    createBoidSimulation({
      numBoids: initNumBoids,
      startPos: [() => $width / 2, () => $height / 2],
      startVel: [() => getRand(5), () => getRand(50)],
      boardSize: { w: $width, h: $height },
    })
  );

  $: drawBoid = MakeBoidDrawer($width > 700 ? 5 : 3);

  renderable((props, dt) => {
    if (!started) return;
    const { context: ctx, width, height } = props;

    const boids = $boidSim.update(
      dt,
      {
        htmlContext: ctx,
        visibleBoard: {
          h: height,
          w: width,
        },
      },
      [$cursorPos]
    );

    for (const boid of boids) {
      drawBoid(boid.vec.pos, boid.vec.vel, ctx, boid.color);
    }
  });
</script>

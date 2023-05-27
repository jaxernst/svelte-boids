<script lang="ts">
  import { renderable } from "./game";
  import { boidSim } from "./boidSimControls";

  renderable((props, dt) => {
    const { context } = props;

    const color = "blue";
    context.lineCap = "round";

    for (let detractor of $boidSim.getDetractors()) {
      context.beginPath();
      context.fillStyle = color;
      context.strokeStyle = color;
      context.lineWidth = 3;
      context.arc(detractor.x, detractor.y, 4, 0, Math.PI * 2);
      context.stroke();
    }
  });
</script>

<script lang="ts">
  import { get } from "svelte/store";
  import { detractors } from "./boidSimControls";
  import { renderable } from "./game";
  import Character from "./MoveableCharacter.svelte";

  renderable((props, dt) => {
    const { context } = props;

    const color = "blue";
    context.lineCap = "round";

    for (let detractor of $detractors) {
      context.beginPath();
      context.fillStyle = color;
      context.strokeStyle = color;
      context.lineWidth = 3;
      context.arc(get(detractor).x, get(detractor).y, 4, 0, Math.PI * 2);
      context.stroke();
    }
  });
</script>

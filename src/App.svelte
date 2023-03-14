<script lang="ts">
  import { width, height } from "./game.js";

  import Canvas from "./Canvas.svelte";
  import Background from "./Background.svelte";
  import DotGrid from "./DotGrid.svelte";
  import Character from "./Character.svelte";
  import Text from "./Text.svelte";
  import FPS from "./FPS.svelte";
  import BoidSimulation from "./BoidSimulation.svelte";
  import { addBoid } from "./boidSimControls.js";

  let started = false;
  $: command = $width > 700 ? "click" : "tap";
</script>

<div class="main">
  <Canvas>
    <Background color="hsl(0, 0%, 10%)">
      <DotGrid divisions={30} color="hsla(0, 0%, 100%, 0.5)" />
    </Background>

    <BoidSimulation {started} />
    <Character
      size={started ? 10 : 0}
      moveSpeed={0.7}
      maxVelocity={$width > 700 ? 10 : 4}
    />
    <div class="big-screen-only">
      <Text
        text="Jackson Ernst | Digital Journey"
        fontSize={12}
        align="left"
        baseline="bottom"
        x={20}
        y={$height - 20}
      />
    </div>
    <Text
      text={command + " to move character"}
      fontSize={12}
      align="right"
      baseline="bottom"
      x={$width - 20}
      y={$height - 20}
    />

    <FPS />
  </Canvas>

  <div class="overlay">
    <div class="content-container">
      <h1 class="left" style="margin-bottom:0">Svelte Boids</h1>
      <div class="right-bar">
        {#if started}
          <button on:click={() => $addBoid && $addBoid()}>Spawn</button>
        {/if}
      </div>
    </div>
  </div>

  {#if !started}
    <button class="centered-button" on:click={() => (started = true)}
      >Start</button
    >
  {/if}
  >
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }

  .left {
    text-align: left;
  }

  .centered-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .main {
    position: fixed;
    top: 0%;
    left: 0%;
  }

  .overlay {
    position: absolute;
    top: 0%;
    left: 0%;
    margin: 1em;
    width: 100%;
  }

  .content-container {
    display: flex;
    justify-content: space-between;
  }

  .right-bar {
    grid-column: 2;
    grid-row: 1/-1;
    padding-top: 1.5em;
    margin-right: 2em;
  }
</style>

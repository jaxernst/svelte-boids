<script lang="ts">
  import { width, height, renderable } from "./game.js";
  import Canvas from "./Canvas.svelte";
  import Background from "./Background.svelte";
  import DotGrid from "./DotGrid.svelte";
  import Character from "./MoveableCharacter.svelte";
  import Text from "./Text.svelte";
  import FPS from "./FPS.svelte";
  import BoidSimulation from "./BoidSimulation.svelte";
  import {
    addBoids,
    boidSim,
    currentBoidType,
    cursorPos,
  } from "./boidSimControls.js";
  import TwitterLogo from "./lib/svelte-components/TwitterLogo.svelte";
  import Detractors from "./Detractors.svelte";
  import { randomizeBoidType } from "./lib/boid-engine/boid-creation.js";
  import {
    BlueAngels,
    GrouperSpecies1,
    LilBuggers,
    SlowArrows,
  } from "./lib/presetBoids.js";
  import Github from "./lib/svelte-components/Github.svelte";

  $: console.log("New Species", $currentBoidType);

  let started = false;
  $: command = $width > 700 ? "click" : "tap";

  let addingDetractor = false;
  let waitingForClick = false;
  function maybeAddDetractor(event) {
    if (!addingDetractor) return;
    if (!waitingForClick) {
      waitingForClick = true;
      return;
    }
    const { clientX, clientY } = event;
    $boidSim.addDetractor({ x: clientX, y: clientY });
  }

  let characterPaused = false;
  function characterPause(node) {
    const onPress = () => (characterPaused = true);
    const onRelease = () => (characterPaused = false);
    node.addEventListener("mousedown", onPress);
    node.addEventListener("mouseup", onRelease);
    node.addEventListener("touchstart", onPress);
    node.addEventListener("touchend", onRelease);
    return {
      destroy() {
        node.removeEventListener("mousedown", onPress);
        node.removeEventListener("mouseup", onRelease);
        node.removeEventListener("touchstart", onPress);
        node.removeEventListener("touchend", onRelease);
      },
    };
  }

  function toggleDetractorPen() {
    addingDetractor = !addingDetractor;
    waitingForClick = false;
  }
</script>

<svelte:window on:click={maybeAddDetractor} />

<div class="main">
  <Canvas>
    <Background color="hsl(0, 0%, 10%)">
      <DotGrid divisions={30} color="hsla(0, 0%, 100%, 0.5)" />
    </Background>

    <BoidSimulation {started} initNumBoids={25} />
    <Character
      storeToUpdate={cursorPos}
      size={$width > 700 ? 10 : 7}
      moveSpeed={0.7}
      maxVelocity={$width > 700 ? 9 : 6}
      startX={$width / 2}
      startY={$height / 1.1}
      {characterPaused}
    />
    <Detractors />

    <FPS />
  </Canvas>

  <div class="overlay">
    <div class="flex justify-between">
      <div class="ml-5 mt-8 left">
        <h1 class="text-[25px] md:text-[35px]" style="margin-bottom:0">
          Digital Boids
        </h1>
        <i class="left" style="font-size: 12px; margin-top: 1em"
          >A flocking simulation visualizer</i
        >
      </div>
      <div class="flex flex-col m-5 gap-2 items-end text-xs md:text-base">
        {#if started}
          <button use:characterPause on:click={() => $boidSim.reset()}
            >Reset</button
          >
          {#if $width > 700}
            <button
              use:characterPause
              on:click={toggleDetractorPen}
              class:purple-bg={addingDetractor}
              >{addingDetractor
                ? "Adding Detractors"
                : "Add Detractors"}</button
            >
          {/if}
          <button
            class="flex gap-2 items-center"
            use:characterPause
            on:click={() => ($currentBoidType = randomizeBoidType())}
            >Randomize Species {" "}
            <div
              style={`background-color: ${$currentBoidType.color}; height:15px; width:15px; border-radius:100%; display:inline-block;`}
            /></button
          >

          <button
            use:characterPause
            on:click={() => $addBoids && $addBoids($currentBoidType, 10)}
            >Spawn</button
          >
          {#if false}
            <div class="mt-4 p-2 min-h-[400px] border border-double rounded-lg">
              <div class="pb-2">Featured Species</div>
              <div class="flex flex-col gap-1">
                <button on:click={() => ($currentBoidType = GrouperSpecies1)}
                  >Grouper #1</button
                >
                <button on:click={() => ($currentBoidType = LilBuggers)}
                  >Lil Buggers</button
                >
                <button on:click={() => ($currentBoidType = BlueAngels)}
                  >Blue Angels</button
                >
                <button on:click={() => ($currentBoidType = SlowArrows)}
                  >Slow Arrows</button
                >
              </div>
            </div>
          {/if}
        {/if}
      </div>
    </div>
  </div>

  <div class="twitter-link">
    <a
      href="https://github.com/jaxernst"
      style="display:flex; gap:4px; items:center; font-size:12px; color:rgb(200,200,200);"
      target="_blank"
      rel="noreferrer"
    >
      <div style="width:18px; display:flex; fill:rgb(200,200,200);">
        <Github />
      </div>
      by Jackson Ernst
    </a>
  </div>

  {#if !started}
    <button class="centered-button" on:click={() => (started = true)}
      >Start</button
    >
  {/if}
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }

  .twitter-link {
    position: absolute;
    bottom: 19px;
    left: 1em;
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
    width: 100%;
  }

  .content-container {
    display: flex;
    justify-content: space-between;
  }

  .right-bar {
    grid-column: 2;
    grid-row: 1/-1;
  }

  @media (max-width: 700px) {
    .right-bar {
      font-size: 0.65em;
      gap: 0.5em;
    }
  }

  .purple-bg {
    background-color: #a55bd7;
  }
</style>

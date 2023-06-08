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
  import { defaultAttrs } from "./lib/boid-engine/main.js";
  import type { BoidAttrs } from "./lib/boid-engine/types.js";

  $: console.log("New Species", currentBoidType);

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
    <div class="big-screen-only">
      <Text
        text="Jackson Ernst | Digital Journey"
        fontSize={12}
        align="left"
        baseline="bottom"
        x={36}
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
      <div class="left">
        <h1 class="left" style="margin-bottom:0">Digital Boids</h1>
        <i class="left" style="font-size: 12px; margin-top: 1em"
          >A flocking simulation visualizer</i
        >
      </div>
      <div class="right-bar">
        {#if started}
          <button
            style="display:flex; gap:.5em; align-items:center"
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
          <button use:characterPause on:click={() => $boidSim.reset()}
            >Reset</button
          >
          <!-- 
          <div style="font-size: 10px">
            <Switch bind:value={$forceSmoothing} label="" design="inner" />
          </div>
            
            <div style="font-size: 10px">
              <Slider />
            </div>
          -->
        {/if}
      </div>
    </div>
  </div>

  <div class="twitter-link">
    <a href="https://twitter.com/yachtyyachty" target="_blank" rel="noreferrer">
      <TwitterLogo />
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

  .left {
    text-align: left;
  }

  .twitter-link {
    position: absolute;
    bottom: 32px;
    left: 1em;
    height: 13px;
    width: 13px;
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
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 0.8em;
    font-size: 0.9em;
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

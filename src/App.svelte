<script lang="ts">
  import { width, height } from "./game.js";
  import Canvas from "./Canvas.svelte";
  import Background from "./Background.svelte";
  import DotGrid from "./DotGrid.svelte";
  import Character from "./MoveableCharacter.svelte";
  import Text from "./Text.svelte";
  import FPS from "./FPS.svelte";
  import BoidSimulation from "./BoidSimulation.svelte";
  import {
    addBoid,
    cursorPos,
    detractors,
    MakeDetractor,
  } from "./boidSimControls.js";
  import Switch from "./lib/svelte-components/Switch.svelte";
  import { onMount } from "svelte";
  import Slider from "@bulatdashiev/svelte-slider";
  import TwitterLogo from "./lib/svelte-components/TwitterLogo.svelte";
  import Detractors from "./Detractors.svelte";
  import { get } from "svelte/store";

  let started = false;
  $: command = $width > 700 ? "click" : "tap";
</script>

<div class="main">
  <Canvas>
    <Background color="hsl(0, 0%, 10%)">
      <DotGrid divisions={30} color="hsla(0, 0%, 100%, 0.5)" />
    </Background>

    <BoidSimulation {started} initNumBoids={200} />
    <Character
      storeToUpdate={cursorPos}
      size={$width > 700 ? 10 : 7}
      moveSpeed={0.7}
      maxVelocity={$width > 700 ? 9 : 6}
      startX={$width / 2}
      startY={$height / 1.6}
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
          <button on:click={() => null}>Reset</button>
          <button on:click={() => $addBoid && $addBoid()}>Spawn</button>
          <button
            on:click={() => {
              $detractors.push(MakeDetractor({ ...$cursorPos }));
            }}>Add Detractor</button
          >
          <button on:click={() => null}>New Species</button>
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
    gap: 1em;
  }
</style>

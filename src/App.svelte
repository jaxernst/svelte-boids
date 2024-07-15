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
    BoidSpecies,
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

  let hidden = false;
</script>

<svelte:window on:click={maybeAddDetractor} />

<div class="main">
  <Canvas>
    <Background color="hsl(0, 0%, 10%)">
      <DotGrid divisions={30} color="hsla(0, 0%, 100%, 0.5)" />
    </Background>

    <BoidSimulation {started} initNumBoids={45} />
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

          {#if true}
            <div class="p-2 border border-[#b12727c9] rounded-lg">
              <div class="pb-2 text-gray-300 font-semibold">
                Featured Species
              </div>
              <div>
                <select
                  class="bg-transparent"
                  on:change={(e) => {
                    const choice = BoidSpecies.find((s) => {
                      return s.name === e.target.value;
                    });

                    if (choice) {
                      $currentBoidType = choice;
                    }
                  }}
                >
                  <option value={"default"}>Default</option>
                  {#each BoidSpecies as species}
                    <option value={species.name}>{species.name}</option>
                  {/each}
                </select>
              </div>
            </div>
          {/if}

          <div class="spacer h-2" />
          <button
            style="padding: 12px; background-color: green"
            use:characterPause
            on:click={() => $addBoids && $addBoids($currentBoidType, 10)}
            >Spawn</button
          >
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

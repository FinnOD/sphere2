<script>
  import { Canvas } from '@threlte/core';
  import { World, Debug } from '@threlte/rapier';
  import { onDestroy } from 'svelte';
  import Scene from '$lib/components/Scene.svelte';
  import { plControlsEnabled } from '$lib/state';
  import { KeyboardControls } from 'svelte-kbc';
  
  const config = [
    { name: 'forward', keys: ['w', 'W', 'ArrowUp'] },
    { name: 'backward', keys: ['s', 'S', 'ArrowDown'] },
    { name: 'right', keys: ['d', 'D', 'ArrowRight'] },
    { name: 'left', keys: ['a', 'A', 'ArrowLeft'] },
    { name: 'run', keys: ['Shift'] },
    { name: 'space', keys: [' '], },
  ]


  onDestroy(() => {
    plControlsEnabled.set(false)
  })

  // $: if($plControlsEnabled) {
  //   console.log($plControlsEnabled);
  // }
</script>

<div class="canvas-wrapper">
  <Canvas>
    <World>
      <Debug />
      <KeyboardControls {config}>
        <Scene />
      </KeyboardControls>
    </World>
  </Canvas>
  {#if !$plControlsEnabled}
    <div class="focus-box">
      <button on:click={() => plControlsEnabled.set(true)}>Click to Enable</button>
    </div>
  {/if}
</div>

<style>
  .canvas-wrapper {
    position: fixed;
    width: 100%;
    height: 100%;
    background: #ddd;
  }
  .focus-box {
    position: absolute;
    top: 0;
    left: 0;
    /* background: #16161688; */
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  :global(body) {
    margin: 0;
  }
</style>

<script>
	import { Canvas } from '@threlte/core';
	import { World, Debug } from '@threlte/rapier';
	import { onDestroy, onMount } from 'svelte';
	import Scene from '$lib/components/Scene.svelte';
	import { plControlsEnabled, settings, processHash } from '$lib/state';
	import { KeyboardControls, useKeyboardControls } from 'svelte-kbc';
	import Settings from '$lib/components/Settings.svelte';

	const config = [
		{ name: 'forward', keys: ['w', 'W', 'ArrowUp'] },
		{ name: 'backward', keys: ['s', 'S', 'ArrowDown'] },
		{ name: 'right', keys: ['d', 'D', 'ArrowRight'] },
		{ name: 'left', keys: ['a', 'A', 'ArrowLeft'] },
		{ name: 'run', keys: ['Shift'] },
		{ name: 'space', keys: [' '] },
		{ name: 'debug', keys: ['P', 'p'] }
	];

	onDestroy(() => {
		plControlsEnabled.set(false);
	});

	onMount(() => {
		settings.subscribe((value) => {
			if (value === undefined) {
				value = { //default values
					debug: {
						enabled: false,
						fog: false,
					}
				};
			}

			const encodedJSON = encodeURIComponent(JSON.stringify(value));
			window.location.hash = encodedJSON;
		});
		settings.set(processHash());
	});
</script>

<svelte:window
	on:hashchange={() => {
		settings.set(processHash());
	}}
/>

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

{#if $settings !== undefined && $settings['debug']['enabled']}
	<Settings />
{/if}

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

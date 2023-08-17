<script lang="ts">
	import { T, useThrelte, useFrame } from '@threlte/core';
	import World from './World.svelte';
	import { useKeyboardControls } from 'svelte-kbc';
	const { renderer, camera } = useThrelte();
	import { Fog, Mesh, Vector3 } from 'three';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
    import Player from './Player.svelte';
	import { renderInfo, settings } from '$lib/state';
	import { onMount } from 'svelte';

	// interactivity();
	const { scene } = useThrelte();
	const { space, forward, backward, right, left, run } = useKeyboardControls();

	let cameraPos: Vector3 = new Vector3(0, -2990, 0);
	let time = 0;
   
	let cameraDirection: Vector3;

	$: if(!$settings['debug']['fog']){
		delete scene.fog;
	}
    
    let playerMesh: Mesh;
    let positionHasBeenSet = false;

	let smoothFps: number[] = []
	useFrame(({clock}, delta) => {
		time = clock.getElapsedTime();
		// console.log('hs')
		let stats = renderer?.info.render;
		if (smoothFps.length > 50)
			smoothFps.pop()
		smoothFps.push(1/delta);
		
		const sum = smoothFps.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
		const average = sum / smoothFps.length;
		stats['fps'] = average;
		renderInfo.set(stats);

		if (stats.frame % 120 == 0) {
			console.log(stats, delta);
			// console.log(cameraPos, cameraDirection);
			// console.log(space);
		}
	});

</script>

<World playerPosition={cameraPos} />

<Player
    bind:position={cameraPos}
  />

<!-- <T.PerspectiveCamera makeDefault position.y={-2980} fov={(1+($progress-1)*0.4) *55} far={10*3000} near={1}>
	<PointerLockControls
		bind:direction={cameraDirection}
		bind:position={cameraPos}
		enabled={$plControlsEnabled}
		forward={$forward}
		backward={$backward}
		right={$right}
		left={$left}
		speed={$progress * 40}
	/>
</T.PerspectiveCamera> -->


<T.SpotLight 
	intensity={0.7}
	color={'#fefcbd'}
	position={[0, 0, 1]}
	angle={Math.PI/3}
	penumbra={5}
	decay={0}
	
/>
<T.SpotLight 
	intensity={0.3}
	color={'#4b7daf'}
	position={[0, 0, -1]}
	angle={Math.PI/3}
	penumbra={5}
	decay={0}
/>
<!-- <T.AmbientLight intensity={0.05} /> -->

{#if $settings.debug.fog}
	<T.Fog
		far={6000}
		color={$settings['debug']['fog'] ? '#faa': '#ddd'}
		on:create={({ ref }) => {
			scene.fog = ref;
		}}
	/>
{/if}
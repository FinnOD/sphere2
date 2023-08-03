<script lang="ts">
	import { T, useThrelte, useFrame } from '@threlte/core';
	import World from './World.svelte';
	import { useKeyboardControls } from 'svelte-kbc';
	const { renderer, camera } = useThrelte();
	import { Fog, Mesh, Vector3 } from 'three';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
    import Player from './Player.svelte';

	// interactivity();
	const { scene } = useThrelte();
	const { space, forward, backward, right, left, run } = useKeyboardControls();
	let fog;
	let cameraPos: Vector3 = new Vector3(0, -2990, 0)
   
	let cameraDirection: Vector3;

    
    let playerMesh: Mesh;
    let positionHasBeenSet = false
    
	useFrame(() => {
		// console.log('hs')
		let stats = renderer?.info.render;
		if (stats.frame % 30 == 0) {
			// console.log(stats);
			// console.log(cameraPos, cameraDirection);
			// console.log(space);
		}
	});

	const progress = tweened(1, {
		duration: 400,
		easing: cubicInOut
	});

	$: if ($run) {
		progress.set(2);
	} else {
		progress.set(1);
	}
</script>

<World playerPosition={cameraPos} />

<Player
    bind:position={cameraPos}
    speed={1000}
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


<T.DirectionalLight intensity={0.7} position={[0, 40, 90]} />
<T.AmbientLight intensity={0.1} />
<!-- <T.Fog
    bind:ref={fog}
    color={'#ddd'}
    near={2000}
    far={4000}
    density={0.1}
    on:create={({ ref }) => {
        scene.fog = ref;
    }}
/> -->
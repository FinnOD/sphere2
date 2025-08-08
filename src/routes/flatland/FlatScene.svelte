<script lang="ts">
	import { T, useThrelte, useFrame } from '@threlte/core';
	import World from '$lib/components/World.svelte';
	import { useKeyboardControls } from 'svelte-kbc';
	const { renderer } = useThrelte();
	import { BoxGeometry, Mesh, MeshBasicMaterial, MeshNormalMaterial, Vector3 } from 'three';
    import Player from '$lib/components/Player.svelte';
	import { settings } from '$lib/state';
	import { OrbitControls } from '@threlte/extras';

	let cameraPos = new Vector3();
	$: console.log(cameraPos);
    
	useFrame(({ camera }, delta) => {
		cameraPos.copy(camera.current.position);
		cameraPos = cameraPos;
		let stats = renderer?.info.render;
		if (stats.frame % 120 == 0) {
			// console.log(stats);
		}
	});

</script>


<World playerPosition={cameraPos} />

<T.Mesh>
	<T.BoxGeometry></T.BoxGeometry>
	<T.MeshNormalMaterial></T.MeshNormalMaterial>
</T.Mesh>

<T.PerspectiveCamera
  makeDefault
  fov={50}
  position={[10, 10, 10]}
>
  <OrbitControls enableDamping />
  
</T.PerspectiveCamera>


<T.DirectionalLight intensity={0.7} position={[0, 40, 90]} />
<T.AmbientLight intensity={0.1} /> 

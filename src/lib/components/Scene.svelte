<script lang="ts">
  import { T, useThrelte, useFrame} from '@threlte/core'
  import { ContactShadows, Float, Grid, OrbitControls } from '@threlte/extras'
  import World from './World.svelte';
  import { plControlsEnabled } from '$lib/state';
  import { useKeyboardControls } from 'svelte-kbc';
  const { renderer, camera } = useThrelte()
  import PointerLockControls from '$lib/extras/PointerLockControls.svelte';
	import { Fog, Vector3 } from 'three';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
  
  // interactivity();
  const { scene } = useThrelte();
  const { space, forward, backward, right, left, run } = useKeyboardControls();
  let fog;
  let cameraPos;// = new Vector3(0, -2990, 0)
  let cameraDirection;
  let triGeoms, chunkIndex = 3;
  useFrame(() => {
    // console.log('hs')
    let stats = renderer?.info.render;
    if (stats.frame % 300 == 0)
      console.log(stats);
    // console.log(cameraPos, cameraDirection);
    // console.log(space);
  });

  const progress = tweened(1, {
		duration: 400,
		easing: cubicInOut
	});

  $: if ($run){
    progress.set(2);
  } else {
    progress.set(1);
  }

</script>

<T.PerspectiveCamera 
  makeDefault
  position.y={-2990}
  fov={$progress * 45}
  far={1e9}
  near={0.001}
>
 <!-- <OrbitControls /> -->
  <PointerLockControls 
    bind:direction={cameraDirection}
    bind:position={cameraPos}
    bind:chunkIndex={chunkIndex}
    enabled={$plControlsEnabled}
    forward={$forward}
    backward={$backward}
    right={$right}
    left={$left}
    speed={$progress * 100}
    surfaces={triGeoms}
  />
</T.PerspectiveCamera>

<T.DirectionalLight
  intensity={0.7}
  position={[0,100,60]}
/>
<T.AmbientLight intensity={0.1} />
<!-- <T.Fog
    bind:ref={fog}
    color={'#ddd'}
    near={0}
    far={2000}
    density={0.1}
    on:create={({ ref }) => {
        scene.fog = ref;
    }}
/> -->

<!-- <Grid
  position.y={-0.001}
  cellColor="#330000"
  sectionColor="#003300"
  sectionThickness={0}
  fadeDistance={25}
  cellSize={2}
/> -->


<World bind:triGeoms playerPosition={cameraPos} chunkIndex={chunkIndex}/>
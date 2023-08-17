<script lang="ts">
	import { T, useFrame, useThrelte } from '@threlte/core';
	import { onMount } from 'svelte';
	import { BackSide, UniformsLib, UniformsUtils, MeshNormalMaterial, Mesh, SphereGeometry } from 'three';
    import fragmentShader from './fragment.glsl?raw';
	import vertexShader from './vertex.glsl?raw';

    console.log(fragmentShader);

    const { clock } = useThrelte();
	let uniformsDefaults = {
		u_time: { value: clock.getElapsedTime() }
	};

    const uniforms = UniformsUtils.merge(
        [UniformsLib['lights'],
        uniformsDefaults]
    );

	useFrame(({ clock }) => {
		uniforms['u_time']['value'] = clock.getElapsedTime();
	});
</script>



<T.ShaderMaterial wireframe={false} vertexShader={vertexShader} fragmentShader={fragmentShader} {uniforms} side={BackSide} flatShading={false}/>
 
<!-- <T.MeshLambertMaterial color={'#66aa44'} wireframe={false} side={BackSide} /> -->

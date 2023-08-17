<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { onMount } from 'svelte';
    import { Group, Object3D, SphereGeometry, Vector3 } from 'three';

    let position = new Vector3(0, -3000, 0);
    let radius = 100;
    let radialSegments = 50;
    const sunGeom = new SphereGeometry(radius, radialSegments, Math.round(radialSegments / 4), 0, Math.PI * 2, 0, Math.PI * 0.5);
    const moonGeom = new SphereGeometry(radius, radialSegments, Math.round(radialSegments / 4), 0, Math.PI * 2, 0, Math.PI * 0.5);
    moonGeom.rotateZ(Math.PI);

    let lightTarget;
    onMount(() => {
        console.log(lightTarget);
    })

    let {scene} = useThrelte();

    let ssss = new SphereGeometry(5, 20, 20);
</script>

<T.Group position={[0,-2000]}>
    <T.Mesh geometry={ssss} >
        <T.MeshPhongMaterial color={'magenta'} wireframe={false}/>
    </T.Mesh>
    <!-- Spotlight might be the solution -->
    <T.SpotLight intensity={0.7} position={[0, 4000, 9000]} />
</T.Group>
<T.AmbientLight intensity={0.1} />

<!-- <T.Group position={[position.x, position.y, position.z]}>
    <T.Mesh geometry={sunGeom} castShadow receiveShadow >
        <T.MeshPhongMaterial color={'yellow'} wireframe={false}/>
    </T.Mesh>
    <T.Mesh geometry={moonGeom}>
        <T.MeshPhongMaterial color={'aqua'} wireframe={false}/>
    </T.Mesh>
</T.Group> -->

<T.Object3D on:create={({ ref }) => {
    scene.lightTarget = ref;
}} position={[0, 10, 0]}/>
<script lang="ts">
	import { T, useFrame, useThrelte } from '@threlte/core';
	import { onDestroy } from 'svelte';
	import { Camera, Mesh, MeshNormalMaterial, PerspectiveCamera, Quaternion, SphereGeometry, Spherical, Vector3 } from 'three';
	import PointerLockControls from './PointerLockControls.svelte';
	import { useKeyboardControls } from 'svelte-kbc';
	import { getDisplacement } from '$lib/extras/SphereNoise';
	import { tweened } from 'svelte/motion';
	import { cubicInOut, quadInOut } from 'svelte/easing';
	import { settings, playerPosition } from '$lib/state';

	export let position: Vector3;
	export let speed = 5;

	let lock: () => void;
	let cam: PerspectiveCamera;

	const { space, forward, backward, right, left, run, debug} = useKeyboardControls();
	let lastTime = Date.now()
    $: if($debug){
		if(Date.now() - lastTime > 100){
			lastTime = Date.now();
			$settings['debug']['enabled'] = !$settings['debug']['enabled'];
			console.log('debug is: ', $settings['debug']['enabled']);
		}
	}

	const progress = tweened(1, {
		duration: 400,
		easing: cubicInOut
	});

	$: if ($run) {
		progress.set(10);
	} else {
		progress.set(0);
	}

	const lockControls = () => lock();

	const { renderer } = useThrelte();
	if (!renderer) throw new Error();

	renderer.domElement.addEventListener('click', lockControls);

	onDestroy(() => {
		renderer.domElement.removeEventListener('click', lockControls);
	});

	const tangentVelocity = new Vector3();
	const downVector = new Vector3(0, -1, 0);
	const globalAngle = new Quaternion();

	let surrogatePos = position.clone();

	useFrame((_, delta) => {
		// Construct velocity vector
		const d = speed * ($progress * 10 + 1) * delta; // or ~0.01, delta is a not deterministic so hard to test
		tangentVelocity.set(0, 0, 0);
		if ($forward) tangentVelocity.z -= d;
		if ($backward) tangentVelocity.z += d;
		if ($right) tangentVelocity.x += d;
		if ($left) tangentVelocity.x -= d;
		tangentVelocity.applyQuaternion(cam.quaternion);

		// Update position vector
		position = position.add(tangentVelocity);
		let normal = position.normalize().clone();
		let onSphere = normal.clone().multiplyScalar(3000);
		
		let displacement = getDisplacement(onSphere.x, onSphere.y, onSphere.z);
		let displacementVec = normal.clone().multiplyScalar(-displacement);
		let cameraHeightOffset = normal.clone().multiplyScalar(-2);
		

		let tentativePos = onSphere.add(displacementVec);
		// if (tentativePos.length() < 3000){
			position = tentativePos;
			playerPosition.set(position.clone());
			surrogatePos = position.clone();
			position.add(cameraHeightOffset);
		// }
		//For cam
		

		
		

		// This is the rotation magic and doesnt work 100% due to the hairy ball theorem
		// The fix is here but i dont know how to do it.
		// https://gamedev.stackexchange.com/questions/73588/how-do-i-fix-my-planet-facing-camera
		// First adjust to global angles
		const norm = cam.position.clone().normalize();
		globalAngle.setFromUnitVectors(downVector, norm);
		cam.quaternion.copy(globalAngle);

		// Then account for rotation with mouse
		// Localrot is set in pointerlock controls
		cam.quaternion.multiply(cam.localRot);
	});
</script>

<T.Group position.y={0.9}>
	<T.PerspectiveCamera
		makeDefault
		fov={65 + (10 * $progress) / 5}
		far={10 * 3000}
		near={1}
		bind:ref={cam}
		position.x={position.x}
		position.y={position.y}
		position.z={position.z}
		on:create={({ ref }) => {
			ref.lookAt(new Vector3(0, -3000, 30000));
		}}
	>
		<PointerLockControls bind:lock />

		<!-- minPolarAngle={minAngle}
     maxPolarAngle={maxAngle} -->
	</T.PerspectiveCamera>
</T.Group>

<T.Mesh position={[surrogatePos.x, surrogatePos.y, surrogatePos.z]}>
	<T.SphereGeometry radius={1}></T.SphereGeometry>
	<T.MeshNormalMaterial></T.MeshNormalMaterial>
</T.Mesh>

<script lang="ts">
	import { T, useFrame, useThrelte } from '@threlte/core';
	import { onDestroy } from 'svelte';
	import { Camera, PerspectiveCamera, Quaternion, Spherical, Vector3 } from 'three';
	import PointerLockControls from './PointerLockControls.svelte';
	import { useKeyboardControls } from 'svelte-kbc';

	export let position: Vector3; // = [0, 0, 0]
	let radius = 0.3;
	let height = 1.7;
	export let speed = 6;

	let lock: () => void;
	let cam: PerspectiveCamera;

	const { space, forward, backward, right, left, run } = useKeyboardControls();
	// let forward = 0
	// let backward = 0
	// let left = 0
	// let right = 0

	const t = new Vector3();

	const lockControls = () => lock();

	const { renderer } = useThrelte();
	if (!renderer) throw new Error();

	renderer.domElement.addEventListener('click', lockControls);

	onDestroy(() => {
		renderer.domElement.removeEventListener('click', lockControls);
	});

	useFrame((_, delta) => {
		const d = speed * 0.01; //delta; // delta is a not deterministic so hard to test
		const tangentVelocity = t.set(0, 0, 0);

		if ($forward) tangentVelocity.z -= d;
		if ($backward) tangentVelocity.z += d;
		if ($right) tangentVelocity.x += d;
		if ($left) tangentVelocity.x -= d;

		tangentVelocity.applyQuaternion(cam.quaternion);

		if (!$run) {
			position = position.add(tangentVelocity);
			let normal = position.normalize().clone();
			let offset = normal.clone().multiplyScalar(-4);
			position = normal.multiplyScalar(3000).add(offset);
		}

		const norm = cam.position.clone().normalize();
		const globalAngle = new Quaternion().setFromUnitVectors(new Vector3(0, -1, 0), norm);

        cam.quaternion.copy(globalAngle);

		if (cam.localRot) {
            cam.quaternion.multiply(cam.localRot);
		}

		

		// cam.lookAt(new Vector3(0,0,0));
	});
</script>

<T.Group position.y={0.9}>
	<T.PerspectiveCamera
		makeDefault
		fov={65}
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

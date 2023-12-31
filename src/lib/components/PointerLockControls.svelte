<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { Euler, Camera, Quaternion, Spherical, Vector3, Matrix4 } from 'three';
	import { useThrelte, useParent } from '@threlte/core';

	// Set to constrain the pitch of the camera
	// Range is 0 to Math.PI radians
	export let minPolarAngle = 0; // radians
	export let maxPolarAngle = Math.PI; // radians
	export let pointerSpeed = 1.0;

	let isLocked = false;

	const { renderer, invalidate } = useThrelte();
	if (!renderer) throw new Error();
	const domElement = renderer.domElement;
	const camera = useParent();
	const dispatch = createEventDispatcher();

	const _euler = new Euler(0, 0, 0, 'YXZ');
	$camera.localRot = new Quaternion().setFromEuler(_euler);
	const _PI_2 = Math.PI / 2;

	if (!renderer) {
		throw new Error('Threlte Context missing: Is <PointerLockControls> a child of <Canvas>?');
	}
	if (!($camera instanceof Camera)) {
		throw new Error('Parent missing: <PointerLockControls> need to be a child of a <Camera>');
	}

	const onChange = () => {
		invalidate('PointerLockControls: change event');
		dispatch('change');
	};

	export const lock = () => domElement.requestPointerLock();
	export const unlock = () => document.exitPointerLock();

	domElement.addEventListener('mousemove', onMouseMove);
	domElement.ownerDocument.addEventListener('pointerlockchange', onPointerlockChange);
	domElement.ownerDocument.addEventListener('pointerlockerror', onPointerlockError);

	onDestroy(() => {
		domElement.removeEventListener('mousemove', onMouseMove);
		domElement.ownerDocument.removeEventListener('pointerlockchange', onPointerlockChange);
		domElement.ownerDocument.removeEventListener('pointerlockerror', onPointerlockError);
	});

	function onMouseMove(event: MouseEvent) {
		if (!isLocked) return;
		if (!$camera) return;

		const { movementX, movementY } = event;

		

		_euler.setFromQuaternion($camera.localRot);
		// let _euler = new Euler(0, 0, 0, 'YXZ');

		_euler.y -= movementX * 0.002 * pointerSpeed;
		_euler.x -= movementY * 0.002 * pointerSpeed;

		_euler.x = Math.max(_PI_2 - maxPolarAngle, Math.min(_PI_2 - minPolarAngle, _euler.x));
		$camera.localRot.setFromEuler(_euler)

		// $camera.quaternion.multiply();

		onChange();
	}

	// Q1 https://chat.openai.com/share/0b82f3a1-7e06-4e65-b1a1-163a76e4dfed
	// function onMouseMove(event: MouseEvent) {
	// 	if (!isLocked) return;
	// 	if (!$camera) return;

	// 	const { movementX, movementY } = event;

	// 	const rotationY = new Quaternion().setFromAxisAngle(
	// 		// new Vector3(0, -1, 0),
	// 		$camera.position.clone().normalize().negate(),
	// 		-movementX * 0.002 * pointerSpeed
	// 	);

	// 	const rotationX = new Quaternion().setFromAxisAngle(
	// 		new Vector3(1,0,0),
	// 		-movementY * 0.002 * pointerSpeed
	// 	);

	// 	const newQuaternion = $camera.quaternion.clone().multiply(rotationY).multiply(rotationX);

	// 	$camera.quaternion.copy(newQuaternion);

	// 	onChange();
	// }

	//flat land
	// function onMouseMove(event: MouseEvent) {
	// 	if (!isLocked) return;
	// 	if (!$camera) return;

	// 	const { movementX, movementY } = event;

	// 	_euler.setFromQuaternion($camera.quaternion);

	// 	_euler.y -= movementX * 0.002 * pointerSpeed;
	// 	_euler.x -= movementY * 0.002 * pointerSpeed;

	// 	_euler.x = Math.max(_PI_2 - maxPolarAngle, Math.min(_PI_2 - minPolarAngle, _euler.x));

	// 	$camera.quaternion.setFromEuler(_euler);

	// 	onChange();
	// }

	function onPointerlockChange() {
		if (document.pointerLockElement === domElement) {
			dispatch('lock');
			isLocked = true;
		} else {
			dispatch('unlock');
			isLocked = false;
		}
	}

	function onPointerlockError() {
		console.error('PointerLockControls: Unable to use Pointer Lock API');
	}
</script>

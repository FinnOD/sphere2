<script lang="ts">
	// Reference: https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html
	import { Vector3, Camera, Ray, BufferGeometry, Triangle } from 'three';
	import { ThreePointerLockControls } from './ThreePointerLockControls';
	import { T, useThrelte, useFrame, useParent, forwardEventHandlers } from '@threlte/core';
	import { plControlsEnabled } from '$lib/state';
	import { getDisplacement } from './SphereNoise';
	const { renderer } = useThrelte();
	const parent = useParent(); //Camera
	const v3Direction = new Vector3();

	// Validation
	if (!($parent instanceof Camera)) {
		throw new Error('Parent missing: <PointerLockControls> need to be a child of a <Camera>');
	}

	
	// Props
	export let forward = false;
	export let backward = false;
	export let right = false;
	export let left = false;
	export let enabled = false;
	export let speed = 8;

	export let surfaces: Array<BufferGeometry> = [];
	$: triangles = surfaces.map((s) => {
		let pos = s.attributes.position.array;
		return [
			new Vector3(pos[0], pos[1], pos[2]),
			new Vector3(pos[3], pos[4], pos[5]),
			new Vector3(pos[6], pos[7], pos[8])
		]
	});

	// For external read only
	export const ref = new ThreePointerLockControls($parent, renderer.domElement);
	export let direction = new Vector3();
	export let position = new Vector3();
	export let chunkIndex: number;

	const component = forwardEventHandlers();

	let ray = new Ray();
	let target = new Vector3();

	useFrame((_, delta) => {
		if (ref) {
			if (forward) ref.moveForward(speed * delta);
			if (backward) ref.moveForward(-speed * delta);
			if (right) ref.moveRight(speed * delta);
			if (left) ref.moveRight(-speed * delta);

			let copy = ref.camera.position.clone().normalize();
			ray.direction = copy;
			
			let res = null;
			let i = 0
			for (; i < triangles.length; i++) {
				res = ray.intersectTriangle(triangles[i][0], triangles[i][1], triangles[i][2], false, target);
				if(res)
					break;
				
			}
			chunkIndex = i;
			let resclone = res?.clone();
			let resnorm = resclone?.clone().normalize()
			
		
			// ref.camera.position.copy(resclone.multiplyScalar(getDisplacement(resclone?.x, resclone?.y, resclone.z)).add(resnorm?.multiplyScalar(-2)));
			position.copy(ref.camera.position);

			// const altitudeAngle = Math.atan2(resnorm.y, Math.sqrt(resnorm.x * resnorm.x + resnorm.z * resnorm.z));
			// ref.minPolarAngle = Math.PI;
			// ref.maxPolarAngle = 0;

			ref?.getDirection(v3Direction);
			if (ref.isLocked && !direction.equals(v3Direction)) {
				direction = direction.copy(v3Direction);
			}
		}
	});

	$: if (enabled) renderer?.domElement.requestPointerLock();
	$: if (ref?.isLocked) ref.connect();

	ref?.addEventListener( 'lock', function ( event ) {
		plControlsEnabled.set(true);
	} );
	ref?.addEventListener( 'unlock', function ( event ) {
		plControlsEnabled.set(false);
	} );

</script>

<T is={ref} let:ref {...$$restProps} bind:this={$component}>
	<slot {ref} {direction} />
</T>

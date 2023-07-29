<script lang="ts">
	import { T } from '@threlte/core';
	import { Color, BackSide, BufferGeometry, BufferAttribute } from 'three';
    import { getDisplacement } from '$lib/extras/SphereNoise';
	import { onMount } from 'svelte';

	export let triangle: BufferGeometry;
	export let detail: Number;

	function mid(a: number, b: number, c: number, x: number, y: number, z: number) {
		return [0.5 * (a + x), 0.5 * (b + y), 0.5 * (c + z)];
	}

	function subdivide(tri: number[], detail: number): number[]{
		let mid_left = mid(tri[0], tri[1], tri[2], tri[3], tri[4], tri[5]);
		let mid_right = mid(tri[0], tri[1], tri[2], tri[6], tri[7], tri[8]);
		let mid_bot = mid(tri[3], tri[4], tri[5], tri[6], tri[7], tri[8]);

		if (detail <= 1) {
			return [
				tri[0],
				tri[1],
				tri[2],
				...mid_left,
				...mid_right,

				...mid_left,
				tri[3],
				tri[4],
				tri[5],
				...mid_bot,

				...mid_left,
				...mid_bot,
				...mid_right,

				...mid_right,
				...mid_bot,
				tri[6],
				tri[7],
				tri[8]
			];
		} else
			return [
				...subdivide([tri[0], tri[1], tri[2], ...mid_left, ...mid_right], detail - 1),
				...subdivide([...mid_left, tri[3], tri[4], tri[5], ...mid_bot], detail - 1),
				...subdivide([...mid_left, ...mid_bot, ...mid_right], detail - 1),
				...subdivide([...mid_right, ...mid_bot, tri[6], tri[7], tri[8]], detail - 1)
			];
	}

	function makeBufferGeometry(positions: number[]) {
        let then = window.performance.now();
		let buffGeom = new BufferGeometry();
        let distorted_positions = [];
        for(let i = 0; i < positions.length; i+=3){
            let noise = getDisplacement(positions[i], positions[i+1], positions[i+2]);
            distorted_positions.push(noise*positions[i]);
            distorted_positions.push(noise*positions[i+1]);
            distorted_positions.push(noise*positions[i+2]);
        }
		const vertices = new Float32Array(distorted_positions);
		buffGeom.setAttribute('position', new BufferAttribute(vertices, 3));
		buffGeom.computeVertexNormals();
		buffGeom.computeBoundingSphere();
        console.log(window.performance.now()-then);
		return buffGeom;
	}

	$: subdividedGeom = makeBufferGeometry(subdivide(triangle.attributes.position.array, detail));

</script>

<T.Mesh geometry={subdividedGeom}>
	<T.MeshPhongMaterial color={new Color(0x44aa11)} wireframe={false} side={BackSide} />
</T.Mesh>

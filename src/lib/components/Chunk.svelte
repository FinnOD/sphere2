<script lang="ts">
	import { noisifyBuffer } from '$lib/extras/GenerateWorldGeometry';
	import { T } from '@threlte/core';
	import { Color, BackSide, BufferGeometry, BufferAttribute, DoubleSide, SphereGeometry } from 'three';
	import { LoopSubdivision } from 'three-subdivide';
	import MyWorker from './worker?worker';
	import { scale } from 'svelte/transition';
	import { deserializeBufferGeometry, serializeBufferGeometry } from '$lib/extras/SerializeBufferGeometry';
	import { onDestroy, onMount } from 'svelte';

	export let tile: BufferGeometry;
	export let chunkIndex: number;
	export let detail: number;
	export let color = new Color(0x66aa44);

	const subDivideParams = {
		split: false, // optional, default: true
		uvSmooth: false, // optional, default: false
		preserveEdges: false, // optional, default: false
		flatOnly: true, // optional, default: false
		maxTriangles: Infinity // optional, default: Infinity
	};

	function makeBufferGeometry(originalGeometry: BufferGeometry, subdivideDetail: number) {
		let subdivided = LoopSubdivision.modify(originalGeometry, subdivideDetail, subDivideParams);
		subdivided = noisifyBuffer(subdivided);
		subdivided.computeVertexNormals();

		return subdivided;
	}

	
	let worker: Worker;
	function runWorker(tile: BufferGeometry, detail: number) {
		return new Promise((resolve, reject) => {
			worker = new MyWorker();

			worker.onmessage = function (e) {
				// console.log('Message received from worker');
				const detailedSerializedGeometry = e.data;
				const detailedGeometry = deserializeBufferGeometry(detailedSerializedGeometry);

				resolve(detailedGeometry); // Resolve the promise with the data sent by the worker
				worker.terminate(); // Terminate the worker after the message is received
			};

			worker.onerror = function (err) {
				reject(err); // Reject the promise in case of an error
				worker.terminate();
				throw err;
			}

			const serializedGeometry = serializeBufferGeometry(tile);
			
			worker.postMessage([serializedGeometry, detail]);
		});
	}
	$: subdividedGeomLow = makeBufferGeometry(tile, 4);
	const subdividedGeomPromise = runWorker(tile, detail);


	onDestroy(() => {
		// console.log('unloading chunk ', chunkIndex);
		worker.terminate();
	});
	onMount(() => {
		// console.log('loading chunk ', chunkIndex)
	});
	// console.log(subdividedGeomPromise);
	
	// $: color = new Color().setHSL((0.5*distanceMatrix[$chunkIndex][i])/6, 0.9, 0.7)
</script>

{#await subdividedGeomPromise}
	<T.Mesh geometry={subdividedGeomLow}>
		<T.MeshPhongMaterial {color} wireframe={false} side={BackSide} />
	</T.Mesh>
{:then finalGeom}
	<T.Mesh geometry={finalGeom}>
		<T.MeshPhongMaterial {color} wireframe={false} side={BackSide} />
	</T.Mesh>
{/await}

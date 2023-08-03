<script lang="ts">
	import { noisifyBuffer } from '$lib/extras/GenerateWorldGeometry';
	import { T } from '@threlte/core';
	import { Color, BackSide, BufferGeometry, BufferAttribute, DoubleSide } from 'three';
	import { LoopSubdivision } from "three-subdivide";

	export let triangle: BufferGeometry;
	export let detail: number;

	const subDivideParams = {
		split: false,         // optional, default: true
		uvSmooth: false,      // optional, default: false
		preserveEdges: false,      // optional, default: false
		flatOnly: true,      // optional, default: false
		maxTriangles: Infinity,   // optional, default: Infinity
	};

	function makeBufferGeometry(originalGeometry: BufferGeometry, subdivideDetail: number) {
		
		let subdivided = LoopSubdivision.modify(originalGeometry, subdivideDetail, subDivideParams);
		subdivided = noisifyBuffer(subdivided);
		subdivided.computeVertexNormals();

		return subdivided;
	}

	$: subdividedGeom = makeBufferGeometry(triangle, detail);

</script>

<T.Mesh geometry={subdividedGeom}>
	<T.MeshPhongMaterial color={new Color(0x66aa44)} wireframe={false} side={DoubleSide} />
</T.Mesh>

<script lang="ts">
	import { T } from '@threlte/core';
	import {
		IcosahedronGeometry,
		BufferGeometry,
		BufferAttribute,
		Color,
		Group,
		Triangle,
		Vector3,
		BackSide,
		DoubleSide,
        Float32BufferAttribute, 
		SphereGeometry,
		FrontSide} from 'three';
	import Chunk from './Chunk.svelte';
	import Hexasphere from '$lib/extras/Hexasphere.js';
    import { LoopSubdivision } from 'three-subdivide';
    import { getDisplacement } from '$lib/extras/SphereNoise';

    // Good to 10 million triangles and <2000 calls I think
	export let playerPosition: Vector3;
	export let chunkIndex: number = 1;

	let hexasphere = new Hexasphere(3000, 16, 1.0);
    const subDivideParams = {
        split:          false,       // optional, default: true
        uvSmooth:       false,      // optional, default: false
        preserveEdges:  false,      // optional, default: false
        flatOnly:       true,      // optional, default: false
        maxTriangles:   Infinity,   // optional, default: Infinity
    };
    // let hexasphere = {
    //     tiles: [
    //         {
    //             centerPoint: {
    //                 x: '0',
    //                 y: '0',
    //                 z: '0',
    //             },
    //             boundary: [
    //                 {x: '200', y: '350', z: '0'},
    //                 {x: '-200', y: '350', z: '0'},
    //                 {x: '-400', y: '0', z: '0'},
    //                 {x: '-200', y: '-350', z: '0'},
    //                 {x: '200', y: '-350', z: '0'},
    //                 {x: '400', y: '0', z: '0'}
    //             ]   
    //         }
    //     ]
    // }
	console.log(hexasphere);

	export let triGeoms: Array<BufferGeometry> = [];

    let vec = new Vector3();
	for (let i = 0; i < hexasphere.tiles.length; i++) {
		let t = hexasphere.tiles[i];
        
        let vertices = [];
        let indices = [];
        vec.set(parseFloat(t.centerPoint.x), parseFloat(t.centerPoint.y), parseFloat(t.centerPoint.z)).normalize().multiplyScalar(3000);
        vertices.push(vec.x, vec.y, vec.z);
        for (let j = 0; j < t.boundary.length; j++) {
            let bp = t.boundary[j];
            vec.set(parseFloat(bp.x), parseFloat(bp.y), parseFloat(bp.z)).normalize().multiplyScalar(3000);
            vertices.push(vec.x, vec.y, vec.z);
        }
        
        indices.push(0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5);
        if (t.boundary.length == 5){
            indices.push(0, 5, 1)
        } else {
            indices.push(0, 5, 6, 0, 6, 1);
        }
        
        let geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3, false));
        geometry.setIndex(indices);

        
        geometry = LoopSubdivision.modify(geometry, 2, subDivideParams);
        for(let i = 0; i < geometry.attributes.position.array.length; i+=3){
            let noise = getDisplacement(
                geometry.attributes.position.array[i],
                geometry.attributes.position.array[i+1],
                geometry.attributes.position.array[i+2],
                )
            geometry.attributes.position.array[i] *= noise;
            geometry.attributes.position.array[i+1] *= noise;
            geometry.attributes.position.array[i+2] *= noise;
        }

        geometry.computeVertexNormals();
		triGeoms.push(geometry);

		// let mesh = new THREE.Mesh(geometry, material.clone());
		// scene.add(mesh);
		// hexasphere.tiles[i].mesh = mesh;
	}
	console.log(triGeoms);

	// let referenceGeom = new IcosahedronGeometry(3000, 1); //30 seems appropriate
	// console.log(referenceGeom);

	//     export let triGeoms: Array<BufferGeometry> = [];
	//     for (let i = 0; i < referenceGeom.attributes.position.array.length; i+=9) {

	//         let triGeom = new BufferGeometry();
	//         const vertices = new Float32Array(Array.from({ length: 9 }, (_, j) => referenceGeom.attributes.position.array[i+j]));

	//         triGeom.setAttribute( 'position', new BufferAttribute( vertices, 3 ) );
	//         triGeom.computeVertexNormals();
	//         triGeom.computeBoundingSphere();
	//         triGeoms.push(triGeom);
	//     }

	// $: triGeomsFar = triGeoms.filter((_, i) => i !== chunkIndex);
</script>

{#each triGeoms as tri, i}
    <T.Mesh geometry={tri}>
        <T.MeshPhongMaterial color={new Color().setHSL((20*i)/triGeoms.length, 1.0, 0.5)} wireframe={false} side={BackSide} />
         <!-- <T.MeshPhongMaterial color={"pink"} wireframe={true} side={DoubleSide} /> -->
    </T.Mesh>
{/each}

<!-- <T.Mesh geometry={new SphereGeometry(3000, 2200, 2290)}>
    <T.MeshPhongMaterial color="green" wireframe={false} />
</T.Mesh> -->
<!--
<T.Mesh geometry={referenceGeom} >
    <T.MeshPhongMaterial scale={0.95} color="pink" wireframe={true} side={BackSide} />
 </T.Mesh> -->
<!-- <Chunk triangle={triGeoms[chunkIndex]} detail={7}/> -->
<!-- detail 9 seems good -->

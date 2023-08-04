<script lang="ts">
	import { T, useFrame } from '@threlte/core';
	import { Color, Vector3, FrontSide, BackSide, DoubleSide, SphereGeometry, Spherical, BoxGeometry, MeshStandardMaterial } from 'three';
	import Chunk from './Chunk.svelte';
	import Hexasphere from '$lib/extras/Hexasphere.js';
	import { generateWorldGeometry } from '$lib/extras/GenerateWorldGeometry';
    import { tilesGeom, chunkIndex } from '$lib/state';
	import { AutoColliders, Collider } from '@threlte/rapier';

	// Good to 10 million triangles and <2000 calls I think
	export let playerPosition: Vector3;
	// export let chunkIndex: number;
    

	let hexasphere = new Hexasphere(3000, 8, 1.0);
    let [pureTiles, triGeoms, midPoints] = generateWorldGeometry(hexasphere, 2);
    $: tilesGeom.set(pureTiles);

    let midPointsSpherical = midPoints.map((v) => {
        let s = new Spherical().setFromVector3(v);
        return [s.phi, s.theta];
    });
    
   
    function closestChunk(playerPos: Vector3): number {
        let closest = 0;
        let closestDist = Infinity;
        for(let i = 0; i < midPoints.length; i++){
            let distance = midPoints[i].distanceToSquared(playerPos);
            if(distance < closestDist){
                closest = i;
                closestDist = distance;
            }
        }

        return closest;
    }

    $: chunkIndex.set(closestChunk(playerPosition));

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

    let ssss = new SphereGeometry(3, 20, 20)
</script>

{#each triGeoms as tri, i}
    {#if i !== $chunkIndex }
        <T.Mesh geometry={tri}>
            <T.MeshPhongMaterial
                color={new Color().setHSL((20 * i) / triGeoms.length, 0.5, 0.5)}
                wireframe={false}
                side={DoubleSide}
            />
            <!-- <T.MeshPhongMaterial color={"pink"} wireframe={true} side={DoubleSide} /> -->
        </T.Mesh>
    {/if}
{/each}


<T.Mesh geometry={ssss} position={[0,0,0]} scale={20}>
    <T.MeshPhongMaterial color="pink" wireframe={false} />
</T.Mesh>

{#each midPoints as mp}
    <T.Mesh geometry={ssss} position={[mp.x, mp.y, mp.z]}>
        <T.MeshPhongMaterial color="green" wireframe={false} />
    </T.Mesh>
{/each}

<!-- <T.Mesh geometry={referenceGeom} >
    <T.MeshPhongMaterial scale={0.95} color="pink" wireframe={true} side={BackSide} />
 </T.Mesh> -->
 
<Chunk triangle={pureTiles[$chunkIndex]} detail={5}/>

<!-- detail 9 seems good -->

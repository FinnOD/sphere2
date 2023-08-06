<script lang="ts">
	import { T, useFrame } from '@threlte/core';
	import {
		Color,
		Vector3,
		FrontSide,
		BackSide,
		DoubleSide,
		SphereGeometry,
		Spherical,
		BoxGeometry,
		MeshStandardMaterial
	} from 'three';
	import Chunk from './Chunk.svelte';
	import Hexasphere from '$lib/extras/Hexasphere.js';
	import { generateWorldGeometry } from '$lib/extras/GenerateWorldGeometry';
	import { tilesGeom, chunkIndex } from '$lib/state';
	import { AutoColliders, Collider } from '@threlte/rapier';

	// Good to 10 million triangles and <2000 calls I think
	export let playerPosition: Vector3;
	// export let chunkIndex: number;

	let hexasphere = new Hexasphere(3000, 10, 1.0);
	let [pureTiles, triGeoms, midPoints] = generateWorldGeometry(hexasphere, 3);
	$: tilesGeom.set(pureTiles);

	function getNeighboursByIndex(hex: Hexasphere): number[][] {
		let neighbourIndexes: number[][] = [];
		const keys = Object.keys(hex.tileLookup);

		for (const tileId in hex.tileLookup) {
			const neighbours = hex.tileLookup[tileId];
			const currentIndexes = [];

			for (const neighborId of neighbours.neighborIds) {
				const index = keys.findIndex((id) => id === neighborId);
				if (index < 0) console.log(neighborId);
				currentIndexes.push(index);
			}
			neighbourIndexes.push(currentIndexes);
		}
		return neighbourIndexes;
	}

	function createDistanceMatrix(neighbourIndexes: number[][]): number[][] {
		const numTiles = neighbourIndexes.length;
		const distanceMatrix: number[][] = [];

		// Initialize the distance matrix with infinity values.
		for (let i = 0; i < numTiles; i++) {
			distanceMatrix[i] = Array(numTiles).fill(Infinity);
			distanceMatrix[i][i] = 0; // Distance to itself is 0.
		}

		// Populate the distance matrix using BFS.
		for (let i = 0; i < numTiles; i++) {
			const queue = [i];
			const visited = new Set([i]);
			while (queue.length > 0) {
				const currentTile = queue.shift() as number;
				for (const neighbour of neighbourIndexes[currentTile]) {
					if (!visited.has(neighbour)) {
						distanceMatrix[i][neighbour] = distanceMatrix[i][currentTile] + 1;
						visited.add(neighbour);
						queue.push(neighbour);
					}
				}
			}
		}

		return distanceMatrix;
	}

	const neighboursByIndex = getNeighboursByIndex(hexasphere);
    const distanceMatrix = createDistanceMatrix(neighboursByIndex);
    const maxDistance = distanceMatrix.reduce((max, row) => Math.max(max, ...row), 0);
    console.log(maxDistance);

	let midPointsSpherical = midPoints.map((v) => {
		let s = new Spherical().setFromVector3(v);
		return [s.phi, s.theta];
	});

	function closestChunk(playerPos: Vector3): number {
		let closest = 0;
		let closestDist = Infinity;
		for (let i = 0; i < midPoints.length; i++) {
			let distance = midPoints[i].distanceToSquared(playerPos);
			if (distance < closestDist) {
				closest = i;
				closestDist = distance;
			}
		}

		return closest;
	}

	$: chunkIndex.set(closestChunk(playerPosition));
	$: chunkAndNeighbours = [$chunkIndex, ...neighboursByIndex[$chunkIndex]];

    let distanceToDetail = {
        0: 7,
        1: 7,
        2: 6,
        3: 6,
        4: 5,
        5: 1,
    }

	let ssss = new SphereGeometry(3, 20, 20);
	let referenceGeom = new SphereGeometry(3175, 20, 20);
</script>

{#each triGeoms as tri, i ([$chunkIndex, i])}
	{#if distanceMatrix[$chunkIndex][i] >= 3}
		<T.Mesh geometry={tri}>
            <!-- maxDistance -->
            <!-- <T.MeshPhongMaterial color={new Color().setHSL((i % 70)/70, 0.9, 0.7)} wireframe={false} side={BackSide} /> -->
            <T.MeshPhongMaterial color={new Color().setHSL(distanceMatrix[$chunkIndex][i]/maxDistance, 0.9, 0.7)} wireframe={false} side={BackSide} />
			<!-- <T.MeshPhongMaterial color={new Color(0x66aa44)} wireframe={false} side={BackSide} /> -->
			<!-- <T.MeshPhongMaterial color={"pink"} wireframe={true} side={DoubleSide} /> -->
			<!-- color={new Color().setHSL((20 * i) / triGeoms.length, 0.5, 0.5)} -->
		</T.Mesh>
    {:else}

    <!-- <Chunk tile={pureTiles[i]} color={new Color().setHSL((0.5*distanceMatrix[$chunkIndex][i])/6, 0.9, 0.7)} chunkIndex={i} detail={2} /> -->
    <Chunk tile={pureTiles[i]} color={new Color().setHSL((distanceToDetail[distanceMatrix[$chunkIndex][i]])/4, 0.9, 0.7)} chunkIndex={i} detail={distanceToDetail[distanceMatrix[$chunkIndex][i]]} />
    <!-- <Chunk tile={pureTiles[i]} color={new Color(0x66aa44)} chunkIndex={i} detail={7} /> -->
    <!-- detail 9 seems good -->
    <!-- color={i == 0 ? new Color(0xffaa44) : undefined} -->
	{/if}
{/each}

<T.Mesh geometry={ssss} position={[0, 0, 0]} scale={20}>
	<T.MeshPhongMaterial color="pink" wireframe={false} />
</T.Mesh>

{#each midPoints as mp}
	<T.Mesh geometry={ssss} position={[mp.x, mp.y, mp.z]}>
		<T.MeshPhongMaterial color="green" wireframe={false} />
	</T.Mesh>
{/each}

<!-- <T.Mesh geometry={referenceGeom}>
	<T.MeshPhongMaterial color="blue" wireframe={false} side={BackSide} />
</T.Mesh> -->

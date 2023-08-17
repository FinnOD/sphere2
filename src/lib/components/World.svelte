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
		MeshStandardMaterial,

		IcosahedronGeometry,

		Group


	} from 'three';
	import Chunk from './Chunk.svelte';
	import Hexasphere from '$lib/extras/Hexasphere.js';
	import { Instance, InstancedMesh } from '@threlte/extras';
	import { generateWorldGeometry } from '$lib/extras/GenerateWorldGeometry';
	import { tilesGeom, chunkIndex, settings } from '$lib/state';
	import { AutoColliders, Collider } from '@threlte/rapier';
	import GroundMaterial from './GroundMaterial.svelte';
	import { getDisplacement } from '$lib/extras/SphereNoise';

	// Good to 10 million triangles and <2000 calls I think
	export let playerPosition: Vector3;
	export let defaultDetail: number = 5;
	// export let chunkIndex: number;

	let hexasphere = new Hexasphere(3000, 4, 1.0);
	let [pureTiles, triGeoms, midPoints] = generateWorldGeometry(hexasphere, defaultDetail);
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

	// detail 9 seems good
    let distanceToDetail = {
        0: 7,
        1: 7,
    }

	const chunkRenderDist = 1;
	$: nearbyIndices = distanceMatrix[$chunkIndex].map((d, i) => d <= chunkRenderDist ? i : -1).filter((v) => v >= 0);
	$: farawayIndices = distanceMatrix[$chunkIndex].map((d, i) => d > chunkRenderDist ? i : -1).filter((v) => v >= 0);

	let ssss = new SphereGeometry(3, 20, 20);
	let referenceGeom = new IcosahedronGeometry(3000, 45);

	function mpDisp(mp: Vector3): number[]{

		let normal = mp.clone().normalize()
		let onSphere = normal.clone().multiplyScalar(3000);
		
		let noise = getDisplacement(onSphere.x, onSphere.y, onSphere.z);
		let ballOffset = normal.clone().multiplyScalar(-3);

		onSphere.add(normal.multiplyScalar(-noise)).add(ballOffset);

		return [onSphere.x, onSphere.y, onSphere.z]
	}
</script>
    
{#each farawayIndices as i (i)}
	<T.Mesh geometry={triGeoms[i]}>
		<GroundMaterial />
	</T.Mesh>
{/each}

{#each nearbyIndices as i ([$chunkIndex, i])}
	<Chunk tile={pureTiles[i]} color={new Color().setHSL((2*distanceMatrix[$chunkIndex][i])/maxDistance, 0.9, 0.7)} chunkIndex={i} detail={distanceToDetail[distanceMatrix[$chunkIndex][i]]} />
{/each}

<T.Mesh geometry={ssss} position={[0, 0, 0]} scale={20}>
	<T.MeshPhongMaterial color="pink" wireframe={false} />
</T.Mesh>

{#each midPoints as mp}
	<T.Mesh geometry={ssss} position={mpDisp(mp)}>
		<T.MeshPhongMaterial color="white" wireframe={false} />
		<!-- <Instance /> -->
	</T.Mesh>
{/each}

<!-- <T.Mesh geometry={referenceGeom}>
	<T.MeshPhongMaterial color="#2B65EC" wireframe={false} side={DoubleSide} />
</T.Mesh> -->

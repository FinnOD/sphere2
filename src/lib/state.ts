import { writable, type Writable } from 'svelte/store';
import { useKeyboardControls } from "svelte-kbc";
import { Vector3 } from 'three';

export const fpControlsEnabled = writable(false);
export const plControlsEnabled = writable(false);

export const tilesGeom = writable();
export const chunkIndex = writable(1);
export const playerPosition = writable(new Vector3());

export const renderInfo = writable();

export type Settings = {
    debug: {
        enabled: boolean;
        fog: boolean;
    };
};
export const settings: Writable<Settings | undefined> = writable(undefined);
export function processHash() {
    const hash = decodeURIComponent(location.hash.substring(1));
    return JSON.parse(hash);
}

// function createChunkCache() {
// 	const { subscribe, set, update } = writable({});

// 	return {
// 		subscribe,
// 		// increment: () => update((n) => n + 1),
// 		// decrement: () => update((n) => n - 1),
//         get: (chunkIndex: number) => update((cache) => {
//             cache['abb'] = 'beep';
//             return cache;
//         }),
// 		reset: () => set({})
// 	};
// }

// export const chunkCache = createChunkCache();
// console.log(chunkCache.get(100));
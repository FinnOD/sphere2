import { writable } from 'svelte/store';

export const fpControlsEnabled = writable(false);
export const plControlsEnabled = writable(false);

export const tilesGeom = writable();
export const chunkIndex = writable(1);

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
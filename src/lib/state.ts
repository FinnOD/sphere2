import { writable, type Writable } from 'svelte/store';
import { useKeyboardControls } from "svelte-kbc";
import { BufferGeometry, Vector3 } from 'three';

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

export const chunkGeometryCache: Writable<Record<string, BufferGeometry>> = writable({});
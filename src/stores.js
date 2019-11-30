import { writable } from 'svelte/store';

export const modalItem = writable(null);
export const places = writable([]);
export const selectedMemory = writable(null);
export const selectedPlace = writable(null);
export const message = writable(null);
export const selectedPhoto = writable(null);
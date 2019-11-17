import { writable } from 'svelte/store';

export const places = writable([]);
export const selectedPlace = writable(null);
export const modalItem = writable(null);
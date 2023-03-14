import { writable } from "svelte/store";

export const detractorPos = writable<[number, number] | undefined>();
export const addBoid = writable<any>();

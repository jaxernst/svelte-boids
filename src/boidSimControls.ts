import { writable } from "svelte/store";

export const cursorPos = writable<[number, number] | undefined>();
export const addBoid = writable<any>();
export const forceSmoothing = writable<"on" | "off">("off");

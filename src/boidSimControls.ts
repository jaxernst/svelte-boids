import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import type { Detractor } from "./lib/boid-engine/types";

export const cursorPos = writable<{ x: number; y: number } | undefined>();
export const addBoid = writable<any>();
export const forceSmoothing = writable<"on" | "off">("off");

export const MakeDetractor = ({ x, y }: { x: number; y: number }) => {
  return writable({ x, y }) as Writable<Detractor>;
};

export const detractors = writable<Writable<Detractor>[]>([]);

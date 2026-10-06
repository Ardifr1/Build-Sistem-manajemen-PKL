/** live/placements.js — apiResource pkl-placements. */
import { ep } from "../endpoints.js";
import { liveCrud } from "./_shared.js";

export const { index, show, store, update, destroy } = liveCrud(ep.placements);

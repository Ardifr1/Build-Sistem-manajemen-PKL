/** live/schools.js — apiResource schools. */
import { ep } from "../endpoints.js";
import { liveCrud } from "./_shared.js";

export const { index, show, store, update, destroy } = liveCrud(ep.schools);

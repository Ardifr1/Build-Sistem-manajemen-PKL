/** live/attendances.js — apiResource attendances. */
import { ep } from "../endpoints.js";
import { liveCrud } from "./_shared.js";

export const { index, show, store, update, destroy } = liveCrud(ep.attendances);

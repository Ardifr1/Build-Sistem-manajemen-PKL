/** live/periods.js — apiResource pkl-periods. */
import { ep } from "../endpoints.js";
import { liveCrud } from "./_shared.js";

export const { index, show, store, update, destroy } = liveCrud(ep.periods);

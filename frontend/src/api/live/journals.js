/** live/journals.js — apiResource journals (+ submit) & journal-recommendations. */
import { client } from "../client.js";
import { ep } from "../endpoints.js";
import { liveCrud } from "./_shared.js";

export const { index, show, store, update, destroy } = liveCrud(ep.journals);
export const submit = (id) => client.post(ep.journals.submit(id));
export const verify = (id, payload) => client.post(ep.journals.verify(id), payload);

/** live/feedbacks.js — apiResource feedbacks (+ review, BR-19). */
import { client } from "../client.js";
import { ep } from "../endpoints.js";
import { liveCrud } from "./_shared.js";

export const { index, show, store, update, destroy } = liveCrud(ep.feedbacks);
export const review = (id, { status } = {}) => client.post(ep.feedbacks.review(id), { status });

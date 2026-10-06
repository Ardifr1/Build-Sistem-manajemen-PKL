/** live/applications.js — pkl-applications + application-documents + application-reviews. */
import { ep } from "../endpoints.js";
import { liveCrud } from "./_shared.js";

export const { index, show, store, update, destroy } = liveCrud(ep.applications);
export const documentsApi = liveCrud(ep.applicationDocuments);
export const reviewsApi = liveCrud(ep.applicationReviews);

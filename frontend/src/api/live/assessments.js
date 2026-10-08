/** live/assessments.js — assessments + assessment-components + final-assessments. */
import { ep } from "../endpoints.js";
import { liveCrud } from "./_shared.js";

export const { index, show, store, update, destroy } = liveCrud(ep.assessments);
export const componentsApi = liveCrud(ep.assessmentComponents);

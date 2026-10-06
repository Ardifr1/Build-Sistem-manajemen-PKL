/** live/companies.js — apiResource companies + company-supervisors. */
import { ep } from "../endpoints.js";
import { liveCrud } from "./_shared.js";

export const { index, show, store, update, destroy } = liveCrud(ep.companies);
export const supervisorsApi = liveCrud(ep.companySupervisors);

import { apiRequest } from "./api";

export function getSiteVisits(params) {
  return apiRequest("/site-visits", { params });
}

export function createSiteVisit(data) {
  return apiRequest("/site-visits", { method: "POST", body: data });
}

export function updateSiteVisit(id, data) {
  return apiRequest(`/site-visits/${id}`, { method: "PATCH", body: data });
}

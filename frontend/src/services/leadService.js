import { apiRequest } from "./api";

export function getLeads(params) {
  return apiRequest("/leads", { params });
}

export function getLead(id) {
  return apiRequest(`/leads/${id}`);
}

export function updateLead(id, data) {
  return apiRequest(`/leads/${id}`, { method: "PATCH", body: data });
}

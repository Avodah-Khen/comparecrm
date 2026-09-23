import { apiRequest } from "./api";

export function getSalesTeam() {
  return apiRequest("/sales-team");
}

export function createSalesTeamMember(data) {
  return apiRequest("/sales-team", { method: "POST", body: data });
}

export function updateSalesTeamMember(id, data) {
  return apiRequest(`/sales-team/${id}`, { method: "PATCH", body: data });
}

import { apiRequest } from "./api";

export function getActivities(leadId) {
  return apiRequest("/activities", { params: { leadId } });
}

export function addActivity(data) {
  return apiRequest("/activities", { method: "POST", body: data });
}

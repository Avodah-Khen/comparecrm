import { apiRequest } from "./api";

export function getDashboardStats() {
  return apiRequest("/dashboard/stats");
}

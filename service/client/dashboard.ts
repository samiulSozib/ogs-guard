// service/client/dashboard.service.ts
import { ApiResponse } from "@/app/types/api.types";
import { ClientDashboardData } from "@/app/types/client/dashboard";
import api, { handleApiResponse } from "../api.service";

export const clientDashboardService = {
  /* ---------- Get Client Dashboard Data ---------- */
  getDashboard: () =>
    handleApiResponse(
      api.get<ApiResponse<ClientDashboardData>>("/client/dashboard")
    ),
};
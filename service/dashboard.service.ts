// service/dashboard.service.ts
import { ApiResponse } from "@/app/types/api.types";
import api, { handleApiResponse } from "./api.service";
import {
  DashboardData,
  ShiftStatusResponse,
  StatsResponse,
} from "@/app/types/dashboard";

export const dashboardService = {
  /* ---------- Get complete dashboard data ---------- */
  getDashboardData: () =>
    handleApiResponse(
      api.get<ApiResponse<DashboardData>>("/guardemployee/dashboard")
    ),

  /* ---------- Get shift status only ---------- */
  getShiftStatus: () =>
    handleApiResponse(
      api.get<ApiResponse<ShiftStatusResponse>>("/guardemployee/dashboard/shift-status")
    ),

  /* ---------- Get dashboard stats only ---------- */
  getDashboardStats: () =>
    handleApiResponse(
      api.get<ApiResponse<StatsResponse>>("/guardemployee/dashboard/stats")
    ),
};
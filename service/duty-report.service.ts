// service/client/duty-report.service.ts
import { ApiResponse } from "@/app/types/api.types";
import {
  DutyReport,
  DutyReportsPaginatedResponse,
  CreateDutyReportData,
  DutyReportFilters,
} from "@/app/types/duty-report.types";
import api, { handleApiResponse } from "./api.service";

export const dutyReportService = {
  /* ---------- Get All Duty Reports ---------- */
  getReports: (filters: DutyReportFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());
    if (filters.guard_assignment_id) params.append('guard_assignment_id', filters.guard_assignment_id.toString());
    if (filters.duty_id) params.append('duty_id', filters.duty_id.toString());
    if (filters.guard_id) params.append('guard_id', filters.guard_id.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.from_date) params.append('from_date', filters.from_date);
    if (filters.to_date) params.append('to_date', filters.to_date);
    
    const queryString = params.toString();
    const url = queryString ? `/guardemployee/duty-status-reports?${queryString}` : '/guardemployee/duty-status-reports';
    
    return handleApiResponse(
      api.get<ApiResponse<DutyReportsPaginatedResponse>>(url)
    );
  },

  /* ---------- Get Single Duty Report ---------- */
  getReport: (reportId: number) =>
    handleApiResponse(
      api.get<ApiResponse<{ report: DutyReport }>>(`/guardemployee/duty-status-reports/${reportId}`)
    ),

  /* ---------- Create Duty Report ---------- */
  createReport: (data: CreateDutyReportData) => {
    const formData = new FormData();
    formData.append('guard_assignment_id', data.guard_assignment_id.toString());
    formData.append('message', data.message);
    formData.append('is_ok', data.is_ok ? '1' : '0');
    formData.append('latitude', data.latitude.toString());
    formData.append('longitude', data.longitude.toString());
    
    if (data.media_file) {
      formData.append('media_file', data.media_file);
    }
    
    return handleApiResponse(
      api.post<ApiResponse<{ report: DutyReport }>>(
        '/guardemployee/duty-status-reports',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
    );
  },
};
// service/client/guard.service.ts
import { ApiResponse } from "@/app/types/api.types";
import {
  Guard,
  GuardsPaginatedResponse,
  GuardFilters,
} from "@/app/types/client/guard.types";
import api, { handleApiResponse } from "../api.service";

export const clientGuardService = {
  /* ---------- Get All Guards with Filters ---------- */
  getGuards: (filters: GuardFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());
    
    const queryString = params.toString();
    const url = queryString ? `/client/guards?${queryString}` : '/client/guards';
    
    return handleApiResponse(
      api.get<ApiResponse<GuardsPaginatedResponse>>(url)
    );
  },

  /* ---------- Get Single Guard ---------- */
  getGuard: (guardId: number) =>
    handleApiResponse(
      api.get<ApiResponse<{ guard: Guard }>>(`/client/guards/${guardId}`)
    ),
};
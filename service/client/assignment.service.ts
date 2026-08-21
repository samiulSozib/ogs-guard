// service/client/assignment.service.ts
import { ApiResponse } from "@/app/types/api.types";
import {
  Assignment,
  AssignmentsPaginatedResponse,
  AssignmentFilters,
  TimelineEvent,
} from "@/app/types/client/assignment";
import api, { handleApiResponse } from "../api.service";

export const clientAssignmentService = {
  /* ---------- Get All Assignments with Filters ---------- */
  getAssignments: (filters: AssignmentFilters = {}) => {
    const params = new URLSearchParams();
    
    // Handle status - for 'all', don't send status parameter
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.from_date) params.append('from_date', filters.from_date);
    if (filters.to_date) params.append('to_date', filters.to_date);
    if (filters.search) params.append('search', filters.search);
    if (filters.per_page) params.append('per_page', filters.per_page.toString());
    if (filters.page) params.append('page', filters.page.toString());
    
    const queryString = params.toString();
    const url = queryString ? `/client/assignments?${queryString}` : '/client/assignments?status=all';
    console.log("Fetching assignments with URL:", queryString); // Debugging line
    
    return handleApiResponse(
      api.get<ApiResponse<AssignmentsPaginatedResponse>>(url)
    );
  },

  /* ---------- Get Single Assignment ---------- */
  getAssignment: (assignmentId: number) =>
    handleApiResponse(
      api.get<ApiResponse<{ assignment: Assignment; timeline: TimelineEvent[] }>>(
        `/client/assignments/${assignmentId}`
      )
    ),
};
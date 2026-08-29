import { ApiResponse } from "@/app/types/api.types";
import api from "./api.service";
import { ShiftLogActionRequest, ShiftLogActionResponse } from "@/app/types/dutyAssignmentReport";

export const dutyAssignmentReportService = {
  logShiftAction: async (data: ShiftLogActionRequest) => {
    try {
      const response = await api.post<ApiResponse<ShiftLogActionResponse>>(
        "/guardemployee/assignments/log-action",
        data
      );

      console.log("API Response:", response.data);

      if (response.data.success && response.data.body) {
        return response.data.body;
      }

      if (!response.data.success) {
        console.log("Error response data:", response.data);
        // Throw the entire response data
        throw response.data;
      }

      throw new Error("Unknown error occurred");
    } catch (error) {
      console.log("Service catch error:", error);

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.log("Axios error response:", axiosError.response?.data);
        if (axiosError.response?.data) {
          // Throw the entire response data
          throw axiosError.response.data;
        }
      }
      throw error;
    }
  },
};

// service/dutyAssignmentReport.service.ts
import { ApiResponse } from "@/app/types/api.types";
import api, { handleApiResponse } from "./api.service";
import { ShiftLogActionRequest, ShiftLogActionResponse } from "@/app/types/dutyAssignmentReport";

export const dutyAssignmentReportService = {
  logShiftAction: (data: ShiftLogActionRequest) =>
    handleApiResponse(
      api.post<ApiResponse<ShiftLogActionResponse>>("/guardemployee/assignments/log-action", data)
    ),
};
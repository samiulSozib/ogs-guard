// store/slices/dutyAssignmentReportSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ShiftLogActionRequest, ShiftLogActionResponse } from "@/app/types/dutyAssignmentReport";
import { dutyAssignmentReportService } from "@/service/dutyAssignmentReport.service";

interface DutyAssignmentReportState {
  isLoading: boolean;
  error: string | null;
  lastAction: ShiftLogActionResponse | null;
}

const initialState: DutyAssignmentReportState = {
  isLoading: false,
  error: null,
  lastAction: null,
};

export const logShiftAction = createAsyncThunk(
  "dutyAssignmentReport/logAction",
  async (data: ShiftLogActionRequest, { rejectWithValue }) => {
    try {
      const response = await dutyAssignmentReportService.logShiftAction(data);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to log shift action";
      return rejectWithValue(message);
    }
  }
);

const dutyAssignmentReportSlice = createSlice({
  name: "dutyAssignmentReport",
  initialState,
  reducers: {
    clearDutyAssignmentReportError: (state) => {
      state.error = null;
    },
    clearLastAction: (state) => {
      state.lastAction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logShiftAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logShiftAction.fulfilled, (state, action: PayloadAction<ShiftLogActionResponse>) => {
        state.isLoading = false;
        state.lastAction = action.payload;
      })
      .addCase(logShiftAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDutyAssignmentReportError, clearLastAction } = dutyAssignmentReportSlice.actions;
export default dutyAssignmentReportSlice.reducer;
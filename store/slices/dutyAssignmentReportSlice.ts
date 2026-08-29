import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  ShiftLogActionRequest,
  ShiftLogActionResponse,
  ApiErrorResponse
} from "@/app/types/dutyAssignmentReport";
import { dutyAssignmentReportService } from "@/service/dutyAssignmentReport.service";

interface DutyAssignmentReportState {
  isLoading: boolean;
  error: string | null;
  lastAction: ShiftLogActionResponse | null;
  errorDetails: ApiErrorResponse | null;
}

const initialState: DutyAssignmentReportState = {
  isLoading: false,
  error: null,
  lastAction: null,
  errorDetails: null,
};

export const logShiftAction = createAsyncThunk(
  "dutyAssignmentReport/logAction",
  async (data: ShiftLogActionRequest, { rejectWithValue }) => {
    try {
      const response = await dutyAssignmentReportService.logShiftAction(data);
      return response;
    } catch (error: any) {
      // If error has response property (axios error)
      if (error?.response?.data?.errors) {
        return rejectWithValue(error.response.data.errors);
      }

      // If error has errors property directly
      if (error?.errors) {
        return rejectWithValue(error.errors);
      }

      // If error has message with distance
      if (error?.message && error?.distance_meters !== undefined) {
        return rejectWithValue(error);
      }

      // If error is a string
      if (typeof error === 'string') {
        return rejectWithValue({ message: error });
      }

      // Default error
      return rejectWithValue({
        message: error?.message || "Failed to log shift action"
      });
    }
  }
);

const dutyAssignmentReportSlice = createSlice({
  name: "dutyAssignmentReport",
  initialState,
  reducers: {
    clearDutyAssignmentReportError: (state) => {
      state.error = null;
      state.errorDetails = null;
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
        state.errorDetails = null;
      })
      .addCase(logShiftAction.fulfilled, (state, action: PayloadAction<ShiftLogActionResponse>) => {
        state.isLoading = false;
        state.lastAction = action.payload;
        state.error = null;
        state.errorDetails = null;
      })
      .addCase(logShiftAction.rejected, (state, action) => {
        state.isLoading = false;

        const payload = action.payload as any;

        if (payload) {
          // Check if payload has message with distance
          if (payload.message && payload.distance_meters !== undefined) {
            state.errorDetails = payload;
            state.error = payload.message;
            return;
          }

          // Check if payload has message
          if (payload.message) {
            state.error = payload.message;
            state.errorDetails = null;
            return;
          }
        }

        state.error = "Failed to log shift action";
        state.errorDetails = null;
      });
  },
});

export const { clearDutyAssignmentReportError, clearLastAction } = dutyAssignmentReportSlice.actions;
export default dutyAssignmentReportSlice.reducer;

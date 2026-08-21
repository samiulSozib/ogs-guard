// store/slices/client/dutyReportSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { dutyReportService } from "@/service/duty-report.service";
import {
  DutyReport,
  DutyReportsState,
  CreateDutyReportData,
  DutyReportFilters,
} from "@/app/types/duty-report.types";

/* ------------------ Initial State ------------------ */

const initialState: DutyReportsState = {
  reports: [],
  currentReport: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  pagination: null,
};

/* ------------------ Thunks ------------------ */

// Get all duty reports with filters
export const fetchDutyReports = createAsyncThunk(
  "dutyReports/fetchDutyReports",
  async (filters: DutyReportFilters = {}, { rejectWithValue }) => {
    try {
      const response = await dutyReportService.getReports(filters);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch duty reports";
      return rejectWithValue(message);
    }
  }
);

// Get single duty report
export const fetchDutyReportById = createAsyncThunk(
  "dutyReports/fetchDutyReportById",
  async (reportId: number, { rejectWithValue }) => {
    try {
      const response = await dutyReportService.getReport(reportId);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch duty report";
      return rejectWithValue(message);
    }
  }
);

// Create duty report
export const createDutyReport = createAsyncThunk(
  "dutyReports/createDutyReport",
  async (data: CreateDutyReportData, { rejectWithValue }) => {
    try {
      const response = await dutyReportService.createReport(data);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create duty report";
      return rejectWithValue(message);
    }
  }
);

/* ------------------ Slice ------------------ */

const dutyReportSlice = createSlice({
  name: "dutyReports",
  initialState,
  reducers: {
    clearReportsError: (state) => {
      state.error = null;
    },
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
    clearReports: (state) => {
      state.reports = [];
      state.pagination = null;
    },
    resetSubmitStatus: (state) => {
      state.isSubmitting = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- Fetch Reports ---------- */
      .addCase(fetchDutyReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDutyReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = action.payload.items;
        // Ensure pagination data has all required fields
        state.pagination = {
          current_page: action.payload.data.current_page,
          last_page: action.payload.data.last_page,
          total: action.payload.data.total,
          per_page: action.payload.data.per_page || 10, // Provide default if undefined
        };
        state.error = null;
      })
      .addCase(fetchDutyReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      /* ---------- Fetch Single Report ---------- */
      .addCase(fetchDutyReportById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDutyReportById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentReport = action.payload.report;
        state.error = null;
      })
      .addCase(fetchDutyReportById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      /* ---------- Create Report ---------- */
      .addCase(createDutyReport.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createDutyReport.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.reports.unshift(action.payload.report);
        state.error = null;
      })
      .addCase(createDutyReport.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearReportsError,
  clearCurrentReport,
  clearReports,
  resetSubmitStatus,
} = dutyReportSlice.actions;

export default dutyReportSlice.reducer;
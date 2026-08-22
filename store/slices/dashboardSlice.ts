// store/slices/dashboardSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { dashboardService } from "@/service/dashboard.service";
import {
  DashboardData,
  DashboardState,
  DashboardShiftStatus,
  DashboardStats,
  DashboardTask,
  DashboardApiResponse,
  ShiftStatusApiResponse,
  StatsApiResponse,
} from "@/app/types/dashboard";

/* ------------------ Initial State ------------------ */

const initialState: DashboardState = {
  dashboardData: null,
  shiftStatus: null,
  stats: null,
  tasks: [],
  isLoadingDashboard: false,
  isLoadingShiftStatus: false,
  isLoadingStats: false,
  isLoadingTasks: false,
  dashboardError: null,
  shiftStatusError: null,
  statsError: null,
  tasksError: null,
};

/* ------------------ Thunks ------------------ */

// Fetch complete dashboard data
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getDashboardData();
      // The response body contains the dashboard data directly
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch dashboard data";
      return rejectWithValue(message);
    }
  }
);

// Fetch shift status only
export const fetchShiftStatus = createAsyncThunk(
  "dashboard/fetchShiftStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getShiftStatus();
      return response.shift_status;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch shift status";
      return rejectWithValue(message);
    }
  }
);

// Fetch dashboard stats only
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getDashboardStats();
      return response.stats;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch dashboard stats";
      return rejectWithValue(message);
    }
  }
);

/* ------------------ Slice ------------------ */

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardErrors: (state) => {
      state.dashboardError = null;
      state.shiftStatusError = null;
      state.statsError = null;
      state.tasksError = null;
    },
    clearDashboardData: (state) => {
      state.dashboardData = null;
      state.shiftStatus = null;
      state.stats = null;
      state.tasks = [];
    },
    updateShiftStatus: (state, action: PayloadAction<Partial<DashboardShiftStatus>>) => {
      if (state.shiftStatus) {
        state.shiftStatus = { ...state.shiftStatus, ...action.payload };
      }
      if (state.dashboardData) {
        state.dashboardData.shift_status = { ...state.dashboardData.shift_status, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- Fetch Dashboard Data ---------- */
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoadingDashboard = true;
        state.dashboardError = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action: PayloadAction<DashboardData>) => {
        state.isLoadingDashboard = false;
        state.dashboardData = action.payload;
        state.shiftStatus = action.payload.shift_status;
        state.stats = action.payload.stats;
        state.tasks = action.payload.tasks;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoadingDashboard = false;
        state.dashboardError = action.payload as string;
      })

      /* ---------- Fetch Shift Status ---------- */
      .addCase(fetchShiftStatus.pending, (state) => {
        state.isLoadingShiftStatus = true;
        state.shiftStatusError = null;
      })
      .addCase(fetchShiftStatus.fulfilled, (state, action: PayloadAction<DashboardShiftStatus>) => {
        state.isLoadingShiftStatus = false;
        state.shiftStatus = action.payload;
        if (state.dashboardData) {
          state.dashboardData.shift_status = action.payload;
        }
      })
      .addCase(fetchShiftStatus.rejected, (state, action) => {
        state.isLoadingShiftStatus = false;
        state.shiftStatusError = action.payload as string;
      })

      /* ---------- Fetch Dashboard Stats ---------- */
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoadingStats = true;
        state.statsError = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action: PayloadAction<DashboardStats>) => {
        state.isLoadingStats = false;
        state.stats = action.payload;
        if (state.dashboardData) {
          state.dashboardData.stats = action.payload;
        }
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoadingStats = false;
        state.statsError = action.payload as string;
      });
  },
});

/* ------------------ Exports ------------------ */

export const {
  clearDashboardErrors,
  clearDashboardData,
  updateShiftStatus,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;

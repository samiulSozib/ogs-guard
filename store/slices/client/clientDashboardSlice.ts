// store/slices/clientDashboardSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { clientDashboardService } from "@/service/client/dashboard";
import { ClientDashboardData, ClientDashboardState } from "@/app/types/client/dashboard";

/* ------------------ Initial State ------------------ */

const initialState: ClientDashboardState = {
  dashboardData: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

/* ------------------ Thunks ------------------ */

// Fetch client dashboard data
export const fetchClientDashboard = createAsyncThunk(
  "clientDashboard/fetch",
  async (_, { rejectWithValue, getState }) => {
    try {
      // Optional: Check if we need to refresh based on lastFetched
      const state = getState() as { clientDashboard: ClientDashboardState };
      const lastFetched = state.clientDashboard.lastFetched;
      const now = Date.now();

      // If data was fetched in the last 30 seconds, don't refetch (optional)
      if (lastFetched && (now - lastFetched) < 30000) {
        return state.clientDashboard.dashboardData;
      }

      const response = await clientDashboardService.getDashboard();
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch dashboard data";
      return rejectWithValue(message);
    }
  }
);

// Refresh dashboard (force refresh)
export const refreshClientDashboard = createAsyncThunk(
  "clientDashboard/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const response = await clientDashboardService.getDashboard();
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to refresh dashboard data";
      return rejectWithValue(message);
    }
  }
);

/* ------------------ Slice ------------------ */

const clientDashboardSlice = createSlice({
  name: "clientDashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
    clearDashboardData: (state) => {
      state.dashboardData = null;
      state.error = null;
      state.lastFetched = null;
    },
    updateDashboardStats: (state, action: PayloadAction<Partial<ClientDashboardData['stats']>>) => {
      if (state.dashboardData) {
        state.dashboardData.stats = {
          ...state.dashboardData.stats,
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- Fetch Dashboard ---------- */
      .addCase(fetchClientDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClientDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardData = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchClientDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      /* ---------- Refresh Dashboard ---------- */
      .addCase(refreshClientDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshClientDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardData = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(refreshClientDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearDashboardError,
  clearDashboardData,
  updateDashboardStats,
} = clientDashboardSlice.actions;

export default clientDashboardSlice.reducer;
// store/slices/client/guardSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { clientGuardService } from "@/service/client/guard.service";
import {
  Guard,
  GuardsState,
  GuardFilters,
} from "@/app/types/client/guard.types";

/* ------------------ Initial State ------------------ */

const initialState: GuardsState = {
  guards: [],
  currentGuard: null,
  isLoading: false,
  error: null,
  pagination: null,
  filters: {
    status: null,
    search: '',
    page: 1,
    per_page: 20,
  },
};

/* ------------------ Thunks ------------------ */

// Get all guards with filters
export const fetchGuards = createAsyncThunk(
  "clientGuards/fetchGuards",
  async (filters: GuardFilters = {}, { rejectWithValue }) => {
    try {
      const response = await clientGuardService.getGuards(filters);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch guards";
      return rejectWithValue(message);
    }
  }
);

// Get single guard
export const fetchGuardById = createAsyncThunk(
  "clientGuards/fetchGuardById",
  async (guardId: number, { rejectWithValue }) => {
    try {
      const response = await clientGuardService.getGuard(guardId);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch guard";
      return rejectWithValue(message);
    }
  }
);

// Get online guards
export const fetchOnlineGuards = createAsyncThunk(
  "clientGuards/fetchOnlineGuards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await clientGuardService.getGuards({ status: 'online' });
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch online guards";
      return rejectWithValue(message);
    }
  }
);

// Get offline guards
export const fetchOfflineGuards = createAsyncThunk(
  "clientGuards/fetchOfflineGuards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await clientGuardService.getGuards({ status: 'offline' });
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch offline guards";
      return rejectWithValue(message);
    }
  }
);

/* ------------------ Slice ------------------ */

const clientGuardsSlice = createSlice({
  name: "clientGuards",
  initialState,
  reducers: {
    clearGuardsError: (state) => {
      state.error = null;
    },
    clearCurrentGuard: (state) => {
      state.currentGuard = null;
    },
    clearGuards: (state) => {
      state.guards = [];
      state.pagination = null;
    },
    setGuardFilters: (state, action: PayloadAction<GuardFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetGuardFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- Fetch Guards ---------- */
      .addCase(fetchGuards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGuards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.guards = action.payload.items;
        state.pagination = action.payload.data;
        state.filters = {
          ...state.filters,
          status: action.payload.filters.status as any,
          search: action.payload.filters.search,
        };
        state.error = null;
      })
      .addCase(fetchGuards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      /* ---------- Fetch Single Guard ---------- */
      .addCase(fetchGuardById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGuardById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGuard = action.payload.guard;
        state.error = null;
      })
      .addCase(fetchGuardById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      /* ---------- Fetch Online Guards ---------- */
      .addCase(fetchOnlineGuards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOnlineGuards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.guards = action.payload.items;
        state.pagination = action.payload.data;
        state.error = null;
      })
      .addCase(fetchOnlineGuards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      /* ---------- Fetch Offline Guards ---------- */
      .addCase(fetchOfflineGuards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOfflineGuards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.guards = action.payload.items;
        state.pagination = action.payload.data;
        state.error = null;
      })
      .addCase(fetchOfflineGuards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearGuardsError,
  clearCurrentGuard,
  clearGuards,
  setGuardFilters,
  resetGuardFilters,
} = clientGuardsSlice.actions;

export default clientGuardsSlice.reducer;
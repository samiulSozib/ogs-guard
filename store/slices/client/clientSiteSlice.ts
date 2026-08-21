// store/slices/clientSitesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { clientSitesService } from "@/service/client/clientSite";
import {
  Site,
  SitesState,
  CreateSiteData,
  UpdateSiteData,
  CreateLocationData,
  UpdateLocationData,
  SiteLocation,
} from "@/app/types/client/clientSite";

/* ------------------ Initial State ------------------ */

const initialState: SitesState = {
  sites: [],
  currentSite: null,
  locations: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  pagination: null,
};

/* ------------------ Thunks ------------------ */

// Get all sites
export const fetchSites = createAsyncThunk(
  "clientSites/fetchSites",
  async ({ page = 1, perPage = 20 }: { page?: number; perPage?: number }, { rejectWithValue }) => {
    try {
      const response = await clientSitesService.getSites(page, perPage);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch sites";
      return rejectWithValue(message);
    }
  }
);

// Get single site
export const fetchSiteById = createAsyncThunk(
  "clientSites/fetchSiteById",
  async (siteId: number, { rejectWithValue }) => {
    try {
      const response = await clientSitesService.getSite(siteId);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch site";
      return rejectWithValue(message);
    }
  }
);

// Create site
export const createSite = createAsyncThunk(
  "clientSites/createSite",
  async (data: CreateSiteData, { rejectWithValue }) => {
    try {
      const response = await clientSitesService.createSite(data);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create site";
      return rejectWithValue(message);
    }
  }
);

// Update site
export const updateSite = createAsyncThunk(
  "clientSites/updateSite",
  async ({ siteId, data }: { siteId: number; data: UpdateSiteData }, { rejectWithValue }) => {
    try {
      const response = await clientSitesService.updateSite(siteId, data);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update site";
      return rejectWithValue(message);
    }
  }
);

// Delete site
export const deleteSite = createAsyncThunk(
  "clientSites/deleteSite",
  async (siteId: number, { rejectWithValue }) => {
    try {
      await clientSitesService.deleteSite(siteId);
      return siteId;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete site";
      return rejectWithValue(message);
    }
  }
);

// Get site locations
export const fetchSiteLocations = createAsyncThunk(
  "clientSites/fetchSiteLocations",
  async (siteId: number, { rejectWithValue }) => {
    try {
      const response = await clientSitesService.getSiteLocations(siteId);
      return { locations: response.items, siteInfo: response.data };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch locations";
      return rejectWithValue(message);
    }
  }
);

// Create location
export const createLocation = createAsyncThunk(
  "clientSites/createLocation",
  async ({ siteId, data }: { siteId: number; data: CreateLocationData }, { rejectWithValue }) => {
    try {
      const response = await clientSitesService.createLocation(siteId, data);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create location";
      return rejectWithValue(message);
    }
  }
);

// Update location
export const updateLocation = createAsyncThunk(
  "clientSites/updateLocation",
  async (
    { siteId, locationId, data }: { siteId: number; locationId: number; data: UpdateLocationData },
    { rejectWithValue }
  ) => {
    try {
      const response = await clientSitesService.updateLocation(siteId, locationId, data);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update location";
      return rejectWithValue(message);
    }
  }
);

// Delete location
export const deleteLocation = createAsyncThunk(
  "clientSites/deleteLocation",
  async ({ siteId, locationId }: { siteId: number; locationId: number }, { rejectWithValue }) => {
    try {
      await clientSitesService.deleteLocation(siteId, locationId);
      return locationId;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete location";
      return rejectWithValue(message);
    }
  }
);

/* ------------------ Slice ------------------ */

const clientSitesSlice = createSlice({
  name: "clientSites",
  initialState,
  reducers: {
    clearSitesError: (state) => {
      state.error = null;
    },
    clearCurrentSite: (state) => {
      state.currentSite = null;
    },
    clearLocations: (state) => {
      state.locations = [];
    },
    resetSitesState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      /* ---------- Fetch Sites ---------- */
      .addCase(fetchSites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sites = action.payload.items;
        state.pagination = action.payload.data;
        state.error = null;
      })
      .addCase(fetchSites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      /* ---------- Fetch Single Site ---------- */
      .addCase(fetchSiteById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSiteById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSite = action.payload;
        state.error = null;
      })
      .addCase(fetchSiteById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      /* ---------- Create Site ---------- */
      .addCase(createSite.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createSite.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.sites.unshift(action.payload);
        state.error = null;
      })
      .addCase(createSite.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      /* ---------- Update Site ---------- */
      .addCase(updateSite.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateSite.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const index = state.sites.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.sites[index] = action.payload;
        }
        if (state.currentSite?.id === action.payload.id) {
          state.currentSite = action.payload;
        }
        state.error = null;
      })
      .addCase(updateSite.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      /* ---------- Delete Site ---------- */
      .addCase(deleteSite.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteSite.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.sites = state.sites.filter((s) => s.id !== action.payload);
        if (state.currentSite?.id === action.payload) {
          state.currentSite = null;
        }
        state.error = null;
      })
      .addCase(deleteSite.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      /* ---------- Fetch Locations ---------- */
      .addCase(fetchSiteLocations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSiteLocations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.locations = action.payload.locations;
        state.error = null;
      })
      .addCase(fetchSiteLocations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      /* ---------- Create Location ---------- */
      .addCase(createLocation.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createLocation.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.locations.push(action.payload);
        state.error = null;
      })
      .addCase(createLocation.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      /* ---------- Update Location ---------- */
      .addCase(updateLocation.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const index = state.locations.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) {
          state.locations[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateLocation.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      /* ---------- Delete Location ---------- */
      .addCase(deleteLocation.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.locations = state.locations.filter((l) => l.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteLocation.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearSitesError,
  clearCurrentSite,
  clearLocations,
  resetSitesState,
} = clientSitesSlice.actions;

export default clientSitesSlice.reducer;
// store/slices/clientAssignmentsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { clientAssignmentService } from "@/service/client/assignment.service";
import {
    Assignment,
    AssignmentsState,
    AssignmentFilters,
    FilterStatus,
} from "@/app/types/client/assignment";

/* ------------------ Initial State ------------------ */

const initialState: AssignmentsState = {
    assignments: [],
    currentAssignment: null,
    isLoading: false,
    error: null,
    pagination: null,
    filters: {
        status: 'all' as FilterStatus,
        from_date: null,
        to_date: null,
        search: '',
        per_page: 20,
    },
};

/* ------------------ Thunks ------------------ */

// Get all assignments with filters
// store/slices/client/assignmentSlice.ts (or wherever your slice is)

// Update the fetchAssignments thunk to handle page parameter
export const fetchAssignments = createAsyncThunk(
  "clientAssignments/fetchAssignments",
  async (filters: AssignmentFilters = {}, { rejectWithValue }) => {
    try {
      const response = await clientAssignmentService.getAssignments(filters);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch assignments";
      return rejectWithValue(message);
    }
  }
);

// Get single assignment
export const fetchAssignmentById = createAsyncThunk(
    "clientAssignments/fetchAssignmentById",
    async (assignmentId: number, { rejectWithValue }) => {
        try {
            const response = await clientAssignmentService.getAssignment(assignmentId);
            return response;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to fetch assignment";
            return rejectWithValue(message);
        }
    }
);

// Get current assignments
export const fetchCurrentAssignments = createAsyncThunk(
    "clientAssignments/fetchCurrentAssignments",
    async (_, { rejectWithValue }) => {
        try {
            const response = await clientAssignmentService.getAssignments({ status: 'current' });
            return response;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to fetch current assignments";
            return rejectWithValue(message);
        }
    }
);

// Get upcoming assignments
export const fetchUpcomingAssignments = createAsyncThunk(
    "clientAssignments/fetchUpcomingAssignments",
    async (_, { rejectWithValue }) => {
        try {
            const response = await clientAssignmentService.getAssignments({ status: 'upcoming' });
            return response;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to fetch upcoming assignments";
            return rejectWithValue(message);
        }
    }
);

// Get past assignments
export const fetchPastAssignments = createAsyncThunk(
    "clientAssignments/fetchPastAssignments",
    async ({ from_date, to_date }: { from_date?: string; to_date?: string }, { rejectWithValue }) => {
        try {
            const response = await clientAssignmentService.getAssignments({
                status: 'past',
                from_date,
                to_date
            });
            return response;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to fetch past assignments";
            return rejectWithValue(message);
        }
    }
);

/* ------------------ Slice ------------------ */

const clientAssignmentsSlice = createSlice({
    name: "clientAssignments",
    initialState,
    reducers: {
        clearAssignmentsError: (state) => {
            state.error = null;
        },
        clearCurrentAssignment: (state) => {
            state.currentAssignment = null;
        },
        clearAssignments: (state) => {
            state.assignments = [];
            state.pagination = null;
        },
        setAssignmentFilters: (state, action: PayloadAction<AssignmentFilters>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetAssignmentFilters: (state) => {
            state.filters = {
                status: 'all',
                from_date: null,
                to_date: null,
                search: '',
                per_page: 20,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            /* ---------- Fetch Assignments ---------- */
            .addCase(fetchAssignments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAssignments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.assignments = action.payload.items;
                state.pagination = action.payload.data;
                state.filters = {
                    status: (action.payload.filters.status as FilterStatus) || 'all',
                    from_date: action.payload.filters.from_date,
                    to_date: action.payload.filters.to_date,
                    search: action.payload.filters.search,
                    per_page: state.filters.per_page,
                };
                state.error = null;
            })
            .addCase(fetchAssignments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            /* ---------- Fetch Single Assignment ---------- */
            .addCase(fetchAssignmentById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAssignmentById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentAssignment = action.payload.assignment;
                state.error = null;
            })
            .addCase(fetchAssignmentById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            /* ---------- Fetch Current Assignments ---------- */
            .addCase(fetchCurrentAssignments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCurrentAssignments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.assignments = action.payload.items;
                state.pagination = action.payload.data;
                state.error = null;
            })
            .addCase(fetchCurrentAssignments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            /* ---------- Fetch Upcoming Assignments ---------- */
            .addCase(fetchUpcomingAssignments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUpcomingAssignments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.assignments = action.payload.items;
                state.pagination = action.payload.data;
                state.error = null;
            })
            .addCase(fetchUpcomingAssignments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            /* ---------- Fetch Past Assignments ---------- */
            .addCase(fetchPastAssignments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPastAssignments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.assignments = action.payload.items;
                state.pagination = action.payload.data;
                state.error = null;
            })
            .addCase(fetchPastAssignments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    clearAssignmentsError,
    clearCurrentAssignment,
    clearAssignments,
    setAssignmentFilters,
    resetAssignmentFilters,
} = clientAssignmentsSlice.actions;

export default clientAssignmentsSlice.reducer;
// store/slices/profile.slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { profileService } from "@/service/profile.service";
import {
    Guard,
    ProfileState,
    UpdateGuardProfile,
    ChangePasswordDto,
    ForgotPasswordDto,
    ResetPasswordDto,
} from "@/app/types/profile";

/* ------------------ Initial State ------------------ */

const initialState: ProfileState = {
    guard: null,
    user: null,
    isLoading: false,
    isUpdating: false,
    isChangingPassword: false,
    isSendingResetLink: false,
    isResettingPassword: false,
    error: null,
    successMessage: null,
};

/* ------------------ Thunks ------------------ */

// Fetch current profile
export const fetchCurrentProfile = createAsyncThunk(
    "profile/fetchCurrentProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await profileService.getCurrentProfile();
            return response;
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch profile";
            return rejectWithValue(message);
        }
    }
);

// Update profile
export const updateProfile = createAsyncThunk(
    "profile/updateProfile",
    async (data: UpdateGuardProfile | FormData, { rejectWithValue }) => {
        try {
            const response = await profileService.updateProfile(data);
            return response;
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to update profile";
            return rejectWithValue(message);
        }
    }
);

// Change password
export const changePassword = createAsyncThunk(
    "profile/changePassword",
    async (data: ChangePasswordDto, { rejectWithValue }) => {
        try {
            const response = await profileService.changePassword(data);
            return response;
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to change password";
            return rejectWithValue(message);
        }
    }
);

// Forgot password - send reset email
export const forgotPassword = createAsyncThunk(
    "profile/forgotPassword",
    async (data: ForgotPasswordDto, { rejectWithValue }) => {
        try {
            const response = await profileService.forgotPassword(data);
            return response;
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to send reset link";
            return rejectWithValue(message);
        }
    }
);

// Reset password with token
export const resetPassword = createAsyncThunk(
    "profile/resetPassword",
    async (data: ResetPasswordDto, { rejectWithValue }) => {
        try {
            const response = await profileService.resetPassword(data);
            return response;
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to reset password";
            return rejectWithValue(message);
        }
    }
);

/* ------------------ Slice ------------------ */

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        clearProfileError: (state) => {
            state.error = null;
        },
        clearProfileSuccess: (state) => {
            state.successMessage = null;
        },
        clearProfileState: (state) => {
            state.guard = null;
            state.user = null;
            state.error = null;
            state.successMessage = null;
        },
        updateGuardLocally: (state, action: PayloadAction<Partial<Guard>>) => {
            if (state.guard) {
                state.guard = { ...state.guard, ...action.payload };
            }
        },
        updateProfileImage: (state, action: PayloadAction<string>) => {
            if (state.guard) {
                state.guard.profile_image_url = action.payload;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            /* ---------- Fetch profile ---------- */
            .addCase(fetchCurrentProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCurrentProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.guard = action.payload.guard;
                state.user = action.payload.user;
            })
            .addCase(fetchCurrentProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            /* ---------- Update profile ---------- */
            .addCase(updateProfile.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isUpdating = false;
                state.guard = action.payload.guard;
                state.successMessage = "Profile updated successfully";
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload as string;
            })

            /* ---------- Change password ---------- */
            .addCase(changePassword.pending, (state) => {
                state.isChangingPassword = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.isChangingPassword = false;
                state.successMessage = action.payload.message || "Password changed successfully";
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isChangingPassword = false;
                state.error = action.payload as string;
            })

            /* ---------- Forgot password ---------- */
            .addCase(forgotPassword.pending, (state) => {
                state.isSendingResetLink = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.isSendingResetLink = false;
                state.successMessage = action.payload.message || "Reset link sent to your email";
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isSendingResetLink = false;
                state.error = action.payload as string;
            })

            /* ---------- Reset password ---------- */
            .addCase(resetPassword.pending, (state) => {
                state.isResettingPassword = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.isResettingPassword = false;
                state.successMessage = action.payload.message || "Password reset successfully";
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isResettingPassword = false;
                state.error = action.payload as string;
            });
    },
});

/* ------------------ Exports ------------------ */

export const {
    clearProfileError,
    clearProfileSuccess,
    clearProfileState,
    updateGuardLocally,
    updateProfileImage,
} = profileSlice.actions;

export default profileSlice.reducer;

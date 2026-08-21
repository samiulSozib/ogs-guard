// store/slices/clientSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Client,
  ClientState,
  UpdateClientProfile,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ClientRegisterData,
  ClientLoginCredentials,
} from "@/app/types/client/client.types";
import { clientService } from "@/service/client/client.service";

/* ------------------ Initial State ------------------ */

const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('client_token');
  }
  return null;
};

const getInitialClient = () => {
  if (typeof window !== 'undefined') {
    const client = localStorage.getItem('client_user');
    return client ? JSON.parse(client) : null;
  }
  return null;
};

const initialState: ClientState = {
  client: getInitialClient(),
  user: null,
  token: getInitialToken(),
  isLoading: false,
  isUpdating: false,
  isChangingPassword: false,
  isSendingResetLink: false,
  isResettingPassword: false,
  isRegistering: false,
  isRegistered: false,
  error: null,
  successMessage: null,
};

/* ------------------ Thunks ------------------ */

// Client Login
export const clientLogin = createAsyncThunk(
  "client/login",
  async (credentials: ClientLoginCredentials, { rejectWithValue }) => {
    try {
      const response = await clientService.login(credentials);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('client_token', response.token);
        localStorage.setItem('client_user', JSON.stringify(response.client));
        localStorage.setItem('user_type', 'client');
      }
      
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      return rejectWithValue(message);
    }
  }
);

// Client Register
export const clientRegister = createAsyncThunk(
  "client/register",
  async (data: ClientRegisterData | FormData, { rejectWithValue }) => {
    try {
      const response = await clientService.register(data);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Registration failed";
      return rejectWithValue(message);
    }
  }
);

// Fetch current client profile
export const fetchCurrentClient = createAsyncThunk(
  "client/fetchCurrentClient",
  async (_, { rejectWithValue }) => {
    try {
      const response = await clientService.getCurrentProfile();
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch profile";
      return rejectWithValue(message);
    }
  }
);

// Update client profile
export const updateClientProfile = createAsyncThunk(
  "client/updateProfile",
  async (data: UpdateClientProfile | FormData, { rejectWithValue }) => {
    try {
      const response = await clientService.updateProfile(data);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      return rejectWithValue(message);
    }
  }
);

// Change password
export const clientChangePassword = createAsyncThunk(
  "client/changePassword",
  async (data: ChangePasswordDto, { rejectWithValue }) => {
    try {
      const response = await clientService.changePassword(data);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to change password";
      return rejectWithValue(message);
    }
  }
);

// Forgot password
export const clientForgotPassword = createAsyncThunk(
  "client/forgotPassword",
  async (data: ForgotPasswordDto, { rejectWithValue }) => {
    try {
      const response = await clientService.forgotPassword(data);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to send reset link";
      return rejectWithValue(message);
    }
  }
);

// Reset password
export const clientResetPassword = createAsyncThunk(
  "client/resetPassword",
  async (data: ResetPasswordDto, { rejectWithValue }) => {
    try {
      const response = await clientService.resetPassword(data);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to reset password";
      return rejectWithValue(message);
    }
  }
);

// Client Logout
export const clientLogout = createAsyncThunk("client/logout", async () => {
  clientService.logout();
});

/* ------------------ Slice ------------------ */

const clientProfileSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    clearClientError: (state) => {
      state.error = null;
    },
    clearClientSuccess: (state) => {
      state.successMessage = null;
    },
    clearClientState: (state) => {
      state.client = null;
      state.user = null;
      state.token = null;
      state.error = null;
      state.successMessage = null;
      state.isRegistered = false;
    },
    updateClientLocally: (state, action: PayloadAction<Partial<Client>>) => {
      if (state.client) {
        state.client = { ...state.client, ...action.payload };
      }
    },
    resetClientRegisterState: (state) => {
      state.isRegistering = false;
      state.isRegistered = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- Login ---------- */
      .addCase(clientLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clientLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.client = action.payload.client;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(clientLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      /* ---------- Register ---------- */
      .addCase(clientRegister.pending, (state) => {
        state.isRegistering = true;
        state.isRegistered = false;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(clientRegister.fulfilled, (state, action) => {
        state.isRegistering = false;
        state.isRegistered = true;
        state.successMessage = "Registration successful! Please login.";
      })
      .addCase(clientRegister.rejected, (state, action) => {
        state.isRegistering = false;
        state.isRegistered = false;
        state.error = action.payload as string;
      })

      /* ---------- Fetch profile ---------- */
      .addCase(fetchCurrentClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.client = action.payload.client;
        state.user = action.payload.user;
      })
      .addCase(fetchCurrentClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      /* ---------- Update profile ---------- */
      .addCase(updateClientProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateClientProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.client = action.payload.client;
        state.successMessage = "Profile updated successfully";
        if (typeof window !== 'undefined') {
          localStorage.setItem('client_user', JSON.stringify(action.payload.client));
        }
      })
      .addCase(updateClientProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      /* ---------- Change password ---------- */
      .addCase(clientChangePassword.pending, (state) => {
        state.isChangingPassword = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(clientChangePassword.fulfilled, (state, action) => {
        state.isChangingPassword = false;
        state.successMessage = action.payload.message || "Password changed successfully";
      })
      .addCase(clientChangePassword.rejected, (state, action) => {
        state.isChangingPassword = false;
        state.error = action.payload as string;
      })

      /* ---------- Forgot password ---------- */
      .addCase(clientForgotPassword.pending, (state) => {
        state.isSendingResetLink = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(clientForgotPassword.fulfilled, (state, action) => {
        state.isSendingResetLink = false;
        state.successMessage = action.payload.message || "Reset link sent to your email";
      })
      .addCase(clientForgotPassword.rejected, (state, action) => {
        state.isSendingResetLink = false;
        state.error = action.payload as string;
      })

      /* ---------- Reset password ---------- */
      .addCase(clientResetPassword.pending, (state) => {
        state.isResettingPassword = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(clientResetPassword.fulfilled, (state, action) => {
        state.isResettingPassword = false;
        state.successMessage = action.payload.message || "Password reset successfully";
      })
      .addCase(clientResetPassword.rejected, (state, action) => {
        state.isResettingPassword = false;
        state.error = action.payload as string;
      })

      /* ---------- Logout ---------- */
      .addCase(clientLogout.fulfilled, (state) => {
        state.client = null;
        state.user = null;
        state.token = null;
        state.error = null;
        state.successMessage = null;
      });
  },
});

export const {
  clearClientError,
  clearClientSuccess,
  clearClientState,
  updateClientLocally,
  resetClientRegisterState,
} = clientProfileSlice.actions;

export default clientProfileSlice.reducer;
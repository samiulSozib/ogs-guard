// service/client.service.ts
import { ApiResponse } from "@/app/types/api.types";
import {
  ClientLoginCredentials,
  ClientRegisterData,
  ClientLoginResponse,
  ClientProfileResponse,
  UpdateClientProfile,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "@/app/types/client/client.types";
import api, { handleApiResponse } from "../api.service";

const clientApi = api;

export const clientService = {
  /* ---------- Client Login ---------- */
  login: (credentials: ClientLoginCredentials) =>
    handleApiResponse(
      clientApi.post<ApiResponse<ClientLoginResponse>>('/client/auth/login', credentials)
    ),

  /* ---------- Client Register ---------- */
  register: (data: ClientRegisterData | FormData) =>
    handleApiResponse(
      clientApi.post<ApiResponse<ClientLoginResponse>>(
        '/client/auth/register',
        data,
        {
          headers:
            data instanceof FormData
              ? { "Content-Type": "multipart/form-data" }
              : { "Content-Type": "application/json" },
        }
      )
    ),

  /* ---------- Get current client profile ---------- */
  getCurrentProfile: () =>
    handleApiResponse(
      clientApi.get<ApiResponse<ClientProfileResponse>>("/client/auth/me")
    ),

  /* ---------- Update client profile ---------- */
  updateProfile: (data: UpdateClientProfile | FormData) =>
    handleApiResponse(
      clientApi.put<ApiResponse<{ client: any }>>(
        "/client/auth/update-profile",
        data,
        {
          headers:
            data instanceof FormData
              ? { "Content-Type": "multipart/form-data" }
              : { "Content-Type": "application/json" },
        }
      )
    ),

  /* ---------- Change password ---------- */
  changePassword: (data: ChangePasswordDto) =>
    handleApiResponse(
      clientApi.post<ApiResponse<{ message: string }>>(
        "/client/auth/change-password",
        data
      )
    ),

  /* ---------- Forgot password - Send reset email ---------- */
  forgotPassword: (data: ForgotPasswordDto) =>
    handleApiResponse(
      clientApi.post<ApiResponse<{ message: string }>>(
        "/client/auth/forgot-password",
        data
      )
    ),

  /* ---------- Reset password with token ---------- */
  resetPassword: (data: ResetPasswordDto) =>
    handleApiResponse(
      clientApi.post<ApiResponse<{ message: string }>>(
        "/client/auth/reset-password",
        data
      )
    ),

  /* ---------- Resend verification email ---------- */
  resendVerification: () =>
    handleApiResponse(
      clientApi.post<ApiResponse<{ message: string }>>(
        "/client/auth/resend-verification",
        {}
      )
    ),

  /* ---------- Logout ---------- */
  logout: () => {
    localStorage.removeItem('client_token');
    localStorage.removeItem('client_user');
    localStorage.removeItem('user_type');
  },
};
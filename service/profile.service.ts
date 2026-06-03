// service/profile.service.ts
import { ApiResponse } from "@/app/types/api.types";
import {
  ChangePasswordDto,
  Guard,
  UpdateGuardProfile,
  ForgotPasswordDto,
  ResetPasswordDto,
  RegisterData,
  RegisterResponse
} from "@/app/types/profile";
import api, { handleApiResponse } from "./api.service";

/* =========================================================
   Profile Service
   ========================================================= */

export const profileService = {
  /* ---------- Get current profile ---------- */
  getCurrentProfile: () =>
    handleApiResponse(
      api.get<ApiResponse<{ guard: Guard; user: { id: number; name: string | null; email: string; created_at: string } }>>(
        "/guardemployee/auth/me"
      )
    ),

  /* ---------- Update profile ---------- */
  updateProfile: (data: UpdateGuardProfile | FormData) =>
    handleApiResponse(
      api.post<ApiResponse<{ guard: Guard }>>(
        "/guardemployee/auth/update-profile",
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
      api.post<ApiResponse<{ message: string }>>(
        "/guardemployee/auth/change-password",
        data
      )
    ),

  /* ---------- Forgot password - Send reset email ---------- */
  forgotPassword: (data: ForgotPasswordDto) =>
    handleApiResponse(
      api.post<ApiResponse<{ message: string }>>(
        "/guardemployee/auth/forgot-password",
        data
      )
    ),

  /* ---------- Reset password with token ---------- */
  resetPassword: (data: ResetPasswordDto) =>
    handleApiResponse(
      api.post<ApiResponse<{ message: string }>>(
        "/guardemployee/auth/reset-password",
        data
      )
    ),

  /* ---------- Register new guard ---------- */
  register: (data: RegisterData | FormData) =>
    handleApiResponse(
      api.post<ApiResponse<RegisterResponse>>(
        "/guardemployee/auth/register",
        data,
        {
          headers:
            data instanceof FormData
              ? { "Content-Type": "multipart/form-data" }
              : { "Content-Type": "application/json" },
        }
      )
    ),
};

// app/types/client.types.ts
export interface ClientLoginCredentials {
  email: string;
  password: string;
}

export interface ClientRegisterData {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  company_name?: string;
  phone?: string;
  country?: string;
  city?: string;
  address?: string;
  zip_code?: string;
  website?: string;
  business_type?: string;
  industry?: string;
  contact_person?: string;
  contact_person_phone?: string;
}

export interface ClientLoginResponse {
  token: string;
  client: Client;
  user: {
    id: number;
    email: string;
    created_at: string;
  };
}

export interface ClientProfileResponse {
  client: Client;
  user: {
    id: number;
    email: string;
    created_at: string;
  };
}

export interface Client {
  id: number;
  user_id: number;
  client_code: string;
  full_name: string;
  company_name: string | null;
  business_type: string | null;
  industry: string | null;
  tax_id: string | null;
  license_number: string | null;
  phone: string | null;
  email: string;
  contact_person: string | null;
  contact_person_phone: string | null;
  website: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  zip_code: string | null;
  profile_image: string | null;
  profile_image_url?: string;
  is_active: boolean;
  verification_status: string;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  sites?: Site[];
  sites_count?: number;
  contracts_count?: number;
}

export interface Site {
  id: number;
  site_name: string;
  site_instruction: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  is_active: boolean;
  locations_count?: number;
  created_at: string;
}

export interface UpdateClientProfile {
  full_name?: string;
  phone?: string;
  email?: string;
  company_name?: string;
  country?: string;
  city?: string;
  address?: string;
  zip_code?: string;
  website?: string;
  business_type?: string;
  industry?: string;
  contact_person?: string;
  contact_person_phone?: string;
  profile_image?: File;
}

export interface ChangePasswordDto {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ClientState {
  client: Client | null;
  user: { id: number; email: string; created_at: string } | null;
  token: string | null;
  isLoading: boolean;
  isUpdating: boolean;
  isChangingPassword: boolean;
  isSendingResetLink: boolean;
  isResettingPassword: boolean;
  isRegistering: boolean;
  isRegistered: boolean;
  error: string | null;
  successMessage: string | null;
}
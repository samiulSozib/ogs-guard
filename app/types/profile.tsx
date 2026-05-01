// types/profile.ts

// Guard Profile Interface
export interface GuardProfile {
    id: number;
    guard_id: number;
    place_of_birth: string | null;
    country_of_origin: string | null;
    current_country: string | null;
    current_city: string | null;
    current_state: string | null;
    current_zip_code: string | null;
    current_address: string | null;
    citizenship: string | null;
    visa_countries: string | null;
    visa_expiry_date: string | null;
    has_work_permit: boolean;
    father_name: string | null;
    mother_name: string | null;
    national_id_number: string | null;
    marital_status: string | null;
    height: string | null;
    weight: string | null;
    blood_group: string | null;
    experience_years: number;
    skills: string | null;
    languages: string | null;
    highest_education_level: string | null;
    education_field: string | null;
    institution_name: string | null;
    graduation_year: string | null;
    has_security_training: boolean;
    emergency_contact_name: string | null;
    emergency_contact_phone: string | null;
    emergency_contact_relation: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

// Document Interface
export interface GuardDocument {
    id: number;
    guard_id: number;
    document_type: string;
    document_url: string;
    document_name: string;
    created_at: string;
    updated_at: string;
}

// Availability Interface
export interface GuardAvailability {
    id: number;
    guard_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    is_available: boolean;
    created_at: string;
    updated_at: string;
}

// Main Guard Interface
export interface Guard {
    id: number;
    user_id: number;
    guard_code: string;
    employee_company_card_number: string;
    full_name: string;
    phone: string;
    email: string;
    date_of_birth: string | null;
    gender: string | null;
    country: string | null;
    city: string | null;
    address: string | null;
    zip_code: string | null;
    guard_type_id: number | null;
    guard_type: string | null;
    driver_license: string | null;
    license_expiry_date: string | null;
    issuing_source: string | null;
    contract_id: number | null;
    joining_date: string;
    is_active: boolean;
    rating: string;
    profile: GuardProfile;
    documents: GuardDocument[];
    availabilities: GuardAvailability[];
    profile_image: string | null;
    profile_image_url: string | null;
    created_at: string;
    updated_at: string;
}

// Update Guard Profile Interface (for form submission)
export interface UpdateGuardProfile {
    full_name?: string;
    phone?: string;
    email?: string;
    date_of_birth?: string;
    gender?: string;
    country?: string;
    state?: string;
    city?: string;
    address?: string;
    zip_code?: string;
}

// Change Password DTO
export interface ChangePasswordDto {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}

// Profile State for Redux
export interface ProfileState {
    guard: Guard | null;
    user: {
        id: number;
        name: string | null;
        email: string;
        created_at: string;
    } | null;
    isLoading: boolean;
    isUpdating: boolean;
    isChangingPassword: boolean;
    error: string | null;
    successMessage: string | null;
}

// API Response Types
export interface ProfileApiResponse {
    status: string;
    status_code: number;
    success: boolean;
    body: {
        guard: Guard;
        user: {
            id: number;
            name: string | null;
            email: string;
            created_at: string;
        };
    };
}

export interface UpdateProfileApiResponse {
    status: string;
    status_code: number;
    success: boolean;
    body: {
        guard: Guard;
    };
}

export interface ChangePasswordApiResponse {
    status: string;
    status_code: number;
    success: boolean;
    body: {
        message: string;
    };
}



// types/profile.ts (add these new types)

// Forgot Password DTO
export interface ForgotPasswordDto {
    email: string;
}

// Reset Password DTO
export interface ResetPasswordDto {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
}

// Add to ProfileState
export interface ProfileState {
    guard: Guard | null;
    user: {
        id: number;
        name: string | null;
        email: string;
        created_at: string;
    } | null;
    isLoading: boolean;
    isUpdating: boolean;
    isChangingPassword: boolean;
    isSendingResetLink: boolean;
    isResettingPassword: boolean;
    error: string | null;
    successMessage: string | null;
}

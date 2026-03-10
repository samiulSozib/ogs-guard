import { Site } from "./site";

export interface Leave {
  id: number;
  guard_id: number;
  title: string; // Added missing title field
  site_id: number | null; // Can be null based on response
  start_date: string;
  end_date: string;
  total_days: number;
  leave_type: "sick" | "casual" | "annual" | "emergency" | string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "completed" | string;
  reviewed_by: number | null; // Changed from reviewer to match API
  review_note: string | null;
  reviewed_at: string | null; // Added missing field
  admin_notes: string | null; // Added missing field
  attachment_path: string | null;
  attachment_url: string | null; // Added missing field
  created_at: string;
  updated_at: string; // Added missing field
  deleted_at: string | null; // Added missing field
  
  /* ---------------- Computed/Display Fields ---------------- */
  status_text?: string; // Added computed field
  leave_type_text?: string; // Added computed field
  created_at_formatted?: string; // Added formatted date
  updated_at_formatted?: string; // Added formatted date
  
  /* ---------------- Relationships ---------------- */
  guard_user?: { // Changed from reviewer to guard_user to match API
    id: number;
    user_id: number;
    guard_code: string;
    full_name: string;
    phone: string;
    email: string;
    date_of_birth: string | null;
    gender: string;
    country: string | null;
    state: string | null;
    city: string | null;
    address: string | null;
    zip_code: string | null;
    guard_type_id: number | null;
    is_active: boolean;
    rating: string;
    joining_date: string | null;
    contract_id: number | null;
    currency_id: number | null;
    verification_status: string;
    verified_at: string | null;
    verified_by: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    employee_company_card_number: string | null;
    driver_license: string | null;
    issuing_source: string | null;
    license_expiry_date: string | null;
    profile_image: string | null;
  } | null;
  
  site?: Site | null; // Can be null
  reviewer?: null; // Not used in response, but keeping for backward compatibility
  
  /* ---------------- Simplified Details Objects ---------------- */
  guard_details?: { // Added helper object
    name: string;
    guard_code: string;
    phone: string;
  };
  
  site_details?: { // Added helper object
    site_name: string;
    address: string | null;
  };
}

export interface LeaveParams {
  page?: number;
  per_page?: number;
  search?: string;
  guard_id?: number;
  site_id?: number;
  leave_type?: string;
  status?: "pending" | "approved" | "rejected" | "completed";
  from_date?: string;
  to_date?: string;
  include_site?: boolean | number;
  include_reviewer?: boolean | number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface LeaveState {
  leaves: Leave[];
  currentLeave: Leave | null;
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
    per_page?: number;
  };
  isLoading: boolean;
  error: string | null;
}

export interface ToggleLeaveStatusRequest {
  status: string;
  review_note?: string | null;
}

/* ---------- Create Leave DTO ---------- */
export interface CreateLeaveDto {
  title: string; // Made required as it appears in response
  site_id?: number;
  start_date: string;
  end_date: string;
  leave_type: string;
  reason: string;
  attachment_path?: string | null; // Added optional attachment
}

/* ---------- Update Leave DTO ---------- */
export interface UpdateLeaveDto extends Partial<CreateLeaveDto> {
  status?: string;
  review_note?: string | null;
  reviewed_by?: number | null; // Added for update
  admin_notes?: string | null; // Added for update
}

/* ---------- API Response Types ---------- */
export interface LeaveApiResponse {
  status: string;
  status_code: number;
  success: boolean;
  body: {
    items: Leave[];
    data: {
      current_page: number;
      last_page: number;
      total: number;
    };
  };
}

export interface SingleLeaveApiResponse {
  status: string;
  status_code: number;
  success: boolean;
  body: Leave;
}
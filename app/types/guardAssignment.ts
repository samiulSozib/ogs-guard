import { Duty } from "./duty";
import { Guard } from "./guard";


export interface GuardAssignment {
  id: number;
  guard_id: number;
  duty_id: number;
  start_date: string;
  end_date: string;
  status: 'assigned' | 'accepted' | 'checked_in' | 'on_duty' | 'completed' | 'late' | 'no_show' | 'cancelled' | 'replaced' | string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  
  // Relationships - Full objects from API
  duty?: {
    id: number;
    title: string;
    duty_date: string | null;
    start_datetime: string;
    end_datetime: string;
    site_id: number;
    site_location_id: number;
    guards_required: number;
    duty_time_type_id: number;
    duty_type: 'day' | 'night' | string;
    required_hours: number;
    mandatory_check_in_time: string | null;
    check_in_time: string | null;
    check_out_time: string | null;
    total_working_hours: number | null;
    status: 'pending' | 'in_progress' | 'completed' | string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    
    // Nested relationships within duty
    site?: {
      id: number;
      client_id: number;
      site_name: string;
      site_instruction: string | null;
      address: string;
      guards_required: number;
      latitude: string;
      longitude: string;
      status: string;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      client_contract_id: string | null;
      
      // Client within site
      client?: {
        id: number;
        user_id: number;
        client_code: string;
        full_name: string;
        company_name: string | null;
        tax_id: string | null;
        registration_date: string | null;
        business_type: string | null;
        industry: string | null;
        website: string | null;
        contact_person: string | null;
        contact_person_phone: string | null;
        license_number: string | null;
        phone: string;
        email: string;
        country: string;
        currency_id: number | null;
        city: string;
        address: string;
        zip_code: string | null;
        notes: string | null;
        profile_image: string | null;
        is_active: boolean;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
      };
    };
    
    site_location?: {
      id: number;
      site_id: number;
      title: string;
      description: string | null;
      contract_specific_instructions: string | null;
      latitude: string;
      longitude: string;
      is_active: boolean;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      client_contract_id: string | null;
    };
    
    duty_time_type?: {
      id: number;
      title: string;
      description: string | null;
      start_time: string;
      end_time: string;
      is_active: boolean;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };
  };
  
  guard_user?: {
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
    
    // User within guard_user
    user?: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      email_verified_at: string | null;
      role: string;
      is_active: boolean;
      last_login_at: string | null;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };
  };
  
  // Simplified details objects from API
  duty_details?: {
    title: string;
    start_datetime: string;
    end_datetime: string;
    required_hours: number;
    status: string;
  };
  
  site_details?: {
    site_name: string;
    address: string;
    latitude: string;
    longitude: string;
    client_name: string | null;
  };
  
  // Additional computed fields from API
  current_shift_status?: 'not_started' | 'checked_in' | 'on_break' | 'completed' | string;
  is_on_break?: boolean;
  last_action?: string | null;
  
  // For backward compatibility - optional simplified guard reference
  guard?: Partial<Guard>;
}

export interface GuardAssignmentParams {
  page?: number;
  per_page?: number;
  search?: string;
  guard_id?: number;
  duty_id?: number;
  status?: 'assigned' | 'accepted' | 'checked_in' | 'on_duty' | 'completed' | 'late' | 'no_show' | 'cancelled' | 'replaced' | string;
  include_guard?: boolean;
  include_duty?: boolean;
  include_site?: boolean;
  include_client?: boolean;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  from_date?: string;
  to_date?: string;
}

export interface GuardAssignmentState {
  assignments: GuardAssignment[];
  currentAssignment: GuardAssignment | null;
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
    per_page?: number;
  };
  isLoading: boolean;
  error: string | null;
}

export interface ToggleGuardAssignmentStatusRequest {
  status: 'assigned' | 'accepted' | 'checked_in' | 'on_duty' | 'completed' | 'late' | 'no_show' | 'cancelled' | 'replaced' | string;
  review_note?: string | null;
}

export interface CreateGuardAssignmentDto {
  guard_id: number;
  duty_id: number;
  start_date: string;
  end_date: string;
  status?: 'assigned' | 'accepted' | string; // Making status optional as it might default to 'assigned'
}

export interface UpdateGuardAssignmentDto extends Partial<CreateGuardAssignmentDto> {
  status?: 'assigned' | 'accepted' | 'checked_in' | 'on_duty' | 'completed' | 'late' | 'no_show' | 'cancelled' | 'replaced' | string;
}

// Status helper for UI components
export const GuardAssignmentStatus = {
  ASSIGNED: 'assigned' as const,
  ACCEPTED: 'accepted' as const,
  CHECKED_IN: 'checked_in' as const,
  ON_DUTY: 'on_duty' as const,
  COMPLETED: 'completed' as const,
  LATE: 'late' as const,
  NO_SHOW: 'no_show' as const,
  CANCELLED: 'cancelled' as const,
  REPLACED: 'replaced' as const,
};

export type GuardAssignmentStatusType = typeof GuardAssignmentStatus[keyof typeof GuardAssignmentStatus];

// Status display mapping for UI
export const GuardAssignmentStatusDisplay: Record<GuardAssignmentStatusType, string> = {
  [GuardAssignmentStatus.ASSIGNED]: 'Assigned',
  [GuardAssignmentStatus.ACCEPTED]: 'Accepted',
  [GuardAssignmentStatus.CHECKED_IN]: 'Checked In',
  [GuardAssignmentStatus.ON_DUTY]: 'On Duty',
  [GuardAssignmentStatus.COMPLETED]: 'Completed',
  [GuardAssignmentStatus.LATE]: 'Late',
  [GuardAssignmentStatus.NO_SHOW]: 'No Show',
  [GuardAssignmentStatus.CANCELLED]: 'Cancelled',
  [GuardAssignmentStatus.REPLACED]: 'Replaced',
};

// Status color mapping for UI
export const GuardAssignmentStatusColor: Record<GuardAssignmentStatusType, string> = {
  [GuardAssignmentStatus.ASSIGNED]: 'bg-blue-100 text-blue-800',
  [GuardAssignmentStatus.ACCEPTED]: 'bg-green-100 text-green-800',
  [GuardAssignmentStatus.CHECKED_IN]: 'bg-purple-100 text-purple-800',
  [GuardAssignmentStatus.ON_DUTY]: 'bg-indigo-100 text-indigo-800',
  [GuardAssignmentStatus.COMPLETED]: 'bg-gray-100 text-gray-800',
  [GuardAssignmentStatus.LATE]: 'bg-orange-100 text-orange-800',
  [GuardAssignmentStatus.NO_SHOW]: 'bg-red-100 text-red-800',
  [GuardAssignmentStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
  [GuardAssignmentStatus.REPLACED]: 'bg-yellow-100 text-yellow-800',
};

// API Response Types
export interface GuardAssignmentApiResponse {
  status: string;
  status_code: number;
  success: boolean;
  body: {
    items: GuardAssignment[];
    data: {
      current_page: number;
      last_page: number;
      total: number;
    };
  };
}

export interface SingleGuardAssignmentApiResponse {
  status: string;
  status_code: number;
  success: boolean;
  body: GuardAssignment;
}
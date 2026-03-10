import { Site } from "./site";
import { Client } from "./client";
import { Guard } from "./guard";
import { Duty } from "./duty";

// Media summary interface
export interface IncidentMediaSummary {
  has_primary: boolean;
  additional_count: number;
  media_uploads_count: number;
  total_count: number;
  types: string[];
}

// Status log interface
export interface IncidentStatusLog {
  id: number;
  incident_id: number;
  old_status: string;
  new_status: string;
  changed_by_type: "admin" | "guard" | "client" | "system" | string;
  changed_by_id: number | null;
  is_visible_to_client: boolean;
  is_visible_to_guard: boolean;
  note: string | null;
  created_at: string;
  updated_at: string;
}

// Review interface (define based on your needs)
// export interface IncidentReview {
// }

// Media interface
// export interface IncidentMediaItem {
// }

// Incident type definition based on the API response
export interface Incident {
  id: number;
  tracking_code: string;
  title: string;
  
  // Foreign keys
  site_id: number;
  site_location_id: number;
  client_id: number;
  guard_id: number | null;
  duty_id: number | null;
  
  // Reporter information
  reporter_type: "admin" | "guard" | "client" | "system" | string;
  reporter_id: number;
  
  // Incident details
  incident_type: string; // "fire", "theft", "accident", "medical", "security_breach", etc.
  severity: "critical" | "high" | "medium" | "low" | "minor" | string;
  
  // Location details
  incident_place: string;
  incident_address: string;
  
  // Timestamps
  incident_date: string; // YYYY-MM-DDTHH:MM:SSZ format
  incident_time: string; // HH:MM:SS
  reported_at: string; // YYYY-MM-DD HH:MM:SS format
  
  // Geolocation - Note: API returns strings, not numbers
  latitude: string | null;
  longitude: string | null;
  
  // Descriptions and notes
  description: string;
  injury_or_damage_note: string | null;
  conversation_note: string | null;
  note: string | null;
  
  // Media paths
  media_path: string | null;
  media_type: string | null; // "image", "video", "document", etc.
  primary_media: string | null;
  additional_media: string | null;
  media_summary: IncidentMediaSummary;
  
  // Status
  status: "pending" | "acknowledged" | "investigating" | "resolved" | "closed" | "rejected" | string;
  
  // Flags
  visible_to_client: boolean;
  
  // Relationships
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
    client_contract_id: number | null;
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
    client_contract_id: number | null;
  };
  
  duty?: Partial<Duty> | null;
  
  // Additional arrays
  status_logs: IncidentStatusLog[];
  reviews: [];
  media: [];
  
  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Query parameters for fetching incidents
export interface IncidentParams {
  page?: number;
  per_page?: number;
  search?: string;
  
  // Filter by relations
  site_id?: number;
  site_location_id?: number;
  client_id?: number;
  guard_id?: number;
  duty_id?: number;
  
  // Filter by reporter
  reporter_type?: "admin" | "guard" | "client" | "system" | string;
  reporter_id?: number;
  
  // Filter by incident details
  incident_type?: string;
  severity?: "critical" | "high" | "medium" | "low" | "minor" | string;
  
  // Filter by date range
  incident_date_from?: string;
  incident_date_to?: string;
  reported_at_from?: string;
  reported_at_to?: string;
  
  // Filter by status
  status?: "pending" | "acknowledged" | "investigating" | "resolved" | "closed" | "rejected" | string;
  
  // Visibility filter
  visible_to_client?: boolean;
  
  // Include relationships
  include_site?: boolean | number;
  include_client?: boolean | number;
  include_guard?: boolean | number;
  include_duty?: boolean | number;
  include_media?: boolean | number;
  include_status_logs?: boolean | number;
  
  // Sorting
  sort_by?: string;
  sort_order?: "asc" | "desc";
  incident_date?: string;
}

// Redux state interface
export interface IncidentState {
  incidents: Incident[];
  currentIncident: Incident | null;
  
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
    per_page?: number;
  };
  
  isLoading: boolean;
  error: string | null;
}

// DTO for creating a new incident
export interface CreateIncidentDto {
  title: string;
  
  site_id: number;
  site_location_id: number;
  client_id: number;
  guard_id?: number | null;
  duty_id?: number | null;
  
  reporter_type: "admin" | "guard" | "client" | "system" | string;
  reporter_id: number;
  
  incident_type: string;
  severity: "critical" | "high" | "medium" | "low" | "minor" | string;
  
  incident_place: string;
  incident_address: string;
  
  incident_date: string; // YYYY-MM-DD
  incident_time: string; // HH:MM:SS
  reported_at?: string; // YYYY-MM-DD HH:MM:SS (defaults to now)
  
  latitude?: string | null; // Changed to string to match API
  longitude?: string | null; // Changed to string to match API
  
  description: string;
  injury_or_damage_note?: string | null;
  conversation_note?: string | null;
  note?: string | null;
  
  media_path?: string | null;
  media_type?: string | null;
  
  status?: "pending" | "acknowledged" | "investigating" | "resolved" | "closed" | "rejected" | string;
  visible_to_client?: boolean;
}

// API Response Types
export interface IncidentApiResponse {
  status: string;
  status_code: number;
  success: boolean;
  body: {
    items: Incident[];
    data: {
      current_page: number;
      last_page: number;
      total: number;
    };
  };
}

// List item version for table displays
export interface IncidentListItem {
  id: number;
  row?: number;
  tracking_code: string;
  title: string;
  incident_type: string;
  severity: string;
  site_name: string;
  reporter: string;
  client_name?: string;
  guard_name?: string;
  incident_date: string;
  incident_time: string;
  reported_at: string;
  status: string;
  media_summary?: IncidentMediaSummary;
  location?: {
    place: string;
    address: string;
    latitude?: string | null;
    longitude?: string | null;
  };
}
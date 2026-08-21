// app/types/client/duty-report.types.ts

export interface DutyReportCoordinates {
  lat: number;
  lng: number;
}

export interface DutyReportDutyDetails {
  title: string;
  site_name: string;
  site_address: string;
  site_location: string;
}

export interface DutyReportSite {
  id: number;
  client_id: number;
  site_name: string;
  site_instruction: string;
  address: string;
  guards_required: number;
  latitude: number;
  longitude: number;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  client_contract_id: number;
}

export interface DutyReportSiteLocation {
  id: number;
  site_id: number;
  title: string;
  description: string;
  contract_specific_instructions: string | null;
  latitude: string;
  longitude: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  client_contract_id: number | null;
}

export interface DutyReportDuty {
  id: number;
  title: string;
  duty_date: string | null;
  start_datetime: string;
  end_datetime: string;
  site_id: number;
  site_location_id: number;
  guards_required: number;
  duty_time_type_id: number;
  duty_type: string;
  required_hours: number;
  mandatory_check_in_time: string;
  check_in_time: string | null;
  check_out_time: string | null;
  total_working_hours: number | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  site: DutyReportSite;
  site_location: DutyReportSiteLocation;
}

export interface DutyReport {
  id: number;
  duty_id: number;
  guard_id: number;
  message: string;
  is_ok: boolean;
  latitude: string;
  longitude: string;
  media_path: string | null;
  media_type: string | null;
  visible_to_client: boolean;
  status: 'submitted' | 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  duty: DutyReportDuty;
  media: any[];
  media_url?: string | null;
  media_uploads: any[];
  duty_details: DutyReportDutyDetails;
  status_text: string;
  status_color: string;
  has_media: boolean;
  has_location: boolean;
  coordinates: DutyReportCoordinates;
  created_at_formatted: string;
  time_ago: string;
}

export interface DutyReportsPaginatedResponse {
  items: DutyReport[];
  data: {
    current_page: number;
    last_page: number;
    total: number;
    per_page?: number;
  };
}

export interface CreateDutyReportData {
  guard_assignment_id: number;
  message: string;
  is_ok: boolean | number;
  latitude: number | string;
  longitude: number | string;
  media_file?: File | null;
}

export interface DutyReportsState {
  reports: DutyReport[];
  currentReport: DutyReport | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  } | null;
}

export interface DutyReportFilters {
  page?: number;
  per_page?: number;
  guard_assignment_id?: number;
  duty_id?: number;
  guard_id?: number;
  status?: 'submitted' | 'pending' | 'approved' | 'rejected';
  from_date?: string;
  to_date?: string;
}
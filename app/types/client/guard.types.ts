// app/types/client/guard.types.ts

export interface OnlineStatus {
  is_online: boolean;
  last_seen: string | null;
  current_location: {
    latitude: number;
    longitude: number;
  } | null;
}

export interface GuardLocation {
  id: number;
  title: string;
  description: string | null;
  latitude: string;
  longitude: string;
}

export interface GuardDuty {
  duty_id: number;
  duty_title: string;
  start_datetime: string;
  end_datetime: string;
  guards_required: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  assignment_id: number;
  assignment_status: 'assigned' | 'active' | 'completed' | 'cancelled';
  location: GuardLocation;
}

export interface AssignedSite {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  locations: GuardLocation[];
  current_location: GuardLocation;
  duties: GuardDuty[];
}

export interface CurrentDuty {
  assignment_id: number;
  duty_id: number;
  duty_title: string;
  site_id: number;
  site_name: string;
  site_address: string;
  location: GuardLocation;
  start_time: string;
  end_time: string;
  guards_required: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  assignment_status: 'assigned' | 'active' | 'completed' | 'cancelled';
}

export interface GuardProfile {
  experience_years: number;
  specialization: string | null;
  languages: string | null;
}

export interface Guard {
  id: number;
  guard_code: string;
  full_name: string;
  phone: string;
  email: string;
  rating: number;
  profile_image: string | null;
  guard_type: string | null;
  online_status: OnlineStatus | null;
  assigned_sites: AssignedSite[];
  current_duty: CurrentDuty | null;
  profile: GuardProfile | null;
  joined_at: string;
}

export interface GuardsPaginatedResponse {
  items: Guard[];
  data: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  filters: {
    status: string | null;
    search: string;
  };
}

export interface GuardFilters {
  status?: 'online' | 'offline' | 'all' | null;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface GuardsState {
  guards: Guard[];
  currentGuard: Guard | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  } | null;
  filters: GuardFilters;
}

export interface GuardStats {
  total: number;
  online: number;
  offline: number;
  on_duty: number;
}
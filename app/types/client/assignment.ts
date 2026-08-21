// app/types/client/assignment.types.ts

export type AssignmentStatus = 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type FilterStatus = AssignmentStatus | 'all' | 'current' | 'upcoming' | 'past';

export interface Site {
  id: number;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  instructions?: string;
}

export interface Location {
  id: number;
  title: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}

export interface Guard {
  id: number;
  name: string;
  code: string;
  phone: string;
  email?: string;
  rating: number;
  profile_image: string;
  type: string | null;
  experience_years?: number;
}

export interface Attendance {
  checked_in_at: string | null;
  checked_out_at: string | null;
  actual_hours: number;
  expected_hours?: number;
  is_completed: boolean;
  is_late: boolean;
}

export interface HoursSummary {
  expected_hours: number;
  actual_hours: number;
  break_hours: number;
  net_hours: number;
  variance: number;
  completion_percentage: number;
}

export interface TimelineEvent {
  id: number;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  created_at_human?: string;
}

export interface Assignment {
  id: number;
  status: AssignmentStatus;
  date: string;
  day_of_week?: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  site: Site;
  location: Location;
  guard: Guard;
  attendance: Attendance;
  is_current?: boolean;
  is_upcoming?: boolean;
  is_past?: boolean;
  instructions?: string[];
  notes?: string;
  hours_summary?: HoursSummary;
  timeline?: TimelineEvent[];
}

export interface AssignmentsPaginatedResponse {
  items: Assignment[];
  data: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  filters: {
    status: string;
    from_date: string | null;
    to_date: string | null;
    search: string;
  };
}

export interface AssignmentFilters {
  status?: FilterStatus;
  from_date?: string | null;
  to_date?: string | null;
  search?: string;
  per_page?: number;
  page?:number;
}

export interface AssignmentsState {
  assignments: Assignment[];
  currentAssignment: Assignment | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  } | null;
  filters: AssignmentFilters;
}

export interface AssignmentStats {
  total: number;
  current: number;
  upcoming: number;
  past: number;
  completed: number;
  in_progress: number;
}
// app/types/dashboard.ts

// Guard Info Interface
export interface DashboardGuard {
  id: number;
  user_id: number;
  guard_code: string;
  full_name: string;
  phone: string;
  email: string;
  profile_image_url: string | null;
  is_active: boolean;
  verification_status: string;
  guard_type: string | null;
  rating: string;
}

// Site Interface
export interface DashboardSite {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  client: string;
}

// Location Interface
export interface DashboardLocation {
  id: number;
  title: string;
  latitude: string;
  longitude: string;
}

// Duty Interface
export interface DashboardDuty {
  id: number;
  title: string;
  start_datetime: string;
  end_datetime: string;
  required_hours: number;
}

// Progress Interface
export interface DashboardProgress {
  percentage: number;
  total_hours: number;
  elapsed_hours: number;
  remaining_hours: number;
}

// Assignment Interface
export interface DashboardAssignment {
  id: number;
  assignment_code: string;
  status: string;
  start_date: string;
  end_date: string;
  duty: DashboardDuty;
  site: DashboardSite;
  location: DashboardLocation;
  progress: DashboardProgress;
  last_action: string | null;
}

// Shift Status Interface
export interface DashboardShiftStatus {
  has_active_shift: boolean;
  shift_status: 'not_started' | 'checked_in' | 'on_break' | 'checked_out' | 'completed' | string;
  shift_status_label: string;
  shift_status_color: string;
  check_in_time: string | null;
  check_out_time: string | null;
  break_start_time: string | null;
  total_break_minutes: number;
  on_break: boolean;
  can_check_in: boolean;
  can_check_out: boolean;
  can_start_break: boolean;
  can_end_break: boolean;
  next_expected_action: string;
}

// Task Interface
export interface DashboardTask {
  id: number;
  title: string;
  description: string;
  instruction_type: string;
  priority: string;
  completion_status: string;
  is_mandatory: boolean;
  requires_confirmation: boolean;
  requires_photo: boolean;
  requires_signature: boolean;
}

// Incident Interface
export interface DashboardIncident {
  id: number;
  title: string;
  severity: string;
  status: string;
  created_at: string;
  site_name: string;
}

// Patrol Point Interface
export interface DashboardPatrolPoint {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
}

// Dashboard Stats Interface
export interface DashboardStats {
  tasks_completed_today: number;
  today_incidents: number;
  unread_messages: number;
  pending_leaves: number;
  attendance_days: number;
  total_assignments: number;
  completed_assignments: number;
  completion_rate: number;
  upcoming_shifts_count: number;
}

// Main Dashboard Data Interface
export interface DashboardData {
  guard: DashboardGuard;
  today_assignments: DashboardAssignment[];
  current_assignment: DashboardAssignment | null;
  shift_status: DashboardShiftStatus;
  tasks: DashboardTask[];
  stats: DashboardStats;
  recent_incidents: DashboardIncident[];
  upcoming_shifts: DashboardAssignment[];
  patrol_points: DashboardPatrolPoint[];
  unread_messages: number;
  current_time: string;
  server_date: string;
}

// Shift Status Response Interface
export interface ShiftStatusResponse {
  shift_status: DashboardShiftStatus;
}

// Stats Response Interface
export interface StatsResponse {
  stats: DashboardStats;
}

// Dashboard State Interface for Redux
export interface DashboardState {
  // Main dashboard data
  dashboardData: DashboardData | null;
  
  // Individual components (for selective fetching)
  shiftStatus: DashboardShiftStatus | null;
  stats: DashboardStats | null;
  tasks: DashboardTask[];
  
  // Loading states
  isLoadingDashboard: boolean;
  isLoadingShiftStatus: boolean;
  isLoadingStats: boolean;
  isLoadingTasks: boolean;
  
  // Error states
  dashboardError: string | null;
  shiftStatusError: string | null;
  statsError: string | null;
  tasksError: string | null;
}

// API Response Wrappers
export interface DashboardApiResponse {
  status: string;
  status_code: number;
  success: boolean;
  body: DashboardData;
}

export interface ShiftStatusApiResponse {
  status: string;
  status_code: number;
  success: boolean;
  body: ShiftStatusResponse;
}

export interface StatsApiResponse {
  status: string;
  status_code: number;
  success: boolean;
  body: StatsResponse;
}
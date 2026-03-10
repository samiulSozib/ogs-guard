// app/types/dashboard.ts

// Guard Info Interface
export interface DashboardGuard {
  id: number;
  user_id: number;
  guard_code: string;
  full_name: string;
  phone: string;
  email: string;
  is_active: boolean;
  verification_status: string;
  profile_image: string | null;
  profile_image_url: string | null;
  guard_type: string | null;
  rating: string;
  created_at: string;
}

// Assignment Site Interface
export interface DashboardSite {
  name: string;
  address: string;
}

// Assignment Duty Interface
export interface DashboardDuty {
  start_datetime: string;
  end_datetime: string;
}

// Assignment Interface
export interface DashboardAssignment {
  id: number;
  assignment_code: string;
  status: string;
  site: DashboardSite;
  duty: DashboardDuty;
  progress_percentage: number;
  shift_duration_hours: number;
  elapsed_hours: number;
  remaining_hours: number;
}

// Shift Status Interface
export interface DashboardShiftStatus {
  shift_status: 'not_started' | 'checked_in' | 'on_break' | 'checked_out' | 'completed' | string;
  shift_status_label: string;
  check_in_time: string | null;
  check_out_time: string | null;
  break_start_time: string | null;
  total_break_minutes: number;
  can_check_in: boolean;
  can_check_out: boolean;
  can_start_break: boolean;
  can_end_break: boolean;
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

// Dashboard Stats Interface
export interface DashboardStats {
  total_tasks_today: number;
  completed_tasks: number;
  pending_tasks: number;
  unread_messages: number;
  pending_leaves: number;
  today_incidents: number;
  attendance_days: number;
  total_assignments: number;
  completion_rate: number;
}

// Main Dashboard Data Interface (from /guardemployee/dashboard)
export interface DashboardData {
  guard: DashboardGuard;
  assignment: DashboardAssignment | null;
  shift_status: DashboardShiftStatus;
  tasks: DashboardTask[];
  stats: DashboardStats;
  unread_messages: number;
  current_time: string;
}

// Shift Status Response Interface (from /guardemployee/dashboard/shift-status)
export interface ShiftStatusResponse {
  shift_status: DashboardShiftStatus;
}

// Stats Response Interface (from /guardemployee/dashboard/stats)
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
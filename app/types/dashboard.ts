// // app/types/dashboard.ts

// // Guard Info Interface
// export interface DashboardGuard {
//   id: number;
//   user_id: number;
//   guard_code: string;
//   full_name: string;
//   phone: string;
//   email: string;
//   profile_image_url: string | null;
//   is_active: boolean;
//   verification_status: string;
//   guard_type: string | null;
//   rating: string;
// }

// // Site Interface
// export interface DashboardSite {
//   id: number;
//   name: string;
//   address: string;
//   latitude: string;
//   longitude: string;
//   client: string;
// }

// // Location Interface
// export interface DashboardLocation {
//   id: number;
//   title: string;
//   latitude: string;
//   longitude: string;
// }

// // Duty Interface
// export interface DashboardDuty {
//   id: number;
//   title: string;
//   start_datetime: string;
//   end_datetime: string;
//   required_hours: number;
// }

// // Progress Interface
// export interface DashboardProgress {
//   percentage: number;
//   total_hours: number;
//   elapsed_hours: number;
//   remaining_hours: number;
// }

// // Assignment Interface
// export interface DashboardAssignment {
//   id: number;
//   assignment_code: string;
//   status: string;
//   start_date: string;
//   end_date: string;
//   duty: DashboardDuty;
//   site: DashboardSite;
//   location: DashboardLocation;
//   progress: DashboardProgress;
//   last_action: LastAction | null;
// }

// export interface LastAction{
//   action:string,
//   time:string,
//   location:string
// }

// // Shift Status Interface
// export interface DashboardShiftStatus {
//   has_active_shift: boolean;
//   shift_status: 'not_started' | 'checked_in' | 'on_break' | 'checked_out' | 'completed' | string;
//   shift_status_label: string;
//   shift_status_color: string;
//   check_in_time: string | null;
//   check_out_time: string | null;
//   break_start_time: string | null;
//   total_break_minutes: number;
//   on_break: boolean;
//   can_check_in: boolean;
//   can_check_out: boolean;
//   can_start_break: boolean;
//   can_end_break: boolean;
//   next_expected_action: string;
// }

// // Task Interface
// export interface DashboardTask {
//   id: number;
//   title: string;
//   description: string;
//   instruction_type: string;
//   priority: string;
//   completion_status: string;
//   is_mandatory: boolean;
//   requires_confirmation: boolean;
//   requires_photo: boolean;
//   requires_signature: boolean;
// }

// // Incident Interface
// export interface DashboardIncident {
//   id: number;
//   title: string;
//   severity: string;
//   status: string;
//   created_at: string;
//   site_name: string;
// }

// // Patrol Point Interface
// export interface DashboardPatrolPoint {
//   id: number;
//   name: string;
//   latitude: string;
//   longitude: string;
// }

// // Dashboard Stats Interface
// export interface DashboardStats {
//   tasks_completed_today: number;
//   today_incidents: number;
//   unread_messages: number;
//   pending_leaves: number;
//   attendance_days: number;
//   total_assignments: number;
//   completed_assignments: number;
//   completion_rate: number;
//   upcoming_shifts_count: number;
// }

// // Main Dashboard Data Interface
// export interface DashboardData {
//   guard: DashboardGuard;
//   today_assignments: DashboardAssignment[];
//   current_assignment: DashboardAssignment | null;
//   upcoming_assignments:DashboardAssignment[]|[];
//   shift_status: DashboardShiftStatus;
//   tasks: DashboardTask[];
//   stats: DashboardStats;
//   recent_incidents: DashboardIncident[];
//   upcoming_shifts: DashboardAssignment[];
//   patrol_points: DashboardPatrolPoint[];
//   unread_messages: number;
//   current_time: string;
//   server_date: string;
// }

// // Shift Status Response Interface
// export interface ShiftStatusResponse {
//   shift_status: DashboardShiftStatus;
// }

// // Stats Response Interface
// export interface StatsResponse {
//   stats: DashboardStats;
// }

// // Dashboard State Interface for Redux
// export interface DashboardState {
//   // Main dashboard data
//   dashboardData: DashboardData | null;

//   // Individual components (for selective fetching)
//   shiftStatus: DashboardShiftStatus | null;
//   stats: DashboardStats | null;
//   tasks: DashboardTask[];

//   // Loading states
//   isLoadingDashboard: boolean;
//   isLoadingShiftStatus: boolean;
//   isLoadingStats: boolean;
//   isLoadingTasks: boolean;

//   // Error states
//   dashboardError: string | null;
//   shiftStatusError: string | null;
//   statsError: string | null;
//   tasksError: string | null;
// }

// // API Response Wrappers
// export interface DashboardApiResponse {
//   status: string;
//   status_code: number;
//   success: boolean;
//   body: DashboardData;
// }

// export interface ShiftStatusApiResponse {
//   status: string;
//   status_code: number;
//   success: boolean;
//   body: ShiftStatusResponse;
// }

// export interface StatsApiResponse {
//   status: string;
//   status_code: number;
//   success: boolean;
//   body: StatsResponse;
// }


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
  guard_type: GuardType | null;
  rating: number;
}

// Guard Type Interface
export interface GuardType {
  id: number;
  name: string;
}

// Site Interface
export interface DashboardSite {
  id: number;
  name: string;
  address: string;
  timezone: string;
  latitude: number;
  longitude: number;
  client: string;
}

// Location Interface
export interface DashboardLocation {
  id: number;
  title: string;
  latitude: string;
  longitude: string;
}

// Duty Time Type Interface
export interface DutyTimeType {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
}

// Duty Interface
export interface DashboardDuty {
  id: number;
  title: string;
  duty_date: string;
  start_datetime: string;
  end_datetime: string;
  site_timezone: string;
  site_start_datetime: string;
  site_end_datetime: string;
  site_start_date: string;
  site_end_date: string;
  site_start_time: string;
  site_end_time: string;
  is_overnight: boolean;
  duty_schedule_id: number | null;
  client_contract_service_id: number | null;
  duty_time_type_id: number;
  duty_type: string | null;
  duty_time_type: DutyTimeType;
  required_hours: number;
  mandatory_check_in_time: string;
  mandatory_check_in_site_datetime: string;
  mandatory_check_in_site_time: string;
  status: string;
  is_active: boolean;
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
  location: DashboardLocation | null;
  progress: DashboardProgress;
  last_action: LastAction | null;
  instructions: any[];
}

export interface LastAction {
  action: string;
  time: string;
  location: string;
}

// Shift Status Interface
export interface DashboardShiftStatus {
  has_active_shift: boolean;
  shift_status: 'not_started' | 'checked_in' | 'on_break' | 'checked_out' | 'completed' | string;
  shift_status_label: string;
  shift_status_color: string;
  site_timezone: string;
  check_in_time: string | null;
  check_out_time: string | null;
  break_start_time: string | null;
  check_in_site_time: string | null;
  check_out_site_time: string | null;
  break_start_site_time: string | null;
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
  created_at_human: string;
  site_name: string;
}

// Patrol Point Interface
export interface DashboardPatrolPoint {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

// Upcoming Shift Interface
export interface DashboardUpcomingShift {
  id: number;
  duty_id: number;
  title: string;
  duty_date: string;
  site_name: string;
  site_timezone: string;
  start_datetime: string;
  end_datetime: string;
  date: string;
  start_time: string;
  end_time: string;
  end_date: string;
  is_overnight: boolean;
  duty_time_type: string;
  status: string;
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
  current_assignment: DashboardAssignment | null;
  upcoming_assignments: DashboardAssignment[];
  shift_status: DashboardShiftStatus;
  tasks: DashboardTask[];
  stats: DashboardStats;
  recent_incidents: DashboardIncident[];
  upcoming_shifts: DashboardUpcomingShift[];
  patrol_points: DashboardPatrolPoint[];
  unread_messages: number;
  current_time_utc: string;
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
  dashboardData: DashboardData | null;
  shiftStatus: DashboardShiftStatus | null;
  stats: DashboardStats | null;
  tasks: DashboardTask[];
  isLoadingDashboard: boolean;
  isLoadingShiftStatus: boolean;
  isLoadingStats: boolean;
  isLoadingTasks: boolean;
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

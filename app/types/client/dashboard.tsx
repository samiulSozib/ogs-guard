// app/types/client/dashboard.types.ts

export interface ClientDashboardStats {
  total_sites: number;
  active_sites: number;
  total_guards: number;
  active_guards: number;
  total_incidents: number;
  open_incidents: number;
  total_complaints: number;
  pending_complaints: number;
  today_incidents: number;
  today_complaints: number;
}

export interface RecentIncident {
  id: number;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  site_name: string;
  created_at: string;
  created_at_human: string;
}

export interface RecentComplaint {
  id: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  site_name: string;
  against_name: string;
  created_at: string;
  created_at_human: string;
}

export interface ActiveGuard {
  id: number;
  name: string;
  guard_code: string;
  site_name: string;
  status: 'on_duty' | 'off_duty' | 'on_break';
  shift_start?: string;
  shift_end?: string;
}

export interface UpcomingShift {
  id: number;
  site_name: string;
  guard_name: string;
  guard_code: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'confirmed' | 'completed';
}

export interface SiteSummary {
  id: number;
  site_name: string;
  address: string;
  status: 'active' | 'inactive' | 'planned' | 'under_maintenance';
  locations_count: number;
  active_guards_count: number;
}

export interface ClientDashboardData {
  stats: ClientDashboardStats;
  recent_incidents: RecentIncident[];
  recent_complaints: RecentComplaint[];
  active_guards_list: ActiveGuard[];
  upcoming_shifts: UpcomingShift[];
  sites_summary: SiteSummary[];
}

export interface ClientDashboardState {
  dashboardData: ClientDashboardData | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}
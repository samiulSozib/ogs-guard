// app/types/shift.types.ts

export type ShiftAction = 'check_in' | 'check_out' | 'break' | 'break';

export interface ShiftLogActionRequest {
  guard_assignment_id: number;
  action: ShiftAction;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  location_address?: string;
  remarks?: string;
  metadata?: {
    battery_level?: number;
    network_strength?: string;
    device_id?: string;
    [key: string]: string | number | undefined;
  };
}

export interface ShiftLogActionResponse {
  id: number;
  guard_assignment_id: number;
  action: string;
  timestamp: string;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  location_address: string | null;
  remarks: string | null;
  metadata: Record<string, unknown>;
  status: string;
  created_at: string;
  updated_at: string;
}
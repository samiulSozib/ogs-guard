// app/types/guardLiveLocation.types.ts

export interface LiveLocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  speed?: number;
  heading?: number;
  battery_level?: number;
  is_charging?: boolean;
  network_type?: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  device_id?: string;
  device_model?: string;
  os_version?: string;
  app_version?: string;
  status?: 'active' | 'inactive';
}

export interface LocationResponse {
  id: number;
  latitude: string;
  longitude: string;
  accuracy: string;
  speed: string;
  duty_location_match: boolean;
  distance_from_duty_meters: string;
}

export interface LiveLocationResponse {
  status: 'success' | 'error';
  status_code: number;
  success: boolean;
  body: {
    location: LocationResponse;
    status: 'online' | 'offline' | 'pending';
    message?: string;
  };
}

export interface HeartbeatResponse {
  status: 'success' | 'error';
  status_code: number;
  success: boolean;
  body: {
    status: 'online' | 'offline' | 'pending';
    timestamp: string;
    message?: string;
  };
}

export interface OfflineResponse {
  status: 'success' | 'error';
  status_code: number;
  success: boolean;
  body: {
    status: 'offline';
    message: string;
  };
}

export interface GuardLiveLocationState {
  currentLocation: LocationResponse | null;
  locationStatus: 'online' | 'offline' | 'pending' | null;
  lastHeartbeat: string | null;
  isTracking: boolean;
  isLoading: boolean;
  error: string | null;
  distanceFromDuty: number | null;
  isWithinDutyLocation: boolean;
}
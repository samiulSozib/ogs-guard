// store/slices/guardLiveLocation.slice.ts

import {
  GuardLiveLocationState,
  LiveLocationData
} from "@/app/types/guardLiveLocation";
import { guardLiveLocationService } from "@/service/guardLiveLocation.service";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define BatteryManager interface
interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
}

// Extend Navigator interface for Battery
interface NavigatorWithBattery extends Navigator {
  getBattery: () => Promise<BatteryManager>;
}

// Extend Navigator with complete connection interface
interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType: string;
    type?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  };
  mozConnection?: {
    effectiveType: string;
    type?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  };
  webkitConnection?: {
    effectiveType: string;
    type?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  };
}

// Helper function to get current position
const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  });
};

// Helper to get device info
const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  let deviceModel = "Unknown";
  let osVersion = "Unknown";

  if (/iPhone/i.test(userAgent)) {
    deviceModel = "iPhone";
    const match = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
    if (match) osVersion = `iOS ${match[1]}.${match[2]}`;
  } else if (/iPad/i.test(userAgent)) {
    deviceModel = "iPad";
    const match = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
    if (match) osVersion = `iOS ${match[1]}.${match[2]}`;
  } else if (/Android/i.test(userAgent)) {
    deviceModel = "Android Device";
    const match = userAgent.match(/Android (\d+(?:\.\d+)+)/);
    if (match) osVersion = `Android ${match[1]}`;
  } else if (/Mac/i.test(userAgent)) {
    deviceModel = "Mac";
    osVersion = "macOS";
  } else if (/Windows/i.test(userAgent)) {
    deviceModel = "Windows PC";
    osVersion = "Windows";
  } else if (/Linux/i.test(userAgent)) {
    deviceModel = "Linux Device";
    osVersion = "Linux";
  }

  return {
    device_model: deviceModel,
    os_version: osVersion,
    app_version: "1.0.0",
  };
};

// Helper to get network type
function getNetworkType(): 'wifi' | 'cellular' | 'ethernet' | 'unknown' {
  const nav = navigator as NavigatorWithConnection;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

  if (!navigator.onLine) {
    return 'unknown';
  }

  if (connection) {
    if (connection.type) {
      const type = connection.type.toLowerCase();
      if (type === 'wifi') return 'wifi';
      if (type === 'cellular') return 'cellular';
      if (type === 'ethernet') return 'ethernet';
    }

    if (connection.effectiveType) {
      const effectiveType = connection.effectiveType.toLowerCase();
      if (effectiveType === '4g' || effectiveType === '3g' || effectiveType === '2g' || effectiveType === 'slow-2g') {
        return 'cellular';
      }
    }

    if (connection.downlink && connection.downlink > 10) {
      return 'wifi';
    }
  }

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (!isMobile) {
    return 'wifi';
  }

  return 'unknown';
}

// Get initial tracking state from localStorage
const getInitialTrackingState = (): boolean => {
  if (typeof window !== 'undefined') {
    const savedState = localStorage.getItem('guard_tracking_active');
    return savedState === 'true';
  }
  return false;
};

// Initial state
const initialState: GuardLiveLocationState = {
  currentLocation: null,
  locationStatus: null,
  lastHeartbeat: null,
  isTracking: getInitialTrackingState(),
  isLoading: false,
  error: null,
  distanceFromDuty: null,
  isWithinDutyLocation: false,
};

/* ------------------ Thunks ------------------ */

// Update live location (called only on button click)
export const updateLiveLocation = createAsyncThunk(
  "guardLiveLocation/updateLocation",
  async (_, { rejectWithValue }) => {
    try {
      const position = await getCurrentPosition();
      const deviceInfo = getDeviceInfo();

      const locationData: LiveLocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude || undefined,
        speed: position.coords.speed || undefined,
        heading: position.coords.heading || undefined,
        battery_level: await getBatteryLevel(),
        is_charging: await getChargingStatus(),
        network_type: getNetworkType(),
        device_id: localStorage.getItem("device_id") || generateDeviceId(),
        ...deviceInfo,
        status: "active",
      };

      const response = await guardLiveLocationService.updateLocation(locationData);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update location";
      return rejectWithValue(message);
    }
  }
);

// Send heartbeat (called automatically every 2 minutes)
export const sendHeartbeat = createAsyncThunk(
  "guardLiveLocation/sendHeartbeat",
  async (_, { rejectWithValue }) => {
    try {
      const response = await guardLiveLocationService.sendHeartbeat();
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to send heartbeat";
      return rejectWithValue(message);
    }
  }
);

// Mark as offline (called on button click)
export const markOffline = createAsyncThunk(
  "guardLiveLocation/markOffline",
  async (_, { rejectWithValue }) => {
    try {
      const response = await guardLiveLocationService.markOffline();
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to mark offline";
      return rejectWithValue(message);
    }
  }
);

// Start live tracking - ONLY starts heartbeat, NO automatic location updates
export const startLiveTracking = createAsyncThunk(
  "guardLiveLocation/startTracking",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Only start heartbeat interval (every 2 minutes = 120000 ms)
      const heartbeatInterval = window.setInterval(() => {
        dispatch(sendHeartbeat());
      }, 120000); // 2 minutes

      localStorage.setItem("heartbeatIntervalId", String(heartbeatInterval));
      localStorage.setItem("guard_tracking_active", "true");

      return { heartbeatInterval };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to start tracking";
      return rejectWithValue(message);
    }
  }
);

// Stop live tracking
export const stopLiveTracking = createAsyncThunk(
  "guardLiveLocation/stopTracking",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Mark as offline
      await dispatch(markOffline()).unwrap();

      // Clear heartbeat interval
      const heartbeatIntervalId = localStorage.getItem("heartbeatIntervalId");

      if (heartbeatIntervalId) {
        window.clearInterval(parseInt(heartbeatIntervalId));
        localStorage.removeItem("heartbeatIntervalId");
      }

      localStorage.setItem("guard_tracking_active", "false");

      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to stop tracking";
      return rejectWithValue(message);
    }
  }
);

// Restore tracking on app load
export const restoreTracking = createAsyncThunk(
  "guardLiveLocation/restoreTracking",
  async (_, { dispatch, getState }) => {
    const savedState = localStorage.getItem('guard_tracking_active');
    if (savedState === 'true') {
      const heartbeatIntervalId = localStorage.getItem("heartbeatIntervalId");

      if (!heartbeatIntervalId) {
        // Restart tracking if interval is missing
        await dispatch(startLiveTracking()).unwrap();
      } else {
        // Just set the tracking state to true
        return true;
      }
    }
    return false;
  }
);

// Helper functions
async function getBatteryLevel(): Promise<number | undefined> {
  const nav = navigator as NavigatorWithBattery;
  if ('getBattery' in nav) {
    try {
      const battery = await nav.getBattery();
      return Math.round(battery.level * 100);
    } catch {
      return undefined;
    }
  }
  return undefined;
}

async function getChargingStatus(): Promise<boolean | undefined> {
  const nav = navigator as NavigatorWithBattery;
  if ('getBattery' in nav) {
    try {
      const battery = await nav.getBattery();
      return battery.charging;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function generateDeviceId(): string {
  let deviceId = localStorage.getItem("device_id");
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem("device_id", deviceId);
  }
  return deviceId;
}

/* ------------------ Slice ------------------ */

const guardLiveLocationSlice = createSlice({
  name: "guardLiveLocation",
  initialState,
  reducers: {
    clearLocationError: (state) => {
      state.error = null;
    },
    resetLocationState: (state) => {
      state.currentLocation = null;
      state.locationStatus = null;
      state.lastHeartbeat = null;
      state.isTracking = false;
      state.error = null;
      state.distanceFromDuty = null;
      state.isWithinDutyLocation = false;
      localStorage.setItem("guard_tracking_active", "false");
    },
    updateDistanceFromDuty: (state, action: PayloadAction<{ distance: number; isWithin: boolean }>) => {
      state.distanceFromDuty = action.payload.distance;
      state.isWithinDutyLocation = action.payload.isWithin;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateLiveLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLiveLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLocation = action.payload.location;
        state.locationStatus = action.payload.status;
        state.distanceFromDuty = parseFloat(action.payload.location.distance_from_duty_meters);
        state.isWithinDutyLocation = action.payload.location.duty_location_match;
      })
      .addCase(updateLiveLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(sendHeartbeat.fulfilled, (state, action) => {
        state.lastHeartbeat = action.payload.timestamp;
        state.locationStatus = action.payload.status;
      })
      .addCase(sendHeartbeat.rejected, (state, action) => {
        console.error("Heartbeat failed:", action.payload);
      })

      .addCase(markOffline.fulfilled, (state, action) => {
        state.locationStatus = action.payload.status;
      })
      .addCase(markOffline.rejected, (state, action) => {
        console.error("Mark offline failed:", action.payload);
      })

      .addCase(startLiveTracking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(startLiveTracking.fulfilled, (state) => {
        state.isLoading = false;
        state.isTracking = true;
      })
      .addCase(startLiveTracking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        localStorage.setItem("guard_tracking_active", "false");
      })

      .addCase(stopLiveTracking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(stopLiveTracking.fulfilled, (state) => {
        state.isLoading = false;
        state.isTracking = false;
        state.locationStatus = 'offline';
      })
      .addCase(stopLiveTracking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(restoreTracking.fulfilled, (state, action) => {
        if (action.payload) {
          state.isTracking = true;
        }
      });
  },
});

export const {
  clearLocationError,
  resetLocationState,
  updateDistanceFromDuty
} = guardLiveLocationSlice.actions;

export default guardLiveLocationSlice.reducer;

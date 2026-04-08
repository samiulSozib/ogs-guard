// components/dashboard/header-card.tsx
'use client';

import { DashboardGuard } from "@/app/types/dashboard"
import { Bell, Menu, Wifi, BatteryFull, MapPin, Power, Circle, Activity } from "lucide-react"
import Image from "next/image"
import { useEffect, useState, useCallback, useRef } from "react"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { 
  startLiveTracking, 
  stopLiveTracking, 
  updateLiveLocation,
  sendHeartbeat,
  restoreTracking
} from "@/store/slices/guardLiveLocationSlice"
import SweetAlertService from "@/lib/sweetAlert"
import { useAppSelector } from "@/hooks/useAppSelector";

interface HeaderCardProps {
  guard: DashboardGuard
  currentTime: string
}

export function HeaderCard({ guard, currentTime }: HeaderCardProps) {
  const dispatch = useAppDispatch()
  const { locationStatus, isTracking, currentLocation, isLoading } = useAppSelector(
    (state) => state.guardLiveLocation
  )
  
  const [isOnline, setIsOnline] = useState(isTracking)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const formattedTime = new Date(currentTime).toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  // Restore tracking state on component mount - NO AUTOMATIC LOCATION UPDATE
  useEffect(() => {
    const initTracking = async () => {
      const savedState = localStorage.getItem('guard_tracking_active');
      if (savedState === 'true') {
        setIsOnline(true);
        await dispatch(restoreTracking()).unwrap();
        
        // Restart heartbeat interval if not running
        if (!heartbeatIntervalRef.current) {
          heartbeatIntervalRef.current = setInterval(() => {
            dispatch(sendHeartbeat());
          }, 120000); // 2 minutes
        }
        
        // ✅ REMOVED: No automatic location update here
        // Location should only be updated when user clicks the button
      }
    };
    
    initTracking();
    
    // Cleanup on unmount
    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [dispatch]);

  // Sync isOnline with Redux state
  useEffect(() => {
    setIsOnline(isTracking);
  }, [isTracking]);

  // Start location tracking (only heartbeat, no automatic location updates)
  const handleStartTracking = useCallback(async () => {
    try {
      await dispatch(startLiveTracking()).unwrap();
      setIsOnline(true);
      
      // Start background heartbeat (every 2 minutes)
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      heartbeatIntervalRef.current = setInterval(() => {
        dispatch(sendHeartbeat());
      }, 120000); // 2 minutes
      
      SweetAlertService.success(
        'Online Mode Active',
        'Heartbeat is now being sent every 2 minutes. Use "Update Location" button to share your location.',
        { timer: 3000 }
      );
    } catch (error) {
      SweetAlertService.error(
        'Failed to Start',
        'Unable to start heartbeat. Please try again.',
        { timer: 3000 }
      );
    }
  }, [dispatch]);

  // Stop location tracking
  const handleStopTracking = useCallback(async () => {
    const result = await SweetAlertService.confirm(
      'Go Offline?',
      'You will no longer send heartbeat or location updates. Are you sure?',
      'Yes, go offline',
      'Cancel'
    );
    
    if (result.isConfirmed) {
      try {
        await dispatch(stopLiveTracking()).unwrap();
        setIsOnline(false);
        
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }
        
        SweetAlertService.success(
          'Offline Mode',
          'You are now offline. No heartbeat or location updates are being sent.',
          { timer: 3000 }
        );
      } catch (error) {
        SweetAlertService.error(
          'Failed to Go Offline',
          'Unable to stop tracking. Please try again.',
          { timer: 3000 }
        );
      }
    }
  }, [dispatch]);

  // Manual location update (ONLY when user clicks button)
  const handleManualUpdate = useCallback(async () => {
    if (!isOnline) {
      SweetAlertService.warning(
        'Location Tracking Off',
        'Please go online first using the "Go Online" button.',
        { timer: 2000 }
      );
      return;
    }
    
    try {
      await dispatch(updateLiveLocation()).unwrap();
      setLastUpdate(new Date().toLocaleTimeString());
      SweetAlertService.success(
        'Location Updated',
        'Your current location has been sent to the control room.',
        { timer: 1500 }
      );
    } catch (error) {
      SweetAlertService.error(
        'Update Failed',
        'Unable to update location. Please check your GPS and try again.',
        { timer: 2000 }
      );
    }
  }, [dispatch, isOnline]);

  // Update last update time when location changes
  useEffect(() => {
    if (currentLocation) {
      setLastUpdate(new Date().toLocaleTimeString());
    }
  }, [currentLocation]);

  // Get status color and text
  const getStatusDisplay = () => {
    if (isOnline && locationStatus === 'online') {
      return { color: 'text-green-400', bg: 'bg-green-500/20', text: 'Online', pulse: true };
    } else if (isOnline && locationStatus === 'pending') {
      return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', text: 'Connecting...', pulse: true };
    } else {
      return { color: 'text-gray-400', bg: 'bg-gray-500/20', text: 'Offline', pulse: false };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className="relative overflow-hidden rounded-b-[2.5rem] rounded-t-xl bg-gradient-to-br from-[#2a0008] to-[#6b0015] px-4 pb-5 pt-4 text-white sm:px-5 sm:pb-6">
      {/* Decorative Wave */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.06),transparent_45%)]" />

      {/* Status Bar with Live Location Status */}
      {/* <div className="relative z-10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span>{formattedTime}</span>
          <div className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 ${status.bg}`}>
            {status.pulse && (
              <div className="relative">
                <Circle className={`h-2 w-2 ${status.color} animate-pulse`} fill="currentColor" />
              </div>
            )}
            <span className={`text-[10px] font-medium ${status.color}`}>{status.text}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Wifi className={`h-3 w-3 ${isOnline ? 'text-green-400' : 'text-gray-400'}`} />
          <BatteryFull className="h-3 w-3" />
        </div>
      </div> */}

      {/* User Row */}
      <div className="relative z-10 mt-5 flex items-center justify-between sm:mt-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              src={guard.profile_image_url || "/img/avt.png"}
              alt={guard.full_name}
              width={40}
              height={40}
              className="rounded-full border border-white/20 object-cover sm:h-11 sm:w-11"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white" />
            )}
          </div>

          <div>
            <p className="text-xs font-medium sm:text-sm">Welcome back, {guard.full_name.split(' ')[0]}! 👋</p>
            <p className="text-[10px] text-yellow-400 sm:text-xs">
              {guard.verification_status === 'pending' 
                ? '⏳ Account pending verification' 
                : '✅ Verified account'}
            </p>
            <p className="text-[10px] text-white/60 sm:text-xs">
              {guard.guard_code}
            </p>
          </div>
        </div>
      </div>

      {/* Live Location Controls */}
      <div className="relative z-10 mt-4">
        <div className="flex items-center justify-between gap-2 rounded-lg bg-white/5 p-2">
          <div className="flex items-center gap-2">
            <MapPin className={`h-4 w-4 ${isOnline ? 'text-green-400' : 'text-gray-400'}`} />
            <span className="text-[10px] opacity-70">
              {isOnline && currentLocation 
                ? `📍 Last location: ${parseFloat(currentLocation.latitude).toFixed(4)}, ${parseFloat(currentLocation.longitude).toFixed(4)}`
                : 'Location sharing off'}
            </span>
          </div>
          
          <div className="flex gap-2">
            {!isOnline ? (
              <button
                onClick={handleStartTracking}
                disabled={isLoading}
                className="flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium transition-all hover:bg-green-700 disabled:opacity-50"
              >
                <Activity className="h-3 w-3" />
                {isLoading ? 'Starting...' : 'Go Online'}
              </button>
            ) : (
              <>
                <button
                  onClick={handleManualUpdate}
                  disabled={isLoading}
                  className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium transition-all hover:bg-blue-700 disabled:opacity-50"
                >
                  <MapPin className="h-3 w-3" />
                  Update Location
                </button>
                <button
                  onClick={handleStopTracking}
                  disabled={isLoading}
                  className="flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium transition-all hover:bg-red-700 disabled:opacity-50"
                >
                  <Power className="h-3 w-3" />
                  Go Offline
                </button>
              </>
            )}
          </div>
        </div>
        
        {isOnline && (
          <div className="mt-1 text-right">
            <span className="text-[9px] text-white/40">
              {lastUpdate ? `Last location update: ${lastUpdate}` : 'Click "Update Location" to share your position'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
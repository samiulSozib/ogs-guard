// components/dashboard/shift-control.tsx
"use client"

import { useState, useEffect } from "react"
import {
  Power,
  Coffee,
  Clock,
  AlertCircle,
  Target,
  Calendar,
  Loader2,
  MapPin,
  Navigation,
  Battery,
  Wifi,
} from "lucide-react"
import { ActionButton } from "./action-button"
import { DashboardShiftStatus } from "@/app/types/dashboard"
import SweetAlertService from "@/lib/sweetAlert"
import { logShiftAction } from "@/store/slices/dutyAssignmentReportSlice"
import { fetchShiftStatus } from "@/store/slices/dashboardSlice"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"

interface ShiftControlProps {
  shiftStatus: DashboardShiftStatus
  guardId: number
  currentAssignmentId?: number
}

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  address: string
}

interface DeviceInfoData {
  battery_level: number
  network_strength: string
  device_id: string
}

export function ShiftControl({ 
  shiftStatus, 
  guardId, 
  currentAssignmentId 
}: ShiftControlProps) {
  const dispatch = useAppDispatch()
  const { isLoading, error: shiftError } = useAppSelector((state) => state.dutyAssignmentReport)
  const [actionType, setActionType] = useState<string | null>(null)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfoData>({
    battery_level: 0,
    network_strength: "unknown",
    device_id: ""
  })

  // Get device info on mount
  useEffect(() => {
    getDeviceInfo()
  }, [])

  const getDeviceInfo = () => {
    // Get battery info if available
    if ('getBattery' in navigator) {
      const batteryPromise = (navigator as Navigator & { getBattery?: () => Promise<{ level: number }> }).getBattery?.()
      if (batteryPromise) {
        batteryPromise.then((battery) => {
          setDeviceInfo(prev => ({
            ...prev,
            battery_level: Math.round(battery.level * 100)
          }))
        }).catch(() => {
          setDeviceInfo(prev => ({ ...prev, battery_level: 85 }))
        })
      } else {
        setDeviceInfo(prev => ({ ...prev, battery_level: 85 }))
      }
    } else {
      setDeviceInfo(prev => ({ ...prev, battery_level: 85 }))
    }

    // Get network info
    const connection = (navigator as Navigator & { 
      connection?: { effectiveType?: string; type?: string } 
    }).connection
    
    if (connection) {
      const type = connection.effectiveType || connection.type
      let strength = "fair"
      if (type === '4g') strength = "excellent"
      else if (type === '3g') strength = "good"
      else if (type === '2g') strength = "poor"
      
      setDeviceInfo(prev => ({ ...prev, network_strength: strength }))
    } else {
      setDeviceInfo(prev => ({ ...prev, network_strength: "good" }))
    }

    // Get or generate device ID
    let deviceId = localStorage.getItem('device_id')
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('device_id', deviceId)
    }
    setDeviceInfo(prev => ({ ...prev, device_id: deviceId }))
  }

  const getLocation = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        SweetAlertService.error("Error", "Geolocation is not supported by your browser")
        resolve(false)
        return
      }

      setIsGettingLocation(true)
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          const accuracyValue = position.coords.accuracy
          
          // Get address from coordinates (reverse geocoding)
          let addressText = `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`,
              {
                headers: { 'User-Agent': 'GuardApp/1.0' }
              }
            )
            const data = await response.json()
            addressText = data.display_name || addressText
          } catch (error) {
            console.error("Reverse geocoding failed:", error)
          }
          
          setLocation({
            latitude: lat,
            longitude: lng,
            accuracy: accuracyValue,
            address: addressText
          })
          
          setIsGettingLocation(false)
          resolve(true)
        },
        (error) => {
          setIsGettingLocation(false)
          let errorMessage = "Unable to get your location"
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = "Location permission denied. Please enable location access."
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = "Location information is unavailable."
          } else if (error.code === error.TIMEOUT) {
            errorMessage = "Location request timed out."
          }
          SweetAlertService.error("Location Error", errorMessage)
          resolve(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    })
  }

  // Determine available actions based on shift status
  const getAvailableActions = () => {
    const canCheckIn = shiftStatus.can_check_in && shiftStatus.next_expected_action === 'check_in'
    const canStartBreak = shiftStatus.can_start_break && shiftStatus.next_expected_action === 'start_break'
    const canEndBreak = shiftStatus.can_end_break && shiftStatus.next_expected_action === 'end_break'
    const canCheckOut = shiftStatus.can_check_out && shiftStatus.next_expected_action === 'check_out'

    return {
      canCheckIn,
      canStartBreak,
      canEndBreak,
      canCheckOut,
      nextAction: shiftStatus.next_expected_action
    }
  }

  const availableActions = getAvailableActions()

  const handleClockIn = async () => {
    if (!availableActions.canCheckIn) {
      SweetAlertService.warning("Not Available", "You cannot clock in at this time")
      return
    }

    if (!currentAssignmentId) {
      SweetAlertService.error("Error", "No active assignment found")
      return
    }

    setActionType('check_in')
    
    try {
      // Get location first
      const locationSuccess = await getLocation()
      if (!locationSuccess || !location) {
        setActionType(null)
        return
      }

      const result = await SweetAlertService.confirm(
        "Clock In",
        "Are you ready to start your shift?",
        "Yes, Clock In"
      )
      
      if (!result.isConfirmed) {
        setActionType(null)
        return
      }

      await dispatch(logShiftAction({
        guard_assignment_id: currentAssignmentId,
        action: 'check_in',
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        location_address: location.address,
        remarks: "Starting shift",
        metadata: {
          battery_level: deviceInfo.battery_level,
          network_strength: deviceInfo.network_strength,
          device_id: deviceInfo.device_id,
          timestamp: new Date().toISOString(),
        }
      })).unwrap()

      SweetAlertService.success("Success", "You have successfully clocked in")
      
      // Refresh shift status
      dispatch(fetchShiftStatus())
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to clock in. Please try again."
      SweetAlertService.error("Error", errorMessage)
    } finally {
      setActionType(null)
    }
  }

  const handleBreak = async () => {
    const canStartBreak = availableActions.canStartBreak
    const canEndBreak = availableActions.canEndBreak

    if (!canStartBreak && !canEndBreak) {
      SweetAlertService.warning("Not Available", "Break action not available at this time")
      return
    }

    if (!currentAssignmentId) {
      SweetAlertService.error("Error", "No active assignment found")
      return
    }

    const isStartingBreak = canStartBreak
    const action = isStartingBreak ? 'start_break' : 'end_break'
    const title = isStartingBreak ? "Start Break" : "End Break"
    const confirmText = isStartingBreak ? "Yes, Start Break" : "Yes, End Break"
    const successMessage = isStartingBreak ? "Break started successfully" : "Break ended successfully"

    setActionType(action)
    
    try {
      // Get location for break action
      const locationSuccess = await getLocation()
      if (!locationSuccess || !location) {
        setActionType(null)
        return
      }

      const result = await SweetAlertService.confirm(
        title,
        isStartingBreak ? "Are you sure you want to start your break?" : "Are you ready to return from break?",
        confirmText
      )
      
      if (!result.isConfirmed) {
        setActionType(null)
        return
      }

      await dispatch(logShiftAction({
        guard_assignment_id: currentAssignmentId,
        action,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        location_address: location.address,
        remarks: isStartingBreak ? "Starting break" : "Ending break",
        metadata: {
          battery_level: deviceInfo.battery_level,
          network_strength: deviceInfo.network_strength,
          device_id: deviceInfo.device_id,
          timestamp: new Date().toISOString(),
        }
      })).unwrap()

      SweetAlertService.success("Success", successMessage)
      
      // Refresh shift status
      dispatch(fetchShiftStatus())
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to process break action. Please try again."
      SweetAlertService.error("Error", errorMessage)
    } finally {
      setActionType(null)
    }
  }

  const handleClockOut = async () => {
    if (!availableActions.canCheckOut) {
      SweetAlertService.warning("Not Available", "You cannot clock out at this time")
      return
    }

    if (!currentAssignmentId) {
      SweetAlertService.error("Error", "No active assignment found")
      return
    }

    setActionType('check_out')
    
    try {
      // Get location for clock out
      const locationSuccess = await getLocation()
      if (!locationSuccess || !location) {
        setActionType(null)
        return
      }

      const result = await SweetAlertService.confirm(
        "Clock Out",
        "Are you sure you want to clock out? This will end your shift.",
        "Yes, Clock Out"
      )
      
      if (!result.isConfirmed) {
        setActionType(null)
        return
      }

      await dispatch(logShiftAction({
        guard_assignment_id: currentAssignmentId,
        action: 'check_out',
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        location_address: location.address,
        remarks: "Ending shift",
        metadata: {
          battery_level: deviceInfo.battery_level,
          network_strength: deviceInfo.network_strength,
          device_id: deviceInfo.device_id,
          timestamp: new Date().toISOString(),
        }
      })).unwrap()

      SweetAlertService.success("Success", "You have successfully clocked out")
      
      // Refresh shift status
      dispatch(fetchShiftStatus())
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to clock out. Please try again."
      SweetAlertService.error("Error", errorMessage)
    } finally {
      setActionType(null)
    }
  }

  const handleIncident = () => {
    window.location.href = "/incidents"
  }

  const handleMissions = () => {
    window.location.href = "/missions"
  }

  const handleLeave = () => {
    window.location.href = "/leave-requests"
  }

  // Get button labels based on next expected action
  const getBreakButtonLabel = () => {
    if (availableActions.canStartBreak) return "Start Break"
    if (availableActions.canEndBreak) return "End Break"
    return "Break"
  }

  // Determine if break button should be active
  const isBreakActive = availableActions.canStartBreak || availableActions.canEndBreak

  // Show loading state for specific button
  const isLoadingCheckIn = isLoading && actionType === 'check_in'
  const isLoadingBreak = isLoading && (actionType === 'start_break' || actionType === 'end_break')
  const isLoadingCheckOut = isLoading && actionType === 'check_out'

  return (
    <div>
      <h2 className="mb-3 font-semibold">Shift Control</h2>

      {/* Location Status */}
      {isGettingLocation && (
        <div className="mb-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 animate-spin" />
            <span>Getting your location...</span>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {shiftError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{shiftError}</span>
          </div>
        </div>
      )}

      {/* Shift Status Banner */}
      <div className="mb-4 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Current Shift Status:</span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
            shiftStatus.shift_status === 'checked_in' ? 'bg-green-100 text-green-600' :
            shiftStatus.shift_status === 'on_break' ? 'bg-yellow-100 text-yellow-600' :
            shiftStatus.shift_status === 'checked_out' ? 'bg-gray-100 text-gray-600' :
            'bg-blue-100 text-blue-600'
          }`}>
            {shiftStatus.shift_status_label}
          </span>
        </div>
        
        {shiftStatus.has_active_shift && (
          <div className="mt-2 text-xs text-gray-500">
            Next action: <span className="font-medium capitalize">{shiftStatus.next_expected_action?.replace('_', ' ')}</span>
          </div>
        )}
        
        {shiftStatus.check_in_time && (
          <div className="mt-2 text-xs text-gray-500">
            Checked in at: {new Date(shiftStatus.check_in_time).toLocaleTimeString()}
          </div>
        )}
        
        {shiftStatus.check_out_time && (
          <div className="mt-2 text-xs text-gray-500">
            Checked out at: {new Date(shiftStatus.check_out_time).toLocaleTimeString()}
          </div>
        )}
        
        {shiftStatus.total_break_minutes > 0 && (
          <div className="text-xs text-gray-500">
            Total break time: {Math.floor(shiftStatus.total_break_minutes / 60)}h {shiftStatus.total_break_minutes % 60}m
          </div>
        )}
        
        {shiftStatus.on_break && (
          <div className="mt-2 text-xs text-yellow-600 font-medium">
            🔴 Currently on break
          </div>
        )}

        {/* Device Info */}
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Battery className="h-3 w-3" />
            <span>{deviceInfo.battery_level}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wifi className="h-3 w-3" />
            <span>{deviceInfo.network_strength}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {/* Clock In Button */}
        <ActionButton
          icon={isLoadingCheckIn ? Loader2 : Power}
          label={isLoadingCheckIn ? "Clocking In..." : "Clock In"}
          size="large"
          active={availableActions.canCheckIn}
          activeColor="green"
          disabled={!availableActions.canCheckIn || isLoading || isGettingLocation}
          onClick={handleClockIn}
        />

        {/* Break Button */}
        <ActionButton
          icon={isLoadingBreak ? Loader2 : Coffee}
          label={isLoadingBreak ? "Processing..." : getBreakButtonLabel()}
          size="medium"
          active={isBreakActive}
          activeColor="yellow"
          disabled={!isBreakActive || isLoading || isGettingLocation}
          onClick={handleBreak}
        />

        {/* Clock Out Button */}
        <ActionButton
          icon={isLoadingCheckOut ? Loader2 : Clock}
          label={isLoadingCheckOut ? "Clocking Out..." : "Clock Out"}
          size="medium"
          active={availableActions.canCheckOut}
          activeColor="maroon"
          disabled={!availableActions.canCheckOut || isLoading || isGettingLocation}
          onClick={handleClockOut}
        />

        {/* Secondary Actions */}
        <ActionButton 
          icon={AlertCircle} 
          label="Incident" 
          onClick={handleIncident}
        />
        <ActionButton 
          icon={Target} 
          label="Missions" 
          onClick={handleMissions}
        />
        <ActionButton 
          icon={Calendar} 
          label="Leave" 
          onClick={handleLeave}
        />
      </div>

      {/* Helper text showing what action to take next */}
      {shiftStatus.has_active_shift && shiftStatus.next_expected_action && (
        <div className="mt-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
          <strong>Next expected action:</strong> {shiftStatus.next_expected_action.replace('_', ' ').toUpperCase()}
          {shiftStatus.next_expected_action === 'check_in' && " - Start your shift by clicking the Clock In button"}
          {shiftStatus.next_expected_action === 'start_break' && " - Take a break when needed"}
          {shiftStatus.next_expected_action === 'end_break' && " - Return from break to continue your shift"}
          {shiftStatus.next_expected_action === 'check_out' && " - End your shift when complete"}
        </div>
      )}
    </div>
  )
}
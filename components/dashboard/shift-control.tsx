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
  Navigation,
  Battery,
  Wifi,
} from "lucide-react"
import { ActionButton } from "./action-button"
import SweetAlertService from "@/lib/sweetAlert"
import { logShiftAction } from "@/store/slices/dutyAssignmentReportSlice"
import { fetchShiftStatus } from "@/store/slices/dashboardSlice"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { DashboardShiftStatus, LastAction } from "@/app/types/dashboard"

interface ShiftControlProps {
  shiftStatus: DashboardShiftStatus
  guardId: number
  currentAssignmentId?: number,
  currentAssignmentStatus?: string
  lastAction?: LastAction | null
  onActionComplete?: () => void // Callback to refresh parent data
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
  currentAssignmentId,
  currentAssignmentStatus,
  lastAction: initialLastAction,
  onActionComplete
}: ShiftControlProps) {
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.dutyAssignmentReport)
  const [actionType, setActionType] = useState<string | null>(null)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfoData>({
    battery_level: 0,
    network_strength: "unknown",
    device_id: ""
  })
  
  // Local state for lastAction to update dynamically
  const [lastAction, setLastAction] = useState<LastAction | null>(initialLastAction || null)

  // Update local state when prop changes
  useEffect(() => {
    setLastAction(initialLastAction || null)
  }, [initialLastAction])

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

  // Determine available actions based on last_action
  const getAvailableActions = () => {
    // If no last_action, only check_in is available
    if (!lastAction) {
      return {
        canCheckIn: true,
        canBreak: false,
        canCheckOut: false,
        nextAction: 'check_in'
      }
    }

    // If last_action.action is 'break', make check_in and check_out available
    if (lastAction.action === 'break') {
      return {
        canCheckIn: true,
        canBreak: false,
        canCheckOut: true,
        nextAction: 'check_in'
      }
    }

    // If last_action.action is 'check_in', make break and check_out available
    if (lastAction.action === 'check_in') {
      return {
        canCheckIn: false,
        canBreak: true,
        canCheckOut: true,
        nextAction: 'break'
      }
    }

    // If last_action.action is 'check_out', disable all
    if (lastAction.action === 'check_out') {
      return {
        canCheckIn: false,
        canBreak: false,
        canCheckOut: false,
        nextAction: 'none'
      }
    }

    // Default fallback
    return {
      canCheckIn: true,
      canBreak: false,
      canCheckOut: false,
      nextAction: 'check_in'
    }
  }

  const availableActions = getAvailableActions()

  // Determine which button should bounce
  const shouldBounceCheckIn = availableActions.canCheckIn
  const shouldBounceBreak = availableActions.canBreak
  const shouldBounceCheckOut = availableActions.canCheckOut

  // Update last action after successful action
  const updateLastAction = (action: string, time?: string) => {
    const now = new Date()
    const formattedTime = time || now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    
    setLastAction({
      action: action,
      time: formattedTime,
      location: location?.address || 'Current location'
    })
  }

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

      // Update local state
      updateLastAction('check_in')
      
      SweetAlertService.success("Success", "You have successfully clocked in")
      dispatch(fetchShiftStatus())
      
      // Callback to refresh parent data
      if (onActionComplete) {
        onActionComplete()
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to clock in. Please try again."
      SweetAlertService.error("Error", errorMessage)
    } finally {
      setActionType(null)
    }
  }

  const handleBreak = async () => {
    if (!availableActions.canBreak) {
      SweetAlertService.warning("Not Available", "Break action not available at this time")
      return
    }

    if (!currentAssignmentId) {
      SweetAlertService.error("Error", "No active assignment found")
      return
    }

    setActionType('break')

    try {
      const locationSuccess = await getLocation()
      if (!locationSuccess || !location) {
        setActionType(null)
        return
      }

      const result = await SweetAlertService.confirm(
        "Break",
        "Are you sure you want to take a break?",
        "Yes, Take Break"
      )

      if (!result.isConfirmed) {
        setActionType(null)
        return
      }

      await dispatch(logShiftAction({
        guard_assignment_id: currentAssignmentId,
        action: 'break',
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        location_address: location.address,
        remarks: "Taking break",
        metadata: {
          battery_level: deviceInfo.battery_level,
          network_strength: deviceInfo.network_strength,
          device_id: deviceInfo.device_id,
          timestamp: new Date().toISOString(),
        }
      })).unwrap()

      // Update local state
      updateLastAction('break')
      
      SweetAlertService.success("Success", "Break started successfully")
      dispatch(fetchShiftStatus())
      
      // Callback to refresh parent data
      if (onActionComplete) {
        onActionComplete()
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to take break. Please try again."
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

      // Update local state
      updateLastAction('check_out')
      
      SweetAlertService.success("Success", "You have successfully clocked out")
      dispatch(fetchShiftStatus())
      
      // Callback to refresh parent data
      if (onActionComplete) {
        onActionComplete()
      }

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

  const isLoadingCheckIn = isLoading && actionType === 'check_in'
  const isLoadingBreak = isLoading && actionType === 'break'
  const isLoadingCheckOut = isLoading && actionType === 'check_out'

  // Get last action display text
  const getLastActionText = () => {
    if (!lastAction) return "No action yet"
    return `${lastAction.action.replace('_', ' ').toUpperCase()} at ${lastAction.time}`
  }

  // Check if shift is completed (all actions disabled)
  const isShiftCompleted = lastAction?.action === 'check_out'

  return (
    <div>
      <h2 className="mb-3 font-semibold">Shift Control</h2>

      {/* Last Action Banner */}
      <div className="mb-4 rounded-lg border p-3 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Last Action:</span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
            !lastAction ? 'bg-gray-100 text-gray-600' :
            lastAction.action === 'check_in' ? 'bg-green-100 text-green-600' :
            lastAction.action === 'break' ? 'bg-yellow-100 text-yellow-600' :
            lastAction.action === 'check_out' ? 'bg-red-100 text-red-600' :
            'bg-purple-100 text-purple-600'
          }`}>
            {getLastActionText()}
          </span>
        </div>
        {!lastAction && (
          <div className="mt-2 text-xs text-blue-600 animate-pulse">
            ⚡ Click the Check In button to start your shift
          </div>
        )}
        {lastAction?.action === 'break' && (
          <div className="mt-2 text-xs text-orange-600">
            🔄 You were on break. Click Check In to resume or Check Out to end shift
          </div>
        )}
        {lastAction?.action === 'check_in' && (
          <div className="mt-2 text-xs text-green-600">
            ✅ You are checked in. Take a break or check out when done
          </div>
        )}
        {lastAction?.action === 'check_out' && (
          <div className="mt-2 text-xs text-red-600">
            🏁 Shift completed. Thank you for your service!
          </div>
        )}
      </div>

      {/* Location Status */}
      {isGettingLocation && (
        <div className="mb-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 animate-spin" />
            <span>Getting your location...</span>
          </div>
        </div>
      )}

      {/* Shift Status Banner */}
      <div className="mb-4 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Current Shift Status:</span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${shiftStatus.shift_status === 'checked_in' ? 'bg-green-100 text-green-600' :
              shiftStatus.shift_status === 'on_break' ? 'bg-yellow-100 text-yellow-600' :
                shiftStatus.shift_status === 'checked_out' ? 'bg-gray-100 text-gray-600' :
                  'bg-blue-100 text-blue-600'
            }`}>
            {shiftStatus.shift_status_label}
          </span>
        </div>

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

      <div className="flex flex-col gap-6">
        {/* Primary Actions Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {/* Clock In Button */}
          <ActionButton
            icon={isLoadingCheckIn ? Loader2 : Power}
            label={isLoadingCheckIn ? "Checking In..." : "Check In"}
            size="large"
            variant="checkin"
            active={availableActions.canCheckIn}
            bounce={shouldBounceCheckIn}
            isAssignmentAssigned={availableActions.canCheckIn}
            onClick={handleClockIn}
            disabled={isLoadingCheckIn || isShiftCompleted}
          />

          {/* Break Button */}
          <ActionButton
            icon={isLoadingBreak ? Loader2 : Coffee}
            label={isLoadingBreak ? "Processing..." : "Break"}
            size="large"
            variant="break"
            active={availableActions.canBreak}
            bounce={shouldBounceBreak}
            isAssignmentAssigned={availableActions.canBreak}
            onClick={handleBreak}
            disabled={isLoadingBreak || isShiftCompleted}
          />

          {/* Clock Out Button */}
          <ActionButton
            icon={isLoadingCheckOut ? Loader2 : Clock}
            label={isLoadingCheckOut ? "Checking Out..." : "Check Out"}
            size="large"
            variant="checkout"
            active={availableActions.canCheckOut}
            bounce={shouldBounceCheckOut}
            isAssignmentAssigned={availableActions.canCheckOut}
            onClick={handleClockOut}
            disabled={isLoadingCheckOut || isShiftCompleted}
          />
        </div>

        {/* Secondary Actions Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <ActionButton
            icon={AlertCircle}
            label="Incident"
            variant="default"
            onClick={handleIncident}
          />
          <ActionButton
            icon={Target}
            label="Missions"
            variant="default"
            onClick={handleMissions}
          />
          <ActionButton
            icon={Calendar}
            label="Leave"
            variant="default"
            onClick={handleLeave}
          />
        </div>
      </div>

      {/* Helper text based on last_action */}
      {!lastAction && (
        <div className="mt-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 animate-pulse">
          <strong>📋 No active shift:</strong> Click the <strong className="font-bold">Check In</strong> button to start your shift
        </div>
      )}

      {lastAction?.action === 'break' && (
        <div className="mt-4 rounded-lg bg-orange-50 p-3 text-xs text-orange-700 dark:bg-orange-900/20 dark:text-orange-300">
          <strong>🔄 Break Ended:</strong> Click <strong className="font-bold">Check In</strong> to resume duty or <strong className="font-bold">Check Out</strong> to end shift
        </div>
      )}

      {lastAction?.action === 'check_in' && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-xs text-green-700 dark:bg-green-900/20 dark:text-green-300">
          <strong>✅ Shift Active:</strong> Use <strong className="font-bold">Break</strong> to take a break or <strong className="font-bold">Check Out</strong> to end shift
        </div>
      )}

      {lastAction?.action === 'check_out' && (
        <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-900/20 dark:text-gray-400">
          <strong>🏁 Shift Completed:</strong> Thank you for completing your shift. No further actions available.
        </div>
      )}
    </div>
  )
}
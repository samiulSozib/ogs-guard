// components/dashboard/shift-control.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import {
  Power,
  Coffee,
  Clock,
  AlertCircle,
  Target,
  Calendar,
  Loader2,
  Navigation,
  Globe,
} from "lucide-react"
import { ActionButton } from "./action-button"
import SweetAlertService from "@/lib/sweetAlert"
import { logShiftAction } from "@/store/slices/dutyAssignmentReportSlice"
import { fetchShiftStatus } from "@/store/slices/dashboardSlice"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { DashboardShiftStatus, LastAction } from "@/app/types/dashboard"
import { sendHeartbeat, startLiveTracking } from '@/store/slices/guardLiveLocationSlice'

interface ShiftControlProps {
  shiftStatus: DashboardShiftStatus
  guardId: number
  currentAssignmentId?: number,
  currentAssignmentStatus?: string
  lastAction?: LastAction | null
  onActionComplete?: () => void
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
  const { isTracking } = useAppSelector((state) => state.guardLiveLocation)
  const [actionType, setActionType] = useState<string | null>(null)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [isProcessingAction, setIsProcessingAction] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfoData>({
    battery_level: 0,
    network_strength: "unknown",
    device_id: ""
  })

  const [lastAction, setLastAction] = useState<LastAction | null>(initialLastAction || null)
  const locationResolveRef = useRef<((value: boolean) => void) | null>(null)

  // Update local state when prop changes
  useEffect(() => {
    setLastAction(initialLastAction || null)
  }, [initialLastAction])

  // Get device info on mount
  useEffect(() => {
    getDeviceInfo()
  }, [])

  const getDeviceInfo = () => {
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

    let deviceId = localStorage.getItem('device_id')
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('device_id', deviceId)
    }
    setDeviceInfo(prev => ({ ...prev, device_id: deviceId }))
  }

  // Get location with promise
  const getLocation = (): Promise<LocationData | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        SweetAlertService.error("Error", "Geolocation is not supported by your browser")
        resolve(null)
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

          const locationData = {
            latitude: lat,
            longitude: lng,
            accuracy: accuracyValue,
            address: addressText
          }

          setLocation(locationData)
          setIsGettingLocation(false)
          resolve(locationData)
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
          resolve(null)
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
    if (!lastAction) {
      return {
        canCheckIn: true,
        canBreak: false,
        canCheckOut: false,
        nextAction: 'check_in'
      }
    }

    if (lastAction.action === 'break') {
      return {
        canCheckIn: true,
        canBreak: false,
        canCheckOut: false,
        nextAction: 'check_in'
      }
    }

    if (lastAction.action === 'check_in') {
      return {
        canCheckIn: false,
        canBreak: true,
        canCheckOut: true,
        nextAction: 'break'
      }
    }

    if (lastAction.action === 'check_out') {
      return {
        canCheckIn: false,
        canBreak: false,
        canCheckOut: false,
        nextAction: 'none'
      }
    }

    return {
      canCheckIn: true,
      canBreak: false,
      canCheckOut: false,
      nextAction: 'check_in'
    }
  }

  const availableActions = getAvailableActions()

  const shouldBounceCheckIn = availableActions.canCheckIn
  const shouldBounceBreak = availableActions.canBreak
  const shouldBounceCheckOut = availableActions.canCheckOut

  const updateLastAction = (action: string, time?: string) => {
    const now = new Date()
    const formattedTime = time || now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    setLastAction({
      action: action,
      time: formattedTime,
      location: location?.address || 'Current location'
    })
  }

  // Main action handler - handles online status and location in one click
  const performShiftAction = async (action: 'check_in' | 'break' | 'check_out', actionLabel: string) => {
    // Check if action is available
    const actionMap = {
      check_in: availableActions.canCheckIn,
      break: availableActions.canBreak,
      check_out: availableActions.canCheckOut
    }

    if (!actionMap[action]) {
      SweetAlertService.warning("Not Available", `You cannot ${actionLabel} at this time`)
      return
    }

    if (!currentAssignmentId) {
      SweetAlertService.error("Error", "No active assignment found")
      return
    }

    setActionType(action)
    setIsProcessingAction(true)

    try {
      // Step 1: Check if online, if not - go online first
      let isOnline = isTracking
      if (!isOnline) {
        SweetAlertService.loading('Going Online...', 'Please wait while we connect...')

        // Dispatch start tracking
        await dispatch(startLiveTracking()).unwrap()
        isOnline = true

        // Start heartbeat
        const heartbeatInterval = setInterval(() => {
          dispatch(sendHeartbeat())
        }, 120000)

        // Store interval reference for cleanup (optional)
        localStorage.setItem('heartbeat_interval', String(heartbeatInterval))

        SweetAlertService.close()
      }

      // Step 2: Get location (this will trigger GPS)
      SweetAlertService.loading('Getting Location...', 'Please wait while we get your current position...')

      const locationData = await getLocation()

      if (!locationData) {
        SweetAlertService.close()
        setIsProcessingAction(false)
        setActionType(null)
        return
      }

      SweetAlertService.close()

      // Step 3: Confirm action with user
      const confirmMessages = {
        check_in: {
          title: "Clock In",
          text: "Are you ready to start your shift?",
          confirmText: "Yes, Clock In"
        },
        break: {
          title: "Take Break",
          text: "Are you sure you want to take a break?",
          confirmText: "Yes, Take Break"
        },
        check_out: {
          title: "Clock Out",
          text: "Are you sure you want to clock out? This will end your shift.",
          confirmText: "Yes, Clock Out"
        }
      }

      const msg = confirmMessages[action]
      const result = await SweetAlertService.confirm(
        msg.title,
        msg.text,
        msg.confirmText,
        "Cancel"
      )

      if (!result.isConfirmed) {
        setIsProcessingAction(false)
        setActionType(null)
        return
      }

      // Step 4: Perform the action
      SweetAlertService.loading('Processing...', `Please wait while we ${actionLabel}...`)

      const remarksMap = {
        check_in: "Starting shift",
        break: "Taking break",
        check_out: "Ending shift"
      }

      await dispatch(logShiftAction({
        guard_assignment_id: currentAssignmentId,
        action: action,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy,
        location_address: locationData.address,
        remarks: remarksMap[action],
        metadata: {
          battery_level: deviceInfo.battery_level,
          network_strength: deviceInfo.network_strength,
          device_id: deviceInfo.device_id,
          timestamp: new Date().toISOString(),
        }
      })).unwrap()

      SweetAlertService.close()

      // Step 5: Update local state
      updateLastAction(action)

      const successMessages = {
        check_in: "You have successfully clocked in",
        break: "Break started successfully",
        check_out: "You have successfully clocked out"
      }

      SweetAlertService.success("Success", successMessages[action])
      dispatch(fetchShiftStatus())

      if (onActionComplete) {
        onActionComplete()
      }

    } catch (error: unknown) {
      SweetAlertService.close()
      const errorMessage = error instanceof Error ? error.message : `Failed to ${actionLabel}. Please try again.`
      SweetAlertService.error("Error", errorMessage)
    } finally {
      setIsProcessingAction(false)
      setActionType(null)
    }
  }

  const handleClockIn = () => performShiftAction('check_in', 'clock in')
  const handleBreak = () => performShiftAction('break', 'take break')
  const handleClockOut = () => performShiftAction('check_out', 'clock out')

  const handleIncident = () => {
    window.location.href = "/incidents"
  }

  const handleMissions = () => {
    window.location.href = "/missions"
  }

  const handleLeave = () => {
    window.location.href = "/leave-requests"
  }

  const isLoadingCheckIn = (isLoading || isProcessingAction) && actionType === 'check_in'
  const isLoadingBreak = (isLoading || isProcessingAction) && actionType === 'break'
  const isLoadingCheckOut = (isLoading || isProcessingAction) && actionType === 'check_out'

  const getLastActionText = () => {
    if (!lastAction) return "No action yet"
    return `${lastAction.action.replace('_', ' ').toUpperCase()} at ${lastAction.time}`
  }

  const isShiftCompleted = lastAction?.action === 'check_out'

  // Get timezone display
  const timezoneDisplay = shiftStatus?.site_timezone || 'Unknown'

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Shift Control</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Globe className="h-3 w-3" />
          <span>{timezoneDisplay}</span>
        </div>
      </div>

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
            🔄 You are on break. Click <strong className="font-bold">Check In</strong> to resume duty
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

      {/* Processing Status */}
      {isProcessingAction && (
        <div className="mb-4 rounded-lg bg-purple-50 p-3 text-xs text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing your request...</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* Primary Actions Row */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <ActionButton
            icon={isLoadingCheckIn ? Loader2 : Power}
            label={isLoadingCheckIn ? "Processing..." : "Check In"}
            size="large"
            variant="checkin"
            active={availableActions.canCheckIn}
            bounce={shouldBounceCheckIn}
            isAssignmentAssigned={availableActions.canCheckIn}
            onClick={handleClockIn}
            disabled={isLoadingCheckIn || isShiftCompleted || isProcessingAction}
          />

          <ActionButton
            icon={isLoadingBreak ? Loader2 : Coffee}
            label={isLoadingBreak ? "Processing..." : "Break"}
            size="large"
            variant="break"
            active={availableActions.canBreak}
            bounce={shouldBounceBreak}
            isAssignmentAssigned={availableActions.canBreak}
            onClick={handleBreak}
            disabled={isLoadingBreak || isShiftCompleted || isProcessingAction}
          />

          <ActionButton
            icon={isLoadingCheckOut ? Loader2 : Clock}
            label={isLoadingCheckOut ? "Processing..." : "Check Out"}
            size="large"
            variant="checkout"
            active={availableActions.canCheckOut}
            bounce={shouldBounceCheckOut}
            isAssignmentAssigned={availableActions.canCheckOut}
            onClick={handleClockOut}
            disabled={isLoadingCheckOut || isShiftCompleted || isProcessingAction}
          />
        </div>

        {/* Secondary Actions Row */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
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
          <strong>🔄 On Break:</strong> Click <strong className="font-bold">Check In</strong> to resume your duty
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

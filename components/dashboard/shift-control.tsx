// components/dashboard/shift-control.tsx
"use client"

import { useState } from "react"
import {
  Power,
  Coffee,
  Clock,
  AlertCircle,
  Target,
  Calendar,
  Loader2,
} from "lucide-react"
import { ActionButton } from "./action-button"
import { DashboardShiftStatus } from "@/app/types/dashboard"
import SweetAlertService from "@/lib/sweetAlert"

interface ShiftControlProps {
  shiftStatus: DashboardShiftStatus
  guardId: number
}

export function ShiftControl({ shiftStatus, guardId }: ShiftControlProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [actionType, setActionType] = useState<string | null>(null)

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

    setActionType('check_in')
    setIsLoading(true)
    
    try {
      // TODO: Implement actual clock in API call
      // await dashboardService.checkIn(guardId)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      SweetAlertService.success("Success", "You have successfully clocked in")
      
      // TODO: Refresh shift status after action
      // dispatch(fetchShiftStatus())
      
    } catch (error) {
      SweetAlertService.error("Error", "Failed to clock in. Please try again.")
    } finally {
      setIsLoading(false)
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

    setActionType(canStartBreak ? 'start_break' : 'end_break')
    setIsLoading(true)
    
    try {
      // TODO: Implement actual break API call
      // if (canStartBreak) {
      //   await dashboardService.startBreak(guardId)
      // } else {
      //   await dashboardService.endBreak(guardId)
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const message = canStartBreak ? "Break started successfully" : "Break ended successfully"
      SweetAlertService.success("Success", message)
      
      // TODO: Refresh shift status after action
      // dispatch(fetchShiftStatus())
      
    } catch (error) {
      SweetAlertService.error("Error", "Failed to process break action. Please try again.")
    } finally {
      setIsLoading(false)
      setActionType(null)
    }
  }

  const handleClockOut = async () => {
    if (!availableActions.canCheckOut) {
      SweetAlertService.warning("Not Available", "You cannot clock out at this time")
      return
    }

    setActionType('check_out')
    setIsLoading(true)
    
    try {
      // Confirm before clocking out
      const result = await SweetAlertService.confirm(
        "Clock Out",
        "Are you sure you want to clock out? This will end your shift.",
        "Yes, clock out"
      )
      
      if (!result.isConfirmed) {
        setIsLoading(false)
        setActionType(null)
        return
      }
      
      // TODO: Implement actual clock out API call
      // await dashboardService.checkOut(guardId)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      SweetAlertService.success("Success", "You have successfully clocked out")
      
      // TODO: Refresh shift status after action
      // dispatch(fetchShiftStatus())
      
    } catch (error) {
      SweetAlertService.error("Error", "Failed to clock out. Please try again.")
    } finally {
      setIsLoading(false)
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
      </div>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {/* Clock In Button */}
        <ActionButton
          icon={isLoadingCheckIn ? Loader2 : Power}
          label={isLoadingCheckIn ? "Clocking In..." : "Clock In"}
          size="large"
          active={availableActions.canCheckIn}
          activeColor="green"
          disabled={!availableActions.canCheckIn || isLoading}
          onClick={handleClockIn}
          //iconClassName={isLoadingCheckIn ? "animate-spin" : ""}
        />

        {/* Break Button */}
        <ActionButton
          icon={isLoadingBreak ? Loader2 : Coffee}
          label={isLoadingBreak ? "Processing..." : getBreakButtonLabel()}
          size="medium"
          active={isBreakActive}
          activeColor="yellow"
          disabled={!isBreakActive || isLoading}
          onClick={handleBreak}
          //iconClassName={isLoadingBreak ? "animate-spin" : ""}
        />

        {/* Clock Out Button */}
        <ActionButton
          icon={isLoadingCheckOut ? Loader2 : Clock}
          label={isLoadingCheckOut ? "Clocking Out..." : "Clock Out"}
          size="medium"
          active={availableActions.canCheckOut}
          activeColor="maroon"
          disabled={!availableActions.canCheckOut || isLoading}
          onClick={handleClockOut}
          //iconClassName={isLoadingCheckOut ? "animate-spin" : ""}
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
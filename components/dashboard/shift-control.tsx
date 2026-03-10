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

  const handleClockIn = async () => {
    setIsLoading(true)
    // You'll implement the API call here
    SweetAlertService.info("Clock In", "Feature coming soon")
    setIsLoading(false)
  }

  const handleBreak = async () => {
    if (!shiftStatus.can_start_break && !shiftStatus.can_end_break) {
      SweetAlertService.warning("Not Available", "Break action not available at this time")
      return
    }

    setIsLoading(true)
    if (shiftStatus.can_start_break) {
      SweetAlertService.info("Start Break", "Feature coming soon")
    } else if (shiftStatus.can_end_break) {
      SweetAlertService.info("End Break", "Feature coming soon")
    }
    setIsLoading(false)
  }

  const handleClockOut = async () => {
    if (!shiftStatus.can_check_out) {
      SweetAlertService.warning("Not Available", "Cannot clock out at this time")
      return
    }

    setIsLoading(true)
    SweetAlertService.info("Clock Out", "Feature coming soon")
    setIsLoading(false)
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
        {shiftStatus.check_in_time && (
          <div className="mt-2 text-xs text-gray-500">
            Checked in at: {new Date(shiftStatus.check_in_time).toLocaleTimeString()}
          </div>
        )}
        {shiftStatus.total_break_minutes > 0 && (
          <div className="text-xs text-gray-500">
            Total break time: {shiftStatus.total_break_minutes} minutes
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {/* Clock In Button */}
        <ActionButton
          icon={Power}
          label="Clock In"
          size="large"
          active={shiftStatus.can_check_in}
          activeColor="green"
          disabled={!shiftStatus.can_check_in || isLoading}
          onClick={handleClockIn}
        />

        {/* Break Button */}
        <ActionButton
          icon={Coffee}
          label={shiftStatus.can_start_break ? "Start Break" : shiftStatus.can_end_break ? "End Break" : "Break"}
          size="medium"
          active={shiftStatus.can_start_break || shiftStatus.can_end_break}
          activeColor="yellow"
          disabled={(!shiftStatus.can_start_break && !shiftStatus.can_end_break) || isLoading}
          onClick={handleBreak}
        />

        {/* Clock Out Button */}
        <ActionButton
          icon={Clock}
          label="Clock Out"
          size="medium"
          active={shiftStatus.can_check_out}
          activeColor="maroon"
          disabled={!shiftStatus.can_check_out || isLoading}
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
    </div>
  )
}
// components/dashboard/active-mission.tsx
import { DashboardAssignment } from "@/app/types/dashboard"
import { MapPin, Clock, Calendar, Building2, MapPinned } from "lucide-react"

interface ActiveMissionProps {
  assignment: DashboardAssignment
}

export function ActiveMission({ assignment }: ActiveMissionProps) {
  const startTime = new Date(assignment.duty.start_datetime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
  const endTime = new Date(assignment.duty.end_datetime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="rounded-xl bg-gradient-to-r from-[#3a000a] to-[#6b0015] p-6 text-white">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div>
            <p className="text-sm opacity-80">Active Mission</p>
            <p className="text-xl font-semibold">{assignment.site.name}</p>
            <p className="text-sm opacity-80">{assignment.site.client}</p>
            <p className="text-xs opacity-70">{assignment.site.address}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>Shift: {startTime} – {endTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>Duration: {assignment.duty.required_hours} hours</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPinned className="h-4 w-4" />
              <span>Location: {assignment.location.title}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4" />
              <span>Assignment: {assignment.assignment_code}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <div className="text-sm opacity-80">Progress</div>
              <div className="text-lg font-bold">{assignment.progress.percentage}%</div>
            </div>
            <div className="flex-1">
              <div className="h-2 overflow-hidden rounded-full bg-white/20">
                <div 
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: `${assignment.progress.percentage}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs opacity-70">
                <span>Elapsed: {assignment.progress.elapsed_hours}h</span>
                <span>Remaining: {assignment.progress.remaining_hours}h</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 border-white">
          <span className="text-xl font-bold">{assignment.progress.percentage}%</span>
          <span className="text-xs opacity-80">Complete</span>
        </div>
      </div>
    </div>
  )
}
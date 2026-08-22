// components/dashboard/active-mission.tsx
import { DashboardAssignment } from "@/app/types/dashboard"
import { MapPin, Clock, Calendar, Building2, MapPinned, Globe, Hourglass } from "lucide-react"

interface ActiveMissionProps {
  assignment: DashboardAssignment
}

export function ActiveMission({ assignment }: ActiveMissionProps) {
  // Use site timezone for display
  const timezone = assignment.site.timezone || 'UTC'

  // Format times using the site timezone
  const startTime = new Date(assignment.duty.start_datetime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone
  })
  const endTime = new Date(assignment.duty.end_datetime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone
  })

  // Format date
  const startDate = new Date(assignment.duty.start_datetime).toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: timezone
  })

  // Format hours and minutes helper
  const formatHoursAndMinutes = (hours: number): string => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)

    if (h === 0 && m === 0) return '0m'
    if (h === 0) return `${m}m`
    if (m === 0) return `${h}h`
    return `${h}h ${m}m`
  }

  // Get progress in hours and minutes
  const elapsedHours = assignment.progress.elapsed_hours || 0
  const remainingHours = assignment.progress.remaining_hours || 0
  const totalHours = assignment.progress.total_hours || 0

  const elapsedFormatted = formatHoursAndMinutes(elapsedHours)
  const remainingFormatted = formatHoursAndMinutes(remainingHours)
  const totalFormatted = formatHoursAndMinutes(totalHours)

  // Calculate percentage for progress bar
  const percentage = Math.min(assignment.progress.percentage || 0, 100)

  return (
    <div className="rounded-xl bg-gradient-to-r from-[#3a000a] to-[#6b0015] p-4 sm:p-6 text-white">
      {/* Mobile: Stack layout, Desktop: Flex row */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
        {/* Left Content */}
        <div className="flex-1 space-y-3 sm:space-y-4">
          {/* Header */}
          <div>
            <p className="text-xs sm:text-sm opacity-80">Active Mission</p>
            <p className="text-lg sm:text-xl font-semibold truncate">{assignment.site.name}</p>
            <p className="text-sm opacity-80 truncate">{assignment.site.client}</p>
            <p className="text-xs opacity-70 line-clamp-2 sm:line-clamp-1">{assignment.site.address}</p>
          </div>

          {/* Details Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Shift: {startTime} – {endTime}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Date: {startDate}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Timezone: {timezone}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">#{assignment.assignment_code}</span>
            </div>
            {assignment.location && (
              <div className="flex items-center gap-2 text-xs sm:text-sm col-span-1 sm:col-span-2">
                <MapPinned className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">Post: {assignment.location.title}</span>
              </div>
            )}
          </div>

          {/* Progress Section */}
          <div className="space-y-3 pt-1 sm:pt-2">
            {/* Time Summary - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <Hourglass className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/70" />
                <span className="text-xs sm:text-sm text-white/70">Progress</span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-4">
                <div className="text-xs sm:text-sm">
                  <span className="text-white/50">Elapsed:</span>
                  <span className="ml-1 font-mono font-semibold text-emerald-300">
                    {elapsedFormatted}
                  </span>
                </div>
                <div className="text-xs sm:text-sm">
                  <span className="text-white/50">Remaining:</span>
                  <span className="ml-1 font-mono font-semibold text-amber-300">
                    {remainingFormatted}
                  </span>
                </div>
                <div className="text-xs sm:text-sm">
                  <span className="text-white/50">Total:</span>
                  <span className="ml-1 font-mono font-semibold text-white">
                    {totalFormatted}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="h-2 sm:h-2.5 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[10px] sm:text-xs opacity-70">
                  <span>{percentage}% complete</span>
                  <span>{totalFormatted} total</span>
                </div>
              </div>
            </div>

            {/* Detailed Time Breakdown - Responsive Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
              <div className="rounded-lg bg-white/10 p-1.5 sm:p-2 text-center">
                <p className="text-[10px] sm:text-xs text-white/60">Elapsed</p>
                <p className="text-xs sm:text-sm font-mono font-semibold text-emerald-300">
                  {elapsedFormatted}
                </p>
              </div>
              <div className="rounded-lg bg-white/10 p-1.5 sm:p-2 text-center">
                <p className="text-[10px] sm:text-xs text-white/60">Remaining</p>
                <p className="text-xs sm:text-sm font-mono font-semibold text-amber-300">
                  {remainingFormatted}
                </p>
              </div>
              <div className="rounded-lg bg-white/10 p-1.5 sm:p-2 text-center">
                <p className="text-[10px] sm:text-xs text-white/60">Total</p>
                <p className="text-xs sm:text-sm font-mono font-semibold text-white">
                  {totalFormatted}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Circular Progress - Responsive */}
        <div className="flex lg:flex-col items-center lg:items-end justify-center lg:justify-start">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 flex-col items-center justify-center rounded-full border-4 border-white flex-shrink-0">
            <span className="text-base sm:text-xl font-bold">{percentage}%</span>
            <span className="text-[8px] sm:text-xs opacity-80">Complete</span>
          </div>
        </div>
      </div>
    </div>
  )
}

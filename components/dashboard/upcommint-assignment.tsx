// components/dashboard/upcoming-assignments.tsx
import { DashboardAssignment } from "@/app/types/dashboard"
import { Calendar, Clock, MapPin, Building2, ChevronRight, Hourglass } from "lucide-react"
import { format } from "date-fns"
import { useState, useEffect } from "react"

interface UpcomingAssignmentsProps {
  assignments: DashboardAssignment[]
}

export function UpcomingAssignments({ assignments }: UpcomingAssignmentsProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!assignments || assignments.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
        <Calendar className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Upcoming Assignments</h3>
        <p className="mt-1 text-sm text-gray-500">You do not have any upcoming shifts scheduled.</p>
      </div>
    )
  }

  // Get current date for comparisons
  const today = new Date(currentTime)
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Helper function to get time left until start
  const getTimeLeftUntilStart = (startDateTime: Date) => {
    const diffMs = startDateTime.getTime() - currentTime.getTime()

    if (diffMs <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, isPast: true }
    }

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000)

    return { hours: diffHours, minutes: diffMinutes, seconds: diffSeconds, isPast: false }
  }

  // Helper function to format time left string
  const formatTimeLeft = (hours: number, minutes: number, seconds: number) => {
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase text-muted-foreground">
          Upcoming Assignments ({assignments.length})
        </h2>
      </div>

      <div className="space-y-3">
        {assignments.map((assignment) => {
          const startDate = new Date(assignment.duty.start_datetime)
          const startDateOnly = new Date(startDate)
          startDateOnly.setHours(0, 0, 0, 0)

          const endDate = new Date(assignment.duty.end_datetime)
          const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

          // Compare dates for label
          const isToday = startDateOnly.getTime() === today.getTime()
          const isTomorrow = startDateOnly.getTime() === tomorrow.getTime()

          // Get time left until start (updates every second)
          const timeLeft = getTimeLeftUntilStart(startDate)

          let dateLabel = format(startDate, "EEEE, MMM d")
          if (isToday) dateLabel = `Today, ${format(startDate, "MMM d")}`
          if (isTomorrow) dateLabel = `Tomorrow, ${format(startDate, "MMM d")}`

          return (
            <div
              key={assignment.id}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-md"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#3a000a] to-[#6b0015]" />

              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#6b0015]" />
                      <span className="text-sm font-medium text-gray-900">
                        {assignment.site.name}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {assignment.assignment_code}
                      </span>
                    </div>

                    {/* Client */}
                    <p className="text-sm text-gray-600">{assignment.site.client}</p>

                    {/* Address */}
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 text-gray-400" />
                      <p className="text-xs text-gray-500">{assignment.site.address}</p>
                    </div>

                    {/* Date and Time */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-xs font-medium text-gray-700">{dateLabel}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {startTime} – {endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-600">
                          {assignment.duty.required_hours} hours
                        </span>
                      </div>
                    </div>

                    {/* Location Details */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-400">Post:</span>
                      <span className="text-xs text-gray-700">{assignment?.location?.title}</span>
                    </div>

                    {/* Countdown Timer */}
                    {!timeLeft.isPast && (
                      <div className="pt-2">
                        <div className={`
                          inline-flex items-center gap-2 rounded-full px-3 py-1.5
                          ${timeLeft.hours === 0 && timeLeft.minutes < 60
                            ? 'bg-red-50 animate-pulse'
                            : timeLeft.hours === 0
                              ? 'bg-orange-50'
                              : 'bg-amber-50'
                          }
                        `}>
                          <Hourglass className={`
                            h-3.5 w-3.5
                            ${timeLeft.hours === 0 && timeLeft.minutes < 60
                              ? 'text-red-600'
                              : timeLeft.hours === 0
                                ? 'text-orange-600'
                                : 'text-amber-600'
                            }
                          `} />
                          <span className={`
                            text-xs font-mono font-medium
                            ${timeLeft.hours === 0 && timeLeft.minutes < 60
                              ? 'text-red-700'
                              : timeLeft.hours === 0
                                ? 'text-orange-700'
                                : 'text-amber-700'
                            }
                          `}>
                            {timeLeft.hours > 0 && `${timeLeft.hours}h `}
                            {timeLeft.minutes > 0 && `${timeLeft.minutes}m `}
                            {timeLeft.seconds}s
                          </span>
                          <span className="text-xs text-gray-500">until shift starts</span>
                        </div>
                      </div>
                    )}

                    {/* If shift has started but not ended - show in progress */}
                    {timeLeft.isPast && new Date(assignment.duty.end_datetime) > currentTime && (
                      <div className="pt-2">
                        <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5">
                          <Clock className="h-3.5 w-3.5 text-green-600" />
                          <span className="text-xs font-medium text-green-700">
                            Shift in progress
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Arrow indicator */}
                  <ChevronRight className="h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#6b0015]" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

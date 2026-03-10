// components/dashboard/header-card.tsx
import { DashboardGuard } from "@/app/types/dashboard"
import { User, Calendar, Clock, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

interface HeaderCardProps {
  guard: DashboardGuard
  currentTime: string
}

export function HeaderCard({ guard, currentTime }: HeaderCardProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [showFullDetails, setShowFullDetails] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const formattedTime = new Date(currentTime).toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  const joinedDate = new Date(guard.created_at).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  // Mobile view
  if (isMobile) {
    return (
      <div className="rounded-xl bg-gradient-to-r from-[#3a000a] to-[#6b0015] p-4 text-white">
        {/* Main Header Row */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-lg font-bold">
                  {guard.full_name.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-base font-semibold">Welcome back!</h1>
                <p className="text-sm opacity-90">{guard.full_name}</p>
              </div>
            </div>
          </div>
          
          {/* Verification Badge - Compact */}
          <div className={`rounded-full px-2 py-1 text-xs ${
            guard.verification_status === 'pending' 
              ? 'bg-yellow-500/20 text-yellow-200' 
              : 'bg-green-500/20 text-green-200'
          }`}>
            {guard.verification_status === 'pending' ? '⏳' : '✅'}
          </div>
        </div>

        {/* Expandable Details Toggle */}
        <button 
          onClick={() => setShowFullDetails(!showFullDetails)}
          className="mt-3 flex w-full items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs"
        >
          <span className="font-medium">View Details</span>
          <ChevronRight className={`h-4 w-4 transition-transform ${showFullDetails ? 'rotate-90' : ''}`} />
        </button>

        {/* Collapsible Details */}
        {showFullDetails && (
          <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
            {/* Guard Code */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 opacity-80">
                <User className="h-3 w-3" />
                <span>Guard Code</span>
              </div>
              <span className="font-medium">{guard.guard_code}</span>
            </div>

            {/* Joined Date */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 opacity-80">
                <Calendar className="h-3 w-3" />
                <span>Joined</span>
              </div>
              <span className="font-medium">{joinedDate}</span>
            </div>

            {/* Current Time */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 opacity-80">
                <Clock className="h-3 w-3" />
                <span>Current Time</span>
              </div>
              <span className="font-medium">{formattedTime}</span>
            </div>

            {/* Full Verification Status */}
            <div className="mt-2 rounded-lg bg-white/5 p-2 text-center text-xs">
              {guard.verification_status === 'pending' 
                ? '⏳ Your account is pending verification' 
                : '✅ Your account is verified'}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Tablet/Desktop view (original)
  return (
    <div className="rounded-xl bg-gradient-to-r from-[#3a000a] to-[#6b0015] p-6 text-white">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-xl font-bold">
                {guard.full_name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {guard.full_name}! 👋</h1>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="font-mono">{guard.guard_code}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Joined {joinedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>

        {/* Verification Badge - Full */}
        <div className={`rounded-full px-4 py-2 text-sm ${
          guard.verification_status === 'pending' 
            ? 'bg-yellow-500/20 text-yellow-200' 
            : 'bg-green-500/20 text-green-200'
        }`}>
          {guard.verification_status === 'pending' 
            ? '⏳ Pending Verification' 
            : '✅ Verified Account'}
        </div>
      </div>
    </div>
  )
}
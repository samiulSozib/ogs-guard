// components/dashboard/header-card.tsx
import { DashboardGuard } from "@/app/types/dashboard"
import { Bell, Menu, Wifi, BatteryFull } from "lucide-react"
import Image from "next/image"

interface HeaderCardProps {
  guard: DashboardGuard
  currentTime: string
}

export function HeaderCard({ guard, currentTime }: HeaderCardProps) {
  const formattedTime = new Date(currentTime).toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <div className="relative overflow-hidden rounded-b-[2.5rem] rounded-t-xl bg-gradient-to-br from-[#2a0008] to-[#6b0015] px-4 pb-5 pt-4 text-white sm:px-5 sm:pb-6">
      {/* Decorative Wave */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.06),transparent_45%)]" />

      {/* Status Bar */}
      {/* <div className="relative z-10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <span>{formattedTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <Wifi className="h-3 w-3" />
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
            {/* Online Status Indicator */}
            {guard.is_active && (
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

        <div className="flex gap-3">
          <button className="relative">
            <Bell className="h-4 w-4 opacity-90 transition-opacity hover:opacity-100 sm:h-5 sm:w-5" />
            {/* Unread Messages Badge - You can connect this with your stats */}
            {/* <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
              {stats?.unread_messages || 0}
            </span> */}
          </button>
          <button>
            <Menu className="h-4 w-4 opacity-90 transition-opacity hover:opacity-100 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      {/* Quick Stats Row - Optional, you can add this if needed */}
      {/* <div className="relative z-10 mt-4 flex items-center justify-between rounded-lg bg-white/5 p-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="opacity-70">Shift:</span>
          <span className="font-medium">08:00 - 16:00</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="opacity-70">Progress:</span>
          <span className="font-medium">60%</span>
        </div>
      </div> */}
    </div>
  )
}
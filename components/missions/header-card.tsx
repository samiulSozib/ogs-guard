import Image from "next/image"
import { Bell, Menu, Wifi, BatteryFull, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export function HeaderCard() {
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useIsMobile()
  
  // Determine if we're not on the main dashboard
  const isNotDashboard = pathname !== '/' && pathname !== '/'
  
  const handleBack = () => {
    if (isNotDashboard) {
      router.back()
    } else {
      // If on dashboard, maybe toggle sidebar or do nothing
      console.log('Already on dashboard')
    }
  }

  return (
    <div className="relative overflow-hidden rounded-b-[2.5rem] rounded-t-xl bg-gradient-to-br from-[#2a0008] to-[#6b0015] px-4 pb-5 pt-4 text-white sm:px-5 sm:pb-6">
      {/* Decorative Wave */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.06),transparent_45%)]" />



      {/* User Row */}
      <div className="relative z-10 mt-5 flex items-center justify-between sm:mt-6">
        <div className="flex items-center gap-3">
          {/* Back Button - Mobile Only */}
          {isMobile && isNotDashboard && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className={cn(
                "-ml-2 h-8 w-8 text-white hover:bg-white/20",
                "transition-transform active:scale-95"
              )}
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}
          
          <Image
            src="/img/avt.png"
            alt="User"
            width={40}
            height={40}
            className={cn(
              "rounded-full border border-white/20 sm:h-11 sm:w-11",
              isMobile && isNotDashboard && "ml-1" // Add spacing when back button is present
            )}
          />

          <div>
            <p className="text-xs font-medium sm:text-sm">Missions</p>
            <p className="text-[10px] text-yellow-400 sm:text-xs">
              Account pending verification
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Bell className="h-4 w-4 opacity-90 sm:h-5 sm:w-5" />
          <Menu className="h-4 w-4 opacity-90 sm:h-5 sm:w-5" />
        </div>
      </div>
    </div>
  )
}
// // app-sidebar.tsx
// "use client"

// import * as React from "react"
// import {
//   AudioWaveform,
//   Command,
//   Home,
//   Inbox,
//   MessageCircleQuestion,
//   Search,
//   Sparkles,
// } from "lucide-react"

// import { NavMain } from "@/components/nav-main"
// import { NavSecondary } from "@/components/nav-secondary"
// import { TeamSwitcher } from "@/components/team-switcher"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarHeader,
//   SidebarRail,
// } from "@/components/ui/sidebar"
// import { BottomNav } from "@/components/bottom-nav"

// // Shared navigation data
// export const navItems = {
//   navMain: [
//     {
//       title: "Home",
//       url: "/",
//       icon: Search,
//     },
//     // {
//     //   title: "Reports",
//     //   url: "/reports",
//     //   icon: Sparkles,
//     // },
//     {
//       title: "Incidents",
//       url: "/incidents",
//       icon: Home,
//     },
//     {
//       title: "Missions",
//       url: "/missions",
//       icon: Inbox,
//       badge: "10",
//     },
//     {
//       title: "Leave Request",
//       url: "/leave-requests",
//       icon: Inbox,
//       badge: "10",
//     },
//   ],
//   navSecondary: [
//     {
//       title: "Help",
//       url: "#",
//       icon: MessageCircleQuestion,
//     },
//   ],
//   teams: [
//     {
//       name: "One Guard Security",
//       logo: Command,
//       plan: "Enterprise",
//     },
//     {
//       name: "OGS",
//       logo: AudioWaveform,
//       plan: "Startup",
//     },
//     {
//       name: "Evil Corp.",
//       logo: Command,
//       plan: "Free",
//     },
//   ],
// }

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <Sidebar className="border-r-0 hidden md:flex" {...props}>
//         <SidebarHeader>
//           <TeamSwitcher teams={navItems.teams} />
//           <NavMain items={navItems.navMain} />
//         </SidebarHeader>
//         <SidebarContent>
//           <NavSecondary items={navItems.navSecondary} className="mt-auto" />
//         </SidebarContent>
//         <SidebarRail />
//       </Sidebar>

//       {/* Mobile Bottom Navigation */}
//       <BottomNav />
//     </>
//   )
// }

// components/app-sidebar.tsx (updated to pass userType to BottomNav)
"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Search,
  Sparkles,
  Building,
  MapPin,
  FileText,
  Users,
  Settings,
  CreditCard,
  Calendar,
  Bell,
  BarChart3,
  Shield,
  Clock,
  UserCheck,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { useAppSelector } from "@/hooks/useAppSelector"

// Guard Navigation Items
const guardNavItems = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },

    {
      title: "Missions",
      url: "/missions",
      icon: Inbox,
      badge: "10",
    },
    {
      title: "Incidents",
      url: "/incidents",
      icon: Search,
    },
    {
      title: "Leave Requests",
      url: "/leave-requests",
      icon: Calendar,
    },
    {
      title: "Report",
      url: "/reports",
      icon: UserCheck,
    },
  ],
  navSecondary: [
    // {
    //   title: "Help",
    //   url: "/help",
    //   icon: MessageCircleQuestion,
    // },
    {
      title: "Contact",
      url: "/contact",
      icon: MessageCircleQuestion,
    },
  ],
}

// Client Navigation Items
const clientNavItems = {
  navMain: [
    {
      title: "Dashboard",
      url: "/client/dashboard",
      icon: Home,
    },
    {
      title: "Sites",
      url: "/client/sites",
      icon: MapPin,
    },
    {
      title: "Guards",
      url: "/client/guards",
      icon: FileText,
    },
    {
      title: "Guard Assignments",
      url: "/client/assignments",
      icon: Users,
    },
    {
      title: "Reports",
      url: "/client/reports",
      icon: BarChart3,
    },
    {
      title: "Incidents",
      url: "/client/incidents",
      icon: Bell,
    },
    {
      title: "Billing",
      url: "/client/billing",
      icon: CreditCard,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/client/settings",
      icon: Settings,
    },
    {
      title: "Help & Support",
      url: "/client/support",
      icon: MessageCircleQuestion,
    },
  ],
}

// Shared teams data
const teams = [
  {
    name: "One Guard Security",
    logo: Command,
    plan: "Enterprise",
  },
  {
    name: "OGS",
    logo: AudioWaveform,
    plan: "Startup",
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userType, setUserType] = React.useState<string | null>(null)
  const [mounted, setMounted] = React.useState(false)

  // Get user type from Redux or localStorage
  const { client } = useAppSelector((state) => state.clientProfile)
  const { user } = useAppSelector((state) => state.auth)

  React.useEffect(() => {
    setMounted(true)
    // Check user type from localStorage
    const type = localStorage.getItem('user_type')
    setUserType(type)
  }, [client, user])

  // Determine which nav items to show
  const isClient = userType === 'client'
  const navItems = isClient ? clientNavItems : guardNavItems

  // Don't render on server to avoid hydration mismatch
  if (!mounted) {
    return (
      <>
        <Sidebar className="border-r-0 hidden md:flex" {...props}>
          <SidebarHeader>
            <TeamSwitcher teams={teams} />
            <div className="h-8" />
          </SidebarHeader>
          <SidebarContent />
          <SidebarRail />
        </Sidebar>
        <BottomNav />
      </>
    )
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <Sidebar className="border-r-0 hidden md:flex" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={teams} />
          <NavMain items={navItems.navMain} />
        </SidebarHeader>
        <SidebarContent>
          <NavSecondary items={navItems.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      {/* Mobile Bottom Navigation - Pass userType */}
      <BottomNav userType={isClient ? "client" : "guard"} />
    </>
  )
}

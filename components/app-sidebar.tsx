// app-sidebar.tsx
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

// Shared navigation data
export const navItems = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Search,
    },
    // {
    //   title: "Reports",
    //   url: "/reports",
    //   icon: Sparkles,
    // },
    {
      title: "Incidents",
      url: "/incidents",
      icon: Home,
    },
    {
      title: "Missions",
      url: "/missions",
      icon: Inbox,
      badge: "10",
    },
    {
      title: "Leave Request",
      url: "/leave-requests",
      icon: Inbox,
      badge: "10",
    },
  ],
  navSecondary: [
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
  teams: [
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
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <>
      {/* Desktop Sidebar */}
      <Sidebar className="border-r-0 hidden md:flex" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={navItems.teams} />
          <NavMain items={navItems.navMain} />
        </SidebarHeader>
        <SidebarContent>
          <NavSecondary items={navItems.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </>
  )
}

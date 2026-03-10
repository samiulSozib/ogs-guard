// app/dashboard/page.tsx
'use client'

import { useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { bottomNavItems } from "@/components/bottom-nav-icon"
import { HeaderCard } from "@/components/dashboard/header-card"
import { ShiftControl } from "@/components/dashboard/shift-control"

import { Loader2 } from "lucide-react"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { fetchDashboardData } from "@/store/slices/dashboardSlice"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ActiveMission } from "@/components/dashboard/active-missions"
import { TaskList } from "@/components/dashboard/task-list"

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { 
    dashboardData, 
    isLoadingDashboard, 
    dashboardError 
  } = useAppSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardData())
  }, [dispatch])

  if (isLoadingDashboard) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" collapsible="icon" className="hidden lg:flex" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex items-center justify-center h-[80vh]">
            <Loader2 className="h-8 w-8 animate-spin text-[#5F0015]" />
          </div>
          <BottomNav items={bottomNavItems} />
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (dashboardError || !dashboardData) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" collapsible="icon" className="hidden lg:flex" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex items-center justify-center h-[80vh]">
            <p className="text-red-500">Error loading dashboard: {dashboardError}</p>
          </div>
          <BottomNav items={bottomNavItems} />
        </SidebarInset>
      </SidebarProvider>
    )
  }

  const { guard, assignment, shift_status, tasks, stats } = dashboardData

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--header-height": "3.5rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" collapsible="icon" className="hidden lg:flex" />
      <SidebarInset>
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-24 pt-4 sm:px-6 lg:pb-6 lg:px-8">
          {/* Header Card with Guard Info */}
          <HeaderCard guard={guard} currentTime={dashboardData.current_time} />

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Shift Control */}
              {/* <ShiftControl 
                shiftStatus={shift_status}
                guardId={guard.id}
              /> */}
              
              {/* Active Mission */}
              {assignment && <ActiveMission assignment={assignment} />}
            </div>

            {/* Tasks Sidebar */}
            <aside className="space-y-4">
              <h2 className="text-sm font-semibold uppercase text-muted-foreground">
                Today Tasks ({tasks.length})
              </h2>
              <TaskList 
                tasks={tasks}
                stats={{
                  total: stats.total_tasks_today,
                  completed: stats.completed_tasks,
                  pending: stats.pending_tasks
                }}
              />
            </aside>
          </section>
        </main>
        <BottomNav items={bottomNavItems} />
      </SidebarInset>
    </SidebarProvider>
  )
}
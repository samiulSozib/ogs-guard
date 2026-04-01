// app/dashboard/page.tsx
'use client'

import { useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { HeaderCard } from "@/components/dashboard/header-card"
import { ShiftControl } from "@/components/dashboard/shift-control"
import { Loader2 } from "lucide-react"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { fetchDashboardData } from "@/store/slices/dashboardSlice"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { TaskList } from "@/components/dashboard/task-list"
import { ActiveMission } from "@/components/dashboard/active-missions"

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
          <BottomNav />
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
          <BottomNav />
        </SidebarInset>
      </SidebarProvider>
    )
  }

  const { guard, current_assignment, shift_status, tasks, stats } = dashboardData

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
              <ShiftControl 
                shiftStatus={shift_status}
                guardId={guard.id}
                currentAssignmentId={current_assignment?.id}
              />
              
              {/* Active Mission */}
              {current_assignment && <ActiveMission assignment={current_assignment} />}
            </div>

            {/* Tasks Sidebar */}
            <aside className="space-y-4">
              <h2 className="text-sm font-semibold uppercase text-muted-foreground">
                Today Tasks ({tasks.length})
              </h2>
              <TaskList 
                tasks={tasks}
                stats={{
                  total: tasks.length,
                  completed: stats.tasks_completed_today,
                  pending: tasks.length - stats.tasks_completed_today
                }}
              />
            </aside>
          </section>
        </main>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}
// app/client/dashboard/page.tsx
'use client'

import { useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { Loader2 } from "lucide-react"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { fetchCurrentClient } from "@/store/slices/client/clientProfileSlice"
import ClientGuardedRoute from '@/components/clientGuardedRoute'
import { ClientDashboardHeader } from "@/components/client/dashboard/client-dashboard-header"
import { ClientStatsCards } from "@/components/client/dashboard/client-stats-cards"
import { ClientActiveSites } from "@/components/client/dashboard/client-active-sites"
import { ClientQuickAccess } from "@/components/client/dashboard/client-quick-access"
import { fetchClientDashboard } from "@/store/slices/client/clientDashboardSlice"

function ClientDashboardContent() {
  const dispatch = useAppDispatch()
  const { client, isLoading: isClientLoading } = useAppSelector((state) => state.clientProfile)
  const { dashboardData, isLoading: isDashboardLoading, error } = useAppSelector((state) => state.clientDashboard)

  useEffect(() => {
    if (!client) {
      dispatch(fetchCurrentClient())
    }
    dispatch(fetchClientDashboard())
  }, [dispatch, client])

  if (isClientLoading || isDashboardLoading) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" collapsible="icon" className="hidden lg:flex" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex items-center justify-center h-[80vh]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
          <BottomNav />
        </SidebarInset>
      </SidebarProvider>
    )
  }

  const stats = dashboardData?.stats || {
    total_sites: 0,
    active_sites: 0,
    total_guards: 0,
    active_guards: 0,
    total_incidents: 0,
    open_incidents: 0,
    total_complaints: 0,
    pending_complaints: 0,
    today_incidents: 0,
    today_complaints: 0,
  }

  const sites = dashboardData?.sites_summary || []

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
          
          {/* Header Card */}
          <ClientDashboardHeader client={client} stats={stats} />

          {/* Stats Cards */}
          <ClientStatsCards stats={stats} />

          {/* Two Column Layout */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Active Sites */}
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Sites</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  View All
                </button>
              </div>
              <ClientActiveSites sites={sites} />
            </div>

            {/* Right Column - Quick Access */}
            <aside className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick access</h2>
              <ClientQuickAccess />
            </aside>
          </section>

        </main>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function ClientDashboardPage() {
  return (
    <ClientGuardedRoute>
      <ClientDashboardContent />
    </ClientGuardedRoute>
  )
}
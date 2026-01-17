// app/dashboard/page.tsx
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { bottomNavItems } from "@/components/bottom-nav-icon"

import { HeaderCard } from "@/components/dashboard/header-card"
import { ShiftControl } from "@/components/dashboard/shift-control"
import { ActiveMission } from "@/components/dashboard/active-missions"
import { TaskCard } from "@/components/dashboard/task-card"

export default function DashboardPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--header-height": "3.5rem",
        } as React.CSSProperties
      }
    >
      {/* Sidebar (Desktop ONLY) */}
      <AppSidebar
        variant="inset"
        collapsible="icon"
        className="hidden lg:flex"
      />

      <SidebarInset>
        {/* App Header (ALL VIEWS) */}
        <SiteHeader />

        {/* Dashboard Content - Add bottom padding for mobile navigation */}
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-24 pt-4 sm:px-6 lg:pb-6 lg:px-8">
          <HeaderCard />

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              <ShiftControl />
              <h2 className="text-sm font-semibold uppercase text-muted-foreground">
                Active Missions
              </h2>
              <ActiveMission />
            </div>

            {/* Tasks Sidebar (Desktop) */}
            <aside className="space-y-4">
              <h2 className="text-sm font-semibold uppercase text-muted-foreground">
                Today Tasks
              </h2>
              <TaskCard />
            </aside>
          </section>
        </main>

        {/* Bottom Navigation (Mobile ONLY) */}
        <BottomNav items={bottomNavItems} />
      </SidebarInset>
    </SidebarProvider>
  )
}
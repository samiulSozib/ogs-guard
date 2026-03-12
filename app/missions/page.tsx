// app/missions/page.tsx
'use client'

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { HeaderCard } from "@/components/missions/header-card"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { MissionList } from "@/components/missions/mission-list"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"
import { bottomNavItems } from "@/components/bottom-nav-icon"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { fetchAssignments } from "@/store/slices/guardAssignmentSlice"
import { GuardAssignment } from "@/app/types/guardAssignment"

export default function MissionsPage() {
  const dispatch = useAppDispatch()
  const { assignments, isLoading, pagination } = useAppSelector((state) => state.guardAssignment)
  const [currentPage, setCurrentPage] = useState(1)

    const loadAssignments = () => {
    dispatch(fetchAssignments({
      page: currentPage,
      per_page: 10,
      include_duty: true,
      include_guard: true,
      include_site: true,
      include_client: true,
    }))
  }
  useEffect(() => {
    loadAssignments()
  }, [dispatch, currentPage])



  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Transform API data to match MissionItem type
  const transformedMissions = assignments.map((assignment: GuardAssignment) => {
    const duty = assignment.duty;
    const site = duty?.site;
    const guardUser = assignment.guard_user;
    
    return {
      id: assignment.id,
      title: site?.site_name || duty?.title || "Mission",
      time: assignment.created_at ? new Date(assignment.created_at).toLocaleTimeString() : "-",
      reporter: "You", // You can get this from auth state
      reporterName: guardUser?.full_name || "-",
      trackingCode: `M${assignment.id}`,
      siteName: site?.site_name || "-",
      siteStatus: site?.status || "active",
      missionPlace: duty?.duty_type === "day" ? "Day Shift" : "Night Shift",
      missionDate: assignment.start_date ? new Date(assignment.start_date).toLocaleDateString() : "-",
      missionTime: duty?.start_datetime ? new Date(duty.start_datetime).toLocaleTimeString() : "-",
      missionLocation: duty?.site_location?.title || "Main Location",
      missionAddress: site?.address || "-",
      document: "report.pdf",
      images: ["/img/h1.png", "/img/h2.png", "/img/h3.png"],
      note: duty?.notes || "No additional notes",
      
      // Additional data for maps
      latitude: site?.latitude,
      longitude: site?.longitude,
      
      // Guards assigned to this mission
      guards: [
        {
          name: guardUser?.full_name || "You",
          status: assignment.current_shift_status || "assigned",
          avatar: guardUser?.profile_image || "/img/avt.png",
          isOnline: true,
        }
      ],
      
      // Duty details
      dutyDetails: assignment.duty_details,
      siteDetails: assignment.site_details,
      
      // Stats
      incidentCount: 2, // You can fetch this from another API
      reportCount: 1,
    };
  });

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--header-height": "3.5rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        collapsible="icon"
        className="hidden lg:flex"
      />

      <SidebarInset>
        <SiteHeader />

        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <HeaderCard />

          {/* Add New Mission Button */}
          {/* <Link href="/missions/add-mission">
            <Button className="w-full bg-[#5F0015] text-white font-bold hover:bg-[#5F0015]/90">
              <Plus className="mr-2 h-4 w-4" />
              Add New Mission
            </Button>
          </Link> */}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#5F0015]" />
            </div>
          )}

          {/* Missions List */}
          {!isLoading && (
            <div className="">
              <MissionList 
                missions={transformedMissions}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && transformedMissions.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No missions found</p>
              <Link href="/missions/add-mission">
                <Button className="mt-4 bg-[#5F0015] text-white hover:bg-[#5F0015]/90">
                  Create your first mission
                </Button>
              </Link>
            </div>
          )}
        </main>
        <BottomNav  />
      </SidebarInset>
    </SidebarProvider>
  )
}